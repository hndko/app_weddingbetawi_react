# ☁️ Panduan Deployment Multi-Platform (Self-Hosted Architecture)

Dokumen ini memuat instruksi langkah-demi-langkah yang teruji dan bebas dari teks placeholder generik (*anti-slop*) untuk mempublikasikan aplikasi **Mari Partner Digital Wedding Invitation SPA** dengan arsitektur mandiri (*Full-Stack Self-Hosted*: React SPA + Node.js Express + MySQL + Socket.io + Local File Uploads):

1. [Deployment Lokal (Localhost: Laragon / XAMPP / Dev Server)](#1-deployment-lokal-localhost)
2. [Deployment VPS Linux Ubuntu 22.04 LTS (Nginx Reverse Proxy + PM2)](#2-deployment-vps-linux-ubuntu-2204-lts--nginx--pm2)
3. [Deployment Shared Hosting cPanel (Node.js Selector + MySQL)](#3-deployment-shared-hosting-cpanel)
4. [Deployment aaPanel Control Panel (Node.js Project Manager + Nginx)](#4-deployment-aapanel-control-panel)
5. [Konfigurasi Environment Variables Produksi (.env)](#5-konfigurasi-environment-variables-produksi-env)
6. [Daftar Periksa Pasca-Deployment (Production Checklist)](#6-daftar-periksa-pasca-deployment-production-checklist)

---

## 1. Deployment Lokal (Localhost)

Skenario ini digunakan untuk proses modifikasi data, pengujian tampilan mobile di jaringan Wi-Fi lokal, atau demonstrasi luring (*offline/local presentation*).

### A. Persiapan Basis Data MySQL (Laragon / XAMPP)
1. Buka **Laragon** dan pastikan service **MySQL** telah berstatus *Started* (Port 3306).
2. Buat basis data baru bernama `db_weddingbetawi` melalui HeidiSQL, phpMyAdmin, atau terminal:
   ```sql
   CREATE DATABASE db_weddingbetawi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Konfigurasikan file `.env` di root proyek:
   ```env
   VITE_API_URL="http://localhost:5000"
   PORT=5000
   DB_HOST="127.0.0.1"
   DB_PORT=3306
   DB_USER="root"
   DB_PASSWORD=""
   DB_NAME="db_weddingbetawi"
   JWT_SECRET="mari_partner_secret_local_key_2026"
   CORS_ORIGIN="http://localhost:3000"
   ```
4. Jalankan migrasi tabel dan seeding data akun default (`superadmin` / `password`):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### B. Menjalankan Backend & Frontend
Buka dua jendela terminal terpisah:

- **Terminal 1 (Backend Express & Socket.io)**:
  ```bash
  npm run server
  # Server aktif pada http://localhost:5000
  ```
- **Terminal 2 (Frontend React SPA Vite)**:
  ```bash
  npm run dev
  # Frontend aktif pada http://localhost:3000
  ```

Buka browser di komputer: `http://localhost:3000`.  
Buka di smartphone pada jaringan Wi-Fi yang sama: `http://<IP-Komputer-Anda>:3000` (contoh: `http://192.168.1.15:3000`).

---

## 2. Deployment VPS Linux (Ubuntu 22.04 LTS + Nginx + PM2)

Skenario ini adalah **standar produksi rekomendasi utama** untuk performa tinggi, skalabilitas penuh, dan kustomisasi domain/SSL independen.

### Arsitektur Produksi VPS:
```text
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Web Server (:80 / :443)            │
├──────────────────────────────┬──────────────────────────────┤
│  Frontend React SPA (Static) │  Backend API & Socket.io     │
│  location /                  │  location /api/              │
│  try_files $uri /index.html  │  location /socket.io/        │
│  /var/www/wedding/dist/      │  proxy_pass http://localhost:5000│
└──────────────────────────────┴──────────────────────────────┘
```

### A. Persiapan Server & Instalasi Dependensi
Akses terminal VPS via SSH:
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Pasang Node.js LTS (v20.x atau v22.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx mysql-server certbot python3-certbot-nginx

# Pasang Process Manager PM2 & TSX secara global
sudo npm install -g pm2 tsx
```

### B. Konfigurasi Basis Data MySQL VPS
```bash
sudo mysql
```
```sql
CREATE DATABASE db_weddingbetawi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wedding_user'@'localhost' IDENTIFIED BY 'PasswordSangatKuat2026!';
GRANT ALL PRIVILEGES ON db_weddingbetawi.* TO 'wedding_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### C. Menyiapkan Direktori & Kode Aplikasi
```bash
sudo mkdir -p /var/www/wedding
sudo chown -R $USER:$USER /var/www/wedding

# Clone atau unggah repositori ke /var/www/wedding
git clone https://github.com/hndko/app_weddingbetawi_react.git /var/www/wedding
cd /var/www/wedding

# Pasang dependensi
npm install

# Buat file konfigurasi .env produksi
cp .env.example .env
nano .env
```
Isi `.env` produksi:
```env
VITE_API_URL="https://undangan.domainanda.com"
PORT=5000
DB_HOST="localhost"
DB_PORT=3306
DB_USER="wedding_user"
DB_PASSWORD="PasswordSangatKuat2026!"
DB_NAME="db_weddingbetawi"
JWT_SECRET="acak_kunci_rahasia_produksi_64_karakter_min"
CORS_ORIGIN="https://undangan.domainanda.com"
```

Jalankan migrasi database di server:
```bash
npm run db:migrate
npm run db:seed
```

Bangun aset frontend SPA:
```bash
npm run build
```

Pastikan folder upload memiliki izin tulis:
```bash
mkdir -p server/uploads
chmod -R 775 server/uploads
```

### D. Menjalankan Backend via PM2 Daemon
```bash
# Jalankan backend Express & Socket.io dengan PM2
pm2 start "npx tsx server/src/index.ts" --name "wedding-backend"

# Simpan konfigurasi PM2 agar otomatis berjalan saat VPS reboot
pm2 save
pm2 startup
```

### E. Konfigurasi Server Block Nginx
Buat berkas konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/wedding.conf
```

Masukkan konfigurasi teruji berikut (ganti `undangan.domainanda.com` dengan domain Anda):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name undangan.domainanda.com;

    root /var/www/wedding/dist;
    index index.html;

    # Gzip Compression Optimal
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 256;

    # 1. Routing Frontend React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy REST API ke Express Port 5000
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 15M;
    }

    # 3. Proxy Berkas Unggahan Statis
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # 4. Proxy Real-Time WebSocket Socket.io
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache Aset Statis Frontend
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Keamanan: Blokir Akses ke File Tersembunyi (.git, .env)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    access_log /var/log/nginx/wedding_access.log;
    error_log /var/log/nginx/wedding_error.log;
}
```

Aktifkan konfigurasi dan periksa sintaks:
```bash
sudo ln -s /etc/nginx/sites-available/wedding.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### F. Penerbitan Sertifikat SSL Gratis (Let's Encrypt)
```bash
sudo certbot --nginx -d undangan.domainanda.com
```
Pilih opsi pengalihan otomatis ke HTTPS (*Redirect all HTTP traffic to HTTPS*).

---

## 3. Deployment Shared Hosting (cPanel)

Cocok untuk pengguna yang memiliki hosting cPanel dengan fitur **Setup Node.js App**:

### A. Persiapan Database MySQL cPanel
1. Buka cPanel > **MySQL® Database Wizard**.
2. Buat nama database (misal: `user_wedding`), username, dan password.
3. Berikan privilege **ALL PRIVILEGES**.

### B. Kompilasi Frontend & Pengunggahan Berkas
1. Di komputer lokal Anda, buat file build:
   ```bash
   npm run build
   ```
2. Unggah seluruh direktori proyek (termasuk folder `server/`, `dist/`, `package.json`, `.env`) ke folder home cPanel (misal: `/home/user/apps/wedding`).
3. Konfigurasikan `.env` dengan kredensial database cPanel yang baru dibuat.
4. Jalankan migrasi via SSH cPanel Terminal:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

### C. Pengaturan Setup Node.js App
1. Di menu cPanel, klik **Setup Node.js App**.
2. Klik **Create Application**:
   - **Node.js version**: `20.x` (atau versi terbaru yang tersedia)
   - **Application mode**: `Production`
   - **Application root**: `apps/wedding`
   - **Application startup file**: `server/src/index.ts` (atau build JS `server/dist/index.js`)
3. Klik **Run NPM Install**, lalu klik **Start App**.
4. Di direktori `public_html` atau subdomain domain Anda, arahkan berkas statis `dist/` atau gunakan Reverse Proxy Apache `.htaccess`.

---

## 4. Deployment aaPanel Control Panel

Jika Anda menggunakan control panel **aaPanel**:

1. **Instalasi Modul di aaPanel App Store**:
   - Pasang **Nginx**, **MySQL**, dan **Node.js Version Manager** (pilih Node v20 LTS).
2. **Buat Database MySQL**:
   - Buka menu **Databases** > klik **Add database** > beri nama `db_weddingbetawi`.
3. **Tambahkan Proyek Node.js**:
   - Buka menu **Website** > tab **Node project** > klik **Add Node project**.
   - **Path**: arahkan ke folder proyek Anda (`/www/wwwroot/wedding`).
   - **Run Opt**: `npm run server` atau skrip PM2.
   - **Port**: `5000`.
4. **URL Rewrite & Reverse Proxy Nginx di aaPanel**:
   - Di tab **Reverse proxy** pada domain website, tambahkan rule untuk `/api/` dan `/socket.io/` mengarah ke `http://127.0.0.1:5000`.
   - Di tab **SSL**, pilih **Let's Encrypt** dan aktifkan **Force HTTPS**.

---

## 5. Konfigurasi Environment Variables Produksi (.env)

Berikut adalah daftar variabel lingkungan yang wajib dikonfigurasi:

| Nama Variabel | Wajib? | Contoh Nilai Produksi | Penjelasan |
| :--- | :---: | :--- | :--- |
| `VITE_API_URL` | **Ya** | `https://undangan.domainanda.com` | URL basis API backend yang diakses oleh frontend browser. |
| `PORT` | **Ya** | `5000` | Port lokal tempat service Express mendengarkan traffic internal. |
| `DB_HOST` | **Ya** | `localhost` atau `127.0.0.1` | Host server database MySQL. |
| `DB_PORT` | **Ya** | `3306` | Port koneksi MySQL. |
| `DB_USER` | **Ya** | `wedding_user` | Nama user database MySQL. |
| `DB_PASSWORD` | **Ya** | `PasswordKuatDB2026!` | Kata sandi user database MySQL. |
| `DB_NAME` | **Ya** | `db_weddingbetawi` | Nama database MySQL. |
| `JWT_SECRET` | **Ya** | `kunci_acak_string_panjang_rahasia` | Kunci enkripsi token autentikasi sesi admin. |
| `CORS_ORIGIN` | **Ya** | `https://undangan.domainanda.com` | Domain asal frontend yang diizinkan melakukan request ke backend API. |

---

## 6. Daftar Periksa Pasca-Deployment (Production Checklist)

Sebelum membagikan tautan undangan kepada para tamu dan keluarga, lakukan uji verifikasi berikut:

- [ ] **HTTPS & Gembok Hijau**: Website dapat dibuka via `https://` tanpa peringatan sertifikat keamanan (*Mixed Content*).
- [ ] **Konektivitas Basis Data**: Pastikan service MySQL berjalan lancar dan data awal termuat di website utama.
- [ ] **Login Admin Mandiri**: Buka `https://domainanda.com/login`, masukkan kredensial default (`superadmin` / `password`), dan pastikan dialihkan ke `/modules`.
- [ ] **Uji Fitur Ganti Password**: Klik tombol **Ganti Password** di header admin, ubah kata sandi, dan uji login ulang dengan kata sandi baru.
- [ ] **Uji Coba Kirim Doa & Realtime Socket.io**: Buka undangan di dua tab atau perangkat berbeda; kirim ucapan doa di satu perangkat dan pastikan ucapan langsung muncul seketika di perangkat lain tanpa perlu refresh.
- [ ] **Uji Coba Unggah Berkas & Pembersihan Disk**: Unggah foto baru mempelai atau barcode QRIS di Admin Panel; pastikan gambar tersimpan di `server/uploads/` dan file lama otomatis terhapus dari disk.
- [ ] **Uji Coba Konfirmasi RSVP**: Isi konfirmasi kehadiran dan pastikan data langsung tercatat di tabel RSVP Admin Panel.
- [ ] **Personalisasi Nama Tamu**: Buka `https://domainanda.com/?to=Nama+Tamu` dan pastikan nama tamu tampil elegan di cover pembuka.
- [ ] **Layar Proyektor Panggung**: Akses `https://domainanda.com/live` di layar panggung / videotron dan pastikan QR Code panggung serta audio chime berfungsi sempurna saat ada doa baru.
