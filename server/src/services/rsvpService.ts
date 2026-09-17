import { pool } from '../db/connection';
import crypto from 'crypto';

export interface RsvpRecord {
  id: string;
  name: string;
  phone?: string;
  attendance: string;
  guestCount: number;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SaveRsvpInput {
  name: string;
  phone?: string | null;
  attendance: string;
  guestCount?: number;
  notes?: string | null;
}

export interface SaveRsvpResult {
  record: RsvpRecord;
  isUpdate: boolean;
  cleanName: string;
  cleanPhone: string | null;
  count: number;
}

export const rsvpService = {
  /**
   * Mengambil seluruh data konfirmasi kehadiran RSVP
   */
  async getAllRsvps(): Promise<RsvpRecord[]> {
    const [rows] = await pool.query(
      'SELECT id, name, phone, attendance, guest_count as guestCount, notes, created_at as createdAt FROM rsvps ORDER BY created_at DESC'
    );
    return (rows as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      phone: r.phone || undefined,
      attendance: r.attendance,
      guestCount: Number(r.guestCount || 0),
      notes: r.notes || '',
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }));
  },

  /**
   * Menyimpan atau memperbarui RSVP dengan transaksi atomik dan row-level locking (Pilar 2 Concurrency)
   */
  async saveOrUpdateRsvp(input: SaveRsvpInput): Promise<SaveRsvpResult> {
    const cleanName = String(input.name).trim();
    const cleanPhone = input.phone ? String(input.phone).trim() : null;
    const isNotAttending = input.attendance === 'tidak_hadir';
    const parsedCount = parseInt(String(input.guestCount || 1), 10) || 1;
    // Invarian Domain: Jika tidak hadir, guest_count = 0. Jika hadir/ragu, minimal 1 pax.
    const count = isNotAttending ? 0 : Math.max(1, parsedCount);
    const cleanNotes = (input.notes || '').trim();

    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Row-level lock dengan FOR UPDATE untuk mencegah race condition pada submisi serentak
      const [existingRows] = await conn.query(
        `SELECT id, name, phone, attendance, guest_count as guestCount, notes, created_at as createdAt 
         FROM rsvps 
         WHERE LOWER(TRIM(name)) = LOWER(?) OR (phone IS NOT NULL AND phone != "" AND phone = ?) 
         LIMIT 1 FOR UPDATE`,
        [cleanName, cleanPhone || '___NO_PHONE___']
      );

      const existingList = existingRows as any[];
      const isExisting = existingList.length > 0;
      let record: RsvpRecord;

      if (isExisting) {
        const existingId = existingList[0].id;
        await conn.query(
          `UPDATE rsvps 
           SET name = ?, phone = COALESCE(?, phone), attendance = ?, guest_count = ?, notes = ? 
           WHERE id = ?`,
          [cleanName, cleanPhone, input.attendance, count, cleanNotes, existingId]
        );

        record = {
          id: existingId,
          name: cleanName,
          phone: cleanPhone || existingList[0].phone || undefined,
          attendance: input.attendance,
          guestCount: count,
          notes: cleanNotes,
          createdAt: existingList[0].createdAt ? new Date(existingList[0].createdAt).toISOString() : new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        const id = 'rsvp_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
        await conn.query(
          `INSERT INTO rsvps (id, name, phone, attendance, guest_count, notes) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [id, cleanName, cleanPhone, input.attendance, count, cleanNotes]
        );

        record = {
          id,
          name: cleanName,
          phone: cleanPhone || undefined,
          attendance: input.attendance,
          guestCount: count,
          notes: cleanNotes,
          createdAt: new Date().toISOString(),
        };
      }

      await conn.commit();

      return {
        record,
        isUpdate: isExisting,
        cleanName,
        cleanPhone,
        count,
      };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  /**
   * Menghapus RSVP berdasarkan ID
   */
  async deleteRsvp(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM rsvps WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },
};
