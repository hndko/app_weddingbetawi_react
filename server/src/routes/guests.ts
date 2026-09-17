import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJwt } from '../middleware/auth';
import { guestService } from '../services/guestService';

export function createGuestsRouter(io: SocketIOServer) {
  const router = Router();

  // Seluruh endpoint manajemen data tamu wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // GET /api/guests - Ambil semua daftar tamu undangan
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const rows = await guestService.getAllGuests();
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

      // Handle batch import jika array diberikan (Atomic Multi-Row Transaction)
      if (Array.isArray(body.guests)) {
        const guestsList = body.guests;
        if (guestsList.length === 0) {
          res.json({ success: true, count: 0 });
          return;
        }

        const { count, validGuests } = await guestService.importGuestsBatch(guestsList);
        if (count === 0) {
          res.status(400).json({ error: 'Tidak ada data tamu valid yang dapat diimpor' });
          return;
        }

        io.emit('guests:imported', { count });
        res.status(201).json({ success: true, count, data: validGuests });
        return;
      }

      // Handle single guest
      const { name, phone, tier, vipNotes, tableNumber, notes } = body;
      if (!name) {
        res.status(400).json({ error: 'Nama tamu undangan wajib diisi' });
        return;
      }

      const newGuest = await guestService.createGuest({
        name,
        phone,
        tier,
        vipNotes,
        tableNumber,
        notes,
      });

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
      const id = String(req.params.id);
      const { name, phone, status, tier, vipNotes, tableNumber, notes, souvenirClaimed } = req.body;

      await guestService.updateGuest(id, {
        name,
        phone,
        status,
        tier,
        vipNotes,
        tableNumber,
        notes,
        souvenirClaimed,
      });

      io.emit('guest:updated', { id, name, phone, status, tier, vipNotes, tableNumber, notes, souvenirClaimed });
      res.json({ success: true, message: 'Data tamu berhasil diperbarui' });
    } catch (error) {
      console.error('[API Guests Error] Gagal memperbarui tamu:', error);
      res.status(500).json({ error: 'Gagal memperbarui data tamu' });
    }
  });

  // PATCH /api/guests/:id/checkin - Check-in resepsi (QR scan / manual)
  router.patch('/:id/checkin', async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { autoClaimSouvenir } = req.body || {};

      const checkinResult = await guestService.checkinGuest(id, autoClaimSouvenir);

      io.emit('guest:checked_in', { 
        id, 
        checkedIn: true, 
        checkedInAt: checkinResult.checkedInAt.toISOString(),
        souvenirClaimed: checkinResult.souvenirClaimed,
        souvenirClaimedAt: checkinResult.souvenirClaimedAt ? checkinResult.souvenirClaimedAt.toISOString() : undefined 
      });
      res.json({ success: true, message: 'Tamu berhasil check-in' });
    } catch (error) {
      console.error('[API Guests Check-in Error]:', error);
      res.status(500).json({ error: 'Gagal melakukan check-in tamu' });
    }
  });

  // PATCH /api/guests/:id/souvenir - Klaim atau batal klaim souvenir
  router.patch('/:id/souvenir', async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { claimed } = req.body || {};
      const { isClaimed, timestamp } = await guestService.toggleGuestSouvenir(id, claimed);

      io.emit('guest:souvenir_claimed', { 
        id, 
        souvenirClaimed: isClaimed, 
        souvenirClaimedAt: timestamp ? timestamp.toISOString() : null 
      });
      res.json({ success: true, souvenirClaimed: isClaimed, message: isClaimed ? 'Souvenir berhasil diklaim' : 'Klaim souvenir dibatalkan' });
    } catch (error) {
      console.error('[API Guests Souvenir Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui status souvenir tamu' });
    }
  });

  // DELETE /api/guests/:id - Hapus satu tamu
  router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await guestService.deleteGuest(id);

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
      await guestService.resetAllGuests();
      io.emit('guests:reset', true);
      res.json({ success: true, message: 'Seluruh daftar tamu berhasil dikosongkan' });
    } catch (error) {
      console.error('[API Guests Error] Gagal mereset tamu:', error);
      res.status(500).json({ error: 'Gagal mengosongkan daftar tamu dari database' });
    }
  });

  return router;
}
