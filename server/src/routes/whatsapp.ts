import { Router, Request, Response } from 'express';
import { authenticateJwt } from '../middleware/auth';
import { pool } from '../db/connection';
import {
  WhatsAppGatewayConfig,
  sendWhatsAppMessage,
  testWhatsAppGateway,
} from '../services/whatsappGateway';

export function createWhatsAppRouter() {
  const router = Router();

  // Seluruh endpoint WhatsApp dilindungi oleh token autentikasi JWT Admin
  router.use(authenticateJwt);

  // POST /api/whatsapp/test - Uji coba pengiriman pesan ke nomor tujuan
  router.post('/test', async (req: Request, res: Response): Promise<void> => {
    try {
      const { testPhone, config } = req.body as {
        testPhone?: string;
        config?: WhatsAppGatewayConfig;
      };

      if (!testPhone || !config) {
        res.status(400).json({ error: 'Nomor telepon uji coba dan konfigurasi gateway wajib disertakan' });
        return;
      }

      const result = await testWhatsAppGateway(testPhone, config);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Gagal mengirim pesan uji coba',
          details: result.details,
        });
        return;
      }

      res.json({
        success: true,
        message: `Pesan uji coba berhasil dikirim via provider ${result.provider.toUpperCase()}`,
        result,
      });
    } catch (err: unknown) {
      console.error('[WhatsApp Router Error]:', err);
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: `Terjadi kesalahan saat menguji gateway: ${msg}` });
    }
  });

  // POST /api/whatsapp/send - Kirim pesan ke nomor tujuan via gateway aktif
  router.post('/send', async (req: Request, res: Response): Promise<void> => {
    try {
      const { to, message, config } = req.body as {
        to?: string;
        message?: string;
        config?: WhatsAppGatewayConfig;
      };

      if (!to || !message) {
        res.status(400).json({ error: 'Nomor tujuan dan teks pesan wajib disertakan' });
        return;
      }

      let activeConfig = config;

      // Jika config tidak dikirim, ambil dari wedding_config di basis data
      if (!activeConfig) {
        const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1');
        const list = rows as any[];
        if (list.length > 0 && list[0].config_json) {
          try {
            const parsed = JSON.parse(list[0].config_json);
            activeConfig = parsed.whatsappGateway;
          } catch {}
        }
      }

      const result = await sendWhatsAppMessage(to, message, activeConfig);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error || 'Gagal mengirim pesan via WhatsApp Gateway',
          details: result.details,
        });
        return;
      }

      res.json({
        success: true,
        message: 'Pesan berhasil dikirim via WhatsApp Gateway',
        result,
      });
    } catch (err: unknown) {
      console.error('[WhatsApp Send Error]:', err);
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: `Gagal mengirim pesan: ${msg}` });
    }
  });

  return router;
}
