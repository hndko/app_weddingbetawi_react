import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { authenticateJwt } from '../middleware/auth';
import { configService } from '../services/configService';

export function createConfigRouter(io: SocketIOServer) {
  const router = Router();
  const uploadDir = path.resolve(process.cwd(), 'server', 'uploads');

  // GET /api/config - Ambil konfigurasi undangan pernikahan (In-Memory SWR Cache)
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const config = await configService.getConfig();
      res.json(config);
    } catch (error) {
      console.error('[API Config Error] Gagal mengambil konfigurasi:', error);
      res.status(500).json({ error: 'Gagal mengambil data konfigurasi dari database' });
    }
  });

  // PUT /api/config - Simpan pembaruan konfigurasi (dilindungi JWT) & otomatis hapus berkas lama
  router.put('/', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const newConfig = req.body;
      if (!newConfig || typeof newConfig !== 'object') {
        res.status(400).json({ error: 'Data konfigurasi tidak valid' });
        return;
      }

      await configService.updateConfig(newConfig, uploadDir);

      // Broadcast pembaruan konfigurasi ke seluruh client aktif secara realtime
      io.emit('config:updated', newConfig);

      res.json({ success: true, message: 'Konfigurasi berhasil disimpan ke MySQL', data: newConfig });
    } catch (error) {
      console.error('[API Config Error] Gagal menyimpan konfigurasi:', error);
      res.status(500).json({ error: 'Gagal menyimpan konfigurasi ke database' });
    }
  });

  // POST /api/config/rundown - Broadcast status rundown hari-H secara instan via Socket.io
  router.post('/rundown', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const { cfg, liveRundown } = await configService.updateLiveRundown(req.body);

      io.emit('rundown:updated', liveRundown);
      io.emit('config:updated', cfg);

      res.json({ success: true, liveRundown });
    } catch (error) {
      console.error('[API Rundown Broadcast Error]:', error);
      res.status(500).json({ error: 'Gagal menyiarkan status rundown' });
    }
  });

  return router;
}
