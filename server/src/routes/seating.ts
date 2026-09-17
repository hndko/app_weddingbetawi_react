import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJwt } from '../middleware/auth';
import { seatingService } from '../services/seatingService';

export function createSeatingRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/seating - Ambil semua daftar meja dan penetapan tamu
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const parsed = await seatingService.getAllTables();
      res.json(parsed);
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data seating chart' });
    }
  });

  // POST /api/seating - Tambah meja baru (dilindungi JWT Admin)
  router.post('/', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const newTable = await seatingService.createTable(req.body);
      io.emit('seating:created', newTable);
      res.status(201).json({ success: true, data: newTable });
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal menambahkan meja' });
    }
  });

  // PUT /api/seating/:id - Update meja dan penetapan tamu (dilindungi JWT Admin)
  router.put('/:id', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await seatingService.updateTable(id, req.body);
      io.emit('seating:updated', { id, ...req.body });
      res.json({ success: true, message: 'Meja berhasil diperbarui' });
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui meja' });
    }
  });

  // DELETE /api/seating/:id - Hapus meja (dilindungi JWT Admin)
  router.delete('/:id', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await seatingService.deleteTable(id);
      io.emit('seating:deleted', id);
      res.json({ success: true, message: 'Meja berhasil dihapus' });
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus meja' });
    }
  });

  return router;
}
