import { pool } from '../db/connection';
import crypto from 'crypto';

export interface SeatingTableRow {
  id: string;
  number: string;
  name: string;
  shape: string;
  zone: string;
  capacity: number;
  category: string;
  assignedGuests: string[];
  notes: string;
  posX: number;
  posY: number;
  createdAt?: string;
}

export interface SeatingTableInput {
  number?: string;
  name?: string;
  shape?: string;
  zone?: string;
  capacity?: number;
  category?: string;
  assignedGuests?: string[];
  notes?: string;
  posX?: number;
  posY?: number;
}

export const seatingService = {
  /**
   * Mengambil semua daftar meja dan penetapan tamu
   */
  async getAllTables(): Promise<SeatingTableRow[]> {
    const [rows] = await pool.query(
      `SELECT id, number, name, shape, zone, capacity, category, 
              assigned_guests as assignedGuests, notes, 
              pos_x as posX, pos_y as posY, created_at as createdAt 
       FROM seating_tables ORDER BY number ASC, created_at ASC`
    );

    return (rows as any[]).map((r) => ({
      ...r,
      number: r.number || r.name,
      name: r.name || r.number,
      shape: r.shape || 'round',
      zone: r.zone || 'regular_left',
      capacity: Number(r.capacity || 8),
      category: r.category || 'General',
      notes: r.notes || '',
      posX: Number(r.posX || 0),
      posY: Number(r.posY || 0),
      assignedGuests: typeof r.assignedGuests === 'string' ? JSON.parse(r.assignedGuests) : (r.assignedGuests || []),
    }));
  },

  /**
   * Menambahkan meja baru ke seating chart
   */
  async createTable(data: SeatingTableInput): Promise<SeatingTableRow> {
    const id = 'table_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    const tableNumber = data.number || data.name || 'Meja';
    const tableName = data.name || tableNumber;
    const shape = data.shape || 'round';
    const zone = data.zone || 'regular_left';
    const capacity = Number(data.capacity || 8);
    const category = data.category || 'General';
    const assignedGuests = data.assignedGuests || [];
    const notes = data.notes || '';
    const posX = Number(data.posX || 0);
    const posY = Number(data.posY || 0);

    await pool.query(
      `INSERT INTO seating_tables (id, number, name, shape, zone, capacity, category, assigned_guests, notes, pos_x, pos_y) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        tableNumber,
        tableName,
        shape,
        zone,
        capacity,
        category,
        JSON.stringify(assignedGuests),
        notes || null,
        posX,
        posY,
      ]
    );

    return {
      id,
      number: tableNumber,
      name: tableName,
      shape,
      zone,
      capacity,
      category,
      assignedGuests,
      notes,
      posX,
      posY,
    };
  },

  /**
   * Memperbarui detail meja atau daftar tamu yang ditugaskan
   */
  async updateTable(id: string, data: SeatingTableInput): Promise<boolean> {
    await pool.query(
      `UPDATE seating_tables 
       SET number = COALESCE(?, number),
           name = COALESCE(?, name),
           shape = COALESCE(?, shape),
           zone = COALESCE(?, zone),
           capacity = COALESCE(?, capacity),
           category = COALESCE(?, category),
           assigned_guests = COALESCE(?, assigned_guests),
           notes = COALESCE(?, notes),
           pos_x = COALESCE(?, pos_x),
           pos_y = COALESCE(?, pos_y)
       WHERE id = ?`,
      [
        data.number,
        data.name,
        data.shape,
        data.zone,
        data.capacity,
        data.category,
        data.assignedGuests ? JSON.stringify(data.assignedGuests) : null,
        data.notes,
        data.posX,
        data.posY,
        id,
      ]
    );
    return true;
  },

  /**
   * Menghapus meja dari seating chart
   */
  async deleteTable(id: string): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM seating_tables WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  },
};
