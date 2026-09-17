import path from 'path';
import fs from 'fs';
import { pool } from '../db/connection';
import { config as defaultConfig } from '../../../src/data/config';

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
export function extractUploadUrls(cfg: unknown): Set<string> {
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

export const configService = {
  /**
   * Mengambil konfigurasi undangan dengan In-Memory SWR Cache
   */
  async getConfig(): Promise<unknown> {
    const now = Date.now();
    if (cachedConfig && now < cacheExpiryTime) {
      return cachedConfig;
    }

    try {
      const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
      const record = (rows as Array<{ config_json: string }>)[0];

      if (!record || !record.config_json) {
        cachedConfig = defaultConfig;
        cacheExpiryTime = now + CACHE_TTL_MS;
        return defaultConfig;
      }

      const parsed = JSON.parse(record.config_json);
      cachedConfig = parsed;
      cacheExpiryTime = now + CACHE_TTL_MS;
      return parsed;
    } catch (error) {
      if (cachedConfig) {
        return cachedConfig;
      }
      // Resilient fallback jika MySQL sedang booting atau luring (0 downtime)
      return defaultConfig;
    }
  },

  /**
   * Menyimpan pembaruan konfigurasi, menghapus aset usang dari disk (auto-unlink), dan memperbarui cache
   */
  async updateConfig(newConfig: unknown, uploadDir: string): Promise<unknown> {
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

    return newConfig;
  },

  /**
   * Menyiarkan dan menyimpan status rundown hari-H
   */
  async updateLiveRundown(body: any): Promise<{ cfg: any; liveRundown: any }> {
    const { currentEvent, customNote, broadcastMessage, isActive, active, currentEventTime } = body;
    const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
    const record = (rows as Array<{ config_json: string }>)[0];
    const cfg = record?.config_json ? JSON.parse(record.config_json) : { ...defaultConfig };

    const resolvedActive = isActive !== undefined ? Boolean(isActive) : (active !== undefined ? Boolean(active) : true);
    const resolvedNote = customNote || broadcastMessage || '';

    const liveRundown = {
      isActive: resolvedActive,
      active: resolvedActive,
      currentEvent: currentEvent || 'Acara Sedang Berlangsung',
      currentEventTime: currentEventTime || '',
      customNote: resolvedNote,
      broadcastMessage: resolvedNote,
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

    return { cfg, liveRundown };
  },
};
