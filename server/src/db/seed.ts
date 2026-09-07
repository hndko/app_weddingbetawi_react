import { pool, rawPool, dbName } from './connection';
import { config as defaultConfig } from '../../../src/data/config';

export async function seed() {
  console.log(`[DB Seed] Menyiapkan data awal untuk database \`${dbName}\`...`);

  try {
    // 1. Pastikan tabel sudah ada
    await rawPool.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );

    // 2. Seed / Upsert wedding_config (id = 1)
    const configJson = JSON.stringify(defaultConfig);
    await pool.query(
      `INSERT INTO wedding_config (id, config_json) VALUES (1, ?) 
       ON DUPLICATE KEY UPDATE config_json = VALUES(config_json);`,
      [configJson]
    );
    console.log('[DB Seed] Data `wedding_config` berhasil diimpor dari src/data/config.ts!');

    // 3. Seed contoh ucapan awal jika tabel kosong
    const [wishRows] = await pool.query('SELECT COUNT(*) as count FROM wishes');
    const wishCount = (wishRows as Array<{ count: number }>)[0]?.count || 0;

    if (wishCount === 0) {
      await pool.query(
        `INSERT INTO wishes (id, name, text, time, attendance, is_approved) VALUES 
        ('seed_wish_1', 'Haji Lulung & Keluarga', 'Barakallahu lakum wa baraka alaikum. Selamat buat kedua mempelai!', 'Baru saja', 'hadir', 1),
        ('seed_wish_2', 'Zaenab & Rekan Kantor', 'Selamat yaa! Semoga menjadi keluarga sakinah, mawaddah, warahmah. Aamiin.', '1 jam lalu', 'hadir', 1);`
      );
      console.log('[DB Seed] Contoh ucapan doa berhasil ditambahkan.');
    }

    // 4. Seed contoh RSVP awal jika tabel kosong
    const [rsvpRows] = await pool.query('SELECT COUNT(*) as count FROM rsvps');
    const rsvpCount = (rsvpRows as Array<{ count: number }>)[0]?.count || 0;

    if (rsvpCount === 0) {
      await pool.query(
        `INSERT INTO rsvps (id, name, attendance, guest_count, notes) VALUES 
        ('seed_rsvp_1', 'Bapak H. Ahmad Santoso', 'hadir', 2, 'Insya Allah hadir berdua dengan istri.'),
        ('seed_rsvp_2', 'Ibu Nurul Hidayah', 'tidak_hadir', 0, 'Mohon maaf belum bisa hadir karena dinas ke luar kota. Selamat ya!');`
      );
      console.log('[DB Seed] Contoh data RSVP berhasil ditambahkan.');
    }

    // 5. Seed contoh Tamu Undangan awal jika tabel kosong
    const [guestRows] = await pool.query('SELECT COUNT(*) as count FROM guests');
    const guestCount = (guestRows as Array<{ count: number }>)[0]?.count || 0;

    if (guestCount === 0) {
      await pool.query(
        `INSERT INTO guests (id, name, phone, status, table_number) VALUES 
        ('seed_guest_1', 'Bapak H. Ahmad Santoso & Keluarga', '081234567890', 'sent', 'Meja VIP 1'),
        ('seed_guest_2', 'Zaenab & Pasangan', '081987654321', 'pending', 'Meja Reguler A');`
      );
      console.log('[DB Seed] Contoh data tamu undangan berhasil ditambahkan.');
    }

    console.log('[DB Seed] Database seeder selesai dengan sukses 100%!');
  } catch (error) {
    console.error('[DB Seed Error] Gagal menjalankan seeder:', error);
    throw error;
  } finally {
    await rawPool.end();
    await pool.end();
  }
}

// Jalankan otomatis jika dipanggil langsung via CLI
if (import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/')) || process.argv[1]?.includes('seed.ts')) {
  seed().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}
