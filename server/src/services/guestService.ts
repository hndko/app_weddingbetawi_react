import { pool } from '../db/connection';
import crypto from 'crypto';

export interface GuestRow {
  id: string;
  name: string;
  phone: string | null;
  status: string;
  tier: string;
  vipNotes: string | null;
  tableNumber: string | null;
  notes: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  souvenirClaimed: boolean;
  souvenirClaimedAt: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface GuestInput {
  name: string;
  phone?: string | null;
  tier?: string;
  vipNotes?: string | null;
  tableNumber?: string | null;
  notes?: string | null;
}

export interface GuestUpdateInput {
  name?: string;
  phone?: string | null;
  status?: string;
  tier?: string;
  vipNotes?: string | null;
  tableNumber?: string | null;
  notes?: string | null;
  souvenirClaimed?: boolean;
}

export const guestService = {
  /**
   * Mengambil semua daftar tamu undangan
   */
  async getAllGuests(): Promise<GuestRow[]> {
    const [rows] = await pool.query(
      `SELECT id, name, phone, status, tier, vip_notes as vipNotes, 
              table_number as tableNumber, notes, 
              checked_in as checkedIn, checked_in_at as checkedInAt, 
              souvenir_claimed as souvenirClaimed, souvenir_claimed_at as souvenirClaimedAt,
              created_at as createdAt, updated_at as updatedAt 
       FROM guests ORDER BY created_at DESC`
    );

    return (rows as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone || null,
      status: r.status || 'pending',
      tier: r.tier || 'regular',
      vipNotes: r.vipNotes || null,
      tableNumber: r.tableNumber || null,
      notes: r.notes || null,
      checkedIn: !!r.checkedIn,
      checkedInAt: r.checkedInAt ? new Date(r.checkedInAt).toISOString() : null,
      souvenirClaimed: !!r.souvenirClaimed,
      souvenirClaimedAt: r.souvenirClaimedAt ? new Date(r.souvenirClaimedAt).toISOString() : null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : undefined,
    }));
  },

  /**
   * Mengimpor kumpulan data tamu dengan chunking 500 baris dalam satu transaksi atomik
   */
  async importGuestsBatch(guestsList: any[]): Promise<{ count: number; validGuests: any[] }> {
    const validGuests: any[] = [];
    const rowsToInsert: Array<[string, string, string | null, string, string, string | null, string | null, string | null]> = [];

    for (const g of guestsList) {
      if (!g || !g.name || !String(g.name).trim()) continue;
      const id = 'guest_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const cleanName = String(g.name).trim();
      const cleanPhone = g.phone ? String(g.phone).trim() : null;
      const cleanStatus = g.status || 'pending';
      const cleanTier = g.tier || 'regular';
      const cleanVipNotes = g.vipNotes || null;
      const cleanTable = g.tableNumber || null;
      const cleanNotes = g.notes || null;

      validGuests.push({
        id,
        name: cleanName,
        phone: cleanPhone,
        status: cleanStatus,
        tier: cleanTier,
        vipNotes: cleanVipNotes,
        tableNumber: cleanTable,
        notes: cleanNotes,
        checkedIn: false,
        souvenirClaimed: false,
      });

      rowsToInsert.push([
        id,
        cleanName,
        cleanPhone,
        cleanStatus,
        cleanTier,
        cleanVipNotes,
        cleanTable,
        cleanNotes,
      ]);
    }

    if (rowsToInsert.length === 0) {
      return { count: 0, validGuests: [] };
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const CHUNK_SIZE = 500;
      for (let i = 0; i < rowsToInsert.length; i += CHUNK_SIZE) {
        const chunk = rowsToInsert.slice(i, i + CHUNK_SIZE);
        await connection.query(
          `INSERT INTO guests (id, name, phone, status, tier, vip_notes, table_number, notes) VALUES ?`,
          [chunk]
        );
      }

      await connection.commit();
    } catch (dbErr) {
      await connection.rollback();
      throw dbErr;
    } finally {
      connection.release();
    }

    return { count: validGuests.length, validGuests };
  },

  /**
   * Menambahkan satu tamu baru
   */
  async createGuest(data: GuestInput): Promise<GuestRow> {
    const id = 'guest_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const cleanName = data.name.trim();
    const cleanPhone = data.phone ? data.phone.trim() : null;
    const cleanTier = data.tier || 'regular';
    const cleanVipNotes = data.vipNotes || null;
    const cleanTable = data.tableNumber || null;
    const cleanNotes = data.notes || null;

    await pool.query(
      `INSERT INTO guests (id, name, phone, status, tier, vip_notes, table_number, notes) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`,
      [id, cleanName, cleanPhone, cleanTier, cleanVipNotes, cleanTable, cleanNotes]
    );

    return {
      id,
      name: cleanName,
      phone: cleanPhone,
      status: 'pending',
      tier: cleanTier,
      vipNotes: cleanVipNotes,
      tableNumber: cleanTable,
      notes: cleanNotes,
      checkedIn: false,
      checkedInAt: null,
      souvenirClaimed: false,
      souvenirClaimedAt: null,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Memperbarui informasi atau status tamu
   */
  async updateGuest(id: string, updates: GuestUpdateInput): Promise<boolean> {
    await pool.query(
      `UPDATE guests 
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           status = COALESCE(?, status),
           tier = COALESCE(?, tier),
           vip_notes = COALESCE(?, vip_notes),
           table_number = COALESCE(?, table_number),
           notes = COALESCE(?, notes),
           souvenir_claimed = COALESCE(?, souvenir_claimed)
       WHERE id = ?`,
      [
        updates.name,
        updates.phone,
        updates.status,
        updates.tier,
        updates.vipNotes,
        updates.tableNumber,
        updates.notes,
        updates.souvenirClaimed !== undefined ? (updates.souvenirClaimed ? 1 : 0) : null,
        id,
      ]
    );
    return true;
  },

  /**
   * Melakukan check-in tamu dan mempertahankan timestamp awal jika sudah pernah check-in
   */
  async checkinGuest(id: string, autoClaimSouvenir?: boolean): Promise<{ checkedInAt: Date; souvenirClaimed: boolean; souvenirClaimedAt: Date | null }> {
    const now = new Date();
    const claimSouvenir = autoClaimSouvenir !== false;

    await pool.query(
      `UPDATE guests 
       SET checked_in = 1,
           checked_in_at = COALESCE(checked_in_at, ?),
           souvenir_claimed = CASE WHEN ? = 1 THEN 1 ELSE souvenir_claimed END,
           souvenir_claimed_at = CASE WHEN ? = 1 AND souvenir_claimed_at IS NULL THEN ? ELSE souvenir_claimed_at END
       WHERE id = ?`,
      [now, claimSouvenir ? 1 : 0, claimSouvenir ? 1 : 0, now, id]
    );

    return {
      checkedInAt: now,
      souvenirClaimed: claimSouvenir,
      souvenirClaimedAt: claimSouvenir ? now : null,
    };
  },

  /**
   * Mengubah status klaim souvenir tamu
   */
  async toggleGuestSouvenir(id: string, claimed?: boolean): Promise<{ isClaimed: boolean; timestamp: Date | null }> {
    const isClaimed = claimed !== false;
    const now = isClaimed ? new Date() : null;

    await pool.query(
      `UPDATE guests 
       SET souvenir_claimed = ?,
           souvenir_claimed_at = ?
       WHERE id = ?`,
      [isClaimed ? 1 : 0, now, id]
    );

    return { isClaimed, timestamp: now };
  },

  /**
   * Menghapus satu tamu
   */
  async deleteGuest(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM guests WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },

  /**
   * Mengosongkan seluruh daftar tamu
   */
  async resetAllGuests(): Promise<void> {
    await pool.query('DELETE FROM guests');
  },
};
