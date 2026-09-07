import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';
import { authenticateJwt } from '../middleware/auth';

export function createGuestsRouter(io: SocketIOServer) {
  const router = Router();

  // Seluruh endpoint manajemen data tamu wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // GET /api/guests - Ambil semua daftar tamu undangan
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, name, phone, status, table_number as tableNumber, notes, 
                checked_in as checkedIn, checked_in_at as checkedInAt, 
                created_at as createdAt, updated_at as updatedAt 
         FROM guests ORDER BY created_at DESC`
      );
      res.json(rows);
    } catch (error) {
      console.error('[API Guests Error] Gagal mengambil data tamu:', error);
      res.status(500).json({ error: 'Gagal mengambil data tamu dari database' });
    }
  });

  // POST /api/guests - Tambah satu tamu atau impor batch
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body;

      // Handle batch import jika array diberikan
      if (Array.isArray(body.guests)) {
        const guestsList = body.guests;
        if (guestsList.length === 0) {
          res.json({ success: true, count: 0 });
          return;
        }

        const inserted: any[] = [];
        for (const g of guestsList) {
          if (!g.name) continue;
          const id = 'guest_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
          const phone = g.phone || null;
          const status = g.status || 'pending';
          const tableNumber = g.tableNumber || null;
          const notes = g.notes || null;

          await pool.query(
            `INSERT INTO guests (id, name, phone, status, table_number, notes) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, g.name.trim(), phone, status, tableNumber, notes]
          );

          inserted.push({ id, name: g.name.trim(), phone, status, tableNumber, notes });
        }

        io.emit('guests:imported', { count: inserted.length });
        res.status(201).json({ success: true, count: inserted.length, data: inserted });
        return;
      }

      // Handle single guest
      const { name, phone, tableNumber, notes } = body;
      if (!name) {
        res.status(400).json({ error: 'Nama tamu undangan wajib diisi' });
        return;
      }

      const id = 'guest_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const cleanPhone = phone || null;
      const cleanTable = tableNumber || null;
      const cleanNotes = notes || null;

      await pool.query(
        `INSERT INTO guests (id, name, phone, status, table_number, notes) VALUES (?, ?, ?, 'pending', ?, ?)`,
        [id, name.trim(), cleanPhone, cleanTable, cleanNotes]
      );

      const newGuest = {
        id,
        name: name.trim(),
        phone: cleanPhone,
        status: 'pending',
        tableNumber: cleanTable,
        notes: cleanNotes,
        checkedIn: false,
        createdAt: new Date().toISOString(),
      };

      io.emit('guest:created', newGuest);
      res.status(201).json({ success: true, data: newGuest });
    } catch (error) {
      console.error('[API Guests Error] Gagal menambahkan tamu:', error);
      res.status(500).json({ error: 'Gagal menambahkan tamu ke database' });
    }
  });

  // PUT /api/guests/:id - Update status atau detail tamu
  router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, phone, status, tableNumber, notes } = req.body;

      await pool.query(
        `UPDATE guests 
         SET name = COALESCE(?, name),
             phone = COALESCE(?, phone),
             status = COALESCE(?, status),
             table_number = COALESCE(?, table_number),
             notes = COALESCE(?, notes)
         WHERE id = ?`,
        [name, phone, status, tableNumber, notes, id]
      );

      io.emit('guest:updated', { id, name, phone, status, tableNumber, notes });
      res.json({ success: true, message: 'Data tamu berhasil diperbarui' });
    } catch (error) {
      console.error('[API Guests Error] Gagal memperbarui tamu:', error);
      res.status(500).json({ error: 'Gagal memperbarui data tamu' });
    }
  });

  // PATCH /api/guests/:id/checkin - Check-in resepsi (QR scan / manual)
  router.patch('/:id/checkin', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const now = new Date();

      await pool.query(
        `UPDATE guests 
         SET checked_in = 1,
             checked_in_at = ?
         WHERE id = ?`,
        [now, id]
      );

      io.emit('guest:checked_in', { id, checkedIn: true, checkedInAt: now.toISOString() });
      res.json({ success: true, message: 'Tamu berhasil check-in' });
    } catch (error) {
      console.error('[API Guests Check-in Error]:', error);
      res.status(500).json({ error: 'Gagal melakukan check-in tamu' });
    }
  });

  // DELETE /api/guests/:id - Hapus satu tamu
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM guests WHERE id = ?', [id]);

      io.emit('guest:deleted', id);
      res.json({ success: true, message: 'Tamu berhasil dihapus' });
    } catch (error) {
      console.error('[API Guests Error] Gagal menghapus tamu:', error);
      res.status(500).json({ error: 'Gagal menghapus data tamu dari database' });
    }
  });

  // DELETE /api/guests - Reset / kosongkan seluruh daftar tamu
  router.delete('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      await pool.query('DELETE FROM guests');
      io.emit('guests:reset', true);
      res.json({ success: true, message: 'Seluruh daftar tamu berhasil dikosongkan' });
    } catch (error) {
      console.error('[API Guests Error] Gagal mereset tamu:', error);
      res.status(500).json({ error: 'Gagal mengosongkan daftar tamu dari database' });
    }
  });

  return router;
}
