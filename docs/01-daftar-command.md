# 📟 Daftar Perintah Wajib & Operasional (CLI Reference)

Dokumen ini memuat referensi perintah baris perintah (*Command Line Interface*) lengkap untuk pengelolaan proyek **Mari Partner Digital Wedding Invitation SPA** pada seluruh tahap siklus pengembangan: mulai dari instalasi, server lokal, pengujian tipe TypeScript, kompilasi produksi, hingga troubleshooting teknis.

---

## ⚙️ 1. Parameter Lingkungan Sistem

| Parameter | Nilai Standar | Keterangan |
| :--- | :--- | :--- |
| **Runtime Engine** | `Node.js >= 18.0.0` (Aktif: `v22.22.1`) dengan `npm >= 9.0.0` | Menggunakan npm murni sebagai package manager standar proyek. |
| **Development Server** | Vite 6.2 | Mendukung Fast Refresh (HMR). |
| **Port Default** | `3000` | Dikonfigurasi dengan binding `--host=0.0.0.0` agar dapat diakses dari smartphone pada jaringan Wi-Fi lokal yang sama. |
| **Target Build Output** | `./dist` | Berisi berkas statis `index.html`, berkas `.js`, dan `.css` hasil minifikasi. |
| **Database Engine** | MySQL 8.x / MariaDB (Laragon / Self-Hosted) | Terhubung via Node.js Express REST API & connection pool mysql2. |

---

## 🚀 2. Perintah Server Pengembangan (Localhost)

Aplikasi telah dikonfigurasi untuk berjalan pada host `0.0.0.0` dan port `3000`:

```bash
# Menjalankan dev server frontend Vite menggunakan npm
npm run dev

# Menjalankan backend REST API & Socket.io Gateway (Port 5000)
npm run server

# Menjalankan migrasi skema tabel database MySQL Laragon
npm run db:migrate

# Mengimpor data awal bawaan ke database MySQL Laragon
npm run db:seed

# Menghasilkan kunci rahasia acak (Cryptographically Secure Hex) untuk JWT_SECRET di .env
npm run secret:generate
```

> [!TIP]
> **Mengakses dari Smartphone di Wi-Fi Lokal:**
> Saat dev server berjalan, perhatikan baris output terminal `Network: http://192.168.x.x:3000/`. Buka alamat IP tersebut pada browser smartphone Anda untuk menguji responsivitas tampilan mobile secara langsung.

---

## 📦 3. Manajemen Dependensi

Proyek ini telah distandardisasi murni menggunakan **npm**:

```bash
# Memasang seluruh dependensi proyek sesuai package-lock.json
npm install

# Menambahkan paket produksi baru
npm install <nama-paket>

# Menambahkan paket devDependencies (development)
npm install -D <nama-paket>

# Menghapus paket dari proyek
npm uninstall <nama-paket>
```

---

## 🔍 4. Quality Assurance & Static Typing Check

Sebelum melakukan commit atau deployment, jalankan serangkaian pengecekan berikut untuk menjamin integritas kode:

```bash
# Pengecekan tipe statis TypeScript (Type Checking tanpa emit berkas)
npm run lint

# Atau eksekusi langsung via binary tsc lokal
.\node_modules\.bin\tsc.cmd --noEmit # (Windows)
./node_modules/.bin/tsc --noEmit     # (macOS/Linux)

# Verifikasi kompilasi produksi
npm run build
```

---

## 🏗️ 5. Kompilasi Produksi (Production Build)

Menghasilkan bundel berkas statis yang teroptimasi, ter-minifikasi, dan siap dipublikasikan ke web server manapun:

```bash
# Kompilasi produksi menggunakan npm (Wajib)
npm run build

# Menjalankan preview lokal dari hasil folder dist/
npm run preview
```

---

## 🧹 6. Housekeeping & Pembersihan Cache

```bash
# Membersihkan folder hasil build (dist) di Windows PowerShell:
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue

# Menghapus cache Vite jika terjadi kendala visual yang tidak ter-update
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Reset total node_modules dan menginstal ulang dengan npm
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue
npm install
```

---

## 🗄️ 7. Manajemen Database MySQL (Migrate, Seed & Backup)

Pengelolaan skema dan data database MySQL (Laragon / Self-Hosted Server):

```bash
# Menjalankan migrasi skema tabel database MySQL (users, config, wishes, rsvps, guests, dll)
npm run db:migrate

# Mengimpor data awal bawaan ke database MySQL (termasuk user superadmin default)
npm run db:seed

# Melakukan backup basis data MySQL via mysqldump di Laragon / Terminal:
mysqldump -u root -p db_weddingbetawi > backup_wedding_$(date +%Y%m%d).sql

# Me-restore basis data MySQL dari berkas cadangan .sql:
mysql -u root -p db_weddingbetawi < backup_wedding.sql
```

---

## 🌿 8. Konvensi Git & Conventional Commits

