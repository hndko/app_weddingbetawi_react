import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import { authenticateJwt } from '../middleware/auth';
import { submissionRateLimiter } from '../middleware/rateLimiter';
import { sendWhatsAppMessage } from '../services/whatsappGateway';
import { rsvpService } from '../services/rsvpService';

export function createRsvpsRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/rsvps - Ambil semua konfirmasi kehadiran RSVP (dilindungi JWT Admin)
  router.get('/', authenticateJwt, async (_req: Request, res: Response): Promise<void> => {
    try {
      const rows = await rsvpService.getAllRsvps();
      res.json(rows);
    } catch (error) {
      console.error('[API RSVPs Error] Gagal mengambil data RSVP:', error);
      res.status(500).json({ error: 'Gagal mengambil data RSVP dari database' });
    }
  });

  // POST /api/rsvps - Simpan atau perbarui konfirmasi kehadiran RSVP (Anti-Duplikasi & Rate Limiter)
  router.post('/', submissionRateLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, phone, attendance, guestCount, notes } = req.body;

      if (!name || !attendance) {
        res.status(400).json({ error: 'Nama dan status kehadiran wajib diisi' });
        return;
      }

      const { record, isUpdate, cleanName, cleanPhone, count } = await rsvpService.saveOrUpdateRsvp({
        name,
        phone,
        attendance,
        guestCount,
        notes,
      });

      // Realtime broadcast ke admin panel
      if (isUpdate) {
        io.emit('rsvp:updated', record);
        res.status(200).json({ success: true, data: record, isUpdate: true });
      } else {
        io.emit('rsvp:created', record);
        res.status(201).json({ success: true, data: record, isUpdate: false });
      }

      // Jalankan notifikasi WhatsApp di latar belakang (fire-and-forget)
      (async () => {
        try {
          const [cfgRows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1');
          const cfgList = cfgRows as any[];
          if (cfgList.length === 0 || !cfgList[0].config_json) return;

          const weddingConfig = JSON.parse(cfgList[0].config_json);
          const gateway = weddingConfig.whatsappGateway;
          if (!gateway || gateway.provider === 'manual') return;

          const groom = weddingConfig.groom?.nickname || weddingConfig.groom?.fullName || 'Mempelai Pria';
          const bride = weddingConfig.bride?.nickname || weddingConfig.bride?.fullName || 'Mempelai Wanita';
          const attendanceLabel = attendance === 'hadir' ? 'Hadir' : attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Masih Ragu';

          // Tentukan URL origin dinamis dari header request atau host server aktif
          const rawOrigin = req.get('origin');
          const clientOrigin = (rawOrigin && rawOrigin !== 'null') 
            ? rawOrigin 
            : `${req.protocol}://${req.get('host')}`;
          const invitationUrl = `${clientOrigin}/?to=${encodeURIComponent(cleanName)}`;

          // 1. Kirim notifikasi alert ke Admin/Pengantin
          if (gateway.notifyAdminOnRsvp !== false && gateway.adminPhone) {
            const adminMsg = `🔔 *Konfirmasi RSVP ${isUpdate ? 'Pembaruan' : 'Baru'} Diterima!*\n\n` +
              `👤 *Nama Tamu*: ${cleanName}\n` +
              (cleanPhone ? `📞 *No. WhatsApp*: ${cleanPhone}\n` : '') +
              `✅ *Status*: ${attendanceLabel}\n` +
              `👥 *Jumlah*: ${count} Orang\n` +
              (notes ? `💬 *Doa / Catatan*: "${String(notes).trim()}"\n` : '') +
              `⏰ *Waktu*: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}`;

            sendWhatsAppMessage(gateway.adminPhone, adminMsg, gateway).catch((e) =>
              console.warn('[WhatsApp RSVP Admin Alert Warning]:', e)
            );
          }

          // 2. Kirim balasan otomatis ke Tamu jika nomor telepon tersedia
          if (gateway.notifyGuestOnRsvp !== false && cleanPhone) {
            const eventDate = weddingConfig.events?.resepsi?.date || weddingConfig.dateStr || 'Hari Bahagia';
            const eventVenue = weddingConfig.events?.resepsi?.venue || 'Gedung Resepsi';
            const guestMsg = `Halo *${cleanName}*,\n\n` +
              `Terima kasih telah mengonfirmasi kehadiran untuk hari bahagia pernikahan *${groom} & ${bride}*.\n\n` +
              `📋 *Rincian Konfirmasi Anda*:\n` +
              `• Status Kehadiran: *${attendanceLabel}*\n` +
              `• Jumlah Tamu: *${count} Orang*\n` +
              `📅 Tanggal: ${eventDate}\n` +
              `📍 Lokasi: ${eventVenue}\n\n` +
              `Tautan Undangan & QR Pass Digital Anda:\n` +
              `🔗 ${invitationUrl}\n\n` +
              `Sampai jumpa di hari bahagia kami! 🙏❤️`;

            sendWhatsAppMessage(cleanPhone, guestMsg, gateway).catch((e) =>
              console.warn('[WhatsApp RSVP Guest Confirmation Warning]:', e)
            );
          }
        } catch (notifyErr) {
          console.warn('[WhatsApp RSVP Notification Error]:', notifyErr);
        }
      })();
    } catch (error) {
      console.error('[API RSVPs Error] Gagal menyimpan data RSVP:', error);
      res.status(500).json({ error: 'Gagal menyimpan konfirmasi RSVP ke database' });
    }
  });

  // DELETE /api/rsvps/:id - Hapus data RSVP (dilindungi JWT Admin)
  router.delete('/:id', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      await rsvpService.deleteRsvp(id);

      // Realtime broadcast penghapusan RSVP
      io.emit('rsvp:deleted', id);

      res.json({ success: true, message: 'Data RSVP berhasil dihapus' });
    } catch (error) {
      console.error('[API RSVPs Error] Gagal menghapus RSVP:', error);
      res.status(500).json({ error: 'Gagal menghapus data RSVP dari database' });
    }
  });

  return router;
}
