# ☁️ Panduan Deployment Multi-Platform

Dokumen ini memuat instruksi langkah-demi-langkah yang teruji dan bebas dari teks placeholder generik (*anti-slop*) untuk mempublikasikan aplikasi **Betawi Heritage Wedding Invitation SPA** pada 5 lingkungan infrastruktur:

1. [Localhost (Laragon / XAMPP / Dev Server)](#1-deployment-lokal-localhost)
2. [Cloud Serverless (Vercel - Rekomendasi Utama)](#2-deployment-cloud-serverless-vercel)
3. [VPS Linux Ubuntu 22.04 LTS (Nginx Web Server)](#3-deployment-vps-linux-ubuntu-2204-lts--nginx)
4. [Shared Hosting (cPanel)](#4-deployment-shared-hosting-cpanel)
5. [aaPanel Control Panel](#5-deployment-aapanel-control-panel)
6. [Daftar Periksa Pasca-Deployment (Production Checklist)](#6-daftar-periksa-pasca-deployment-production-checklist)

---

## 1. Deployment Lokal (Localhost)

Skenario ini digunakan untuk proses modifikasi data, pengujian tampilan mobile di jaringan Wi-Fi lokal, atau demonstrasi luring (*offline/local presentation*).

### A. Menjalankan Server Vite Langsung
```bash
# 1. Masuk ke folder proyek
cd d:\laragon\www\app_weddingbetawi_react

# 2. Pasang dependensi
npm install

# 3. Jalankan server lokal dengan akses IP jaringan
npm run dev
```
Buka browser di komputer: `http://localhost:3000`.  
Buka di smartphone pada jaringan Wi-Fi yang sama: `http://<IP-Komputer-Anda>:3000` (misal: `http://192.168.1.15:3000`).

### B. Menjalankan di Laragon / XAMPP (Hasil Build Statis)
1. Lakukan kompilasi produksi:
   ```bash
   npm run build
   ```
2. Salin seluruh isi folder `dist/` ke direktori web server lokal Anda:
   - Laragon: `C:\laragon\www\undangan`
   - XAMPP: `C:\xampp\htdocs\undangan`
3. Buat berkas `.htaccess` di dalam folder tersebut (lihat konfigurasi cPanel di bawah) agar rute SPA tidak menghasilkan error 404 saat di-refresh.

---

## 2. Deployment Cloud Serverless (Vercel)

> [!TIP]
> **Rekomendasi Utama**: Vercel adalah platform paling optimal, cepat, dan 100% gratis untuk aplikasi React SPA Vite ini karena telah terintegrasi dengan Git otomatis dan CDN global dengan sertifikat SSL gratis.

### Langkah-Langkah:
1. **Unggah Kode ke GitHub**:
   ```bash
   git add .
   git commit -m "feat: persiapan rilis undangan digital"
   git push origin main
   ```

2. **Impor Repositori di Vercel Dashboard**:
   - Buka [https://vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
   - Klik tombol **"Add New..."** > pilih **"Project"**.
   - Pilih repositori `app_weddingbetawi_react` dan klik **"Import"**.

3. **Pengaturan Konfigurasi Build (Terdeteksi Otomatis)**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **SPA Fallback Routing**: Repositori telah dilengkapi berkas [`vercel.json`](../vercel.json) bawaan sehingga rute `/login` dan `/modules` tidak akan mengalami error 404 saat di-refresh langsung di browser.

4. **Konfigurasi Environment Variables di Vercel**:
   Sebelum menekan tombol deploy, buka bagian **Environment Variables** dan tambahkan kunci rahasia berikut:

   | Nama Kunci (Key) | Nilai Contoh (Value) |
   | :--- | :--- |
   | `VITE_FIREBASE_API_KEY` | `AIzaSyB-xxxxxxxxxxxxxxxxxxxxxxxx` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `proyek-anda.firebaseapp.com` |
   | `VITE_FIREBASE_PROJECT_ID` | `proyek-anda` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `proyek-anda.appspot.com` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
   | `VITE_FIREBASE_APP_ID` | `1:123456789012:web:abcdef123456` |

5. **Deploy**:
   - Klik **"Deploy"**. Dalam kurun waktu 1 menit, website Anda sudah aktif secara global pada domain `https://proyek-anda.vercel.app`.

---

## 3. Deployment VPS Linux (Ubuntu 22.04 LTS + Nginx)

Skenario ini digunakan jika Anda ingin menggunakan server pribadi (*Virtual Private Server*) dengan performa tinggi dan kustomisasi domain penuh.

### A. Persiapan Server & Instalasi Nginx
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Pasang Nginx & Certbot SSL
sudo apt install nginx certbot python3-certbot-nginx -y
```

### B. Kompilasi & Pengunggahan Berkas
Di komputer lokal Anda, lakukan proses build:
```bash
npm run build
```
Unggah folder `dist/` ke direktori web server di VPS:
```bash
# Mengunggah via SCP (ganti IP dan user VPS Anda)
scp -r dist/* root@103.xxx.xxx.xxx:/var/www/wedding-betawi/
```

Di terminal VPS, atur hak akses kepemilikan direktori:
```bash
sudo mkdir -p /var/www/wedding-betawi
sudo chown -R www-data:www-data /var/www/wedding-betawi
sudo chmod -R 755 /var/www/wedding-betawi
```

### C. Konfigurasi Server Block Nginx
Buat berkas konfigurasi baru:
```bash
sudo nano /etc/nginx/sites-available/wedding-betawi.conf
```

Masukkan konfigurasi siap-pakai berikut (ganti `undangan.domainanda.com` dengan domain Anda):

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name undangan.domainanda.com;

    root /var/www/wedding-betawi;
    index index.html;

    # Optimalisasi Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 256;

    # SPA Fallback Routing (Mencegah Error 404 saat Refresh /admin)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache Control untuk Aset Statis
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Blokir Akses ke File Tersembunyi (.git, .env)
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    access_log /var/log/nginx/wedding_access.log;
    error_log /var/log/nginx/wedding_error.log;
}
```

Aktifkan konfigurasi dan restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/wedding-betawi.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### D. Penerbitan Sertifikat SSL Let's Encrypt
```bash
sudo certbot --nginx -d undangan.domainanda.com
```
Pilih opsi pengalihan otomatis ke HTTPS (*Redirect all HTTP traffic to HTTPS*).

---

## 4. Deployment Shared Hosting (cPanel)

Cocok untuk pengguna hosting tradisional cPanel tanpa akses command line SSH:

### A. Langkah Build Lokal
Di komputer lokal Anda, lakukan kompilasi:
```bash
npm run build
```
Seluruh aset siap pakai akan berada di dalam direktori `dist/`.

### B. Unggah ke File Manager cPanel
1. Masuk ke **cPanel Dashboard** akun hosting Anda.
2. Buka menu **File Manager**.
3. Buka folder `public_html` (atau subdomain tujuan Anda).
4. Kompresi seluruh isi folder `dist/` di komputer Anda menjadi berkas `.zip`.
5. Unggah file zip tersebut ke cPanel, lalu klik kanan dan pilih **Extract**.

### C. Konfigurasi Berkas `.htaccess` (Wajib untuk SPA)
Buat berkas bernama `.htaccess` di direktori `public_html` dan masukkan aturan berikut:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Paksa koneksi aman HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Jangan rewrite jika file atau folder fisik memang ada
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Alihkan seluruh rute lainnya (termasuk /login & /modules) ke index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Keamanan: Larang akses ke file tersembunyi
<FilesMatch "^\.">
  Order allow,deny
  Deny from all
</FilesMatch>
```

### D. Pengaktifan SSL Gratis di cPanel
1. Masuk ke cPanel > menu **SSL/TLS Status**.
2. Centang domain Anda dan klik tombol **Run AutoSSL**.
3. Tunggu 5 menit hingga sertifikat SSL aktif.

---

## 5. Deployment aaPanel Control Panel

Jika Anda mengelola server menggunakan panel **aaPanel**:

1. **Buat Website Baru**:
   - Buka dashboard aaPanel > pilih menu **Website** > klik **Add site**.
   - Masukkan Domain Name (misal: `undangan.domainanda.com`).
   - Pada kolom **PHP Version**, pilih opsi **Pure/Static** (karena aplikasi ini adalah SPA berbasis static build, tidak memerlukan runtime PHP).
   - Klik **Submit**.
2. **Unggah Aset**:
   - Klik nama root folder website tersebut (`/www/wwwroot/undangan.domainanda.com`).
   - Hapus berkas default (`index.html`, `404.html`).
   - Unggah seluruh isi folder `dist/` hasil build Anda.
3. **Konfigurasi URL Rewrite (SPA Fallback)**:
   - Klik nama domain pada daftar website > pilih menu **URL Rewrite**.
   - Masukkan kode konfigurasi:
     ```nginx
     location / {
         try_files $uri $uri/ /index.html;
     }
     ```
   - Klik **Save**.
4. **Penerbitan SSL 1-Klik**:
   - Di menu pengaturan domain, klik tab **SSL** > pilih tab **Let's Encrypt**.
   - Centang nama domain Anda dan klik **Apply**.
   - Centang opsi **Force HTTPS** untuk mengamankan seluruh trafik secara otomatis.

---

## 6. Daftar Periksa Pasca-Deployment (Production Checklist)

Sebelum membagikan link undangan kepada para tamu, lakukan pengujian verifikasi wajib berikut:

- [ ] **HTTPS & Gembok Hijau**: Website dapat diakses via `https://` tanpa peringatan sertifikat keamanan (*Mixed Content*).
- [ ] **Personalisasi Tamu**: Buka `https://domainanda.com/?to=Nama+Tamu` dan pastikan nama tamu tampil rapi di bagian amplop pembuka.
- [ ] **Pemutar Musik**: Musik latar otomatis berputar setelah tombol *"Buka Undangan"* diklik. Tombol *mute/unmute* berfungsi baik.
- [ ] **Uji Coba Kirim RSVP**: Isi nama dan konfirmasi kehadiran. Pastikan data berhasil terkirim tanpa pesan error dialog browser.
- [ ] **Uji Coba Kirim Doa**: Kirim pesan ucapan doa restu dan pastikan ucapan tersebut langsung muncul di dinding ucapan (*real-time*).
- [ ] **Akses Admin Panel**: Buka `https://domainanda.com/login` dan pastikan formulir login passcode muncul, dapat dibuka dengan passcode `password`, dan otomatis beralih ke `https://domainanda.com/modules`.
- [ ] **Tautan Google Maps**: Tombol *"Buka di Google Maps"* pada seksi Akad dan Resepsi berhasil membuka koordinat peta yang akurat di aplikasi HP.
- [ ] **Salin Rekening**: Tombol *"Salin Nomor Rekening"* menampilkan notifikasi tersalin dan nomor rekening berhasil menempel saat di-paste.
- [ ] **Pratinjau Media Sosial**: Bagikan tautan website Anda ke chat WhatsApp (pribadi) dan pastikan judul, deskripsi, dan thumbnail foto muncul dengan menarik.
