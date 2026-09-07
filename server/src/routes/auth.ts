import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db/connection';

export function createAuthRouter() {
  const router = Router();

  // POST /api/auth/login - Autentikasi akun admin
  router.post('/login', async (req: Request, res: Response): Promise<void> => {
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

      const user = (rows as any[])[0];
      if (!user) {
        res.status(401).json({ error: 'Username atau password salah' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Username atau password salah' });
        return;
      }

      res.json({
        success: true,
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

  // PUT /api/auth/password - Ubah password akun
  router.put('/password', async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, oldPassword, newPassword } = req.body;

      if (!username || !oldPassword || !newPassword) {
        res.status(400).json({ error: 'Data perubahan password tidak lengkap' });
        return;
      }

      if (newPassword.length < 4) {
        res.status(400).json({ error: 'Password baru minimal 4 karakter' });
        return;
      }

      const [rows] = await pool.query(
        'SELECT id, password FROM users WHERE username = ? LIMIT 1',
        [username.trim()]
      );

      const user = (rows as any[])[0];
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
