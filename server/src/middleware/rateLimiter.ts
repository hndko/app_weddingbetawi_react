import { Request, Response, NextFunction } from 'express';

export interface RateLimiterOptions {
  windowMs: number; // Jendela waktu dalam milidetik (contoh: 60000 = 1 menit)
  max: number; // Maksimal permintaan yang diizinkan dalam jendela waktu
  message?: string; // Pesan galat kustom saat melebihi batas
}

interface ClientRecord {
  timestamps: number[];
}

/**
 * Pembuat middleware rate limiting berbasis Sliding Window in-memory (tanpa dependensi eksternal).
 * Efektif untuk mencegah bot spam, brute force, dan flooding.
 */
export function createRateLimiter(options: RateLimiterOptions) {
  const {
    windowMs,
    max,
    message = 'Terlalu banyak permintaan dari perangkat Anda. Mohon tunggu sebentar sebelum mencoba lagi.',
  } = options;

  const hits = new Map<string, ClientRecord>();

  // Pembersihan berkala memori setiap 5 menit untuk mencegah kebocoran memori (Zero Storage Leak)
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of hits.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
      if (record.timestamps.length === 0) {
        hits.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    // Ekstraksi alamat IP klien (mendukung proxy Nginx / Cloudflare)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip) || 'unknown_ip';

    const now = Date.now();
    let record = hits.get(ip);

    if (!record) {
      record = { timestamps: [] };
      hits.set(ip, record);
    }

    // Filter timestamp hanya dalam rentang windowMs terakhir
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

    if (record.timestamps.length >= max) {
      const oldestHit = record.timestamps[0];
      const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldestHit)) / 1000));

      res.setHeader('Retry-After', retryAfterSec);
      res.status(429).json({
        error: message,
        retryAfter: retryAfterSec,
      });
      return;
    }

    record.timestamps.push(now);
    next();
  };
}

/**
 * Rate limiter khusus form publik (RSVP & Wishes):
 * Dibatasi ketat maksimal 2 kiriman per menit per IP untuk mencegah spam bot.
 */
export const submissionRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 2,
  message: 'Terlalu banyak pengiriman dari perangkat Anda. Mohon tunggu 1 menit sebelum mengirim ucapan atau RSVP lagi.',
});

/**
 * Rate limiter percobaan login:
 * Maksimal 5 percobaan login per 5 menit per IP untuk mencegah brute-force.
 */
export const authLoginRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: 'Terlalu banyak percobaan login yang gagal. Silakan tunggu 5 menit sebelum mencoba kembali.',
});
