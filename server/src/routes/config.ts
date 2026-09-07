import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import { config as defaultConfig } from '../../../src/data/config';

export function createConfigRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/config - Ambil konfigurasi undangan pernikahan
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query('SELECT config_json FROM wedding_config WHERE id = 1 LIMIT 1');
      const record = (rows as Array<{ config_json: string }>)[0];

      if (!record || !record.config_json) {
        // Fallback jika belum ada baris
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

  // PUT /api/config - Simpan pembaruan konfigurasi undangan pernikahan
  router.put('/', async (req: Request, res: Response): Promise<void> => {
    try {
      const newConfig = req.body;
      if (!newConfig || typeof newConfig !== 'object') {
        res.status(400).json({ error: 'Data konfigurasi tidak valid' });
        return;
      }

      const jsonStr = JSON.stringify(newConfig);
      await pool.query(
        `INSERT INTO wedding_config (id, config_json) VALUES (1, ?) 
         ON DUPLICATE KEY UPDATE config_json = VALUES(config_json);`,
        [jsonStr]
      );

      // Broadcast pembaruan konfigurasi ke seluruh client aktif secara realtime
      io.emit('config:updated', newConfig);

      res.json({ success: true, message: 'Konfigurasi berhasil disimpan ke MySQL', data: newConfig });
    } catch (error) {
      console.error('[API Config Error] Gagal menyimpan konfigurasi:', error);
      res.status(500).json({ error: 'Gagal menyimpan konfigurasi ke database' });
    }
  });

  return router;
}