Proyek ini menerapkan standar pesan commit *Conventional Commits* untuk mempermudah pelacakan changelog:

| Tipe Commit | Format Contoh | Kegunaan |
| :--- | :--- | :--- |
| `feat:` | `git commit -m "feat: tambah integrasi countdown live"` | Penambahan fitur atau fungsi baru pada sistem. |
| `fix:` | `git commit -m "fix: atasi layout shift pada sampul mobile"` | Perbaikan bug atau kesalahan logic/UI. |
| `docs:` | `git commit -m "docs: perbarui panduan konfigurasi self-hosted"` | Penambahan atau pembaruan dokumentasi Markdown. |
| `refactor:` | `git commit -m "refactor: eliminasi native alert menjadi modal"` | Restrukturisasi kode tanpa mengubah fungsionalitas luar. |
| `style:` | `git commit -m "style: rapikan margin ornamen ondel-ondel"` | Penyesuaian formatting CSS, spasi, atau warna. |
| `chore:` | `git commit -m "chore: perbarui dependensi package-lock.json"` | Pembaruan build tooling, library, atau maintenance berkala. |

---

## 🛠️ 9. Troubleshooting & Diagnostik Masalah Umum

### 1. Port 3000 atau 5000 Sedang Digunakan (Port Already in Use)
Jika terminal menampilkan error `Port 3000 is in use` atau `Port 5000 is in use`:
```powershell
# Cari proses yang memakai port di Windows (contoh: port 5000)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# Matikan proses tersebut secara paksa (Ganti <PID> dengan Process ID yang ditemukan)
Stop-Process -Id <PID> -Force
```

### 2. Error Rollup Native Binary di Windows (`@rollup/rollup-win32-x64-msvc`)
Jika saat build muncul error `Cannot find module @rollup/rollup-win32-x64-msvc`:
```bash
npm install -D @rollup/rollup-win32-x64-msvc
```

### 3. Masalah Koneksi Database MySQL Laragon
- **Gejala**: Pesan error `ECONNREFUSED 127.0.0.1:3306` atau form RSVP/ucapan gagal disimpan ke database.
- **Pemeriksaan Solusi**:
  1. Pastikan servis **MySQL pada Laragon** telah berstatus **Start All** (indikator hijau, port 3306 aktif).
  2. Periksa berkas `.env` di root direktori proyek, pastikan parameter konfigurasi basis data telah sesuai:
     ```env
     DB_HOST="127.0.0.1"
     DB_PORT="3306"
     DB_USER="root"
     DB_PASSWORD=""
     DB_NAME="db_weddingbetawi"
     SERVER_PORT="5000"
     ```
  3. Pastikan backend server Express telah berjalan pada terminal lain (`npm run server`).

---

## 📋 10. Cheatsheet Harian (Daily Operational Cheatsheet)

| Kebutuhan Operasional | Perintah Cepat CLI |
| :--- | :--- |
| Memulai backend server (Express + Socket.io) | `npm run server` |
| Memulai frontend dev server (Vite) | `npm run dev` |
| Menjalankan migrasi database MySQL | `npm run db:migrate` |
| Mengisi data awal database (Seeding) | `npm run db:seed` |
| Verifikasi tipe sebelum commit | `npm run lint` |
| Menjalankan automated tests | `npm test` |
| Menguji hasil kompilasi web statis | `npm run build && npm run preview` |
| Menambahkan pustaka dependensi baru | `npm install <nama-library>` |
| Mengirim perubahan ke repositori | `git add . && git commit -m "feat: ..." && git push origin main` |

---

## ⚡ 11. Perintah Otomatisasi Deployment Multi-Klien (Multi-Tenant CLI)

Pengelolaan multi-instance otomatis menggunakan skrip Bash (Linux VPS) dan PowerShell (Windows):

```bash
# 1. Menerbitkan instance klien baru (Wizard Interaktif)
./scripts/deploy-client.sh create

# 2. Menerbitkan klien baru 1 baris perintah + SSL Certbot otomatis
./scripts/deploy-client.sh create --slug budi-ani --domain budiani.maripartner.com --ssl

# 3. Melihat daftar seluruh klien aktif beserta port & status
./scripts/deploy-client.sh list

# 4. Membekukan instance pasca-resepsi (Mematikan PM2, menghemat 70MB RAM, web tetap aktif)
./scripts/deploy-client.sh freeze budi-ani

# 5. Mengaktifkan kembali instance yang dibekukan
./scripts/deploy-client.sh resume budi-ani

# 6. Melakukan pencadangan database SQL & foto uploads klien
./scripts/deploy-client.sh backup budi-ani

# 7. Menghapus instance klien secara bersih dari server
./scripts/deploy-client.sh delete budi-ani

# 8. Pengujian multi-instance lokal di Windows / Laragon (PowerShell)
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action create -Slug budi-ani -Port 5002 -SharedModules
```

