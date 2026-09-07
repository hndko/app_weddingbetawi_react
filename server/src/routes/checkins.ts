import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';

export function createCheckinsRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/checkins - Ambil semua log check-in
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, guest_id as guestId, name, check_in_time as checkInTime, 
                actual_pax as actualPax, souvenir_claimed as souvenirClaimed, 
                table_number as tableNumber, source, notes, created_at as createdAt 
         FROM checkins ORDER BY created_at DESC`
      );
      res.json(rows);
    } catch (error) {
      console.error('[API Checkins Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data check-in' });
    }
  });

  // POST /api/checkins - Tambah atau perbarui log check-in
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { guestId, name, checkInTime, actualPax, souvenirClaimed, tableNumber, source, notes } = req.body;
      const id = 'checkin_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

      await pool.query(
        `INSERT INTO checkins (id, guest_id, name, check_in_time, actual_pax, souvenir_claimed, table_number, source, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, guestId || null, name, checkInTime, actualPax || 1, souvenirClaimed ? 1 : 0, tableNumber || null, source || 'qr_scan', notes || null]
      );

      const newRecord = {
        id,
        guestId,
        name,
        checkInTime,
        actualPax: actualPax || 1,
        souvenirClaimed: !!souvenirClaimed,
        tableNumber,
        source,
        notes,
      };

      io.emit('checkin:created', newRecord);
      res.status(201).json({ success: true, data: newRecord });
    } catch (error) {
      console.error('[API Checkins Error]:', error);
      res.status(500).json({ error: 'Gagal mencatat check-in' });
    }
  });

  // DELETE /api/checkins/:id - Hapus satu log check-in
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM checkins WHERE id = ?', [id]);
      io.emit('checkin:deleted', id);
      res.json({ success: true, message: 'Log check-in berhasil dihapus' });
    } catch (error) {
      console.error('[API Checkins Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus check-in' });
    }
  });

  return router;
}
