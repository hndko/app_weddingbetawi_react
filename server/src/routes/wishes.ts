import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';

export function createWishesRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/wishes - Ambil semua ucapan doa restu
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, text, time, attendance, is_approved as isApproved, created_at as createdAt FROM wishes ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (error) {
      console.error('[API Wishes Error] Gagal mengambil ucapan:', error);
      res.status(500).json({ error: 'Gagal mengambil data ucapan dari database' });
    }
  });

  // POST /api/wishes - Kirim ucapan doa baru
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, text, attendance, time } = req.body;

      if (!name || !text) {
        res.status(400).json({ error: 'Nama dan teks ucapan wajib diisi' });
        return;
      }

      const id = 'wish_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const timeStr = time || 'Baru saja';
      const isApproved = 1;

      await pool.query(
        `INSERT INTO wishes (id, name, text, time, attendance, is_approved) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, name.trim(), text.trim(), timeStr, attendance || 'hadir', isApproved]
      );

      const newWish = {
        id,
        name: name.trim(),
        text: text.trim(),
        time: timeStr,
        attendance: attendance || 'hadir',
        isApproved: true,
        createdAt: new Date().toISOString(),
      };

      // Realtime broadcast ke proyektor panggung dan admin panel
      io.emit('wish:created', newWish);

      res.status(201).json({ success: true, data: newWish });
    } catch (error) {
      console.error('[API Wishes Error] Gagal menambahkan ucapan:', error);
      res.status(500).json({ error: 'Gagal menyimpan ucapan doa ke database' });
    }
  });

  // DELETE /api/wishes/:id - Hapus ucapan
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM wishes WHERE id = ?', [id]);

      // Realtime broadcast penghapusan ucapan
      io.emit('wish:deleted', id);

      res.json({ success: true, message: 'Ucapan berhasil dihapus' });
    } catch (error) {
      console.error('[API Wishes Error] Gagal menghapus ucapan:', error);
      res.status(500).json({ error: 'Gagal menghapus ucapan dari database' });
    }
  });

  return router;
}
