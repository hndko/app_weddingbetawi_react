import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJwt } from '../middleware/auth';
import { submissionRateLimiter } from '../middleware/rateLimiter';
import { wishesService } from '../services/wishesService';

export function createWishesRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/wishes - Ambil ucapan doa restu (dengan batasan LIMIT 50 & dukungan pagination)
  router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const isAll = req.query.all === 'true';
      const limit = parseInt(String(req.query.limit || 50), 10) || 50;
      const offset = parseInt(String(req.query.offset || 0), 10) || 0;

      const rows = await wishesService.getWishes(isAll, limit, offset);
      res.json(rows);
    } catch (error) {
      console.error('[API Wishes Error] Gagal mengambil ucapan:', error);
      res.status(500).json({ error: 'Gagal mengambil data ucapan dari database' });
    }
  });

  // POST /api/wishes - Kirim ucapan doa baru (dilindungi Anti-Spam Rate Limiter)
  router.post('/', submissionRateLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, text, attendance, time } = req.body;

      if (!name || !text) {
        res.status(400).json({ error: 'Nama dan teks ucapan wajib diisi' });
        return;
      }

      const newWish = await wishesService.createWish({
        name,
        text,
        attendance,
        time,
      });

      // Realtime broadcast ke proyektor panggung dan admin panel
      io.emit('wish:created', newWish);

      res.status(201).json({ success: true, data: newWish });
    } catch (error) {
      console.error('[API Wishes Error] Gagal menambahkan ucapan:', error);
      res.status(500).json({ error: 'Gagal menyimpan ucapan doa ke database' });
    }
  });

  // DELETE /api/wishes/:id - Hapus ucapan (dilindungi JWT Admin)
  router.delete('/:id', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await wishesService.deleteWish(id);

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
