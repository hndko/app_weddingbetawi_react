import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';
import { authenticateJwt, AuthenticatedRequest } from '../middleware/auth';
import { authLoginRateLimiter } from '../middleware/rateLimiter';

export function createAuthRouter() {
  const router = Router();
  const secret = process.env.JWT_SECRET || 'mari_partner_jwt_secret_2026';

  // GET /api/auth/me - Verifikasi status login token JWT saat ini
  router.get('/me', authenticateJwt, (req: Request, res: Response): void => {
    const authReq = req as AuthenticatedRequest;
    res.json({
      success: true,
      user: authReq.user,
    });
  });

  // POST /api/auth/login - Autentikasi akun admin & buat token JWT 7 hari
  router.post('/login', authLoginRateLimiter, async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username dan password wajib diisi' });
        return;
      }

      const [rows] = await pool.query(
        'SELECT id, username, password, role FROM users WHERE username = ? LIMIT 1',
        [username.trim()]
      );

      const user = (rows as Array<{ id: number; username: string; password: string; role: string }>)[0];
      if (!user) {
        res.status(401).json({ error: 'Username atau password salah' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Username atau password salah' });
        return;
      }

      // Buat token JWT dengan masa aktif 7 hari (Pilar 3 OWASP)
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        secret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('[API Auth Login Error]:', error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server saat login' });
    }
  });

  // PUT /api/auth/password - Ubah password akun admin (dilindungi JWT)
  router.put('/password', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const targetUserId = authReq.user?.id;
      if (!targetUserId) {
        res.status(401).json({ error: 'Sesi autentikasi tidak valid' });
        return;
      }

      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res.status(400).json({ error: 'Data perubahan password tidak lengkap' });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'Password baru minimal 6 karakter' });
        return;
      }

      const [rows] = await pool.query(
        'SELECT id, password FROM users WHERE id = ? LIMIT 1',
        [targetUserId]
      );

      const user = (rows as Array<{ id: number; password: string }>)[0];
      if (!user) {
        res.status(404).json({ error: 'Pengguna tidak ditemukan' });
        return;
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Password lama salah' });
        return;
      }

      const newHashed = await bcrypt.hash(newPassword, 10);
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [newHashed, user.id]);

      res.json({ success: true, message: 'Password berhasil diperbarui' });
    } catch (error) {
      console.error('[API Auth Password Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui password' });
    }
  });

  return router;
}
