import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';
import { authenticateJwt } from '../middleware/auth';

export function createCheckinsRouter(io: SocketIOServer) {
  const router = Router();

  // Seluruh endpoint manajemen check-in resepsi wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // GET /api/checkins - Ambil semua log check-in
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, guest_id as guestId, name, check_in_time as checkInTime, 
                actual_pax as actualPax, tier, souvenir_claimed as souvenirClaimed, 
                souvenir_claimed_at as souvenirClaimedAt,
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
      const { guestId, name, checkInTime, actualPax, tier, souvenirClaimed, tableNumber, source, notes } = req.body;
      const id = 'checkin_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const now = souvenirClaimed ? new Date() : null;

      await pool.query(
        `INSERT INTO checkins (id, guest_id, name, check_in_time, actual_pax, tier, souvenir_claimed, souvenir_claimed_at, table_number, source, notes) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, guestId || null, name, checkInTime, actualPax || 1, tier || 'regular', souvenirClaimed ? 1 : 0, now, tableNumber || null, source || 'qr_scan', notes || null]
      );

      const newRecord = {
        id,
        guestId,
        name,
        checkInTime,
        actualPax: actualPax || 1,
        tier: tier || 'regular',
        souvenirClaimed: !!souvenirClaimed,
        souvenirClaimedAt: now ? now.toISOString() : undefined,
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

  // PATCH /api/checkins/:id/souvenir - Toggle souvenir status untuk log check-in dan tamu
  router.patch('/:id/souvenir', async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { claimed } = req.body;
      const isClaimed = claimed !== undefined ? Boolean(claimed) : true;
      const now = isClaimed ? new Date() : null;

      interface CheckinGuestRow {
        guest_id: string | null;
      }
      const [rows] = await pool.query<CheckinGuestRow[] & import('mysql2').RowDataPacket[]>(
        'SELECT guest_id FROM checkins WHERE id = ?',
        [id]
      );

      if (!rows || rows.length === 0) {
        res.status(404).json({ error: 'Data check-in tidak ditemukan' });
        return;
      }

      await pool.query(
        'UPDATE checkins SET souvenir_claimed = ?, souvenir_claimed_at = ? WHERE id = ?',
        [isClaimed ? 1 : 0, now, id]
      );

      const guestId = rows[0]?.guest_id;
      if (guestId) {
        await pool.query(
          'UPDATE guests SET souvenir_claimed = ?, souvenir_claimed_at = ? WHERE id = ?',
          [isClaimed ? 1 : 0, now, guestId]
        );
        io.emit('guest:souvenir_claimed', {
          id: guestId,
          souvenirClaimed: isClaimed,
          souvenirClaimedAt: now ? now.toISOString() : null,
        });
      }

      io.emit('checkin:souvenir_updated', {
        id,
        guestId,
        souvenirClaimed: isClaimed,
        souvenirClaimedAt: now ? now.toISOString() : null,
      });

      res.json({ success: true, souvenirClaimed: isClaimed });
    } catch (error) {
      console.error('[API Checkin Souvenir Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui status souvenir' });
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
