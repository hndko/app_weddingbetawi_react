import { pool } from '../db/connection';
import crypto from 'crypto';

export interface BudgetItemRow {
  id: string;
  category: string;
  name: string;
  title?: string;
  estimatedCost: number;
  actualCost: number;
  paidCost: number;
  paidAmount: number;
  status: string;
  paymentStatus: string;
  vendorName: string;
  vendor: string;
  vendorPhone: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  notes: string | null;
  createdAt?: string;
}

export interface BudgetItemInput {
  category?: string;
  title?: string;
  name?: string;
  estimatedCost?: number;
  actualCost?: number;
  paidAmount?: number;
  paidCost?: number;
  paymentStatus?: string;
  status?: string;
  vendorName?: string;
  vendor?: string;
  vendorPhone?: string | null;
  dueDate?: string | null;
  isCompleted?: boolean;
  notes?: string | null;
}

/**
 * Menghitung status pembayaran secara konsisten di sisi server (Pilar 2 Business Logic).
 */
export function calculatePaymentStatus(actualCost: number, estimatedCost: number, paidCost: number, fallbackStatus?: string): string {
  const targetCost = actualCost > 0 ? actualCost : estimatedCost;
  if (targetCost > 0) {
    if (paidCost >= targetCost) return 'paid';
    if (paidCost > 0) return 'partial';
    return 'unpaid';
  }
  return fallbackStatus || 'unpaid';
}

export const budgetService = {
  /**
   * Mengambil semua pos pengeluaran dari database
   */
  async getAllBudgetItems(): Promise<BudgetItemRow[]> {
    const [rows] = await pool.query(
      `SELECT id, category, name, name as title, 
              estimated_cost as estimatedCost, 
              actual_cost as actualCost, 
              paid_cost as paidCost, paid_cost as paidAmount, 
              status, status as paymentStatus, 
              vendor, vendor as vendorName, 
              vendor_phone as vendorPhone, 
              due_date as dueDate, 
              is_completed as isCompleted, 
              notes, created_at as createdAt 
       FROM budget_items ORDER BY created_at ASC`
    );

    return (rows as any[]).map((r) => ({
      ...r,
      title: r.title || r.name,
      estimatedCost: Number(r.estimatedCost || 0),
      actualCost: Number(r.actualCost || 0),
      paidCost: Number(r.paidCost || 0),
      paidAmount: Number(r.paidAmount || r.paidCost || 0),
      paymentStatus: r.paymentStatus || r.status || 'unpaid',
      vendorName: r.vendorName || r.vendor || '',
      vendor: r.vendor || r.vendorName || '',
      isCompleted: !!r.isCompleted,
    }));
  },

  /**
   * Menambahkan item anggaran baru dengan sanitasi dan kalkulasi status server-side
   */
  async createBudgetItem(data: BudgetItemInput): Promise<BudgetItemRow> {
    const itemName = data.title || data.name || 'Pengeluaran';
    const category = data.category || 'logistics_other';
    const estimatedCost = Math.max(0, Number(data.estimatedCost) || 0);
    const actualCost = Math.max(0, Number(data.actualCost) || 0);
    const paidCost = Math.max(0, Number(data.paidAmount !== undefined ? data.paidAmount : data.paidCost) || 0);
    const status = calculatePaymentStatus(actualCost, estimatedCost, paidCost, data.paymentStatus || data.status);
    const vendor = data.vendorName || data.vendor || null;
    const vendorPhone = data.vendorPhone || null;
    const dueDate = data.dueDate || null;
    const isCompleted = data.isCompleted ? 1 : 0;
    const notes = data.notes || null;
    const id = 'budget_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');

    await pool.query(
      `INSERT INTO budget_items (id, category, name, estimated_cost, actual_cost, paid_cost, status, vendor, vendor_phone, due_date, is_completed, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category, itemName, estimatedCost, actualCost, paidCost, status, vendor, vendorPhone, dueDate, isCompleted, notes]
    );

    return {
      id,
      category,
      title: itemName,
      name: itemName,
      estimatedCost,
      actualCost,
      paidAmount: paidCost,
      paidCost,
      paymentStatus: status,
      status,
      vendorName: vendor || '',
      vendor: vendor || '',
      vendorPhone,
      dueDate,
      isCompleted: !!isCompleted,
      notes,
    };
  },

  /**
   * Memperbarui item anggaran dan menghitung ulang status jika biaya berubah
   */
  async updateBudgetItem(id: string, data: BudgetItemInput): Promise<boolean> {
    // Ambil data lama terlebih dahulu jika ada perubahan pada kolom keuangan
    const [existingRows] = await pool.query(
      'SELECT id, estimated_cost as estimatedCost, actual_cost as actualCost, paid_cost as paidCost, status FROM budget_items WHERE id = ? LIMIT 1',
      [id]
    );
    const existingList = existingRows as any[];
    if (existingList.length === 0) {
      return false;
    }
    const current = existingList[0];

    const itemName = data.title !== undefined ? data.title : data.name;
    const estimatedCost = data.estimatedCost !== undefined ? Math.max(0, Number(data.estimatedCost) || 0) : undefined;
    const actualCost = data.actualCost !== undefined ? Math.max(0, Number(data.actualCost) || 0) : undefined;
    const paidCost = (data.paidAmount !== undefined || data.paidCost !== undefined)
      ? Math.max(0, Number(data.paidAmount !== undefined ? data.paidAmount : data.paidCost) || 0)
      : undefined;

    // Kalkulasi status pembayaran terbaru
    const finalActual = actualCost !== undefined ? actualCost : Number(current.actualCost || 0);
    const finalEstimated = estimatedCost !== undefined ? estimatedCost : Number(current.estimatedCost || 0);
    const finalPaid = paidCost !== undefined ? paidCost : Number(current.paidCost || 0);
    const status = calculatePaymentStatus(finalActual, finalEstimated, finalPaid, data.paymentStatus || data.status || current.status);

    const vendor = data.vendorName !== undefined ? data.vendorName : data.vendor;
    const isCompleted = data.isCompleted !== undefined ? (data.isCompleted ? 1 : 0) : undefined;

    await pool.query(
      `UPDATE budget_items 
       SET category = COALESCE(?, category),
           name = COALESCE(?, name),
           estimated_cost = COALESCE(?, estimated_cost),
           actual_cost = COALESCE(?, actual_cost),
           paid_cost = COALESCE(?, paid_cost),
           status = ?,
           vendor = COALESCE(?, vendor),
           vendor_phone = COALESCE(?, vendor_phone),
           due_date = COALESCE(?, due_date),
           is_completed = COALESCE(?, is_completed),
           notes = COALESCE(?, notes)
       WHERE id = ?`,
      [
        data.category,
        itemName,
        estimatedCost,
        actualCost,
        paidCost,
        status,
        vendor,
        data.vendorPhone,
        data.dueDate,
        isCompleted,
        data.notes,
        id,
      ]
    );

    return true;
  },

  /**
   * Menghapus item anggaran berdasarkan ID
   */
  async deleteBudgetItem(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM budget_items WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },
};
