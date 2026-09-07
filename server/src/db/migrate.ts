import { rawPool, pool, dbName } from './connection';

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
        attendance VARCHAR(50) NOT NULL,
        guest_count INT DEFAULT 1,
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabel `rsvps` siap.');

    // 5. Buat tabel guests
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        table_number VARCHAR(50) DEFAULT NULL,
        notes TEXT DEFAULT NULL,
        checked_in TINYINT(1) DEFAULT 0,
        checked_in_at DATETIME DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
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
        notes TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('[DB Migration] Tabel `budget_items` siap.');

    // 7. Buat tabel seating_tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS seating_tables (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        capacity INT DEFAULT 8,
        category VARCHAR(100) DEFAULT 'General',
        assigned_guests JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
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

    console.log('[DB Migration] Seluruh skema database berhasil dimigrasikan!');
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
