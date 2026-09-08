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
        `SELECT id, name, phone, status, tier, vip_notes as vipNotes, 
                table_number as tableNumber, notes, 
                checked_in as checkedIn, checked_in_at as checkedInAt, 
                souvenir_claimed as souvenirClaimed, souvenir_claimed_at as souvenirClaimedAt,
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

      // Handle batch import jika array diberikan (Atomic Multi-Row Transaction)
      if (Array.isArray(body.guests)) {
        const guestsList = body.guests;
        if (guestsList.length === 0) {
          res.json({ success: true, count: 0 });
          return;
        }

        interface GuestImportItem {
          id: string;
          name: string;
          phone: string | null;
          status: string;
          tier: string;
          vipNotes: string | null;
          tableNumber: string | null;
          notes: string | null;
        }

        const validGuests: GuestImportItem[] = [];
        const rowsToInsert: Array<[string, string, string | null, string, string, string | null, string | null, string | null]> = [];

        for (const g of guestsList) {
          if (!g || !g.name || !String(g.name).trim()) continue;
          const id = 'guest_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
          const cleanName = String(g.name).trim();
          const cleanPhone = g.phone ? String(g.phone).trim() : null;
          const cleanStatus = g.status || 'pending';
          const cleanTier = g.tier || 'regular';
          const cleanVipNotes = g.vipNotes || null;
          const cleanTable = g.tableNumber || null;
          const cleanNotes = g.notes || null;

          validGuests.push({
            id,
            name: cleanName,
            phone: cleanPhone,
            status: cleanStatus,
            tier: cleanTier,
            vipNotes: cleanVipNotes,
            tableNumber: cleanTable,
            notes: cleanNotes,
          });

          rowsToInsert.push([
            id,
            cleanName,
            cleanPhone,
            cleanStatus,
            cleanTier,
            cleanVipNotes,
            cleanTable,
            cleanNotes,
          ]);
        }

        if (rowsToInsert.length === 0) {
          res.status(400).json({ error: 'Tidak ada data tamu valid yang dapat diimpor' });
          return;
        }

        // Jalankan transaksi database MySQL atomik
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();

          // Chunking per 500 baris untuk efisiensi kueri
          const CHUNK_SIZE = 500;
          for (let i = 0; i < rowsToInsert.length; i += CHUNK_SIZE) {
            const chunk = rowsToInsert.slice(i, i + CHUNK_SIZE);
            await connection.query(
              `INSERT INTO guests (id, name, phone, status, tier, vip_notes, table_number, notes) VALUES ?`,
              [chunk]
            );
          }

          await connection.commit();
        } catch (dbErr) {
          await connection.rollback();
          throw dbErr;
        } finally {
          connection.release();
        }

        io.emit('guests:imported', { count: validGuests.length });
        res.status(201).json({ success: true, count: validGuests.length, data: validGuests });
        return;
      }

      // Handle single guest
      const { name, phone, tier, vipNotes, tableNumber, notes } = body;
      if (!name) {
        res.status(400).json({ error: 'Nama tamu undangan wajib diisi' });
        return;
      }

      const id = 'guest_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
      const cleanPhone = phone || null;
      const cleanTier = tier || 'regular';
      const cleanVipNotes = vipNotes || null;
      const cleanTable = tableNumber || null;
      const cleanNotes = notes || null;

      await pool.query(
        `INSERT INTO guests (id, name, phone, status, tier, vip_notes, table_number, notes) VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)`,
        [id, name.trim(), cleanPhone, cleanTier, cleanVipNotes, cleanTable, cleanNotes]
      );

      const newGuest = {
        id,
        name: name.trim(),
        phone: cleanPhone,
        status: 'pending',
        tier: cleanTier,
        vipNotes: cleanVipNotes,
        tableNumber: cleanTable,
        notes: cleanNotes,
        checkedIn: false,
        souvenirClaimed: false,
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
      const { name, phone, status, tier, vipNotes, tableNumber, notes, souvenirClaimed } = req.body;

      await pool.query(
        `UPDATE guests 
         SET name = COALESCE(?, name),
             phone = COALESCE(?, phone),
             status = COALESCE(?, status),
             tier = COALESCE(?, tier),
             vip_notes = COALESCE(?, vip_notes),
             table_number = COALESCE(?, table_number),
             notes = COALESCE(?, notes),
             souvenir_claimed = COALESCE(?, souvenir_claimed)
         WHERE id = ?`,
        [name, phone, status, tier, vipNotes, tableNumber, notes, souvenirClaimed !== undefined ? (souvenirClaimed ? 1 : 0) : null, id]
      );

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
      const { id } = req.params;
      const { autoClaimSouvenir } = req.body || {};
      const now = new Date();
      const claimSouvenir = autoClaimSouvenir !== false;

      await pool.query(
        `UPDATE guests 
         SET checked_in = 1,
             checked_in_at = ?,
             souvenir_claimed = CASE WHEN ? = 1 THEN 1 ELSE souvenir_claimed END,
             souvenir_claimed_at = CASE WHEN ? = 1 AND souvenir_claimed_at IS NULL THEN ? ELSE souvenir_claimed_at END
         WHERE id = ?`,
        [now, claimSouvenir ? 1 : 0, claimSouvenir ? 1 : 0, now, id]
      );

      io.emit('guest:checked_in', { 
        id, 
        checkedIn: true, 
        checkedInAt: now.toISOString(),
        souvenirClaimed: claimSouvenir,
        souvenirClaimedAt: claimSouvenir ? now.toISOString() : undefined 
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
      const { id } = req.params;
      const { claimed } = req.body || {};
      const isClaimed = claimed !== false;
      const now = isClaimed ? new Date() : null;

      await pool.query(
        `UPDATE guests 
         SET souvenir_claimed = ?,
             souvenir_claimed_at = ?
         WHERE id = ?`,
        [isClaimed ? 1 : 0, now, id]
      );

      io.emit('guest:souvenir_claimed', { 
        id, 
        souvenirClaimed: isClaimed, 
        souvenirClaimedAt: now ? now.toISOString() : null 
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
