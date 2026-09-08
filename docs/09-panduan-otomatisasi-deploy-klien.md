# ⚡ Panduan Otomatisasi Deploy Klien (Multi-Tenant / Multi-Instance)

Dokumen ini memuat panduan lengkap penggunaan rangkaian skrip otomatisasi deployment (**Mari Partner Provisioning CLI**) untuk menerbitkan dan mengelola puluhan hingga ratusan instance klien undangan pernikahan secara terisolasi pada **satu server VPS Linux (Ubuntu / aaPanel / Debian / CentOS)** dan lingkungan **pengujian lokal Windows (Laragon)**.

---

## 📑 Daftar Isi
1. [Mengapa Otomatisasi Diperlukan?](#1-mengapa-otomatisasi-diperlukan)
2. [Arsitektur & Prinsip Penghematan Disk (Shared node_modules)](#2-arsitektur--prinsip-penghematan-disk-shared-node_modules)
3. [Konfigurasi Awal Server (deploy.env)](#3-konfigurasi-awal-server-deployenv)
4. [Panduan CLI Linux: `scripts/deploy-client.sh`](#4-panduan-cli-linux-scriptsdeploy-clientsh)
   - [A. Penerbitan Klien Baru (Mode Interaktif / Wizard)](#a-penerbitan-klien-baru-mode-interaktif--wizard)
   - [B. Penerbitan Klien Baru Cepat 1 Baris (Mode Flag)](#b-penerbitan-klien-baru-cepat-1-baris-mode-flag)
   - [C. Melihat Daftar Klien Aktif (`list`)](#c-melihat-daftar-klien-aktif-list)
   - [D. Pembekuan Pasca-Acara (`freeze`) — Hemat 70MB RAM](#d-pembekuan-pasca-acara-freeze--hemat-70mb-ram)
   - [E. Mengaktifkan Kembali Klien (`resume`)](#e-mengaktifkan-kembali-klien-resume)
   - [F. Pencadangan Data Database & Foto (`backup`)](#f-pencadangan-data-database--foto-backup)
   - [G. Penghapusan Instance Bersih (`delete`)](#g-penghapusan-instance-bersih-delete)
5. [Panduan Pengujian Lokal Windows / Laragon: `scripts/deploy-client.ps1`](#5-panduan-pengujian-lokal-windows--laragon-scriptsdeploy-clientps1)
6. [Tabel Cheatsheet Perintah Cepat](#6-tabel-cheatsheet-perintah-cepat)
7. [Mitigasi Masalah & Tips Operasional Lapangan](#7-mitigasi-masalah--tips-operasional-lapangan)

---

## 1. Mengapa Otomatisasi Diperlukan?

Sebelum adanya skrip ini, proses penerbitan 1 klien baru secara manual membutuhkan waktu **10 hingga 15 menit** dengan langkah berulang:
1. Menyalin folder proyek secara manual.
2. Membuka MySQL dan mengetik kueri `CREATE DATABASE`.
3. Mengedit berkas `.env` (menentukan port bebas, nama DB, dan mengacak JWT secret).
4. Menjalankan `npm run db:migrate` dan `npm run db:seed`.
5. Menjalankan `npm run build`.
6. Mendaftarkan nama service baru ke PM2 (`pm2 start ...`).
7. Menulis blok konfigurasi Nginx baru di `/etc/nginx/sites-available/` dan membuat symlink.
8. Menjalankan Certbot SSL Let's Encrypt.

Dengan skrip otomatisasi `deploy-client.sh`, seluruh 8 langkah di atas dieksekusi secara otomatis dan paralel dalam waktu **kurang dari 25 detik** hanya dengan **satu baris perintah** di terminal server!

---

## 2. Arsitektur & Prinsip Penghematan Disk (Shared node_modules)

Salah satu kendala terbesar dalam menjalankan model *multi-instance* terisolasi adalah ukuran direktori dependensi `node_modules` (~350–400 MB). Jika Anda memiliki 50 klien dan masing-masing memasang `node_modules` sendiri, server akan terbebani **~20 GB ruang disk** hanya untuk file dependensi yang identik!

### Inovasi Simbiosis Symlink (`--shared-modules`):
Skrip deployment Mari Partner secara cerdas menerapkan tautan simbolik (*Symbolic Link / Symlink*):
```text
/var/www/wedding-base/node_modules/ ◄────────── (Master Tunggal ~380 MB)
        ▲                   ▲                   ▲
        │ (symlink)         │ (symlink)         │ (symlink)
/var/www/weddings/      /var/www/weddings/      /var/www/weddings/
 klien_dimas_anisa/      klien_cecep_ipeh/       klien_budi_zahra/
 (Ukuran: ~35 MB)        (Ukuran: ~35 MB)        (Ukuran: ~35 MB)
```
* **Penghematan Ruang Disk**: Menghemat **> 91% ruang disk** server.
* **Kecepatan Penerbitan Ekstrem**: Klien baru terbit dalam **10–20 detik** tanpa menunggu proses `npm install` yang lambat.
* **Isolasi Penuh Tetap Terjaga**: Setiap klien tetap memiliki database MySQL terpisah, berkas `.env` unik, port internal independen, folder unggahan foto mandiri, dan proses Node.js PM2 terisolasi.

---

## 3. Konfigurasi Awal Server (deploy.env)

Di server VPS Linux Anda, buat salinan master konfigurasi lingkungan deployment:

```bash
cd /var/www/wedding-base/scripts
cp deploy.env.example deploy.env
nano deploy.env
```

Sesuaikan parameter server Anda:
```env
# Direktori penyimpanan seluruh folder klien
BASE_DIR="/var/www/weddings"

# Lokasi master repository (tempat clone git utama)
SOURCE_REPO_DIR="/var/www/wedding-base"

# Direktori Nginx
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

# Kredensial Database MySQL Server
DEFAULT_DB_HOST="127.0.0.1"
DEFAULT_DB_PORT="3306"
DEFAULT_DB_USER="root"
DEFAULT_DB_PASS="PasswordMySQLServerAnda"

# Port awal pencarian otomatis
START_PORT=5001

# User web server (Ubuntu: www-data, aaPanel/CentOS: www)
WEB_USER="www-data"
WEB_GROUP="www-data"

# Email untuk notifikasi pembaruan SSL Let's Encrypt
CERTBOT_EMAIL="admin@maripartner.com"

# Default shared node_modules (1 = aktif, 0 = non-aktif)
DEFAULT_SHARED_MODULES=1
```

Berikan hak akses eksekusi ke skrip:
```bash
chmod +x /var/www/wedding-base/scripts/deploy-client.sh
```

---

## 4. Panduan CLI Linux: `scripts/deploy-client.sh`

### A. Penerbitan Klien Baru (Mode Interaktif / Wizard)
Jika Anda ingin dipandu langkah-demi-langkah melalui antarmuka interaktif:

```bash
./scripts/deploy-client.sh create
```

**Alur Wizard Terminal:**
```text
==========================================================================
   💍 MARI PARTNER - CLIENT PROVISIONING & DEPLOYMENT AUTOMATION CLI
==========================================================================
--- WIZARD DEPLOYMENT KLIEN BARU ---

1. Masukkan Slug Klien (misal: budi-ani / cecepipeh): dimas-anisa
2. Masukkan Subdomain/Domain (misal: budiani.maripartner.com): dimasanisa.maripartner.com
3. Masukkan Port Internal [Default terdeteksi bebas: 5001]: 5001
4. Masukkan Nama Database [Default: db_wedding_dimas_anisa]: db_wedding_dimas_anisa
5. Masukkan Kata Sandi Admin Awal [Default acak 10-karakter]: password
6. Pasang Sertifikat SSL Let's Encrypt Otomatis sekarang? (y/N): y
```

Skrip akan langsung memproses dan menampilkan kartu akses lengkap setelah selesai!

---

### B. Penerbitan Klien Baru Cepat 1 Baris (Mode Flag)
Untuk efisiensi maksimal saat pesanan mulai banyak, cukup jalankan satu baris perintah berikut:

```bash
./scripts/deploy-client.sh create \
  --slug dimas-anisa \
  --domain dimasanisa.maripartner.com \
  --ssl
```

#### Opsi Parameter Flag Lengkap:
| Parameter Flag | Wajib? | Nilai Bawaan (*Default*) | Penjelasan |
| :--- | :---: | :--- | :--- |
| `--slug <nama>` | **Ya** | - | Identitas unik klien (huruf kecil, angka, strip `-`). |
| `--domain <domain>` | **Ya** | - | Domain/subdomain lengkap yang diarahkan ke IP VPS. |
| `--port <nomor>` | Tidak | Deteksi otomatis port bebas mulai `5001` | Port internal proses Express Node.js. |
| `--db-name <nama>` | Tidak | `db_wedding_<slug>` | Nama database MySQL khusus klien ini. |
| `--db-user <user>` | Tidak | Diambil dari `deploy.env` | Pengguna MySQL untuk pembuatan basis data. |
| `--db-pass <pass>` | Tidak | Diambil dari `deploy.env` | Kata sandi pengguna MySQL. |
| `--admin-pass <sandi>`| Tidak | Acak 10 karakter heksadesimal | Kata sandi akun `superadmin` klien. |
| `--ssl` | Tidak | Non-aktif | Mengaktifkan penerbitan otomatis SSL Let's Encrypt. |
| `--standalone` | Tidak | Mode Symlink | Memaksa `npm install` mandiri (tidak menggunakan symlink). |
| `--yes`, `-y` | Tidak | Mode Interaktif | Mengabaikan seluruh prompt konfirmasi. |

---

### C. Melihat Daftar Klien Aktif (`list`)
Untuk memantau seluruh instance klien yang telah diterbitkan, port yang digunakan, status operasional, serta tanggal pembuatan:

```bash
./scripts/deploy-client.sh list
```

**Contoh Output:**
```text
==========================================================================
   💍 MARI PARTNER - CLIENT PROVISIONING & DEPLOYMENT AUTOMATION CLI
==========================================================================
DAFTAR SELURUH INSTANCE KLIEN AKTIF

SLUG               PORT    STATUS     DOMAIN                           DIBUAT      
--------------------------------------------------------------------------------
dimas-anisa        5001    active     dimasanisa.maripartner.com       2026-09-08  
cecep-ipeh         5002    active     cecepipeh.maripartner.com        2026-09-08  
rizky-zahra        5003    frozen     rizkyzahra.maripartner.com       2026-08-20  
```

---

### D. Pembekuan Pasca-Acara (`freeze`) — Hemat 70MB RAM
Setelah hari-H resepsi pernikahan selesai (misal H+7 atau H+14), aplikasi tidak lagi memerlukan proses komputasi Node.js backend yang intensif. Cukup jalankan perintah `freeze`:

```bash
./scripts/deploy-client.sh freeze dimas-anisa
```

#### Apa yang Terjadi Saat Di-Freeze?
1. Proses PM2 `wedding-dimas-anisa` otomatis dimatikan (`pm2 stop`).
2. **~70–100 MB RAM server langsung dibebaskan** kembali ke sistem operasi.
3. Konfigurasi Nginx dialihkan ke template statis murni (`nginx-frozen.conf.template`):
   - Halaman undangan, galeri foto, cerita cinta, dan pemutar musik tetap dapat dibuka secara normal oleh keluarga selamanya.
   - Folder foto `server/uploads/` langsung disajikan oleh Nginx tanpa membebani Node.js.
   - Endpoint `/api/` merespons pesan sopan bahwa acara telah diarsipkan.

---

### E. Mengaktifkan Kembali Klien (`resume`)
Jika pasangan pengantin atau keluarga meminta membuka kembali akses admin atau buku tamu:

```bash
./scripts/deploy-client.sh resume dimas-anisa
```
Service PM2 akan dinyalakan kembali, template Nginx dikembalikan ke reverse proxy penuh, dan status klien kembali **`active`**.

---

### F. Pencadangan Data Database & Foto (`backup`)
Untuk mencadangkan seluruh data penting klien sebelum pengarsipan atau pemindahan server:

```bash
./scripts/deploy-client.sh backup dimas-anisa
```

Skrip akan secara otomatis:
1. Mengekspor struktur & data MySQL via `mysqldump` ke file `.sql`.
2. Mengompres folder unggahan foto `server/uploads/` beserta file SQL menjadi satu arsip terenkpresi:
   ```text
   /var/www/weddings/backups/backup_dimas-anisa_20260908_143000.tar.gz
   ```

---

### G. Penghapusan Instance Bersih (`delete`)
Jika masa sewa klien telah habis dan ingin dihapus total dari server:

```bash
./scripts/deploy-client.sh delete dimas-anisa
```
*Skrip akan otomatis membuat backup darurat terlebih dahulu*, mematikan proses PM2, menghapus database MySQL, menghapus Virtual Host Nginx, menghapus folder fisik, dan memperbarui berkas registry.

Untuk eksekusi langsung tanpa prompt:
```bash
./scripts/deploy-client.sh delete dimas-anisa --force
```

---

## 5. Panduan Pengujian Lokal Windows / Laragon: `scripts/deploy-client.ps1`

Bagi Anda yang sedang mengembangkan atau menguji model multi-instance di laptop/komputer pengembang dengan Windows & Laragon:

### 1. Membuat Instance Lokal Baru
Buka PowerShell (Run as Administrator) di root proyek:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action create -Slug dimas-anisa -Port 5002 -SharedModules
```

Skrip PowerShell akan:
1. Membuat folder instance di `d:\laragon\www\weddings\dimas-anisa`.
2. Menautkan `node_modules` menggunakan Windows Directory Junction (`mklink /J`).
3. Membuat basis data MySQL di Laragon: `db_wedding_dimas_anisa`.
4. Menghasilkan file `.env` lokal ber-port 5002.
5. Menjalankan migrasi tabel, seed data awal, dan kompilasi build frontend Vite.

### 2. Menjalankan Service Klien Lokal
Buka jendela PowerShell baru:
```powershell
cd d:\laragon\www\weddings\dimas-anisa
npm run server
```
Akses di browser: `http://localhost:5002` dan panel admin di `http://localhost:5002/login`.

### 3. Melihat Daftar Klien Lokal
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action list
```

### 4. Menghapus Klien Lokal
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-client.ps1 -Action delete -Slug dimas-anisa
```

---

## 6. Tabel Cheatsheet Perintah Cepat

| Kebutuhan Operasional | Perintah CLI | Estimasi Waktu |
| :--- | :--- | :---: |
| **Deploy Klien Baru (Wizard)** | `./scripts/deploy-client.sh create` | ~20 detik |
| **Deploy 1 Baris + Auto SSL** | `./scripts/deploy-client.sh create --slug klien01 --domain klien01.domain.com --ssl` | ~15 detik |
| **Cek Seluruh Klien Aktif** | `./scripts/deploy-client.sh list` | Instant |
| **Freeze Event Pasca-Acara** | `./scripts/deploy-client.sh freeze klien01` | ~2 detik |
| **Buka Kembali Event Freeze** | `./scripts/deploy-client.sh resume klien01` | ~3 detik |
| **Backup DB & Foto Klien** | `./scripts/deploy-client.sh backup klien01` | ~5 detik |
| **Hapus Bersih Klien** | `./scripts/deploy-client.sh delete klien01` | ~5 detik |
| **Cek Log PM2 Realtime** | `pm2 logs wedding-klien01` | Instant |
| **Restart Service Klien** | `pm2 restart wedding-klien01` | Instant |

---

## 7. Mitigasi Masalah & Tips Operasional Lapangan

### 1. Port Sudah Digunakan (*Port Already in Use*)
Skrip `deploy-client.sh` memiliki pemindai port cerdas (*auto-discovery*) yang memeriksa `ss -tuln` dan `pm2 jlist` sebelum memilih port. Jika Anda menetapkan port secara manual dan terjadi konflik, ubah parameter `--port` ke nomor lain (misal: `5005`, `5006`).

### 2. Subdomain Belum Diarahkan (*DNS Not Pointed*)
Sebelum menjalankan opsi `--ssl` (Certbot), pastikan DNS A-Record subdomain (misal: `dimasanisa.maripartner.com`) telah diarahkan ke IP Public VPS server Anda. Jika Certbot gagal karena DNS belum resolve, Anda dapat menerbitkan SSL nanti kapan saja dengan perintah:
```bash
sudo certbot --nginx -d dimasanisa.maripartner.com
```

### 3. Izin Akses Folder Foto Unggahan (*Uploads Permission*)
Jika admin klien mengeluh tidak bisa mengganti foto mempelai di panel admin, pastikan kepemilikan folder diatur ke user web server (`www-data` di Ubuntu atau `www` di aaPanel):
```bash
chown -R www-data:www-data /var/www/weddings/dimas-anisa/server/uploads
chmod -R 775 /var/www/weddings/dimas-anisa/server/uploads
```
Skrip otomatisasi telah menyertakan langkah ini pada proses *provisioning*.

### 4. Manajemen Memori Server (*High Memory Alert*)
Jalankan `pm2 monit` di server untuk memantau penggunaan RAM tiap proses. Terapkan strategi pembekuan (*freeze*) secara disiplin pada hari Selasa atau Rabu untuk pernikahan yang berlangsung di akhir pekan sebelumnya. Ini akan menjaga server Anda selalu ringan, responsif, dan siap menerima ratusan pesanan klien berikutnya!
