import { pool } from '../db/connection';
import crypto from 'crypto';

export interface TriviaPublicItem {
  id: string;
  question: string;
  options: string[];
  order: number;
}

export interface TriviaAdminItem extends TriviaPublicItem {
  correctAnswerIndex: number;
  explanation: string;
}

export interface TriviaInput {
  question?: string;
  options?: string[];
  correctAnswerIndex?: number;
  correctIndex?: number;
  explanation?: string | null;
  order?: number;
  orderIndex?: number;
}

export const triviaService = {
  /**
   * Mengambil pertanyaan kuis trivia untuk publik (jawaban dan penjelasan disensor)
   */
  async getPublicTrivia(): Promise<TriviaPublicItem[]> {
    const [rows] = await pool.query(
      `SELECT id, question, options, order_index as orderIndex 
       FROM trivia_questions ORDER BY order_index ASC`
    );

    return (rows as any[]).map((r) => ({
      id: r.id,
      question: r.question,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : (r.options || []),
      order: Number(r.orderIndex ?? 0),
    }));
  },

  /**
   * Mengambil data pertanyaan trivia lengkap untuk Admin Panel
   */
  async getAdminTrivia(): Promise<TriviaAdminItem[]> {
    const [rows] = await pool.query(
      `SELECT id, question, options, correct_index as correctIndex, explanation, order_index as orderIndex 
       FROM trivia_questions ORDER BY order_index ASC`
    );

    return (rows as any[]).map((r) => ({
      id: r.id,
      question: r.question,
      options: typeof r.options === 'string' ? JSON.parse(r.options) : (r.options || []),
      correctAnswerIndex: Number(r.correctIndex ?? 0),
      explanation: r.explanation || '',
      order: Number(r.orderIndex ?? 0),
    }));
  },

  /**
   * Memverifikasi jawaban kuis di sisi server
   */
  async verifyAnswer(questionId: string, selectedIndex: number): Promise<{ found: boolean; isCorrect: boolean; correctAnswerIndex: number; explanation: string }> {
    const [rows] = await pool.query(
      `SELECT id, correct_index as correctIndex, explanation 
       FROM trivia_questions WHERE id = ? LIMIT 1`,
      [questionId]
    );

    const item = (rows as Array<{ id: string; correctIndex: number; explanation: string | null }>)[0];
    if (!item) {
      return { found: false, isCorrect: false, correctAnswerIndex: 0, explanation: '' };
    }

    const isCorrect = selectedIndex === item.correctIndex;
    return {
      found: true,
      isCorrect,
      correctAnswerIndex: item.correctIndex,
      explanation: item.explanation || '',
    };
  },

  /**
   * Menambahkan pertanyaan kuis trivia baru
   */
  async createTrivia(data: TriviaInput): Promise<TriviaAdminItem> {
    const id = 'trivia_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const correctIndex = data.correctAnswerIndex ?? data.correctIndex ?? 0;
    const orderIndex = data.order ?? data.orderIndex ?? 0;
    const options = data.options || [];
    const explanation = data.explanation || null;

    await pool.query(
      `INSERT INTO trivia_questions (id, question, options, correct_index, explanation, order_index) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, data.question || '', JSON.stringify(options), correctIndex, explanation, orderIndex]
    );

    return {
      id,
      question: data.question || '',
      options,
      correctAnswerIndex: correctIndex,
      explanation: explanation || '',
      order: orderIndex,
    };
  },

  /**
   * Memperbarui pertanyaan kuis trivia
   */
  async updateTrivia(id: string, data: TriviaInput): Promise<boolean> {
    const correctIndex = data.correctAnswerIndex !== undefined ? data.correctAnswerIndex : data.correctIndex;
    const orderIndex = data.order !== undefined ? data.order : data.orderIndex;

    await pool.query(
      `UPDATE trivia_questions 
       SET question = COALESCE(?, question),
           options = COALESCE(?, options),
           correct_index = COALESCE(?, correct_index),
           explanation = COALESCE(?, explanation),
           order_index = COALESCE(?, order_index)
       WHERE id = ?`,
      [
        data.question,
        data.options ? JSON.stringify(data.options) : null,
        correctIndex,
        data.explanation,
        orderIndex,
        id,
      ]
    );
    return true;
  },

  /**
   * Menghapus pertanyaan trivia berdasarkan ID
   */
  async deleteTrivia(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM trivia_questions WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },
};
