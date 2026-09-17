import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJwt } from '../middleware/auth';
import { checkinService } from '../services/checkinService';

export function createCheckinsRouter(io: SocketIOServer) {
  const router = Router();

  // Seluruh endpoint manajemen check-in resepsi wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // GET /api/checkins - Ambil semua log check-in
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const rows = await checkinService.getAllCheckins();
      res.json(rows);
    } catch (error) {
      console.error('[API Checkins Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data check-in' });
    }
  });

  // POST /api/checkins - Tambah atau perbarui log check-in (Atomik dengan tabel guests)
  router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const { guestId, name, checkInTime, actualPax, tier, souvenirClaimed, tableNumber, source, notes } = req.body;
      if (!name) {
        res.status(400).json({ error: 'Nama tamu check-in wajib disertakan' });
        return;
      }

      const { newRecord, checkinDate, now } = await checkinService.createCheckin({
        guestId,
        name,
        checkInTime,
        actualPax,
        tier,
        souvenirClaimed,
        tableNumber,
        source,
        notes,
      });

      io.emit('checkin:created', newRecord);
      if (guestId) {
        io.emit('guest:checked_in', {
          id: guestId,
          checkedIn: true,
          checkedInAt: checkinDate.toISOString(),
          souvenirClaimed: !!souvenirClaimed,
          souvenirClaimedAt: now ? now.toISOString() : undefined,
        });
      }

      res.status(201).json({ success: true, data: newRecord });
    } catch (error) {
      console.error('[API Checkins Error]:', error);
      res.status(500).json({ error: 'Gagal mencatat check-in' });
    }
  });

  // POST /api/checkins/sync - Batch sinkronisasi check-in luring dari antrean IndexedDB
  router.post('/sync', async (req: Request, res: Response): Promise<void> => {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: 'Data batch items wajib berupa array non-kosong' });
      return;
    }

    try {
      const syncedCount = await checkinService.syncOfflineCheckins(items);
      io.emit('checkins:synced', { count: syncedCount });
      res.json({ success: true, syncedCount });
    } catch (error) {
      console.error('[API Checkins Sync Error]:', error);
      res.status(500).json({ error: 'Gagal menyinkronkan antrean check-in offline' });
    }
  });

  // PATCH /api/checkins/:id/souvenir - Toggle souvenir status untuk log check-in dan tamu
  router.patch('/:id/souvenir', async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { claimed } = req.body;

      const { found, guestId, isClaimed, now } = await checkinService.toggleCheckinSouvenir(id, claimed);
      if (!found) {
        res.status(404).json({ error: 'Data check-in tidak ditemukan' });
        return;
      }

      if (guestId) {
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
      const id = String(req.params.id);
      await checkinService.deleteCheckin(id);
      io.emit('checkin:deleted', id);
      res.json({ success: true, message: 'Log check-in berhasil dihapus' });
    } catch (error) {
      console.error('[API Checkins Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus check-in' });
    }
  });

  return router;
}
