# 📚 Dokumentasi Proyek: Mari Partner Digital Wedding Invitation SPA

Selamat datang di portal dokumentasi resmi **Mari Partner Digital Wedding Invitation SPA**. Dokumentasi ini disusun secara komprehensif, terstruktur, dan bebas dari teks generik (*anti-slop*) untuk melayani seluruh pemangku kepentingan proyek: mulai dari pengguna operasional (mempelai/keluarga), pengembang (*software engineers*), hingga tim infrastruktur (*DevOps/System Administrators*).

---

## 🏛️ Peta Struktur Dokumentasi (`docs/`)

Dokumentasi proyek ini terbagi ke dalam 5 dokumen inti spesialisasi:

```text
docs/
├── README.md                                    # Pusat Navigasi & Portal Dokumentasi (Documentation Hub)
├── 01-daftar-command.md                         # Daftar Perintah Wajib & Operasional (CLI Reference)
├── 02-buku-panduan-pengguna.md                  # Buku Panduan Pengguna & Manual Book Lengkap (User Manual)
├── 03-developer-guide.md                        # Panduan Pengembang & Arsitektur (Developer Guide)
├── 04-panduan-deployment.md                     # Panduan Deployment Multi-Platform & Spek Server Multi-Klien
├── 05-panduan-bisnis-kemitraan-dan-sales-playbook.md # Panduan Bisnis, Sales Playbook & Kemitraan WO
├── 06-pitch-deck-one-pager-wo.md                # Proposal Kemitraan B2B & Pitch Deck Ringkas untuk WO
├── 07-formulir-onboarding-klien-baru.md         # Formulir Pengumpulan Data Klien & Template Impor Tamu Excel
├── 08-panduan-skenario-demo-presentasi.md       # Panduan Skenario Demo Presentasi 10 Menit di Depan WO
└── 09-panduan-otomatisasi-deploy-klien.md       # Panduan Otomatisasi Skrip Deploy Klien (Multi-Tenant CLI)
```

---

## 📑 Matriks Panduan & Sasaran Pembaca

| Berkas Dokumen | Judul Panduan | Target Pembaca | Topik Pembahasan Utama |
| :--- | :--- | :--- | :--- |
| [**AGENTS.md**](../AGENTS.md) | **Panduan & Aturan AI Coding Agent** | *AI Assistant / Developer* | 10 pilar aturan operasional AI Assistant: SemVer, Conventional Commits, Sync Docs, OWASP, & Clean Code. |
| [**01-daftar-command.md**](01-daftar-command.md) | **Daftar Perintah CLI & Operasional** | *Developer / DevOps* | Perintah `npm`, migrasi & seeding MySQL, server Express, dev server Vite, kompilasi produksi, testing Vitest, load test Autocannon, & CLI deployment. |
| [**02-buku-panduan-pengguna.md**](02-buku-panduan-pengguna.md) | **Buku Panduan Pengguna (User Manual)** | *Mempelai / Admin Operasional* | Panduan akses Admin Panel (`superadmin` / `password`), fitur ganti password, generator WhatsApp, modifikasi konten, monitoring RSVP, dan meja resepsi. |
| [**03-developer-guide.md**](03-developer-guide.md) | **Panduan Arsitektur & Pengembang** | *Frontend / Full-Stack Engineer* | Arsitektur SPA React 19 + Node.js Express + MySQL + Socket.io, skema basis data relasional, REST API, sistem pembersihan disk otomatis (*auto-unlink*), dan multi-tema (35 tema). |
| [**04-panduan-deployment.md**](04-panduan-deployment.md) | **Panduan Deployment Multi-Platform** | *DevOps / SysAdmin / Webmaster* | Penerbitan produksi arsitektur *self-hosted* ke VPS Linux, cPanel, aaPanel, kalkulasi kapasitas multi-client 1 server, dan batasan hardware. |
| [**05-panduan-bisnis-kemitraan-dan-sales-playbook.md**](05-panduan-bisnis-kemitraan-dan-sales-playbook.md) | **Panduan Bisnis & Sales Playbook** | *Owner / Business Dev / Sales* | Strategi kemitraan Wedding Organizer, taktik lead gen via Google Maps & Bridestory, cold outreach scripts, skema bagi hasil, dan objection handling. |
| [**06-pitch-deck-one-pager-wo.md**](06-pitch-deck-one-pager-wo.md) | **Pitch Deck One-Pager untuk WO** | *Mitra Wedding Organizer* | Proposal kemitraan 1 halaman siap kirim: 5 fitur unggulan hari-H, scanner offline PWA, master report, paket wholesale WO, dan free trial 1 event. |
| [**07-formulir-onboarding-klien-baru.md**](07-formulir-onboarding-klien-baru.md) | **Formulir Onboarding Klien Baru** | *Pengantin & Admin WO* | Template kuesioner WhatsApp siap salin untuk pengumpulan data pengantin, jadwal acara, rekening/QRIS, dan format standar impor tamu Excel. |
| [**08-panduan-skenario-demo-presentasi.md**](08-panduan-skenario-demo-presentasi.md) | **Panduan Skenario Demo Presentasi** | *Presenter / Sales / Founder* | Alur presentasi 10 menit memukau di depan WO: hook cover nama tamu, trik pamer offline scanner di mode pesawat, layar proyektor panggung, dan ekspor master Excel. |
| [**09-panduan-otomatisasi-deploy-klien.md**](09-panduan-otomatisasi-deploy-klien.md) | **Panduan Otomatisasi Deploy Klien** | *DevOps / Founder / SysAdmin* | Otomatisasi penerbitan klien < 30 detik (`deploy-client.sh`), mode wizard & 1-line flag, hemat disk shared node_modules, freeze H+7, backup, dan delete. |

