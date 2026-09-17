import { pool } from '../db/connection';
import crypto from 'crypto';

export interface WishRow {
  id: string;
  name: string;
  text: string;
  time: string;
  attendance: string;
  isApproved: boolean;
  createdAt: string;
}

export interface WishInput {
  name: string;
  text: string;
  attendance?: string;
  time?: string;
}

export const wishesService = {
  /**
   * Mengambil ucapan doa dengan limitasi dan paginasi (Pilar 6 Beban Kueri)
   */
  async getWishes(isAll: boolean, limit: number = 50, offset: number = 0): Promise<WishRow[]> {
    if (isAll) {
      const [rows] = await pool.query(
        'SELECT id, name, text, time, attendance, is_approved as isApproved, created_at as createdAt FROM wishes ORDER BY created_at DESC'
      );
      return (rows as any[]).map((r) => ({
        id: r.id,
        name: r.name,
        text: r.text,
        time: r.time,
        attendance: r.attendance || 'hadir',
        isApproved: !!r.isApproved,
        createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
      }));
    }

    const safeLimit = Math.max(1, Math.min(100, limit));
    const safeOffset = Math.max(0, offset);

    const [rows] = await pool.query(
      'SELECT id, name, text, time, attendance, is_approved as isApproved, created_at as createdAt FROM wishes ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [safeLimit, safeOffset]
    );

    return (rows as any[]).map((r) => ({
      id: r.id,
      name: r.name,
      text: r.text,
      time: r.time,
      attendance: r.attendance || 'hadir',
      isApproved: !!r.isApproved,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }));
  },

  /**
   * Menambahkan ucapan doa restu baru
   */
  async createWish(data: WishInput): Promise<WishRow> {
    const id = 'wish_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const timeStr = data.time || 'Baru saja';
    const isApproved = 1;
    const cleanName = data.name.trim();
    const cleanText = data.text.trim();
    const attendance = data.attendance || 'hadir';

    await pool.query(
      `INSERT INTO wishes (id, name, text, time, attendance, is_approved) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, cleanName, cleanText, timeStr, attendance, isApproved]
    );

    return {
      id,
      name: cleanName,
      text: cleanText,
      time: timeStr,
      attendance,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Menghapus ucapan berdasarkan ID
   */
  async deleteWish(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM wishes WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },
};
