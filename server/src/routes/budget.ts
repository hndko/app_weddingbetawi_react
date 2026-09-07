import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';

export function createBudgetRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/budget - Ambil semua item anggaran
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, category, name, 
                estimated_cost as estimatedCost, 
                actual_cost as actualCost, 
                paid_cost as paidCost, 
                status, vendor, notes, created_at as createdAt 
         FROM budget_items ORDER BY created_at ASC`
      );
      res.json(rows);
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data anggaran' });
    }
  });

  // POST /api/budget - Tambah item anggaran
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, name, estimatedCost, actualCost, paidCost, status, vendor, notes } = req.body;
      const id = 'budget_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

      await pool.query(
        `INSERT INTO budget_items (id, category, name, estimated_cost, actual_cost, paid_cost, status, vendor, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, category || 'other', name, estimatedCost || 0, actualCost || 0, paidCost || 0, status || 'draft', vendor || null, notes || null]
      );

      const newItem = { id, category, name, estimatedCost, actualCost, paidCost, status, vendor, notes };
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
      const { id } = req.params;
      const { category, name, estimatedCost, actualCost, paidCost, status, vendor, notes } = req.body;

      await pool.query(
        `UPDATE budget_items 
         SET category = COALESCE(?, category),
             name = COALESCE(?, name),
             estimated_cost = COALESCE(?, estimated_cost),
             actual_cost = COALESCE(?, actual_cost),
             paid_cost = COALESCE(?, paid_cost),
             status = COALESCE(?, status),
             vendor = COALESCE(?, vendor),
             notes = COALESCE(?, notes)
         WHERE id = ?`,
        [category, name, estimatedCost, actualCost, paidCost, status, vendor, notes, id]
      );

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
      const { id } = req.params;
      await pool.query('DELETE FROM budget_items WHERE id = ?', [id]);
      io.emit('budget:deleted', id);
      res.json({ success: true, message: 'Item anggaran berhasil dihapus' });
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus item anggaran' });
    }
  });

  return router;
}
