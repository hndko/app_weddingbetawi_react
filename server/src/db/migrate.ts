import { rawPool, pool, dbName } from './connection';

/**
 * Membuat indeks basis data secara idempoten tanpa melempar galat jika indeks sudah ada.
 */
async function ensureIndex(table: string, indexName: string, columns: string): Promise<void> {
  try {
    await pool.query(`CREATE INDEX \`${indexName}\` ON \`${table}\` (${columns});`);
    console.log(`[DB Migration] Index \`${indexName}\` pada tabel \`${table}\` siap.`);
  } catch (err: unknown) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code: string }).code : '';
    const errno = typeof err === 'object' && err !== null && 'errno' in err ? (err as { errno: number }).errno : 0;
    // Abaikan galat ER_DUP_KEYNAME (1061) jika indeks sudah dibuat sebelumnya
    if (code !== 'ER_DUP_KEYNAME' && errno !== 1061) {
      console.warn(`[DB Migration Warning] Indeks \`${indexName}\` pada \`${table}\`:`, err);
    }
  }
}

/**
 * Menambahkan foreign key secara idempoten pada tabel MySQL.
 */
async function ensureForeignKey(table: string, fkName: string, fkDefinition: string): Promise<void> {
  try {
    await pool.query(`ALTER TABLE \`${table}\` ADD CONSTRAINT \`${fkName}\` ${fkDefinition};`);
    console.log(`[DB Migration] Foreign Key \`${fkName}\` pada tabel \`${table}\` siap.`);
  } catch (err: unknown) {
    const code = typeof err === 'object' && err !== null && 'code' in err ? (err as { code: string }).code : '';
    const errno = typeof err === 'object' && err !== null && 'errno' in err ? (err as { errno: number }).errno : 0;
    // Abaikan ER_DUP_KEYNAME (1061) atau ER_DUP_CONSTRAINT_NAME (1826) jika constraint sudah ada
    if (code !== 'ER_DUP_KEYNAME' && errno !== 1061 && errno !== 1826) {
      console.warn(`[DB Migration Warning] Foreign Key \`${fkName}\` pada \`${table}\`:`, err);
    }
  }
}

/**
 * Menambahkan kolom secara idempoten pada tabel MySQL (kompatibel lintas versi MySQL 5.7, 8.0, dan MariaDB).
 */
async function ensureColumn(table: string, column: string, definition: string): Promise<void> {
  try {
    const [rows] = await pool.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [dbName, table, column]
    );
    if ((rows as any[]).length === 0) {
      await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition};`);
      console.log(`[DB Migration] Kolom \`${column}\` pada tabel \`${table}\` siap.`);
    }
  } catch (err: unknown) {
    console.warn(`[DB Migration Warning] Gagal menambahkan kolom \`${column}\` pada \`${table}\`:`, err);
  }
}

