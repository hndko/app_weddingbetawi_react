import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';
import { authenticateJwt } from '../middleware/auth';

export function createSeatingRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/seating - Ambil semua daftar meja dan penetapan tamu
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, number, name, shape, zone, capacity, category, 
                assigned_guests as assignedGuests, notes, 
                pos_x as posX, pos_y as posY, created_at as createdAt 
         FROM seating_tables ORDER BY number ASC, created_at ASC`
      );

      const parsed = (rows as any[]).map((r) => ({
        ...r,
        number: r.number || r.name,
        shape: r.shape || 'round',
        zone: r.zone || 'regular_left',
        assignedGuests: typeof r.assignedGuests === 'string' ? JSON.parse(r.assignedGuests) : (r.assignedGuests || []),
      }));

      res.json(parsed);
    } catch (error) {
      console.error('[API Seating Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data seating chart' });
    }
  });

  // POST /api/seating - Tambah meja baru (dilindungi JWT Admin)
  router.post('/', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const { number, name, shape, zone, capacity, category, assignedGuests, notes, posX, posY } = req.body;
      const id = 'table_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const tableNumber = number || name || 'Meja';

      await pool.query(
        `INSERT INTO seating_tables (id, number, name, shape, zone, capacity, category, assigned_guests, notes, pos_x, pos_y) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          tableNumber,
          name || tableNumber,
          shape || 'round',
          zone || 'regular_left',
          capacity || 8,
          category || 'General',
          JSON.stringify(assignedGuests || []),
          notes || null,
          posX || 0,
          posY || 0,
        ]
      );

      const newTable = {
        id,
        number: tableNumber,
        name: name || tableNumber,
        shape: shape || 'round',
        zone: zone || 'regular_left',
        capacity: capacity || 8,
        category: category || 'General',
        assignedGuests: assignedGuests || [],
        notes: notes || '',
        posX: posX || 0,
        posY: posY || 0,
      };
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
      const { id } = req.params;
      const { number, name, shape, zone, capacity, category, assignedGuests, notes, posX, posY } = req.body;

      await pool.query(
        `UPDATE seating_tables 
         SET number = COALESCE(?, number),
             name = COALESCE(?, name),
             shape = COALESCE(?, shape),
             zone = COALESCE(?, zone),
             capacity = COALESCE(?, capacity),
             category = COALESCE(?, category),
             assigned_guests = COALESCE(?, assigned_guests),
             notes = COALESCE(?, notes),
             pos_x = COALESCE(?, pos_x),
             pos_y = COALESCE(?, pos_y)
         WHERE id = ?`,
        [
          number,
          name,
          shape,
          zone,
          capacity,
          category,
          assignedGuests ? JSON.stringify(assignedGuests) : null,
          notes,
          posX,
          posY,
          id,
        ]
      );

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