---

## ⚡ Jalan Pintas Cepat (*Quick Shortcuts*)

Pilih skenario kebutuhan Anda di bawah ini untuk langsung menuju langkah-langkah implementasi praktis:

### 💻 1. Saya Ingin Menjalankan Proyek di Komputer Lokal (Localhost)
1. Buka terminal dan jalankan:
   ```bash
   git clone https://github.com/hndko/app_weddingbetawi_react.git
   cd app_weddingbetawi_react
   npm install
   cp .env.example .env
   ```
2. Pastikan database MySQL Laragon aktif (`db_weddingbetawi`), lalu jalankan migrasi & seeding:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
3. Jalankan backend dan frontend:
   ```bash
   npm run server   # di terminal 1 (Port 5000)
   npm run dev      # di terminal 2 (Port 3000)
   ```
4. Buka browser pada alamat `http://localhost:3000`.
5. Panduan perintah selengkapnya dapat dipelajari di [01-daftar-command.md](01-daftar-command.md).

### 💌 2. Saya Ingin Membuat Link Undangan Khusus Tamu & Pesan WhatsApp
1. Buka URL login admin pada `http://localhost:3000/login` (setelah login URL otomatis berpindah ke `/modules`).
2. Masukkan Username: **`superadmin`** dan Password: **`password`**.
3. Pilih tab **Link Tamu Undangan**, masukkan nama tamu, lalu klik tombol **"Kirim / Bagikan via WhatsApp"**.
4. Pelajari alur kerja lengkap di [02-buku-panduan-pengguna.md](02-buku-panduan-pengguna.md#3-modul-generator-link-tamu--pesan-whatsapp).

### ☁️ 3. Saya Ingin Men-deploy Undangan ke Server VPS Linux (Nginx + PM2)
1. Siapkan VPS Ubuntu 22.04 LTS dan pasang Node.js, MySQL, Nginx, dan PM2.
2. Buat database `db_weddingbetawi` dan jalankan `npm run db:migrate && npm run db:seed`.
3. Jalankan backend dengan `pm2 start "npx tsx server/src/index.ts" --name "wedding-backend"`.
4. Bangun aset frontend dengan `npm run build`.
5. Konfigurasikan reverse proxy Nginx untuk routing SPA, `/api/`, `/socket.io/`, dan `/uploads/`.
6. Panduan deploy langkah-demi-langkah tersedia di [04-panduan-deployment.md](04-panduan-deployment.md#2-deployment-vps-linux-ubuntu-2204-lts--nginx--pm2).

### 🛠️ 4. Saya Ingin Memahami Arsitektur Kode & Menambah Fitur Baru
1. Pahami pola komponen, *hooks*, REST API service, dan skema MySQL pada [03-developer-guide.md](03-developer-guide.md).
2. Ikuti siklus penambahan fitur terstandarisasi untuk menjaga kebersihan codebase (*Zero Any* & *No Dead Code*).

---

<div align="center">
  <sub>Dokumentasi ini dipelihara di bawah standar <b>Universal Docs Architect Standard</b>.</sub>
</div>