export async function migrate() {
  console.log(`[DB Migration] Memulai migrasi database MySQL Laragon (${dbName})...`);

  try {
    // 1. Buat database jika belum ada
    await rawPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`[DB Migration] Database \`${dbName}\` siap digunakan.`);

    // 2. Buat tabel wedding_config
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wedding_config (
        id INT PRIMARY KEY DEFAULT 1,
        config_json LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabel `wedding_config` siap.');

    // 3. Buat tabel wishes
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishes (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        text TEXT NOT NULL,
        time VARCHAR(50) DEFAULT NULL,
        attendance VARCHAR(50) DEFAULT NULL,
        is_approved TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabel `wishes` siap.');

    // 4. Buat tabel rsvps
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rsvps (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        attendance VARCHAR(50) NOT NULL,
        guest_count INT DEFAULT 1,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await ensureColumn('rsvps', 'phone', 'VARCHAR(50) DEFAULT NULL');
    console.log('[DB Migration] Tabel `rsvps` siap.');

    // 5. Buat tabel guests
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        tier VARCHAR(50) DEFAULT 'regular',
        vip_notes TEXT DEFAULT NULL,
        table_number VARCHAR(50) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        checked_in TINYINT(1) DEFAULT 0,
        checked_in_at DATETIME DEFAULT NULL,
        souvenir_claimed TINYINT(1) DEFAULT 0,
        souvenir_claimed_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await ensureColumn('guests', 'tier', "VARCHAR(50) DEFAULT 'regular'");
    await ensureColumn('guests', 'vip_notes', 'TEXT DEFAULT NULL');
    await ensureColumn('guests', 'souvenir_claimed', 'TINYINT(1) DEFAULT 0');
    await ensureColumn('guests', 'souvenir_claimed_at', 'DATETIME DEFAULT NULL');
    console.log('[DB Migration] Tabel `guests` siap.');

    // 6. Buat tabel budget_items
    await pool.query(`
      CREATE TABLE IF NOT EXISTS budget_items (
        id VARCHAR(64) PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        estimated_cost DECIMAL(15,2) DEFAULT 0,
        actual_cost DECIMAL(15,2) DEFAULT 0,
        paid_cost DECIMAL(15,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'draft',
        vendor VARCHAR(255) DEFAULT NULL,
        vendor_phone VARCHAR(50) DEFAULT NULL,
        due_date VARCHAR(50) DEFAULT NULL,
        is_completed TINYINT(1) DEFAULT 0,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await ensureColumn('budget_items', 'vendor_phone', 'VARCHAR(50) DEFAULT NULL');
    await ensureColumn('budget_items', 'due_date', 'VARCHAR(50) DEFAULT NULL');
    await ensureColumn('budget_items', 'is_completed', 'TINYINT(1) DEFAULT 0');
    console.log('[DB Migration] Tabel `budget_items` siap.');

    // 7. Buat tabel seating_tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seating_tables (
        id VARCHAR(64) PRIMARY KEY,
        number VARCHAR(50) DEFAULT NULL,
        name VARCHAR(100) NOT NULL,
        shape VARCHAR(50) DEFAULT 'round',
        zone VARCHAR(50) DEFAULT 'regular_left',
        capacity INT DEFAULT 8,
        category VARCHAR(100) DEFAULT 'General',
        assigned_guests JSON DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        pos_x INT DEFAULT 0,
        pos_y INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await ensureColumn('seating_tables', 'number', 'VARCHAR(50) DEFAULT NULL');
    await ensureColumn('seating_tables', 'shape', "VARCHAR(50) DEFAULT 'round'");
    await ensureColumn('seating_tables', 'zone', "VARCHAR(50) DEFAULT 'regular_left'");
    await ensureColumn('seating_tables', 'notes', 'TEXT DEFAULT NULL');
    await ensureColumn('seating_tables', 'pos_x', 'INT DEFAULT 0');
    await ensureColumn('seating_tables', 'pos_y', 'INT DEFAULT 0');
    console.log('[DB Migration] Tabel `seating_tables` siap.');

    // 8. Buat tabel trivia_questions
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trivia_questions (
        id VARCHAR(64) PRIMARY KEY,
        question TEXT NOT NULL,
        options JSON NOT NULL,
        correct_index INT NOT NULL DEFAULT 0,
        explanation TEXT DEFAULT NULL,
        order_index INT DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabel `trivia_questions` siap.');

    // 9. Buat tabel users (Autentikasi Akun Login)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabel `users` siap.');

    // 10. Buat tabel checkins (Reception Check-in Logs)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS checkins (
        id VARCHAR(64) PRIMARY KEY,
        guest_id VARCHAR(64) DEFAULT NULL,
        name VARCHAR(150) NOT NULL,
        check_in_time VARCHAR(50) NOT NULL,
        actual_pax INT DEFAULT 1,
        tier VARCHAR(50) DEFAULT 'regular',
        souvenir_claimed TINYINT(1) DEFAULT 1,
        souvenir_claimed_at DATETIME DEFAULT NULL,
        table_number VARCHAR(50) DEFAULT NULL,
        source VARCHAR(50) DEFAULT 'qr_scan',
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    await ensureColumn('checkins', 'tier', "VARCHAR(50) DEFAULT 'regular'");
    await ensureColumn('checkins', 'souvenir_claimed_at', 'DATETIME DEFAULT NULL');
    console.log('[DB Migration] Tabel `checkins` siap.');

    // 11. Optimasi Index Kueri Database (Pilar 3 & 6)
    await ensureIndex('wishes', 'idx_wishes_created_at', 'created_at');
    await ensureIndex('rsvps', 'idx_rsvps_created_at', 'created_at');
    await ensureIndex('guests', 'idx_guests_created_at', 'created_at');
    await ensureIndex('guests', 'idx_guests_status', 'status');
    await ensureIndex('guests', 'idx_guests_phone', 'phone');
    await ensureIndex('checkins', 'idx_checkins_guest_id', 'guest_id');
    await ensureIndex('checkins', 'idx_checkins_created_at', 'created_at');

    // 12. Integritas Relasional Basis Data (Pilar 2)
    await ensureForeignKey(
      'checkins',
      'fk_checkins_guest_id',
      'FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL ON UPDATE CASCADE'
    );

    console.log('[DB Migration] Seluruh skema database, index, dan relasi berhasil dimigrasikan!');
  } catch (error) {
    console.error('[DB Migration Error] Gagal menjalankan migrasi:', error);
    throw error;
  } finally {
    await rawPool.end();
    await pool.end();
  }
}

// Jalankan otomatis jika dipanggil langsung via CLI
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) || process.argv[1]?.includes('migrate.ts')) {
  migrate().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}
