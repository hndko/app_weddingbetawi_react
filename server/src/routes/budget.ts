import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';
import { authenticateJwt } from '../middleware/auth';

export function createBudgetRouter(io: SocketIOServer) {
  const router = Router();

  // Seluruh endpoint manajemen anggaran wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // GET /api/budget - Ambil semua item anggaran
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, category, name, name as title, 
                estimated_cost as estimatedCost, 
                actual_cost as actualCost, 
                paid_cost as paidCost, paid_cost as paidAmount, 
                status, status as paymentStatus, 
                vendor, vendor as vendorName, 
                vendor_phone as vendorPhone, 
                due_date as dueDate, 
                is_completed as isCompleted, 
                notes, created_at as createdAt 
         FROM budget_items ORDER BY created_at ASC`
      );
      const parsed = (rows as any[]).map((r) => ({
        ...r,
        title: r.title || r.name,
        paidAmount: Number(r.paidAmount || r.paidCost || 0),
        paymentStatus: r.paymentStatus || r.status || 'unpaid',
        vendorName: r.vendorName || r.vendor || '',
        isCompleted: !!r.isCompleted,
      }));
      res.json(parsed);
    } catch (error) {
      console.error('[API Budget Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data anggaran' });
    }
  });

  // POST /api/budget - Tambah item anggaran
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, notes } = req.body;
      const itemName = req.body.title || req.body.name || 'Pengeluaran';
      const estimatedCost = Number(req.body.estimatedCost) || 0;
      const actualCost = Number(req.body.actualCost) || 0;
      const paidCost = Number(req.body.paidAmount !== undefined ? req.body.paidAmount : req.body.paidCost) || 0;
      const status = req.body.paymentStatus || req.body.status || 'draft';
      const vendor = req.body.vendorName || req.body.vendor || null;
      const vendorPhone = req.body.vendorPhone || null;
      const dueDate = req.body.dueDate || null;
      const isCompleted = req.body.isCompleted ? 1 : 0;
      const id = 'budget_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

      await pool.query(
        `INSERT INTO budget_items (id, category, name, estimated_cost, actual_cost, paid_cost, status, vendor, vendor_phone, due_date, is_completed, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, category || 'logistics_other', itemName, estimatedCost, actualCost, paidCost, status, vendor, vendorPhone, dueDate, isCompleted, notes || null]
      );

      const newItem = {
        id,
        category: category || 'logistics_other',
        title: itemName,
        name: itemName,
        estimatedCost,
        actualCost,
        paidAmount: paidCost,
        paidCost,
        paymentStatus: status,
        status,
        vendorName: vendor,
        vendor,
        vendorPhone,
        dueDate,
        isCompleted: !!isCompleted,
        notes,
      };
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
      const { category, notes } = req.body;
      const itemName = req.body.title !== undefined ? req.body.title : req.body.name;
      const estimatedCost = req.body.estimatedCost;
      const actualCost = req.body.actualCost;
      const paidCost = req.body.paidAmount !== undefined ? req.body.paidAmount : req.body.paidCost;
      const status = req.body.paymentStatus !== undefined ? req.body.paymentStatus : req.body.status;
      const vendor = req.body.vendorName !== undefined ? req.body.vendorName : req.body.vendor;
      const vendorPhone = req.body.vendorPhone;
      const dueDate = req.body.dueDate;
      const isCompleted = req.body.isCompleted !== undefined ? (req.body.isCompleted ? 1 : 0) : undefined;

      await pool.query(
        `UPDATE budget_items 
         SET category = COALESCE(?, category),
             name = COALESCE(?, name),
             estimated_cost = COALESCE(?, estimated_cost),
             actual_cost = COALESCE(?, actual_cost),
             paid_cost = COALESCE(?, paid_cost),
             status = COALESCE(?, status),
             vendor = COALESCE(?, vendor),
             vendor_phone = COALESCE(?, vendor_phone),
             due_date = COALESCE(?, due_date),
             is_completed = COALESCE(?, is_completed),
             notes = COALESCE(?, notes)
         WHERE id = ?`,
        [category, itemName, estimatedCost, actualCost, paidCost, status, vendor, vendorPhone, dueDate, isCompleted, notes, id]
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
