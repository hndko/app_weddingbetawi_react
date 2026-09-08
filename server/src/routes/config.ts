import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import { pool } from '../db/connection';
import { config as defaultConfig } from '../../../src/data/config';
import { authenticateJwt } from '../middleware/auth';

interface PartialConfigUploads {
  groom?: { image?: string };
  bride?: { image?: string };
  seo?: { image?: string };
  gallery?: string[];
  banks?: Array<{ qrisImage?: string }>;
  agencyBranding?: { agencyLogoUrl?: string };
}

// In-Memory Cache untuk konfigurasi publik (Pilar 6 Kinerja & SWR)
let cachedConfig: unknown = null;
let cacheExpiryTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 menit

// Ekstraksi seluruh URL /uploads/... dari objek konfigurasi
function extractUploadUrls(cfg: unknown): Set<string> {
  const urls = new Set<string>();
  if (!cfg || typeof cfg !== 'object') return urls;

  const conf = cfg as PartialConfigUploads;
  const checkAndAdd = (val: unknown) => {
    if (typeof val === 'string' && val.startsWith('/uploads/')) {
      urls.add(val);
    }
  };

  checkAndAdd(conf.groom?.image);
  checkAndAdd(conf.bride?.image);
  checkAndAdd(conf.seo?.image);

  if (Array.isArray(conf.gallery)) {
    conf.gallery.forEach(checkAndAdd);
  }

  if (Array.isArray(conf.banks)) {
    conf.banks.forEach((b) => checkAndAdd(b?.qrisImage));
  }

  checkAndAdd(conf.agencyBranding?.agencyLogoUrl);

  return urls;
}

export function createConfigRouter(io: SocketIOServer) {
  const router = Router();
  const uploadDir = path.resolve(process.cwd(), 'server', 'uploads');

  // GET /api/config - Ambil konfigurasi undangan pernikahan (In-Memory SWR Cache)
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const now = Date.now();
      if (cachedConfig && now < cacheExpiryTime) {
        res.json(cachedConfig);
        return;
      }

      const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
      const record = (rows as Array<{ config_json: string }>)[0];

      if (!record || !record.config_json) {
        cachedConfig = defaultConfig;
        cacheExpiryTime = now + CACHE_TTL_MS;
        res.json(defaultConfig);
        return;
      }

      const parsed = JSON.parse(record.config_json);
      cachedConfig = parsed;
      cacheExpiryTime = now + CACHE_TTL_MS;
      res.json(parsed);
    } catch (error) {
      console.error('[API Config Error] Gagal mengambil konfigurasi:', error);
      if (cachedConfig) {
        res.json(cachedConfig);
        return;
      }
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
      let oldConfig: unknown = null;
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

      // 4. Sinkronisasi seketika ke In-Memory Cache (0ms delay)
      cachedConfig = newConfig;
      cacheExpiryTime = Date.now() + CACHE_TTL_MS;

      // 5. Broadcast pembaruan konfigurasi ke seluruh client aktif secara realtime
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

      // Sinkronisasi in-memory cache dengan rundown aktif
      cachedConfig = cfg;
      cacheExpiryTime = Date.now() + CACHE_TTL_MS;

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
