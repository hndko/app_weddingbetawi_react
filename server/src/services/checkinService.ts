import { pool } from '../db/connection';
import crypto from 'crypto';

export interface CheckinRow {
  id: string;
  guestId: string | null;
  name: string;
  checkInTime: string;
  actualPax: number;
  tier: string;
  souvenirClaimed: boolean;
  souvenirClaimedAt: string | null;
  tableNumber: string | null;
  source: string;
  notes: string | null;
  createdAt?: string;
}

export interface CheckinInput {
  guestId?: string | null;
  name: string;
  checkInTime?: string;
  actualPax?: number;
  tier?: string;
  souvenirClaimed?: boolean;
  tableNumber?: string | null;
  source?: string;
  notes?: string | null;
}

/**
 * Mengonversi nilai waktu ke ISO 8601 string secara aman tanpa melempar RangeError
 */
export function safeIsoTimestamp(val: unknown): string {
  if (!val) return new Date().toISOString();
  const d = new Date(String(val));
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export const checkinService = {
  /**
   * Mengambil semua log riwayat check-in resepsi
   */
  async getAllCheckins(): Promise<CheckinRow[]> {
    const [rows] = await pool.query(
      `SELECT id, guest_id as guestId, name, check_in_time as checkInTime, 
              actual_pax as actualPax, tier, souvenir_claimed as souvenirClaimed, 
              souvenir_claimed_at as souvenirClaimedAt,
              table_number as tableNumber, source, notes, created_at as createdAt 
       FROM checkins ORDER BY created_at DESC`
    );

    return (rows as any[]).map((r) => ({
      id: r.id,
      guestId: r.guestId || null,
      name: r.name,
      checkInTime: safeIsoTimestamp(r.checkInTime),
      actualPax: Number(r.actualPax || 1),
      tier: r.tier || 'regular',
      souvenirClaimed: !!r.souvenirClaimed,
      souvenirClaimedAt: r.souvenirClaimedAt ? safeIsoTimestamp(r.souvenirClaimedAt) : null,
      tableNumber: r.tableNumber || null,
      source: r.source || 'qr_scan',
      notes: r.notes || null,
      createdAt: safeIsoTimestamp(r.createdAt),
    }));
  },

  /**
   * Menambahkan check-in baru dengan sinkronisasi atomik ke tabel guests (Pilar 2 Domain Invariants)
   */
  async createCheckin(data: CheckinInput): Promise<{ newRecord: CheckinRow; checkinDate: Date; now: Date | null }> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const id = 'checkin_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const now = data.souvenirClaimed ? new Date() : null;
      const checkinDate = new Date();
      const validCheckinTime = safeIsoTimestamp(data.checkInTime || checkinDate);
      // Invarian Domain: Tamu yang check-in minimal 1 pax
      const actualPax = Math.max(1, parseInt(String(data.actualPax || 1), 10) || 1);

      await conn.query(
        `INSERT INTO checkins (id, guest_id, name, check_in_time, actual_pax, tier, souvenir_claimed, souvenir_claimed_at, table_number, source, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.guestId || null,
          data.name,
          validCheckinTime,
          actualPax,
          data.tier || 'regular',
          data.souvenirClaimed ? 1 : 0,
          now,
          data.tableNumber || null,
          data.source || 'qr_scan',
          data.notes || null,
        ]
      );

      // Sinkronkan juga ke tabel guests jika guestId disertakan (Transaksi Atomik)
      if (data.guestId) {
        await conn.query(
          `UPDATE guests 
           SET checked_in = 1, 
               checked_in_at = COALESCE(checked_in_at, ?),
               souvenir_claimed = CASE WHEN ? = 1 THEN 1 ELSE souvenir_claimed END,
               souvenir_claimed_at = CASE WHEN ? = 1 AND souvenir_claimed_at IS NULL THEN ? ELSE souvenir_claimed_at END,
               table_number = COALESCE(?, table_number)
           WHERE id = ?`,
          [
            checkinDate,
            data.souvenirClaimed ? 1 : 0,
            data.souvenirClaimed ? 1 : 0,
            now,
            data.tableNumber || null,
            data.guestId,
          ]
        );
      }

      await conn.commit();

      const newRecord: CheckinRow = {
        id,
        guestId: data.guestId || null,
        name: data.name,
        checkInTime: validCheckinTime,
        actualPax,
        tier: data.tier || 'regular',
        souvenirClaimed: !!data.souvenirClaimed,
        souvenirClaimedAt: now ? now.toISOString() : null,
        tableNumber: data.tableNumber || null,
        source: data.source || 'qr_scan',
        notes: data.notes || null,
      };

      return { newRecord, checkinDate, now };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  /**
   * Batch sinkronisasi antrean check-in luring dari IndexedDB dengan ON DUPLICATE KEY UPDATE
   */
  async syncOfflineCheckins(items: any[]): Promise<number> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      let syncedCount = 0;

      for (const item of items) {
        if (!item || !item.name) continue;

        const id = item.id || ('checkin_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex'));
        const now = item.souvenirClaimed ? new Date() : null;
        const pax = Math.max(1, parseInt(String(item.actualPax || 1), 10) || 1);
        const validCheckinTime = safeIsoTimestamp(item.checkInTime);

        await conn.query(
          `INSERT INTO checkins (id, guest_id, name, check_in_time, actual_pax, tier, souvenir_claimed, souvenir_claimed_at, table_number, source, notes) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             check_in_time = COALESCE(checkins.check_in_time, VALUES(check_in_time)),
             actual_pax = VALUES(actual_pax),
             souvenir_claimed = VALUES(souvenir_claimed),
             souvenir_claimed_at = COALESCE(checkins.souvenir_claimed_at, VALUES(souvenir_claimed_at)),
             table_number = COALESCE(VALUES(table_number), checkins.table_number)`,
          [
            id,
            item.guestId || null,
            item.name,
            validCheckinTime,
            pax,
            item.tier || 'regular',
            item.souvenirClaimed ? 1 : 0,
            now,
            item.tableNumber || null,
            item.source || 'offline_sync',
            item.notes || null,
          ]
        );

        if (item.guestId) {
          const syncCheckinDate = new Date(validCheckinTime);
          await conn.query(
            `UPDATE guests 
             SET checked_in = 1, 
                 checked_in_at = COALESCE(checked_in_at, ?),
                 souvenir_claimed = CASE WHEN ? = 1 THEN 1 ELSE souvenir_claimed END,
                 souvenir_claimed_at = CASE WHEN ? = 1 AND souvenir_claimed_at IS NULL THEN ? ELSE souvenir_claimed_at END,
                 table_number = COALESCE(?, table_number)
             WHERE id = ?`,
            [
              syncCheckinDate,
              item.souvenirClaimed ? 1 : 0,
              item.souvenirClaimed ? 1 : 0,
              now,
              item.tableNumber || null,
              item.guestId,
            ]
          );
        }

        syncedCount++;
      }

      await conn.commit();
      return syncedCount;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  /**
   * Mengubah status souvenir pada log check-in dan tamu terkait
   */
  async toggleCheckinSouvenir(id: string, claimed?: boolean): Promise<{ found: boolean; guestId: string | null; isClaimed: boolean; now: Date | null }> {
    const isClaimed = claimed !== undefined ? Boolean(claimed) : true;
    const now = isClaimed ? new Date() : null;

    interface CheckinGuestRow {
      guest_id: string | null;
    }
    const [rows] = await pool.query<CheckinGuestRow[] & import('mysql2').RowDataPacket[]>(
      'SELECT guest_id FROM checkins WHERE id = ?',
      [id]
    );

    if (!rows || rows.length === 0) {
      return { found: false, guestId: null, isClaimed, now: null };
    }

    await pool.query(
      'UPDATE checkins SET souvenir_claimed = ?, souvenir_claimed_at = ? WHERE id = ?',
      [isClaimed ? 1 : 0, now, id]
    );

    const guestId = rows[0]?.guest_id || null;
    if (guestId) {
      await pool.query(
        'UPDATE guests SET souvenir_claimed = ?, souvenir_claimed_at = ? WHERE id = ?',
        [isClaimed ? 1 : 0, now, guestId]
      );
    }

    return { found: true, guestId, isClaimed, now };
  },

  /**
   * Menghapus log check-in dengan rollback atomik pada data tamu (Pilar 2 Domain Invariants)
   */
  async deleteCheckin(id: string): Promise<{ success: boolean; guestId: string | null }> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      interface CheckinGuestRow {
        guest_id: string | null;
      }
      const [rows] = await conn.query<CheckinGuestRow[] & import('mysql2').RowDataPacket[]>(
        'SELECT guest_id FROM checkins WHERE id = ? FOR UPDATE',
        [id]
      );

      if (!rows || rows.length === 0) {
        await conn.rollback();
        return { success: false, guestId: null };
      }

      const guestId = rows[0]?.guest_id || null;

      const [delResult] = await conn.query('DELETE FROM checkins WHERE id = ?', [id]);
      const success = (delResult as any).affectedRows > 0;

      if (success && guestId) {
        await conn.query(
          `UPDATE guests 
           SET checked_in = 0, 
               checked_in_at = NULL, 
               souvenir_claimed = 0, 
               souvenir_claimed_at = NULL 
           WHERE id = ?`,
          [guestId]
        );
      }

      await conn.commit();
      return { success, guestId };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
};
