import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJwt } from '../middleware/auth';
import { budgetService } from '../services/budgetService';

export function createBudgetRouter(io: SocketIOServer) {
  const router = Router();

  // Seluruh endpoint manajemen anggaran wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // GET /api/budget - Ambil semua item anggaran
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const items = await budgetService.getAllBudgetItems();
      res.json(items);
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data anggaran' });
    }
  });

  // POST /api/budget - Tambah item anggaran
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const newItem = await budgetService.createBudgetItem(req.body);
      io.emit('budget:created', newItem);
      res.status(201).json({ success: true, data: newItem });
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal menambahkan data anggaran' });
    }
  });

  // PUT /api/budget/:id - Update item anggaran
  router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await budgetService.updateBudgetItem(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Item anggaran tidak ditemukan' });
        return;
      }

      io.emit('budget:updated', { id, ...req.body });
      res.json({ success: true, message: 'Data anggaran berhasil diperbarui' });
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui data anggaran' });
    }
  });

  // DELETE /api/budget/:id - Hapus item anggaran
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await budgetService.deleteBudgetItem(id);
      io.emit('budget:deleted', id);
      res.json({ success: true, message: 'Item anggaran berhasil dihapus' });
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus item anggaran' });
    }
  });

  return router;
}
