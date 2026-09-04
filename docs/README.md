# 📚 Dokumentasi Proyek: Betawi Heritage Wedding Invitation SPA

Selamat datang di portal dokumentasi resmi **Betawi Heritage Wedding Invitation**. Dokumentasi ini disusun secara komprehensif, terstruktur, dan bebas dari teks generik (*anti-slop*) untuk melayani seluruh pemangku kepentingan proyek: mulai dari pengguna operasional (mempelai/keluarga), pengembang (*software engineers*), hingga tim infrastruktur (*DevOps/System Administrators*).

---

## 🏛️ Peta Struktur Dokumentasi (`docs/`)

Dokumentasi proyek ini terbagi ke dalam 4 dokumen inti spesialisasi:

```text
docs/
├── README.md                    # Pusat Navigasi & Portal Dokumentasi (Documentation Hub)
├── 01-daftar-command.md         # Daftar Perintah Wajib & Operasional (CLI Reference)
├── 02-buku-panduan-pengguna.md  # Buku Panduan Pengguna & Manual Book Lengkap (User Manual)
├── 03-developer-guide.md        # Panduan Pengembang & Arsitektur (Developer Guide)
└── 04-panduan-deployment.md     # Panduan Deployment Multi-Platform (Local, Vercel, VPS, cPanel, aaPanel)
```

---

## 📑 Matriks Panduan & Sasaran Pembaca

| Berkas Dokumen | Judul Panduan | Target Pembaca | Topik Pembahasan Utama |
| :--- | :--- | :--- | :--- |
| [**01-daftar-command.md**](01-daftar-command.md) | **Daftar Perintah CLI & Operasional** | *Developer / DevOps* | Perintah `bun` & `npm`, dev server, linting TypeScript, kompilasi produksi, maintenance cache, konvensi commit Git, dan cheatsheet operasional harian. |
| [**02-buku-panduan-pengguna.md**](02-buku-panduan-pengguna.md) | **Buku Panduan Pengguna (User Manual)** | *Mempelai / Admin Operasional* | Panduan akses Admin Panel, generator link WhatsApp otomatis, modifikasi konten/jadwal acara, upload foto & QRIS, monitoring RSVP, serta moderasi ucapan doa. |
| [**03-developer-guide.md**](03-developer-guide.md) | **Panduan Arsitektur & Pengembang** | *Frontend Engineer / Reviewer* | Arsitektur SPA React 19 + TypeScript, arsitektur *Zero Storage Cost* (Canvas Base64), model data Firestore, state management, audit kepatuhan OWASP, dan konvensi Clean Code. |
| [**04-panduan-deployment.md**](04-panduan-deployment.md) | **Panduan Deployment Multi-Platform** | *DevOps / SysAdmin / Webmaster* | Penerbitan produksi ke **Vercel** (rekomendasi utama), **VPS Linux Ubuntu (Nginx)**, **Shared Hosting cPanel** (Apache `.htaccess`), dan **aaPanel**, lengkap dengan konfigurasi SSL Let's Encrypt. |

---

## ⚡ Jalan Pintas Cepat (*Quick Shortcuts*)

Pilih skenario kebutuhan Anda di bawah ini untuk langsung menuju langkah-langkah implementasi praktis:

### 💻 1. Saya Ingin Menjalankan Proyek di Komputer Lokal (Localhost)
1. Buka terminal dan jalankan:
   ```bash
   git clone https://github.com/hndko/app_weddingbetawi_react.git
   cd app_weddingbetawi_react
   bun install # atau npm install
   cp .env.example .env
   bun run dev # atau npm run dev
   ```
2. Buka browser pada alamat `http://localhost:3000`.
3. Panduan perintah selengkapnya dapat dipelajari di [01-daftar-command.md](01-daftar-command.md).

### 💌 2. Saya Ingin Membuat Link Undangan Khusus Tamu & Pesan WhatsApp
1. Buka URL undangan Anda dengan menambahkan akhiran `?admin` (misal: `http://localhost:3000/?admin`).
2. Masukkan passcode: **`password`**.
3. Pilih tab **Link Tamu Undangan**, masukkan nama tamu, lalu klik tombol **"Kirim / Bagikan via WhatsApp"**.
4. Pelajari alur kerja lengkap di [02-buku-panduan-pengguna.md](02-buku-panduan-pengguna.md#3-modul-generator-link-tamu--pesan-whatsapp).

### ☁️ 3. Saya Ingin Men-deploy Undangan ke Internet via Vercel (Gratis & Otomatis)
1. Unggah proyek ke GitHub repositori Anda.
2. Impor repositori di [Vercel Dashboard](https://vercel.com/dashboard).
3. Masukkan 6 variabel lingkungan Firebase Anda di menu **Settings > Environment Variables**.
4. Klik **Deploy** dan website aktif dalam 1 menit.
5. Panduan deploy langkah-demi-langkah tersedia di [04-panduan-deployment.md](04-panduan-deployment.md#2-deployment-cloud-serverless-vercel).

### 🛠️ 4. Saya Ingin Memahami Arsitektur Kode & Menambah Fitur Baru
1. Pahami pola komponen, *hooks*, dan struktur state pada [03-developer-guide.md](03-developer-guide.md).
2. Ikuti siklus penambahan fitur terstandarisasi untuk menjaga kebersihan codebase (*Zero Any* & *No Dead Code*).

---

<div align="center">
  <sub>Dokumentasi ini dipelihara di bawah standar <b>Universal Docs Architect Standard</b>.</sub>
</div>
