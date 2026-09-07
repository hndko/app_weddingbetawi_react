import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { pool } from '../db/connection';
import { config as defaultConfig } from '../../../src/data/config';
import { authenticateJwt } from '../middleware/auth';

// Ekstraksi seluruh URL /uploads/... dari objek konfigurasi
function extractUploadUrls(cfg: any): Set<string> {
  const urls = new Set<string>();
  if (!cfg || typeof cfg !== 'object') return urls;

  const checkAndAdd = (val: any) => {
    if (typeof val === 'string' && val.startsWith('/uploads/')) {
      urls.add(val);
    }
  };

  checkAndAdd(cfg.groom?.image);
  checkAndAdd(cfg.bride?.image);
  checkAndAdd(cfg.seo?.image);

  if (Array.isArray(cfg.gallery)) {
    cfg.gallery.forEach(checkAndAdd);
  }

  if (Array.isArray(cfg.banks)) {
    cfg.banks.forEach((b: any) => checkAndAdd(b?.qrisImage));
  }

  checkAndAdd(cfg.agencyBranding?.agencyLogoUrl);

  return urls;
}

export function createConfigRouter(io: SocketIOServer) {
  const router = Router();
  const uploadDir = path.resolve(process.cwd(), 'server', 'uploads');

  // GET /api/config - Ambil konfigurasi undangan pernikahan
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
      const record = (rows as Array<{ config_json: string }>)[0];

      if (!record || !record.config_json) {
        res.json(defaultConfig);
        return;
      }

      const parsed = JSON.parse(record.config_json);
      res.json(parsed);
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

      // 1. Dapatkan konfigurasi lama untuk mendeteksi berkas yang diganti/dihapus
      let oldConfig: any = null;
      try {
        const [oldRows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
        const oldRecord = (oldRows as Array<{ config_json: string }>)[0];
        if (oldRecord?.config_json) {
          oldConfig = JSON.parse(oldRecord.config_json);
        }
      } catch {
        // Safe fallback jika query lama gagal
      }

      // 2. Simpan konfigurasi baru ke MySQL
      const jsonStr = JSON.stringify(newConfig);
      await pool.query(
        `INSERT INTO wedding_config (id, config_json) VALUES (1, ?) 
         ON DUPLICATE KEY UPDATE config_json = VALUES(config_json);`,
        [jsonStr]
      );

      // 3. Deteksi dan hapus berkas lama dari server/uploads/ yang tidak lagi dipakai
      if (oldConfig) {
        const oldUrls = extractUploadUrls(oldConfig);
        const newUrls = extractUploadUrls(newConfig);

        for (const oldUrl of oldUrls) {
          if (!newUrls.has(oldUrl)) {
            try {
              const filename = path.basename(oldUrl);
              const targetPath = path.resolve(uploadDir, filename);
              if (fs.existsSync(targetPath)) {
                fs.unlinkSync(targetPath);
                console.log(`[Storage Cleanup] Berkas gambar lama berhasil dihapus: ${filename}`);
              }
            } catch (unlinkErr) {
              console.warn('[Storage Cleanup Warning] Gagal menghapus berkas usang:', unlinkErr);
            }
          }
        }
      }

      // 4. Broadcast pembaruan konfigurasi ke seluruh client aktif secara realtime
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
      const { currentEvent, customNote, isActive } = req.body;
      const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
      const record = (rows as Array<{ config_json: string }>)[0];
      const cfg = record?.config_json ? JSON.parse(record.config_json) : { ...defaultConfig };

      const liveRundown = {
        isActive: isActive !== false,
        currentEvent: currentEvent || 'Acara Sedang Berlangsung',
        customNote: customNote || '',
        updatedAt: new Date().toISOString(),
      };

      cfg.liveRundown = liveRundown;

      await pool.query(
        `INSERT INTO wedding_config (id, config_json) VALUES (1, ?) 
         ON DUPLICATE KEY UPDATE config_json = VALUES(config_json);`,
        [JSON.stringify(cfg)]
      );

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
