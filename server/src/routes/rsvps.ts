import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';

export function createRsvpsRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/rsvps - Ambil semua konfirmasi kehadiran RSVP
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        'SELECT id, name, attendance, guest_count as guestCount, notes, created_at as createdAt FROM rsvps ORDER BY created_at DESC'
      );
      res.json(rows);
    } catch (error) {
      console.error('[API RSVPs Error] Gagal mengambil data RSVP:', error);
      res.status(500).json({ error: 'Gagal mengambil data RSVP dari database' });
    }
  });

  // POST /api/rsvps - Simpan konfirmasi kehadiran RSVP baru
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, attendance, guestCount, notes } = req.body;

      if (!name || !attendance) {
        res.status(400).json({ error: 'Nama dan status kehadiran wajib diisi' });
        return;
      }

      const id = 'rsvp_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const count = parseInt(String(guestCount || 1), 10) || 1;

      await pool.query(
        `INSERT INTO rsvps (id, name, attendance, guest_count, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, name.trim(), attendance, count, (notes || '').trim()]
      );

      const newRsvp = {
        id,
        name: name.trim(),
        attendance,
        guestCount: count,
        notes: (notes || '').trim(),
        createdAt: new Date().toISOString(),
      };

      // Realtime broadcast ke admin panel
      io.emit('rsvp:created', newRsvp);

      res.status(201).json({ success: true, data: newRsvp });
    } catch (error) {
      console.error('[API RSVPs Error] Gagal menyimpan data RSVP:', error);
      res.status(500).json({ error: 'Gagal menyimpan konfirmasi RSVP ke database' });
    }
  });

  // DELETE /api/rsvps/:id - Hapus data RSVP
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM rsvps WHERE id = ?', [id]);

      // Realtime broadcast penghapusan RSVP
      io.emit('rsvp:deleted', id);

      res.json({ success: true, message: 'Data RSVP berhasil dihapus' });
    } catch (error) {
      console.error('[API RSVPs Error] Gagal menghapus RSVP:', error);
      res.status(500).json({ error: 'Gagal menghapus data RSVP dari database' });
    }
  });

  return router;
}
