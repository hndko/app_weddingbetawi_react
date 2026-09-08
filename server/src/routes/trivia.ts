import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { pool } from '../db/connection';
import crypto from 'crypto';
import { authenticateJwt } from '../middleware/auth';

export function createTriviaRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/trivia - Ambil semua pertanyaan kuis trivia (Publik untuk tamu)
  // Kunci jawaban (correct_index) dan penjelasan (explanation) DISENSOR untuk mencegah kecurangan via DevTools
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, question, options, order_index as orderIndex 
         FROM trivia_questions ORDER BY order_index ASC`
      );

      interface TriviaPublicRow {
        id: string;
        question: string;
        options: string | string[];
        orderIndex: number;
      }

      const parsed = (rows as TriviaPublicRow[]).map((r) => ({
        id: r.id,
        question: r.question,
        options: typeof r.options === 'string' ? JSON.parse(r.options) : (r.options || []),
        order: r.orderIndex ?? 0,
      }));

      res.json(parsed);
    } catch (error) {
      console.error('[API Trivia Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil pertanyaan trivia' });
    }
  });

  // GET /api/trivia/admin - Ambil seluruh data pertanyaan trivia lengkap dengan kunci jawaban (Khusus Admin Panel)
  router.get('/admin', authenticateJwt, async (_req: Request, res: Response): Promise<void> => {
    try {
      const [rows] = await pool.query(
        `SELECT id, question, options, correct_index as correctIndex, explanation, order_index as orderIndex 
         FROM trivia_questions ORDER BY order_index ASC`
      );

      interface TriviaAdminRow {
        id: string;
        question: string;
        options: string | string[];
        correctIndex: number;
        explanation: string | null;
        orderIndex: number;
      }

      const parsed = (rows as TriviaAdminRow[]).map((r) => ({
        id: r.id,
        question: r.question,
        options: typeof r.options === 'string' ? JSON.parse(r.options) : (r.options || []),
        correctAnswerIndex: r.correctIndex ?? 0,
        explanation: r.explanation || '',
        order: r.orderIndex ?? 0,
      }));

      res.json(parsed);
    } catch (error) {
      console.error('[API Trivia Admin Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil data administrasi trivia' });
    }
  });

  // POST /api/trivia/verify - Verifikasi jawaban kuis per-pertanyaan secara aman di server
  router.post('/verify', async (req: Request, res: Response): Promise<void> => {
    try {
      const { questionId, selectedIndex } = req.body;

      if (!questionId || selectedIndex === undefined || typeof selectedIndex !== 'number') {
        res.status(400).json({ error: 'ID pertanyaan dan indeks pilihan wajib disertakan' });
        return;
      }

      const [rows] = await pool.query(
        `SELECT id, correct_index as correctIndex, explanation 
         FROM trivia_questions WHERE id = ? LIMIT 1`,
        [questionId]
      );

      const item = (rows as Array<{ id: string; correctIndex: number; explanation: string | null }>)[0];
      if (!item) {
        res.status(404).json({ error: 'Pertanyaan tidak ditemukan' });
        return;
      }

      const isCorrect = selectedIndex === item.correctIndex;

      res.json({
        success: true,
        isCorrect,
        correctAnswerIndex: item.correctIndex,
        explanation: item.explanation || '',
      });
    } catch (error) {
      console.error('[API Trivia Verify Error]:', error);
      res.status(500).json({ error: 'Gagal memverifikasi jawaban trivia' });
    }
  });

  // POST /api/trivia - Tambah pertanyaan trivia (dilindungi JWT Admin)
  router.post('/', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const { question, options, explanation } = req.body;
      const correctIndex = req.body.correctAnswerIndex ?? req.body.correctIndex ?? 0;
      const orderIndex = req.body.order ?? req.body.orderIndex ?? 0;
      const id = 'trivia_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

      await pool.query(
        `INSERT INTO trivia_questions (id, question, options, correct_index, explanation, order_index) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, question, JSON.stringify(options || []), correctIndex, explanation || null, orderIndex]
      );

      const newQ = { id, question, options: options || [], correctAnswerIndex: correctIndex, explanation, order: orderIndex };
      io.emit('trivia:created', newQ);
      res.status(201).json({ success: true, data: newQ });
    } catch (error) {
      console.error('[API Trivia Error]:', error);
      res.status(500).json({ error: 'Gagal menambahkan pertanyaan trivia' });
    }
  });

  // PUT /api/trivia/:id - Update pertanyaan trivia (dilindungi JWT Admin)
  router.put('/:id', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { question, options, explanation } = req.body;
      const correctIndex = req.body.correctAnswerIndex !== undefined ? req.body.correctAnswerIndex : req.body.correctIndex;
      const orderIndex = req.body.order !== undefined ? req.body.order : req.body.orderIndex;

      await pool.query(
        `UPDATE trivia_questions 
         SET question = COALESCE(?, question),
             options = COALESCE(?, options),
             correct_index = COALESCE(?, correct_index),
             explanation = COALESCE(?, explanation),
             order_index = COALESCE(?, order_index)
         WHERE id = ?`,
        [question, options ? JSON.stringify(options) : null, correctIndex, explanation, orderIndex, id]
      );

      io.emit('trivia:updated', { id, ...req.body });
      res.json({ success: true, message: 'Pertanyaan trivia berhasil diperbarui' });
    } catch (error) {
      console.error('[API Trivia Error]:', error);
      res.status(500).json({ error: 'Gagal memperbarui pertanyaan trivia' });
    }
  });

  // DELETE /api/trivia/:id - Hapus pertanyaan trivia (dilindungi JWT Admin)
  router.delete('/:id', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM trivia_questions WHERE id = ?', [id]);
      io.emit('trivia:deleted', id);
      res.json({ success: true, message: 'Pertanyaan trivia berhasil dihapus' });
    } catch (error) {
      console.error('[API Trivia Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus pertanyaan trivia' });
    }
  });

  return router;
}
