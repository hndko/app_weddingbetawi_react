import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';

export function createSeatingRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/seating - Ambil semua daftar meja dan penetapan tamu
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, capacity, category, assigned_guests as assignedGuests, created_at as createdAt 
         FROM seating_tables ORDER BY created_at ASC`
      );

      const parsed = (rows as any[]).map((r) => ({
        ...r,
        assignedGuests: typeof r.assignedGuests === 'string' ? JSON.parse(r.assignedGuests) : (r.assignedGuests || []),
      }));

      res.json(parsed);
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data seating chart' });
    }
  });

  // POST /api/seating - Tambah meja baru
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, capacity, category, assignedGuests } = req.body;
      const id = 'table_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

      await pool.query(
        `INSERT INTO seating_tables (id, name, capacity, category, assigned_guests) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, name, capacity || 8, category || 'General', JSON.stringify(assignedGuests || [])]
      );

      const newTable = { id, name, capacity: capacity || 8, category: category || 'General', assignedGuests: assignedGuests || [] };
      io.emit('seating:created', newTable);
      res.status(201).json({ success: true, data: newTable });
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal menambahkan meja' });
    }
  });

  // PUT /api/seating/:id - Update meja dan penetapan tamu
  router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, capacity, category, assignedGuests } = req.body;

      await pool.query(
        `UPDATE seating_tables 
         SET name = COALESCE(?, name),
             capacity = COALESCE(?, capacity),
             category = COALESCE(?, category),
             assigned_guests = COALESCE(?, assigned_guests)
         WHERE id = ?`,
        [name, capacity, category, assignedGuests ? JSON.stringify(assignedGuests) : null, id]
      );

      io.emit('seating:updated', { id, name, capacity, category, assignedGuests });
      res.json({ success: true, message: 'Meja berhasil diperbarui' });
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui meja' });
    }
  });

  // DELETE /api/seating/:id - Hapus meja
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM seating_tables WHERE id = ?', [id]);
      io.emit('seating:deleted', id);
      res.json({ success: true, message: 'Meja berhasil dihapus' });
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus meja' });
    }
  });

  return router;
}
