import { Router, Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { authenticateJwt } from '../middleware/auth';
import { triviaService } from '../services/triviaService';

export function createTriviaRouter(io: SocketIOServer) {
  const router = Router();

  // GET /api/trivia - Ambil semua pertanyaan kuis trivia (Publik untuk tamu)
  // Kunci jawaban (correct_index) dan penjelasan (explanation) DISENSOR untuk mencegah kecurangan via DevTools
  router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
      const parsed = await triviaService.getPublicTrivia();
      res.json(parsed);
    } catch (error) {
      console.error('[API Trivia Error]:', error);
      res.status(500).json({ error: 'Gagal mengambil pertanyaan trivia' });
    }
  });

  // GET /api/trivia/admin - Ambil seluruh data pertanyaan trivia lengkap dengan kunci jawaban (Khusus Admin Panel)
  router.get('/admin', authenticateJwt, async (_req: Request, res: Response): Promise<void> => {
    try {
      const parsed = await triviaService.getAdminTrivia();
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
      const parsedIndex = Number(selectedIndex);
      if (!questionId || selectedIndex === undefined || isNaN(parsedIndex)) {
        res.status(400).json({ error: 'ID pertanyaan dan indeks pilihan wajib disertakan' });
        return;
      }

      const verification = await triviaService.verifyAnswer(questionId, parsedIndex);
      if (!verification.found) {
        res.status(404).json({ error: 'Pertanyaan tidak ditemukan' });
        return;
      }

      res.json({
        success: true,
        isCorrect: verification.isCorrect,
        correctAnswerIndex: verification.correctAnswerIndex,
        explanation: verification.explanation,
      });
    } catch (error) {
      console.error('[API Trivia Verify Error]:', error);
      res.status(500).json({ error: 'Gagal memverifikasi jawaban trivia' });
    }
  });

  // POST /api/trivia - Tambah pertanyaan trivia (dilindungi JWT Admin)
  router.post('/', authenticateJwt, async (req: Request, res: Response): Promise<void> => {
    try {
      const newQ = await triviaService.createTrivia(req.body);
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
      const id = String(req.params.id);
      await triviaService.updateTrivia(id, req.body);
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
      const id = String(req.params.id);
      await triviaService.deleteTrivia(id);
      io.emit('trivia:deleted', id);
      res.json({ success: true, message: 'Pertanyaan trivia berhasil dihapus' });
    } catch (error) {
      console.error('[API Trivia Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus pertanyaan trivia' });
    }
  });

  return router;
}
