# 💍 Mari Partner - Digital Wedding Invitation SPA

> Platform undangan pernikahan digital interaktif dan responsif multi-tema (Suite 35 Tema: Adat Nusantara, Modern & Pop Culture, serta Syar'i / Islami) dengan sinkronisasi data *real-time*, audio *playlist* multifungsi, generator pesan WhatsApp, serta panel admin mandiri.

[![Version](https://img.shields.io/badge/Version-1.51.0-blue?style=for-the-badge)](package.json)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-Laragon-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://laragon.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Motion](https://img.shields.io/badge/Motion-12.23-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

- [🤖 Aturan AI Agent (AGENTS.md)](AGENTS.md)
- [📚 Dokumentasi Lengkap Proyek (Docs Suite)](#-dokumentasi-lengkap-proyek-docs-suite)
- [📖 Tentang Proyek](#-tentang-proyek)
- [🛠️ Teknologi & Library](#️-teknologi--library)
- [🏛️ Arsitektur & Alur Sistem](#️-arsitektur--alur-sistem)
- [🗄️ Struktur Database](#️-struktur-database)
- [👥 Hak Akses & Role Pengguna](#-hak-akses--role-pengguna)
- [✨ Fitur Utama](#-fitur-utama)
- [📋 Prasyarat Sistem](#-prasyarat-sistem)
- [🚀 Panduan Instalasi](#-panduan-instalasi)
- [💻 Panduan Penggunaan](#-panduan-penggunaan)
- [🔐 Kredensial Default](#-kredensial-default)
- [🗄️ Panduan Setup Basis Data MySQL & Migrasi](#️-panduan-setup-basis-data-mysql--migrasi)
- [☁️ Panduan Deployment Produksi (Self-Hosted)](#️-panduan-deployment-produksi-self-hosted)
- [🤝 Panduan Kontribusi](#-panduan-kontribusi)
- [📄 Lisensi](#-lisensi)

---

## 📚 Dokumentasi Lengkap Proyek (Docs Suite)

Untuk panduan mendalam sesuai peran dan kebutuhan operasional, silakan telusuri rangkaian dokumentasi di folder [`docs/`](docs/README.md) dan panduan protokol agen di [`AGENTS.md`](AGENTS.md):

| Panduan | Lokasi Berkas | Deskripsi Isi |
| :--- | :--- | :--- |
| 🤖 **Aturan AI Agent** | [`AGENTS.md`](AGENTS.md) | 10 pilar aturan operasional AI Assistant: SemVer, Conventional Commits, Sync Docs, OWASP, & Clean Code. |
| 📚 **Dokumentasi Hub** | [`docs/README.md`](docs/README.md) | Pusat navigasi, matriks panduan, dan jalan pintas cepat skenario umum. |
| 📟 **Daftar Perintah CLI** | [`docs/01-daftar-command.md`](docs/01-daftar-command.md) | Cheatsheet CLI harian, dev server, type checking, build produksi, & housekeeping. |
| 📖 **Buku Panduan Pengguna** | [`docs/02-buku-panduan-pengguna.md`](docs/02-buku-panduan-pengguna.md) | Manual book pengantin: generator link WhatsApp, ubah data, upload foto, & RSVP. |
| 🛠️ **Panduan Pengembang** | [`docs/03-developer-guide.md`](docs/03-developer-guide.md) | Arsitektur SPA React 19 + Node.js Express, basis data MySQL, Socket.io, OWASP, & siklus fitur baru. |
| ☁️ **Panduan Deployment** | [`docs/04-panduan-deployment.md`](docs/04-panduan-deployment.md) | Panduan rilis self-hosted ke VPS Linux Ubuntu (Nginx + PM2), cPanel (Node.js Selector), dan aaPanel. |
| 💼 **Sales & Partnership Playbook** | [`docs/05-panduan-bisnis-kemitraan-dan-sales-playbook.md`](docs/05-panduan-bisnis-kemitraan-dan-sales-playbook.md) | Strategi kemitraan B2B WO, taktik pencarian prospek via Google Maps/IG, skrip penawaran, & objection handling. |

---

## 📖 Tentang Proyek

**Mari Partner Digital Wedding Invitation** adalah aplikasi web *Single Page Application* (SPA) dengan rangkaian 35 tema adat Nusantara, modern, dan islami yang dirancang untuk memberikan pengalaman personal dan imersif kepada setiap tamu undangan. 

Aplikasi ini menyelesaikan sejumlah tantangan utama dalam penyebaran undangan konvensional:
1. **Efisiensi Biaya & Waktu**: Menggantikan undangan cetak fisik dengan undangan digital elegan yang dapat dibagikan secara instan melalui tautan WhatsApp.
2. **Personalisasi Tamu**: Nama tamu dapat disematkan secara dinamis pada halaman sampul depan (*Opening Cover*) melalui parameter URL.
3. **Interaktivitas Dua Arah & Real-Time**: Tamu dapat mengonfirmasi kehadiran (RSVP) serta mengirimkan doa restu secara langsung yang tersinkronisasi seketika melalui WebSockets (Socket.io).
4. **Kemudahan Digital Gift**: Menyediakan opsi transfer bank multi-rekening dengan tombol salin otomatis dan kode QRIS instan.
5. **Panel Admin Mandiri**: Mempelai dapat mengubah jadwal acara, profil, foto galeri, lagu, nomor rekening, mengganti password akun admin, hingga memantau daftar hadir tanpa perlu menyentuh kode program.

Sistem ini didesain dengan prinsip **Efisiensi Penyimpanan Mandiri (*Zero Storage Leak*)**; seluruh media foto profil mempelai, background, atau gambar QRIS dikelola langsung oleh backend Node.js Express di folder `server/uploads/` dengan sistem pembersihan otomatis (*auto-unlink garbage collection*). Saat foto diganti atau dihapus melalui Admin Panel, file lama otomatis terhapus dari disk server sehingga kapasitas hosting tetap hemat dan bersih.

---

## 🛠️ Teknologi & Library

| Kategori | Teknologi / Library | Versi | Deskripsi Kegunaan |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [React](https://react.dev) | `^19.0.1` | Pustaka UI deklaratif modern berbasis komponen. |
| **Language** | [TypeScript](https://www.typescriptlang.org) | `~5.8.2` | Menjamin keandalan kode dengan *static typing*. |
| **Backend Runtime** | [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | `^5.2.1` | Server REST API mandiri dan serving berkas uploads. |
| **Database** | [MySQL](https://laragon.org) (`mysql2/promise`) | `^3.24.3` | Basis data relasional dengan pooling dan *prepared statements*. |
| **Realtime Engine** | [Socket.io](https://socket.io) | `^4.8.1` | Protokol WebSockets untuk siaran ucapan dan live feed proyektor. |
| **Security & Auth** | [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `^3.0.3` | Hashing aman untuk kata sandi administrator. |
| **HTTP Security Headers** | [Helmet](https://helmetjs.github.io/) | `^8.1.0` | Pengamanan HTTP header & Content Security Policy (CSP). |
| **File Uploader** | [Multer](https://github.com/expressjs/multer) | `^2.3.0` | Penanganan unggahan berkas foto multipart/form-data. |
| **Build Tool & Bundler** | [Vite](https://vitejs.dev) | `^6.2.3` | *Development server* berkecepatan tinggi dan *bundling* produksi optimal. |
| **Styling & CSS** | [Tailwind CSS](https://tailwindcss.com) | `^4.1.14` | *Utility-first CSS framework* v4 dengan skema tema dinamis. |
| **Animations** | [Motion](https://motion.dev) | `^12.23.24` | Menghadirkan animasi gerak halus, transisi cover, dan *stagger effects*. |
| **Media Player** | [React Player](https://github.com/cookpete/react-player) | `^3.4.0` | Pemutar audio fleksibel (mendukung YouTube, Google Drive, & file MP3). |
| **Icons** | [Lucide React](https://lucide.dev) | `^0.546.0` | Set ikon antarmuka modern, tajam, dan ringan. |
| **SEO & Meta Head** | [react-helmet-async](https://github.com/staylor/react-helmet-async) | `^3.0.0` | Manajemen tag `<head>` dinamis untuk pratinjau sosial media yang akurat. |
| **Utility Classes** | `clsx` & `tailwind-merge` | `^2.1.1` / `^3.6.0` | Penggabungan kelas Tailwind yang dinamis tanpa benturan style. |

---

## 🏛️ Arsitektur & Alur Sistem

### 1. Alur Pengalaman Tamu Undangan (Guest Flow)
```mermaid
graph TD
    A["Tamu Membuka Tautan Undangan (?to=Nama+Tamu)"] --> B["Opening Cover (Sampul Interaktif)"]
    B -->|"Klik 'Buka Undangan'"| C["Pemutar Musik Otomatis Berputar"]
    C --> D["Halaman Utama Undangan (Hero & Ayat Suci)"]
    D --> E["Profil Mempelai & Hitung Mundur (Countdown)"]
    E --> F["Linimasa Kisah Cinta (Love Story)"]
    F --> G["Jadwal Akad & Resepsi + Navigasi Google Maps"]
    G --> H["Galeri Foto & Amplop Digital (Bank/QRIS)"]
    H --> I["Formulir RSVP & Ucapan Selamat"]
    I -->|"Submit Data via REST API"| J[("Express API & MySQL Database")]
    J -->|"Socket.io Real-Time Broadcast"| K["Dinding Ucapan Terbarui Otomatis"]
```

### 2. Alur Pengelolaan Administrator (Admin Flow)
```mermaid
graph LR
    A["Akses URL: /login"] --> B{"Autentikasi MySQL (bcryptjs)"}
    B -->|"Kredensial Valid"| C["URL: /modules (Dashboard Admin)"]
    B -->|"Kredensial Salah"| D["Pesan Error"]
    C --> E["Link & WA Generator"]
    C --> F["Edit Data & Konten Website"]
    C --> G["Monitor & Rekapitulasi RSVP"]
    C --> H["Moderasi & Hapus Ucapan"]
    C --> I["Modal Ganti Password Admin"]
    F -->|"Simpan & Auto-Unlink File Lama"| J[("MySQL: wedding_config & uploads/")]
    J -->|"Otomatis Tayang"| K["Tampilan Publik Terupdate"]
```

---

## 🗄️ Struktur Database

Sistem memanfaatkan basis data relasional **MySQL** (`db_weddingbetawi`) yang terstruktur dan terindeks:

### 1. Tabel Kredensial Administrator: `users`
Menyimpan akun pengguna admin dengan password ter-hash secara aman.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik pengguna. |
| `username` | `VARCHAR(100) UNIQUE NOT NULL` | Nama pengguna admin (default: `superadmin`). |
| `password` | `VARCHAR(255) NOT NULL` | Hash password aman algoritma `bcryptjs`. |
| `role` | `VARCHAR(50) DEFAULT 'admin'` | Peran otorisasi pengguna. |
| `created_at` / `updated_at` | `TIMESTAMP` | Waktu pembuatan & pembaruan akun. |

### 2. Tabel Konfigurasi Utama: `wedding_config`
Menyimpan seluruh konfigurasi dinamis yang dapat disesuaikan melalui Admin Panel.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `VARCHAR(50) PRIMARY KEY` | Kunci dokumen konfigurasi (`main`). |
| `config_data` | `LONGTEXT NOT NULL` | JSON payload konfigurasi mempelai, tanggal, acara, galeri, bank, cerita, musik, dan SEO. |
| `updated_at` | `TIMESTAMP` | Waktu pembaruan terakhir. |

### 3. Tabel Konfirmasi Kehadiran: `rsvps`
Menyimpan konfirmasi kehadiran dari para tamu.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik RSVP. |
| `name` | `VARCHAR(255) NOT NULL` | Nama tamu yang mengisi konfirmasi. |
| `attendance` | `VARCHAR(50) NOT NULL` | Status konfirmasi: `"hadir"` atau `"tidak_hadir"`. |
| `guest_count` | `INT DEFAULT 1` | Jumlah rombongan tamu yang hadir. |
| `notes` | `TEXT` | Catatan atau doa tambahan dari tamu. |
| `created_at` | `TIMESTAMP` | Waktu pengiriman data konfirmasi. |

### 4. Tabel Ucapan & Doa: `wishes`
Menyimpan daftar ucapan doa restu tamu yang disiarkan langsung ke *wishes wall* dan layar proyektor panggung.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik ucapan. |
| `name` | `VARCHAR(255) NOT NULL` | Nama pengirim doa restu. |
| `text` | `TEXT NOT NULL` | Isi pesan doa restu. |
| `created_at` | `TIMESTAMP` | Waktu pengiriman ucapan. |

### 5. Tabel Buku Tamu Undangan: `guests`
Menyimpan buku tamu personal untuk generator link WhatsApp dan pembagian meja.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik tamu. |
| `name` | `VARCHAR(255) NOT NULL` | Nama lengkap tamu. |
| `phone` | `VARCHAR(50)` | Nomor telepon / WhatsApp tamu. |
| `pax` | `INT DEFAULT 1` | Jumlah kuota undangan (pax). |
| `status` | `VARCHAR(50) DEFAULT 'invited'` | Status undangan (`invited`, `confirmed`, `attended`). |
| `assigned_table` | `VARCHAR(100)` | Nomor meja yang dialokasikan. |
| `qr_code` | `VARCHAR(255)` | Kode QR unik tiket digital pass. |

### 6. Tabel Pos Anggaran: `budget_items`
Menyimpan target biaya, kontrak vendor, dan pelunasan termin pembayaran.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik pos anggaran. |
| `category` | `VARCHAR(100) NOT NULL` | Kategori pos (Venue, Catering, MUA, dll.). |
| `name` | `VARCHAR(255) NOT NULL` | Nama item pengeluaran. |
| `vendor` | `VARCHAR(255)` | Nama vendor penyedia jasa. |
| `phone` | `VARCHAR(50)` | Nomor kontak WhatsApp vendor. |
| `estimated_cost` | `DECIMAL(15,2) DEFAULT 0` | Estimasi anggaran yang direncanakan. |
| `actual_cost` | `DECIMAL(15,2) DEFAULT 0` | Nilai kontrak aktual yang disepakati. |
| `paid_amount` | `DECIMAL(15,2) DEFAULT 0` | Total uang muka/termin yang telah dibayar. |
| `status` | `VARCHAR(50) DEFAULT 'unpaid'` | Status pelunasan (`unpaid`, `partial`, `paid`). |
| `is_ready` | `TINYINT(1) DEFAULT 0` | Kesiapan logistik hari-H. |

### 7. Tabel Denah Meja: `seating_tables`
Menyimpan denah ballroom dan pembagian kursi tamu.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik meja. |
| `table_number` | `VARCHAR(50) NOT NULL` | Nomor/kode meja (misal: `VIP-01`). |
| `table_name` | `VARCHAR(255) NOT NULL` | Nama label meja. |
| `zone` | `VARCHAR(100) DEFAULT 'center'` | Posisi zona meja (`front`, `center`, `back`, dll.). |
| `capacity` | `INT DEFAULT 10` | Kapasitas kursi. |
| `shape` | `VARCHAR(50) DEFAULT 'round'` | Bentuk meja (`round`, `rectangle`). |
| `assigned_guests` | `LONGTEXT` | JSON daftar tamu yang duduk di meja. |
| `notes` | `TEXT` | Catatan khusus meja. |

### 8. Tabel Kuis Trivia: `trivia_questions`
Menyimpan pertanyaan kuis interaktif seputar kedua mempelai.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik kuis. |
| `question` | `TEXT NOT NULL` | Pertanyaan kuis trivia. |
| `options` | `LONGTEXT NOT NULL` | JSON array 4 pilihan jawaban. |
| `correct_answer_index` | `INT NOT NULL` | Indeks jawaban yang benar (0-3). |
| `explanation` | `TEXT` | Penjelasan jawaban. |

### 9. Tabel Check-in Meja Resepsi: `checkins`
Mencatat kehadiran tamu dan pembagian suvenir hari-H secara real-time.

| Nama Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `INT AUTO_INCREMENT PRIMARY KEY` | ID unik check-in. |
| `guest_id` | `INT` | ID referensi tamu (opsional). |
| `guest_name` | `VARCHAR(255) NOT NULL` | Nama tamu yang hadir. |
| `pax` | `INT DEFAULT 1` | Jumlah orang yang masuk. |
| `souvenir_taken` | `TINYINT(1) DEFAULT 1` | Status penerimaan suvenir fisik. |
| `checked_in_at` | `TIMESTAMP` | Waktu kedatangan tamu di meja resepsi. |

---

## 👥 Hak Akses & Role Pengguna

| Role | Metode Akses | Hak Akses & Fitur yang Diizinkan |
| :--- | :--- | :--- |
| **Tamu Undangan** *(Public Guest)* | Membuka URL undangan publik (`https://domain.com/?to=Nama+Tamu`) | - Membuka sampul undangan interaktif (*Opening Cover*).<br>- Memutar dan menjeda musik latar (*Floating Audio Player*).<br>- Menavigasi seksi undangan via *Bottom Navigation* & *ScrollSpy*.<br>- Melihat detail acara dan membuka rute lokasi ke Google Maps.<br>- Mengirim konfirmasi kehadiran pada formulir RSVP.<br>- Mengirim doa restu dan melihat dinding ucapan secara *real-time*.<br>- Menyalin nomor rekening bank & memindai kode QRIS untuk hadiah. |
| **Mempelai / Admin** *(Administrator)* | Membuka URL rahasia `/login` dan memasukkan Username (`superadmin`) & Password (`password`) | - Mengakses **WhatsApp Link Generator** (membuat link custom nama tamu dan template pesan WA instan).<br>- Mengubah data profil kedua mempelai dan unggah foto.<br>- Mengubah jadwal, jam, venue, dan link Google Maps acara.<br>- Menambah, menyusun, dan menghapus foto galeri pernikahan.<br>- Mengelola daftar rekening bank & unggah gambar kode QRIS.<br>- Mengatur playlist musik latar (YouTube/Google Drive) dan mode putar.<br>- Mengonfigurasi metadata SEO & pratinjau thumbnail media sosial.<br>- Memantau statistik kehadiran RSVP (Total Hadir, Tidak Hadir, Total Respon).<br>- Mengelola meja resepsi dan pemindai QR pass tamu hari-H.<br>- Menghapus respon RSVP atau ucapan tamu yang tidak pantas (moderasi).<br>- Mengubah password admin secara mandiri via modal Ganti Password. |
| **Operator Panggung / MC** *(Stage Display)* | Membuka rute publik mandiri `/live` atau `/projector` (atau via tombol jalan pintas di `/modules`) | - Menampilkan layar penuh 16:9 sinematik di proyektor/LED ballroom panggung pernikahan.<br>- Menampilkan QR Code interaktif untuk dipindai tamu dari meja.<br>- Memutar selebrasi spotlight & audio chime harmonis secara otomatis saat ada ucapan baru.<br>- Mengatur kecepatan putar otomatis (carousel) dan audio chime via floating control bar. |

---

## ✨ Fitur Utama

### 👑 Luxury & Wedding Organizer (WO) Partnership Suite (v1.49.0)
- **VIP Guest Tiering & Dedicated Access Pass**:
  - Klasifikasi tamu bertingkat 4 level: `VVIP`, `VIP`, `Keluarga Besar (Family)`, dan `Reguler`.
  - Lencana kemewahan tematik bergradien (Gold Crown untuk VVIP, Amber Star untuk VIP, Emerald Handshake untuk Family) yang terpampang di Opening Cover kartu tamu, e-ticket digital passcard, dan tabel admin.
  - Alokasi nomor / zona meja prioritas baris depan (`tableNumber`) dan catatan protokoler VIP (`vipNotes`).
  - Passcard digital eksklusif tamu yang dapat diunduh instan sebagai gambar HD PNG atau dokumen PDF e-ticket resmi siap cetak.
- **Digital Souvenir & Photobooth Redemption Tracker**:
  - Pelacak penukaran suvenir resepsi anti-ganda berbasis scanner QR dan toggle 1-klik di Reception Check-in & Panel Tamu.
  - Peringatan sistem interaktif jika tamu terdeteksi sudah mengambil suvenir sebelumnya, mencegah duplikasi pengambilan dan kebocoran stok suvenir fisik.
  - Sinkronisasi instan dua arah antara tabel `guests` dan `checkins` pada basis data MySQL.
- **White-Label Agensi Mode (Full Identity Customization)**:
  - 3 Mode fleksibel: `disabled`, `co_branded` (berdampingan dengan Mari Partner), dan `100% white_label` (murni nama agensi WO).
  - Kostumisasi logo WO (upload PNG transparan), nama agensi, tagline kemewahan, website resmi, Instagram, dan nomor WhatsApp CS / konsultasi.
  - Tampil di footer publik undangan, dialog modal, dan dokumen ekspor WO dengan opsi eliminasi total tulisan Mari Partner.
- **Live Wedding Rundown Status Broadcaster**:
  - Siaran langsung status prosesi acara hari-H secara realtime dari smartphone kru WO tanpa perlu reload (`Socket.io`).
  - Floating pill banner (`🔴 LIVE`) dinamis di bagian atas layar tamu dengan penunjuk waktu, nama sesi acara (misal: "Sesi Foto Keluarga" atau "Prasmanan Resepsi Dibuka"), dan pesan khusus.
  - Expandable drawer linimasa yang menampilkan rundown lengkap acara bagi tamu undangan.
  - Tombol preset cepat di Admin Panel untuk perubahan status satu kali klik.

### 📸 Virtual Photo Booth Responsif & Sticky Studio Action Bar (v1.43.0)
- **Pengalaman Photobooth Mobile Optimal (*Zero Button Cutoff*)**:
  - Mengeliminasi isu tombol aksi yang tertutup atau terpotong pada berbagai perangkat seluler melalui integrasi unit tinggi dinamis (`100dvh` / `h-[100dvh]`) dan pengamanan area bawah (*safe area padding* `env(safe-area-inset-bottom)`).
  - **Sticky Bottom Action Bar**: Bilah aksi terkunci permanen di bagian bawah modal dengan latar belakang *backdrop blur* halus dan penyesuaian dinamis sesuai tahapan:
    - **Langkah 1 (Setup)**: Tombol pemicu *"Mulai Pengambilan Foto (3 Pose / Single Polaroid)"*.
    - **Langkah 2 (Capture Kamera)**: Tombol Shutter *"Ambil Foto Pose X"* berdampingan dengan tombol navigasi *"Kembali"*.
    - **Langkah 2 (Capture Galeri)**: Tombol *"Lanjut ke Pratinjau Photostrip"* berdampingan dengan tombol *"Kembali"*.
    - **Langkah 3 (Preview & Download)**: Tombol unduh utama *"Unduh Photostrip HD (PNG)"* bersanding dengan tombol sekunder *"Foto Ulang"* dan *"Ganti Format"*.
  - **Jendela Bidik Kamera Adaptif**: Ketinggian kamera fleksibel (`max-h-[36vh] xs:max-h-[40vh] md:max-h-[340px]`) serta baris pratinjau thumbnail pose yang ringkas (`12x12` / `14x14`) menjaga seluruh visual tetap berada dalam satu layar nyaman tanpa perlu *scrolling*.
- **Sintesis Photostrip HD di Sisi Klien (HTML5 Canvas API)**:
  - 2 Pilihan layout: **3-Pose Photostrip** (Korean self-photo studio vertikal 600x1800 px) & **Single Polaroid Frame** (800x1000 px).
  - 4 Pilihan filter warna artistik: *Natural*, *B&W Vintage*, *Sepia Retro*, dan *Warm Glow*.
  - 4 Desain bingkai: *Theme Matched* (mengadaptasi palet tema aktif secara otomatis), *Black Studio*, *White Studio*, dan *Romantic Pastel*.
  - Pemrosesan gambar 100% lokal di browser pengguna (*zero server upload & zero storage cost*).

### 🎵 Sinkronisasi Mutlak Mode Pemutaran Audio & Engine Playlist (v1.36.1)
- **4 Mode Pemutaran Audio Responsif**: Sinkronisasi penuh antara Panel Admin Modules dan Audio Engine klien:
  - *Repeat All (Ulangi Semua)*: Mengulang seluruh daftar lagu di playlist secara berurutan tanpa henti (termasuk penanganan loop otomatis untuk single track).
  - *Repeat One (Ulangi Satu Lagu)*: Mengulang satu lagu aktif secara terus-menerus tanpa berpindah track.
  - *Shuffle (Acak)*: Memutar lagu-lagu di playlist secara acak tanpa mengulang lagu yang sama berturut-turut.
  - *Linear (Sekali Jalan)*: Memutar urutan playlist satu kali dari awal hingga akhir, lalu berhenti otomatis setelah lagu terakhir selesai.
- **Transisi Mulus YouTube IFrame API**: Menggunakan `loadVideoById` pada instance player aktif tanpa merusak DOM iframe, mencegah pemblokiran autoplay oleh browser seluler (iOS Safari & Android Chrome).
- **Indikator Badge Mode Interaktif**: Floating button musik kini dilengkapi mini-badge ikon mode pemutaran (`Repeat`, `Repeat1`, `Shuffle`, `ListMusic`) serta *tooltip* informatif yang mencerminkan pilihan aktif dari Admin Panel.
- **Normalisasi Data Backend**: Penanganan fallback otomatis untuk struktur `weddingConfig.music` agar konfigurasi mode dan playlist selalu tersimpan dan termuat secara utuh dari basis data MySQL.

### 🦅 Tema Dayak Kenyah Borneo & ⚡ Cyberpunk 2077 Night City (v1.36.0)
- **Total 20 Tema Siap Pakai**: Menembus 20 variasi tema pernikahan digital yang kaya budaya adat Nusantara dan konsep modern futuristik.
- **Dayak Kenyah Borneo (`id: dayak`)**: Nuansa agung adat Dayak Kenyah Kalimantan dengan perisai sakral Talawang, bulu burung Enggang yang melayang lembut, sulur naga Aso Kenyah, serta petikan harmoni magis alat musik dawai Sape' dan denting gong tradisi via Web Audio API.
- **Cyberpunk 2077 Neo-Jakarta (`id: cyberpunk`)**: Konsep futuristik sci-fi Night City berhias sirkuit neon cyan & magenta, HUD biometrik kuantum cinta (*100% Neural Sync*), efek audio hologram boot glitch, dan denting laser synth masa depan.

### 📲 Asisten Broadcast & Pengingat WhatsApp (Queue Runner) (v1.36.0)
- **Modal Interaktif Antrean Tamu (Queue Runner)**: Mengirimkan link undangan personal dan pengingat kehadiran 1-klik ke nomor WhatsApp para tamu dengan alur antrean otomatis (*Next Tamu*).
- **4 Pilihan Template Siap Kirim**:
  - *Undangan Resmi*: Format formal akad & resepsi lengkap dengan tautan personal.
  - *Pengingat H-3*: Pengingat konfirmasi kehadiran RSVP agar katering dan meja tertata presisi.
  - *Pengingat H-1*: Pengingat hari menjelang pernikahan beserta link peta Google Maps & panduan lokasi.
  - *Template Kustom*: Fleksibel disesuaikan dengan variabel `{nama}`, `{mempelai}`, `{tanggal}`, `{venue}`, `{link}`.
- **Otomatisasi Status Database**: Menandai tamu sebagai `Sudah Terkirim` secara otomatis pada basis data MySQL begitu tombol kirim WhatsApp diklik.

### 🎙️ Audio Guestbook / Voice Memo Wishes (v1.36.0)
- **Perekaman Suara Klien Tanpa Biaya Server (*Zero Storage Cost*)**: Tamu dapat merekam pesan suara selamat dan doa restu hingga 20 detik langsung dari browser menggunakan MediaRecorder API.
- **Kompresi Audio Base64 WebM/Opus**: Disimpan langsung ke dalam basis data MySQL (~40-60KB) tanpa memerlukan penyimpanan cloud berbayar.
- **Waveform Audio Player Interaktif**: Pemutar audio terintegrasi pada Dinding Ucapan tamu dan Layar Panggung Proyektor (*Live Wishes Projector*) lengkap dengan animasi gelombang suara (*soundwave*).

### 🌺 Ornamen & Estetika Budaya Betawi
- **Ilustrasi Khas Betawi**: Menghadirkan siluet Monumen Nasional (Monas), ornamen Rumah Kebaya, serta animasi karakter Ondel-ondel Betawi yang anggun.
- **Palet Warna Tematik**: Kombinasi warna *Sage Green*, *Betawi Red*, *Gold Accent*, dan *Ivory White* yang modern, hangat, dan berkelas.
- **Elemen Flora Mengambang**: Animasi dedaunan dan bunga yang bergerak lembut menggunakan CSS keyframes untuk memperkuat kesan natural.

### ✉️ Sampul Digital Interaktif (Opening Cover)
- Kartu undangan awal dengan amplop digital elegan yang menyapa nama tamu secara personal.
- Tombol *"Buka Undangan"* yang memicu animasi transisi mulus serta memulai pemutaran audio latar secara otomatis.

### ⏱️ Live Countdown Timer
- Penghitung mundur waktu otomatis (*Hari, Jam, Menit, Detik*) yang disinkronkan langsung dengan waktu target akad nikah.

### 📖 Kisah Cinta (Love Story)
- Garis waktu (*timeline*) bertahap yang menceritakan momen pertemuan pertama, perjalanan hubungan, proses lamaran, hingga jenjang pernikahan.

### 📍 Integrasi Peta Lokasi
- Informasi alamat lengkap gedung/masjid dengan tombol tautan langsung yang membuka navigasi Google Maps pada aplikasi seluler tamu.

### 💳 Amplop Digital (Multi-Bank & QRIS)
- Dukungan penambahan banyak rekening bank (BCA, Mandiri, BRI, BNI, e-Wallet).
- Fitur **"Salin Nomor Rekening"** dengan notifikasi tersalin instan.
- Dukungan gambar kode QRIS untuk mempermudah transfer dompet digital secara cepat.

### 📝 RSVP & Dinding Ucapan Real-Time
- Formulir konfirmasi kehadiran yang interaktif.
- Dinding ucapan doa restu yang terhubung dengan WebSocket Socket.io dan REST API MySQL, sehingga ucapan baru langsung muncul seketika tanpa perlu memuat ulang halaman (*zero reload*).

### 🎵 Pemutar Musik Latar Fleksibel
- Komponen audio mengambang dengan tombol *mute/unmute*.
- Mendukung pemutaran dari URL **YouTube Playlist** maupun file audio **Google Drive** secara otomatis.
- 4 Mode pemutaran: *Repeat All*, *Repeat One*, *Shuffle*, dan *Linear*.

### 📱 Navigasi Cepat (Floating Bottom Bar)
- Menu navigasi bawah mengambang dengan indikator *ScrollSpy* yang mendeteksi seksi yang sedang aktif secara otomatis.

### 👑 Tema Sundanese Royal Maroon (Adat Sunda Beludru Maroon & Aksen Emas) (v1.40.0)
- **Konsep Ningrat Beludru Maroon & Siger Sunda Emas**:
  - Varian tema adat Sunda kedua yang mengusung palet warna mewah merah maroon ningrat (`#7B1122`, `#800020`, `#3D0B0F`), menggantikan seluruh palet hijau tanpa mengubah kemewahan aksen emas berkilau (`#D4AF37`, `#F5E6A3`, `#E6D5B8`).
  - Dilengkapi ornamen mahkota Siger Sunda 7 pucuk kembang tanjung dengan batu permata delima merah (*ruby stone accents*).
- **Adaptasi Bahasa Indonesia yang Santun & Elegan**:
  - Judul sampul dan pembuka: Menggunakan bahasa universal `THE WEDDING CELEBRATION` berpadu aksen emas `Wilujeng Sumping`.
  - Teks label tamu: Menggunakan format formal bahasa Indonesia `Kepada Yth. Bapak/Ibu/Saudara/i:` (menggantikan teks lokal Parahyangan).
  - Tombol aksi sampul: `Buka Undangan` dengan ikon amplop emas `<MailOpen />`.
  - Sambutan dan pengantar: Pembuka formal bahasa Indonesia dengan salam `Sampurasun • Wilujeng Sumping` serta permohonan rahmat dan ridho Allah SWT.
  - Profil mempelai: Label `Mempelai Pria` dan `Mempelai Wanita` dengan penghubung ampersand elegan `&`.
  - Doa penutup: Salam formal `Hatur Nuhun • Terima Kasih` yang memadukan kesantunan adat Priangan dengan bahasa Indonesia resmi.
- **Suite Aset Luring Mandiri & Animasi Tematik**:
  - Paket aset lokal SVG vektor mandiri di `public/assets/themes/sunda_maroon/`: `thumbnail.svg`, `pattern.svg`, dan `favicon.svg`.
  - Dekorasi animasi: `FloatingJasmineRonce` (kelopak ronce melati putih suci dan serpihan emas melayang) serta `AnimatedSundaneseFiligree` pada sudut bingkai `AppFrame`.

### 🎨 Katalog Tema & Desain Undangan Lengkap (Suite 35 Tema: 21 Siap Pakai & 14 Segera Hadir) (v1.40.0)
- **Ekspansi Katalog Tema Menjadi 34 Tema**:
  Menyajikan kurasi 14 tema baru berstatus *"Segera Hadir"* dengan visual thumbnail SVG vektor mandiri luring (*zero external CDN dependencies*), palet warna tematik 4-titik, daftar fitur unggulan, dan kartu katalog interaktif:
  - **Adat Nusantara (+5 Tema Baru, Total 14 Adat)**:
    - `aceh`: **Aceh Serambi Mekkah** — Pinto Aceh & Rencong Meukuta Alam, mahkota Kupiah Meukeutop keemasan, dan sulur Awan Siweueh.
    - `banjar`: **Banjar Baamar Galung Pancar Matahari** — Mahkota Baamar Galung keemasan, ronce melati bogam, kilau intan Martapura, dan Rumah Bubungan Tinggi.
    - `melayu`: **Melayu Riau Teluk Belanga** — Tenun songket Siak benang emas, ornamen atap Selembayung, tepak sirih persembahan, dan kuning diraja.
    - `sasak`: **Sasak Lombok Bale Tani** — Kain tenun ikat Subahnale khas Sade, lumbung tradisional Bale Tani, dan siluet agung Gunung Rinjani.
    - `papua`: **Papua Cenderawasih Paradise** — Mahkota bulu burung surga Cenderawasih, ukiran kayu Asmat magis, noken, dan zamrud Raja Ampat.
  - **Modern & Pop Culture (+5 Tema Baru, Total 15 Modern)**:
    - `cinema`: **IMAX Cinema Premiere & Movie Ticket** — Tiket gala premiere barcode robek, sorotan spotlight premiere, dan popcorn retro.
    - `airline`: **First-Class Boarding Pass & Aviation** — Format boarding pass penerbangan first-class, stempel visa romantis, dan flight radar map track.
    - `anime`: **Romantic Anime & Manga Panel** — Estetika manga & anime Jepang, kelopak bunga sakura gugur perlahan, dan langit senja komet Makoto Shinkai.
    - `glassmorphism`: **Glassmorphism Aurora Hologram** — Lapisan frosted glass tembus pandang, pembiasan cahaya prisma pelangi aurora borealis.
    - `synthwave`: **Retro 80s Synthwave & Neon Sunset** — Horizon wireframe perspektif 3D, matahari terbenam neon bergaris horizontal, dan palem neon synth.
  - **Syar'i / Islami (+4 Tema Baru, Total 5 Islami)**:
    - `ottoman`: **Ottoman Empire Istanbul Grandeur** — Keramik Iznik biru pirus, kaligrafi Thuluth emas, kubah Hagia Sophia, dan bulan sabit kembar.
    - `moroccan`: **Moroccan Riad & Zellige Mosaic** — Lantai mozaik geometris Zellige terakota, lengkungan tapal kuda Moorish, dan lentera Marrakech.
    - `andalusia`: **Al-Andalus Granada Alhambra** — Relief plafon Muqarnas, air mancur marmer Generalife Alhambra, dan daun zaitun keemasan.
    - `nabawi`: **Madinah Nabawi Serenity** — Siluet Kubah Hijau (Green Dome), pilar marmer putih Rawdah berbalut emas, dan payung hidrolik mekar.
- **Standar Aset Luring Mandiri (Pilar 2 AGENTS.md)**:
  Setiap tema baru dibekali paket aset SVG vektor lokal mandiri di `public/assets/themes/{id}/` (`thumbnail.svg`, `pattern.svg`, `favicon.svg`) tanpa ketergantungan jaringan eksternal.
- **Integrasi ThemeSelector di Admin Panel (`/modules`)**:
  Kartu tema berstatus *"Segera Hadir"* otomatis menampilkan badge status jam, menonaktifkan tombol aktivasi, dan menyembunyikan pratinjau live agar pengalaman pengguna tetap konsisten.

### 🖼️ Sistem Multi-Layout Galeri Bahagia & Visual Selector (v1.38.0)
- **4 Variasi Konsep Tata Letak Galeri Pilihan Pengantin**:
  - **Editorial Asymmetric (`editorial`)**: Susunan dinamis bergaya majalah (*magazine rhythm*) yang berulang secara ritmis (1 foto portrait aspect 4/5, 2 foto kotak aspect 1:1, dan 1 foto landscape aspect 3/2) dengan dukungan jumlah foto tanpa batas (*infinite loop pattern*).
  - **Modern Masonry (`masonry`)**: Grid 2 kolom bertingkat (*Pinterest-style*) yang mempertahankan aspek rasio asli foto tanpa terpotong (*aspect-ratio preservation*), lengkap dengan animasi *staggered entrance*.
  - **Interactive Carousel / 3D Slider (`carousel`)**: Slider horizontal interaktif *swipeable* dengan kartu aktif membesar (*scale-up*), indikator titik navigasi (*dots*) adaptif warna tema, tombol panah prev/next, dan deretan *thumbnail strip* di bagian bawah.
  - **Polaroid Stack (`polaroid`)**: Tampilan kartu foto polaroid putih dengan bayangan lembut realistis, efek rotasi kemiringan acak halus (-2° s/d +2°), hiasan pita perekat (*washi tape*), dan nomor urut momen manis.
- **Visual Card Selector di Admin Panel (`/modules`)**:
  - Sub-tab "Galeri Foto" dilengkapi 4 kartu pemilih layout dengan ilustrasi mini-wireframe visual, badge kategori (*Default Populer, Rekomendasi, Interaktif, Artistik*), dan deskripsi karakteristik masing-masing gaya.
  - Sinkronisasi instan ke state `formData.galleryLayout` dan tersimpan permanen ke basis data MySQL.
- **Universal Fullscreen Lightbox**:
  - Setiap foto pada seluruh 4 pilihan layout dapat diklik untuk membuka modal Lightbox resolusi tinggi dengan navigasi Next/Prev, dukungan keyboard (*Escape, Left/Right Arrow*), tombol tutup cepat, dan penghitung nomor foto aktif.
- **Thematic Adaptive Styling**:
  - Indikator dot slider, border radius, bayangan kartu, dan kontras otomatis menyesuaikan token tema aktif dari 34 tema dalam katalog.

### 🎫 Digital Pass & E-Ticket PDF Export Suite (v1.37.0)
- **Ultra-Sharp High-Density Rendering (1200x1850 px, 300 DPI Equivalent)**:
  - Generator canvas murni di sisi klien dengan kartu pass digital bertekstur modern, ambient glow tematik, monogram inisial mempelai emas, perforated dashed cutouts, dynamic name auto-scaling, badge meja seating & kuota pax, barcode watermark, serta QR code kontras tinggi.
- **Dual Export Formats (PNG HD & PDF Print-Ready via `jsPDF`)**:
  - Unduhan instan format gambar PNG resolusi tinggi untuk disimpan di galeri smartphone atau dibagikan via WhatsApp.
  - Dokumen PDF A6 Portrait *print-ready* tanpa margin berlebih via `jspdf`, siap dicetak oleh panitia, vendor EO, atau tamu.
- **Dual-Sided Access (Sisi Tamu & Sisi Admin)**:
  - **Sisi Tamu (`GuestQRPassModal`)**: Tersedia tombol ganda *"Simpan Gambar HD (PNG)"* dan *"Unduh Tiket PDF (Siap Cetak)"* langsung pada pop-up tiket digital tamu.
  - **Sisi Admin Panel (`Panel.tsx`)**: Tersedia tombol unduh PNG & PDF pada generator tautan tamu personal serta tombol aksi tabel icon-only di setiap baris daftar tamu undangan.
  - **Sisi Meja Resepsi (`ReceptionCheckin.tsx`)**: Akses unduh tiket pass instan dari daftar hasil pencarian cepat manual maupun dari tabel riwayat check-in untuk melayani tamu yang memerlukan slip fisik di lokasi acara.
- **Thematic Adaptive Styling**:
  - Secara cerdas mengadaptasi token warna primer (`tokens.primary`), latar belakang kartu, dan teks sesuai tema desain aktif (dari total 34 tema katalog).

### 📺 Live Wishes Stage Projector Screen (Layar LED Panggung Hari-H) (v1.18.0)
- **Akses Mandiri Standalone**: Dapat dibuka melalui URL publik `/live` atau `/projector` tanpa memerlukan otentikasi login, serta tombol jalan pintas langsung dari Admin Panel (`/modules`).
- **Tata Letak Sinematik Split Stage 16:9**:
  - **Panel Kiri (35%)**: Monogram emas inisial kedua mempelai beranimasi elegan, nama lengkap mempelai, tanggal akad/resepsi & nama gedung ballroom, *Live Counter* jumlah ucapan masuk, serta **QR Code Interaktif** berukuran besar yang dapat langsung dipindai oleh para tamu dari meja mereka untuk membuka formulir ucapan doa.
  - **Panel Aliran Kanan (65%)**: Aliran kartu ucapan mewah berlatar gelap malam (*Midnight Slate & Emerald*) dengan tipografi aksen emas bercahaya.
- **Spotlight Celebration Pop-Up & Efek Konfeti**:
  - Setiap kali ada ucapan baru yang masuk via siaran Socket.io, layar proyektor otomatis menampilkan pop-up modal selebrasi *Spotlight* dengan animasi partikel emas/konfeti berkilau selama 6,5 detik sebelum meluncur anggun ke posisi teratas daftar ucapan.
- **Harmonic Audio Chime (Web Audio API Synthesizer)**:
  - Nada lonceng akor harmonis C5-E5-G5-C6 dengan peluruhan nada alami berdurasi 2,4 detik tanpa perlu aset file audio eksternal (*zero external network download*).
- **Auto-Cycling Carousel & Kontrol Operator Mengambang**:
  - Jika tidak ada ucapan baru, daftar ucapan bergulir otomatis per halaman (*carousel*) secara halus.
  - Operator panggung dapat mengontrol kecepatan transisi (Cepat 4s, Normal 7s, Lambat 10s, Jeda), tombol *Fullscreen* (F11), dan tombol *Mute/Unmute* nada audio melalui bilah kontrol bawah mengambang yang otomatis bersembunyi setelah 3,5 detik kursor tidak bergerak.

### 📅 Sinkronisasi Kalender 1-Klik (Google Calendar & Apple iCal .ics) (v1.22.0)
- **Modal Dialog Interaktif Multi-Kalender**: Tombol *"Simpan ke Kalender"* pada setiap kartu acara (Akad & Resepsi) membuka pop-up pilihan aplikasi kalender favorit tamu undangan.
- **Sinkronisasi Google Calendar**: Tautan langsung template Google Calendar dengan tanggal mulai & selesai yang terstruktur dalam format UTC ISO.
- **Dukungan Apple Calendar / iCal (`.ics`)**: Unduhan file iCalendar RFC 5545 standar yang langsung dikenali dan diimpor otomatis oleh perangkat Apple (iPhone, iPad, Mac) serta Microsoft Outlook.
- **Alarm Pengingat Otomatis Ganda (Double Reminder)**:
  - Notifikasi **H-1 Acara** (`-P1D`): Pengingat persiapan satu hari menjelang hari pernikahan.
  - Notifikasi **1 Jam Sebelum Acara** (`-PT1H`): Pengingat keberangkatan menuju venue akad / resepsi.
- **Integrasi Google Maps**: Tautan rute peta lokasi venue yang disematkan langsung di dalam deskripsi acara kalender dan tombol aksi navigasi cepat.

### 💰 Wedding Budget & Checklist Vendor Tracker (v1.21.0)
- **Dasbor Finansial Real-Time**: 4 Kartu KPI finansial: Target Anggaran, Kontrak Aktual, Terbayar/DP, dan Sisa Tagihan Pelunasan yang tersinkronisasi langsung via basis data MySQL.
- **Kalkulasi Selisih & Efisiensi Otomatis**: Mendeteksi otomatis apakah kontrak berada di bawah anggaran (*hemat*) atau melebihi estimasi rencana (*over-budget*).
- **Progress Bar Realisasi**: Indikator visual persentase pelunasan anggaran dan counter rasio kesiapan logistik hari-H.
- **Manajemen Vendor & 1-Klik Chat WhatsApp**: Integrasi kontak nomor WhatsApp vendor yang otomatis membuka obrolan chat perorangan dengan format internasional `wa.me/62...`.
- **10 Template Pos Anggaran Nusantara (1-Klik)**: Pemuatan instan 10 pos biaya pernikahan adat Nusantara (Sewa Venue, Katering, MUA/Busana, Dekorasi, Foto & Video Sinematik, Sound & MC, Souvenir & Undangan, Cincin Kawin & Mahar, Tenda & Genset, Seserahan & Perlengkapan Adat).
- **Checklist Kesiapan Logistik Hari-H**: Tombol centang 1-klik untuk memantau status persiapan vendor dan barang bawaan.
- **Ekspor Rekapitulasi CSV (UTF-8 BOM)**: Unduh seluruh data finansial dan status vendor ke file spreadsheet untuk pelaporan bendahara dan keluarga.
- **Redesain Estetika Light Theme Selaras Admin Panel (v1.22.1)**: Mengadopsi palet warna *warm light* terpadu (`bg-[#fcfaf7]`), kartu putih dengan aksen *sage green* & *warm gold*, badge kategori pastel lembut, tipografi berkejelasan tinggi, tabel data bersih dengan efek *hover*, serta modal form dan konfirmasi SweetAlert2 bernuansa terang elegan.

### 🪄 Floating Feature Hub (Show/Hide Speed Dial) (v1.29.1)
- **Pengelompokan Fitur Interaktif Terpadu**: Mengeliminasi tombol terapung yang tersebar di layar dengan menyatukan tombol **Photo Booth**, **Wedding Trivia Mini Game**, dan **E-Ticket QR Pass** ke dalam 1 tombol pemicu (*Floating Speed Dial*) di kiri bawah.
- **Layar Bersih & Rapi (*Collapsed by Default*)**: Saat pertama kali dibuka, layar mobile hanya menampilkan 1 tombol pemicu di sisi kiri bawah berhias lencana kilau (*sparkle ping*) halus, dan 1 tombol pemutar musik (*Music Player*) di sisi kanan bawah.
- **Mekanisme Show / Hide Interaktif**:
  - Tombol trigger berganti dari ikon `Sparkles` menjadi ikon `X` untuk menutup menu.
  - Ketiga tombol fitur mekar meluncur ke atas (*vertical stagger animation*) lengkap dengan tombol ikon bulat dan pil label keterangan teks:
    - 📷 **Photo Booth** (*"Photo Booth • BARU • Cetak Photostrip HD"*)
    - 🎮 **Mini Game Trivia** (*"Mini Game Trivia • GAME • Kuis Seru Mempelai"*)
    - 🎟️ **E-Ticket QR Pass** (*"E-Ticket QR Pass • TIKET • Check-in Resepsi"*)
- **Backdrop Catcher & Click Outside**: Latar belakang menggelap halus dengan efek blur ringan (`backdrop-blur-[2px]`) yang otomatis menutup menu saat area luar diketuk.
- **Isolasi Pemutar Musik Latar**: Tombol musik di sisi kanan bawah tetap mandiri dan terpisah dari menu fitur tamu.

### 📸 Digital Photo Booth & Guest Photostrip Generator (v1.29.0)
- **Wedding Virtual Photobooth Tamu**: Pengalaman photobooth digital interaktif langsung di smartphone tamu undangan tanpa perlu aplikasi tambahan.
- **Format Layout Fleksibel Ganda**:
  - **3-Pose Photostrip (Korean Self-Photo Studio)**: 3 slot foto berurutan secara vertikal (resolusi tinggi 600x1800 px) dengan margin studio profesional dan footer nama mempelai.
  - **Single Polaroid Frame**: Format kotak klasik (resolusi 800x1000 px) berbingkai polaroid dengan catatan cinta dan tanggal pernikahan.
- **Metode Pengambilan Foto Ganda**:
  - **Kamera Langsung (Live Selfie Camera)**: Streaming HTML5 video responsif dengan dukungan kamera depan/belakang (*user* vs *environment*).
  - **Timer Hitung Mundur Ritmik 3 Detik**: Overlay hitung mundur interaktif (3.. 2.. 1.. 📸) dengan efek lampu kilat studio putih (*white shutter flash*) dan synthesizer audio mekanik kamera.
  - **Unggah dari Galeri Perangkat**: Alternatif bagi tamu yang ingin memilih foto terbaik yang telah tersimpan di galeri ponsel.
- **Multitemplat Desain Bingkai**:
  - **Theme-Matched Frame**: Otomatis mengadaptasi warna latar belakang, border, dan aksen tipografi dari tema undangan yang sedang aktif (Betawi, Jawa, Sunda, Minang, Bali, Modern, Rustic, Oriental, Netflix, Spotify).
  - **Classic Black Studio**: Nuansa gelap premium (`#121214`) dengan aksen teks emas murni (`#D4AF37`).
  - **Clean White Studio**: Nuansa putih bersih (`#FFFFFF`) minimalis modern dengan aksen charcoal.
  - **Soft Romantic Pastel**: Nuansa blush pink lembut (`#FDF2F4`) dengan tipografi rose burgundy (`#881337`).
- **Filter Foto Artistik Real-Time**:
  - **Natural**: Tampilan warna asli foto berdefinisi tinggi.
  - **B&W Vintage**: Monokrom hitam-putih artistik dengan kontras terangkat.
  - **Sepia Retro**: Nuansa hangat bernostalgia ala film analog tempo dulu.
  - **Warm Glow**: Pancaran keemasan lembut (*warm bloom*) untuk foto romantis.
- **Engine Sintesis Canvas API & 1-Click HD Download**:
  - Seluruh penggabungan foto, filter warna, border ganda, stempel pernikahan, dan nama mempelai dirender seketika di sisi klien (*Canvas API*).
  - Tombol **"Unduh Photostrip HD (PNG)"** mengunduh berkas gambar jernih secara instan ke galeri tamu dengan 100% privasi dan zero storage cost database (Pilar 2.3 & 3).
- **Aksesibilitas Terapung & Seksi Undangan**:
  - Tombol mengambang kamera terpadu (`PhotoBoothFloatingButton`) di kanan bawah atas tombol musik.
  - Kartu promosi seksi undangan (`PhotoBoothSection`) di bawah galeri pernikahan.

### 🎨 Semantic Theme Tokens & Full Theme Synchronization (v1.28.0)
- **Harmonisasi Antarmuka Menyeluruh Lintas 10 Tema**: Mengeliminasi seluruh kelas warna statis (*hardcoded* krem/sage Betawi) pada elemen terapung, bilah navigasi bawah, dan seksi konten bersama sehingga 100% beradaptasi secara dinamis terhadap tema aktif.
- **Arsitektur Semantic Theme Tokens (`ThemeVisualTokens`)**:
  - Pemetaan token lengkap per tema: `isDark`, `bg`, `cardBg`, `cardBorder`, `textPrimary`, `textMuted`, `primary`, `secondary`, `accent`, `inputBg`, `inputBorder`, `btnPrimaryBg`, `navBg`, `navBorder`, `navActive`, `floatingBtnBg`, `floatingBtnBorder`, dan `floatingBtnRing`.
  - Diinjeksi melalui context terpusat `ThemeProvider` dan custom hook `useThemeTokens()`.
- **Adaptasi Elemen Terapung (Floating Action Buttons)**:
  - Tombol Pemutar Musik (`MusicPlayer`), Tiket Masuk E-Pass QR (`GuestQRPassFloatingButton`), dan Gamepad Kuis (`TriviaFloatingButton`) mengadopsi gaya *sleek dark glass* beraksen tematik pada tema gelap (Netflix & Spotify) dan kaca elegan beraksen pada tema terang.
- **Bilah Navigasi Bawah Adaptif (`BottomNavigation`)**:
  - Menampilkan kontainer pil gelap dengan efek blur dan indikator aktif merah Netflix (`#E50914`) atau hijau neon Spotify (`#1DB954`) pada tema gelap, serta pil krem/putih beraksen emas/hijau ningrat pada tema adat Nusantara.
- **Seksi Bersama Adaptif (`shared/sections/`)**:
  - **Countdown Section**: Angka hitung mundur memancarkan warna aksen tema (merah Netflix, hijau neon Spotify, emas kraton Jawa) dengan kartu dan latar belakang yang menyatu sempurna.
  - **Location Section**: Kartu Google Maps, tombol peta, dan tombol denah meja beradaptasi kontras penuh.
  - **RSVP & Wishes Section**: Formulir konfirmasi kehadiran, input teks, tombol kirim, dan kartu ucapan doa bertransformasi sesuai palet tema tanpa merusak netralitas budaya layer `shared/`.
  - **Wedding Gift & Gallery**: Kartu rekening bank, pratinjau QRIS, tombol salin rekening, dan bingkai foto galeri selaras warna tema.
- **Bingkai Mockup Container Desktop Adaptif**:
  - Border mockup smartphone pada tampilan desktop otomatis berganti menjadi gelap elegan (`md:border-[#242424]`) pada tema gelap dan putih bersih pada tema terang, dengan latar desktop radial dots yang selaras.

### 🎮 Wedding Trivia Quiz & Mini Games ("Seberapa Kenal Kamu dengan Mempelai?") (v1.27.0)
- **Permainan Interaktif Smartphone Tamu**: Tamu undangan dapat menguji seberapa dalam mereka mengenal kedua mempelai melalui mini kuis seru berisi pertanyaan seputar pertemuan pertama, momen kencan lucu, hingga rahasia cinta kedua mempelai.
- **Synthesizer Efek Suara Web Audio API**:
  - Nada benar (*Correct Chime* arpeggio C6-G6) dan nada salah (*Wrong Buzz* F3-C3) instan saat memilih jawaban.
  - Terompet kemenangan (*Victory Fanfare* akor C5-E5-G5-C6 crescendo) saat kuis selesai (*zero external MP3 file*).
- **Lencana Predikat Juara & Confetti Burst**:
  - Skor 100%: 🏆 *Sahabat Sejati (Bestie Abadi)*
  - Skor 80%: 🌟 *Sahabat Dekat Pengantin*
  - Skor 60%: 💖 *Kolega Kompak & Suportif*
  - Skor <60%: 😄 *Yuk Ngobrol & Akrabin Lagi di Resepsi!*
- **Tantang Teman via WhatsApp**: Tombol bagikan ke WhatsApp dengan template pesan tantangan seru yang memuat skor, persentase, gelar juara, dan tautan undangan personal.
- **Papan Peringkat Real-Time (Live Leaderboard)**: Papan skor tamu real-time via REST API & basis data MySQL berhias medali emas 🥇, perak 🥈, dan perunggu 🥉.
- **Manajemen Bank Soal & Skor di Admin Panel (`/modules`)**:
  - 4 Kartu KPI: Total Soal Aktif, Tamu Bermain, Rata-Rata Skor, dan Skor Sempurna (100%).
  - Bank soal interaktif: tambah/ubah/hapus pertanyaan, kunci jawaban, dan ulasan fakta seru.
  - Tombol **"Muat 5 Soal Default Trivia"** (1-klik inisialisasi batch ke basis data MySQL).
  - Ekspor seluruh nilai kuis tamu ke CSV (UTF-8 BOM).
- **Aksesibilitas Ganda & Netral Budaya**: Tersedia via tombol mengambang gamepad (`TriviaFloatingButton`) dan kartu seksi undangan (`TriviaQuizSection`) yang kompatibel di seluruh 10 tema undangan aktif.

### 🎬 Tema Netflix Cinematic Premiere ("The Wedding Premiere") (v1.26.0)
- **Konsep Serial Streaming OTT Populer**: Mengadaptasi identitas visual bioskop streaming OTT global Netflix bertema gelap pekat (`#141414`) dengan aksen merah ikonis Netflix Red (`#E50914`), badge rating match 99%, dan kartu video sinematik.
- **Synthesizer Suara Intro "Ta-Dum!" (Web Audio API)**: Suara intro ikonis "Ta-Dum!" disintesis secara murni di sisi peramban menggunakan Web Audio API (kompresor dinamis, sub-bass segitiga D1/D2 frekuensi 36.7-73.4 Hz, dan kilau harmonik A6 1760 Hz) saat tombol sampul *"TONTON TRAILER & BUKA"* diklik tanpa ketergantungan file MP3 eksternal (*zero external audio file*).
- **Sampul Teaser Film & Tiket VIP Screening Pass**: Sampul pembuka bergaya poster rilis resmi dengan lencana *"TOP 1 IN MOVIES TODAY"*, rating *"99% Match"*, kartu undangan personal tamu *"VIP Screening Pass • Premiere Row"*, dan tombol play beranimasi denyut merah.
- **Hero Billboard & Rangkaian Rilis Episode**:
  - Banner billboard sinematik dengan status `99% Match • 2026 • SU • 4K ULTRA HD • ★5.0` dan tombol aksi cepat (*Daftar Saya, Beri Nilai, Bagikan, Pemeran*).
  - Seksi acara berformat Episode Serial Streaming: **Episode 1: "Akad Nikah: The Sacred Vow"** dan **Episode 2: "Resepsi: The Grand Celebration"** berdurasi menit & navigasi Google Maps.
- **Profil Bintang Utama & Produser (Cast & Crew)**: Penataan vertikal murni terpusat (*vertical stack flex-col*) yang bebas pemotongan (*anti-clipping*) pada kontainer mobile 430px dengan lencana *"LEAD ACTOR"* & *"LEAD ACTRESS"*, nama lengkap mempelai, silsilah keluarga, dan akun Instagram.
- **Garis Waktu Musim Cinta (Series Timeline & Seasons)**: Kilas balik perjalanan cinta mempelai disajikan dalam format musim serial (Season 1 s/d Finale) dengan status kartu interaktif.
- **Dekorasi Animasi Partikel Sinema**: Debu bintang dan partikel cahaya proyektor sinema beranimasi halus menggunakan `motion/react` dengan utilitas `pointer-events-none`.
- **Paket Aset Mandiri Offline**: Dilengkapi `thumbnail.svg`, `pattern.svg`, dan `favicon.svg` di `public/assets/themes/netflix/` (*zero external CDN dependency*).

### 🎵 Tema Spotify Interactive Edition ("Wedding Track & Love Playlist") (v1.25.0)
- **Konsep Viral Pemutar Musik Streaming**: Mengadaptasi antarmuka aplikasi pemutar musik global Spotify bertema gelap modern (`#121212`, `#181818`) dengan aksen neon hijau Spotify (`#1DB954`) dan emas berkilau.
- **Sampul Album Vinyl Berputar (Rotating Vinyl Cover)**: Sampul pembuka interaktif dengan piringan hitam vinyl beranimasi rotasi 360 derajat yang meluncur keluar dari jaket album pengantin, lengkap dengan alur gerigi (*vinyl grooves*) dan tombol hijau menyala *"BUKA & PUTAR UNDANGAN"*.
- **Lencana Verified Newlyweds & Statistik Bulanan**: Header profil artis mempelai dilengkapi lencana centang biru-hijau *"VERIFIED NEWLYWEDS"*, penghitung *"1,250 Monthly Guests"*, tombol suka beranimasi hati, dan bilah kontrol interaktif (*Shuffle, Play, Share, Options*).
- **Album Tracklist Kisah Cinta (Love Story)**: Perjalanan cinta kedua mempelai disajikan dalam tabel interaktif lagu pernikahan lengkap dengan nomor urut (`01`, `02`, dst.), durasi waktu menit:detik, ikon equalizer yang memantul, serta kartu akordeon deskripsi cerita.
- **Profil Artis Mempelai (Featured Artists)**: Penataan vertikal terpusat (*vertical stack flex-col*) yang bebas clipping pada kontainer mobile 430px, menampilkan foto lingkaran artis, nama lengkap, orang tua, dan tautan Instagram.
- **Dekorasi Animasi Partikel Nada Musik**: Hujan partikel not balok (♪, ♫, ♬, ♩) dan garis lengkung equalizer sudut beranimasi halus menggunakan `motion/react` dengan utilitas `pointer-events-none`.
- **Paket Aset Mandiri Offline**: Dilengkapi `thumbnail.svg`, `pattern.svg`, dan `favicon.svg` di `public/assets/themes/spotify/` (*zero external CDN dependency*).

### 🪑 Manajemen Meja & Seating Chart Ballroom (v1.24.0)
- **Denah Lantai Interaktif Ballroom (Floor Plan Layout)**: Visualisasi tata letak panggung pelaminan, meja VIP kehormatan, meja bundar keluarga besar & tamu umum, hingga area prasmanan/katering dengan zona terarah (*Depan, Tengah, Belakang, Samping Kiri, Samping Kanan*).
- **4 Kartu Indikator KPI Kapasitas**: Total Meja Aktif, Kapasitas Ballroom Keseluruhan, Kursi Terisi, dan Sisa Kursi Tersedia secara real-time tersinkronisasi via basis data MySQL tabel `seating_tables`.
- **12 Preset Meja Standar Ballroom (1-Klik)**: Tombol pemuatan instan 12 meja standar ballroom berkapasitas total 108 kursi (VIP Pengantin, Keluarga Pria & Wanita, VIP Pejabat, Kolega, dan Tamu Umum).
- **Drawer Alokasi Tamu & Kursi (Guest Assignment)**: Panel interaktif untuk menempatkan atau mencabut tamu undangan (`guests`) ke meja tertentu dengan deteksi kapasitas otomatis (*Sisa Kursi*).
- **Sinkronisasi Otomatis E-Ticket QR Pass & Meja Resepsi**:
  - Badge alokasi meja (`📍 Meja: VIP-01 (VIP Utama)`) otomatis tercetak pada QR pass digital tamu serta pada berkas gambar tiket PNG yang diunduh ke galeri ponsel.
  - Pemindai QR Meja Resepsi (`ReceptionCheckin`) otomatis menampilkan nama dan zona meja tamu saat check-in tanpa input manual.
- **Pencarian Mandiri Tamu (Self-Service Lookup)**: Tamu undangan dapat mencari nomor dan denah mejanya secara mandiri lewat tombol *"Cari Meja & Denah Anda"* di seksi Lokasi.
- **Ekspor Rekapitulasi Seating Chart CSV**: Unduh denah dan alokasi meja ke format spreadsheet CSV UTF-8 BOM untuk koordinasi tim *event organizer* (EO) dan *usher*.

### ⛰️ Tema Batak Toba Royal Gorga (Unjuk Adat Bolon Batak Toba) (v1.23.0)
- **Kemegahan Seni Ukir Gorga & Ruma Bolon**: Menghadirkan siluet atap pelana melengkung Ruma Bolon dengan puncak tanduk kerbau (*simatutu*), ukiran suci Gorga Simeol-meol, Gorga Boraspati, dan fasad *dorpi*.
- **Palet Kosmis Tolu Bolit**: Perpaduan sakral tiga warna adat Batak Toba (Merah Marun Bara Gorga `#7A1B1E`, Hitam Arang Batu Ruma `#1C1917`, dan Putih Gading Sihapor `#FAF6F0`) berpadu dengan aksen kemewahan Emas Antik Tenun Ulos (`#D4AF37`).
- **Salam Tradisional & Falsafah Luhur**: Salam sakral *"Horas Jala Gabe!"*, falsafah luhur adat Batak (*"Aek godang tu aek laut, Dos ni roha sibaen na saut"*), serta doa berkat pernikahan dan permohonan restu para kerabat, Hula-hula, Dongan Tubu, Boru, dan sahabat.
- **Profil Mempelai Pangoli & Oroan**: Penandaan adat mempelai pria (*Pangoli*) dan mempelai wanita (*Oroan*) berbingkai ukiran ganda Ulos & Gorga.
- **Partikel Dekorasi Melayang Tematik**: Serpihan benang emas tenun Ulos Sadum dan daun sirih adat (*demban*) yang melayang lembut dengan rotasi alami menggunakan `motion/react` berutilitas `pointer-events-none`.
- **Penutup Adat Horas**: Salam penutup *"Mauliate Godang"* dan doa berkat *"Horas, Horas, Horas ma di hita sasudena!"*.
- **Paket Aset Mandiri Offline**: Dilengkapi `thumbnail.svg`, `pattern.svg`, dan `favicon.svg` di `public/assets/themes/batak/` (*zero external CDN dependency*).

### 🛕 Tema Balinese Royal Temple (Adat Pawiwahan Ageng Bali) (v1.20.0)
- **Kemegahan Pura & Arsitektur Tradisional Bali**: Menghadirkan siluet Gapura Candi Bentar bertingkat, payung Tedung Agung upacara kembar, penjor emas melengkung, serta motif relief ukiran Patra Punggel.
- **Salam Tradisional & Sloka Rgveda**: Pembuka salam sakral *"Om Swastyastu"* berlatar piringan surya mandala emas, serta kutipan suci pernikahan Hindu Dharma (*Rgveda Mandala X Sukta 85 Sloka 42*) yang sarat berkah keharmonisan keluarga (*Grhastha Ashrama*).
- **Profil Mempelai Purusha & Pradana**: Penandaan mempelai pria (*Purusha*) dan mempelai wanita (*Pradana*) berbingkai relief batu padas Bali mewah.
- **Bunga Kamboja / Jepun Melayang**: Partikel kelopak Bunga Jepun kuning-putih harum yang melayang lembut dengan rotasi alami menggunakan `motion/react` berutilitas `pointer-events-none`.
- **Penutup Penuh Doa**: Doa penutup *"Matur Suksma"* dan mantram kedamaian abadi *"Om Shanti Shanti Shanti Om"*.
- **Paket Aset Mandiri Offline**: Dilengkapi `thumbnail.svg`, `pattern.svg`, dan `favicon.svg` di `public/assets/themes/bali/` (*zero external CDN dependency*).

### ⚡ Optimasi Performa & Vite Code-Splitting Modular (v1.19.0)
- **Pengurangan Ukuran Entry Point Hingga 97%**: Entry bundle publik berkurang drastis dari **1.82 MB** menjadi hanya **56 KB** (19 KB gzip) melalui partisi cerdas *Rollup manualChunks* dan *asynchronous lazy-loading*.
- **Route Lazy-Loading (React.lazy & Suspense)**:
  - Modul Dasbor Admin Panel (`/modules` & `/login`) berukuran 171 KB diisolasi secara asinkron sehingga tidak pernah diunduh oleh tamu undangan umum.
  - Modul Layar Proyektor Panggung (`/live` & `/projector`) berukuran 15 KB diisolasi secara mandiri.
- **On-Demand Dynamic Imports Pustaka Berat**:
  - Pustaka spreadsheet **XLSX / SheetJS** (~430 KB) hanya diunduh oleh peramban jika pengantin memilih untuk mengunggah berkas `.xlsx/.xls` pada modal import tamu WhatsApp.
  - Pustaka **jsQR & QRCode Canvas** (~156 KB) hanya diunduh saat kamera pemindai resepsi aktif atau saat tamu membuka kartu E-Pass.
- **Isolasi Dynamic Multi-Theme**:
  - Komponen visual dan ornamen dekorasi dari 6 tema Nusantara dipecah menjadi chunk mandiri (0.8 KB - 14 KB). Tamu yang membuka tema tertentu hanya mengunduh aset tema tersebut, mengeliminasi pengunduhan berlebih dari 5 tema lainnya.
- **Zero Chunk Size Warnings**: Lulus kompilasi produksi Vite tanpa peringatan bundle berukuran melebihi batas 500 KB / 600 KB.

### 🔐 Panel Modules Responsif & Standar UI/UX Interaktif (v1.9.0)
- **Arsitektur Dashboard Modern**: Tata letak modular di `/modules` dengan Sidebar desktop (expand/collapse), Mobile Slide-over Drawer (hamburger toggle), Topbar dengan breadcrumb navigasi dinamis, dan tombol pintas Live Preview.
- **Menu 1: Dashboard Overview (Ringkasan Real-Time)**:
  - Banner hitung mundur hari-H pernikahan interaktif.
  - 4 Kartu KPI Ringkasan: Total Hadir, Total Tidak Hadir, Total Respon, dan Total Doa.
  - Rasio Kehadiran visual (*Progress Bar* persentase Hadir vs Tidak Hadir).
  - Tombol jalan pintas cepat (*Quick Action Shortcuts*: WhatsApp Generator, Meja Resepsi QR Pass, Layar Panggung Live Proyektor, Ubah Konten, Ekspor RSVP).
  - Feed aktivitas interaksi terbaru (*Live Recent Feeds* untuk RSVP & Doa Tamu).
- **Menu 2: Meja Resepsi & Scanner QR Pass Hari-H (v1.17.0)**:
  - **Pemindai Kamera Langsung**: Pemindai kamera performa tinggi murni sisi klien via `jsQR` dengan animasi laser pemindai, tombol sakelar on/off hemat baterai, dan toggle kamera depan/belakang.
  - **Synthesizer Umpan Balik Audio (Web Audio API)**: Nada *beep* harmonis 880Hz saat pindai sukses dan nada peringatan ganda jika tamu terdeteksi sudah pernah check-in sebelumnya (*zero external audio file*).
  - **Deteksi Anti-Duplikasi Pintar**: Mencegah kecurangan klaim suvenir ganda atau check-in dobel dengan menampilkan riwayat jam check-in sebelumnya.
  - **Pencarian In-Memory & Check-In Manual**: Opsi pencarian cepat nama/nomor tamu jika tamu kehabisan baterai ponsel atau tidak membawa QR pass, lengkap dengan tombol check-in manual 1-klik.
  - **Modal Konfirmasi Check-In Tamu**: Penyesuaian jumlah pax aktual yang hadir (+/- stepper), tombol sakelar penyerahan paket suvenir, dan pencatatan zona/nomor meja tamu.
  - **4 Kartu KPI Real-Time Meja Resepsi**: Tamu Check-In, Total Pax Fisik Hadir, Suvenir Diberikan, dan Estimasi Tamu Belum Hadir.
  - **Riwayat Kedatangan & Ekspor CSV**: Tabel log kedatangan berpenomoran otomatis 1-indexed (`#`), pencarian log instan, dan tombol unduh rekap CSV berformat UTF-8 BOM untuk pelaporan pasca acara.
  - **Tiket Digital Tamu (E-Ticket & QR Pass)**: Tombol tiket mengambang dan tombol seksi RSVP pada sisi tamu yang menampilkan kartu tiket mewah berornamen emas, kode tiket unik, jumlah pax, QR Code resolusi tinggi, serta fitur unduh tiket langsung sebagai gambar PNG ke galeri ponsel via Canvas API.
- **Menu 3: Generator & Manajemen Tamu WhatsApp (Import & Bulk Management)**:
  - **Dukungan Multi-Format Impor**: Mengimpor ratusan tamu sekaligus dari file **Excel (.xlsx, .xls)**, file **CSV (.csv, .txt)**, maupun **Salin-Tempel Teks Multiline**.
  - **Sinkronisasi Basis Data MySQL (`guests`)**: Data daftar tamu dan status pengiriman pesan tersimpan permanen di basis data MySQL sehingga pengantin dapat mengimpor via laptop dan mengirim pesan via smartphone.
  - **Direct WhatsApp Blasting**: Tombol kirim pesan 1-klik yang otomatis membuka chat WhatsApp langsung ke nomor tujuan (dengan sanitasi format internasional `628...`) dan mengubah status menjadi *Sudah Dikirim*.
  - **Statistik & Filter Pengiriman**: 3 Kartu indikator (Total Tamu, Belum Dikirim, Sudah Dikirim), filter status dinamis, dan live in-memory search.
  - **Unduh Template CSV**: Format berkas spreadsheet standar yang siap diisi dan diunggah ulang.
  - **Mode Cepat (Generator Tunggal)**: Opsi pembuatan link personal dadakan untuk satu nama tamu secara instan.
- **Menu 4: Manajemen Konten Terpartisi (Sub-Tabs)**: 
  - Tab pill rapi untuk Tema Desain, Mempelai, Acara & Lokasi, Galeri Foto, Kisah Cinta, Musik & Hadiah/QRIS, serta SEO & Metadata dengan bilah simpan melayang (*sticky action bar*).
  - **Arsitektur Multi-Tema & Separasi Budaya Terisolasi (v1.16.0)**:
    - *Isolasi Ornamen Budaya 100%*: Seksi visual budaya (Hero, Intro, Profil Mempelai, Penutup) diisolasi penuh per tema tanpa pencemaran silang.
    - *20 Tema Siap Pakai (Ready)*:
      - **Adat Nusantara (10 Tema)**:
        - `betawi`: **Betawi Heritage** — Gigi Balang, Ondel-ondel siluet, Rumah Kebaya.
        - `jawa`: **Javanese Royal Kraton** — Gunungan Wayang Mas sakral, Serat Ulem Pawiwahan Ageng.
        - `sunda`: **Sundanese Parahyangan** — Mahkota Siger Sunda, ronce melati, gerbang bambu Priangan.
        - `minang`: **Minangkabau Royal Songket** — Rumah Gadang gonjong, mahkota Suntiang bertingkat, Pucuak Rebung.
        - `bali`: **Balinese Royal Temple** — Gapura Candi Bentar, Penjor Emas, Tedung Agung, Bunga Jepun melayang.
        - `batak`: **Batak Toba Royal Gorga** — Gorga Simeol-meol & Boraspati, Ruma Bolon, tenun Ulos Sadum.
        - `bugis`: **Bugis-Makassar Royal Baju Bodo** — Wadah Bosara emas, Saoraja timpa laja, Lipa Sabbe, aksara Lontara.
        - `palembang`: **Palembang Sriwijaya Songket** — Mahkota Kesuhun Aesan Gede, Teratai Dada, Rumah Limas.
        - `toraja`: **Toraja Tongkonan Heritage** — Atap melengkung Tongkonan, Tedong Bonga, Pa'teddong mistis.
        - `dayak`: **Dayak Kenyah Borneo** — Perisai Talawang, bulu Enggang, sulur Kenyah Aso Naga, musik Sape'.
      - **Modern & Pop Culture (9 Tema)**:
        - `minimalist`: **Modern Botanical Minimalist** — Dedaunan eucalyptus cat air, tipografi serif editorial.
        - `vintage`: **Vintage Newspaper Gazette** — Broadsheet 1920-an, masthead retro, stempel pos, audio mesin tik.
        - `netflix`: **Netflix Cinematic Premiere** — Serial OTT, intro Ta-Dum!, billboard 99% Match, Episode 1 & 2.
        - `spotify`: **Spotify Interactive** — Pemutar vinyl 360°, badge Verified, album tracklist, not balok.
        - `instagram`: **Instagram Stories & Reels** — Layar 9:16 vertikal imersif, progress bar segmen, stiker audio, tap hati.
        - `apple`: **Apple iOS Bento Grid** — Dynamic Island, Lock Screen jam besar, kartu Apple Wallet, balon iMessage.
        - `arcade`: **Arcade Retro 8-Bit Gaming** — Video game retro, RPG Player 1 & 2 Co-Op, Love Bar, chiptune sintetis.
        - `royal`: **Royal Decree & Wax Seal** — Surat gulung perkamen antik, segel lilin merah 3D, harpa magis.
        - `cyberpunk`: **Cyberpunk Neo-Jakarta** — Night City futuristic, sirkuit neon cyan/magenta, biometrik HUD.
      - **Syar'i / Islami (1 Tema)**:
        - `islamic`: **Islamic Arabian Garden** — Kubah Moorish / Arabesque Arch, bintang 8-sudut Rub el Hizb, kaligrafi Bismillah.
    - *14 Tema Terkurasi Segera Hadir (Coming Soon)*:
      - **Adat (+5)**: `aceh`, `banjar`, `melayu`, `sasak`, `papua`.
      - **Modern (+5)**: `cinema`, `airline`, `anime`, `glassmorphism`, `synthwave`.
      - **Islami (+4)**: `ottoman`, `moroccan`, `andalusia`, `nabawi`.
    - *Favicon & Meta Theme-Color Dinamis*: Favicon peramban otomatis berganti dan `meta theme-color` menyesuaikan palet tema aktif.
    - *Centralized Theme Registry*: Standarisasi kontrak antarmuka tema (`types.ts` & `catalog.ts`) untuk skalabilitas 34 tema.
    - *Pemilih Tema Visual*: Pratinjau palet warna tema, badge kategori gaya, dan tombol aktivasi 1-klik yang tersinkronisasi ke basis data MySQL.
    - *Demo URL Preview*: Uji coba instan dengan parameter query `?theme={id}` (contoh: `?theme=dayak`, `?theme=cyberpunk`, `?theme=jawa`).
  - **Modal Lightbox Slider Berkas Terunggah**: Kartu pratinjau foto dapat diklik untuk membuka foto penuh dalam modal Lightbox interaktif berlatar gelap & blur, tombol geser Kiri/Kanan, counter foto, dan shortcut keyboard (`ArrowLeft`, `ArrowRight`, `Escape`).
  - **Reorder Timeline Kisah Cinta (Tombol Naik & Turun)**: Pengaturan kronologi momen kisah cinta fleksibel dengan tombol **Naik (`<ArrowUp />`)** dan **Turun (`<ArrowDown />`)** di samping penomoran dinamis (`#1`, `#2`, dst.), mengeliminasi keharusan menghapus dan mengetik ulang jika terjadi kesalahan urutan.
  - **Pemilih Tanggal & Waktu Interaktif (Date & Time Picker)**:
    - Target Countdown menggunakan `<input type="datetime-local">` yang otomatis menghasilkan format ISO 8601 dengan offset zona waktu (`+07:00`) tanpa ketik manual.
    - Jadwal Akad & Resepsi menggunakan `<input type="date">` cerdas yang otomatis mengekstrak nama Hari Indonesia (misal: *Minggu*) dan penanggalan formal (misal: *20 September 2026*).
    - Pemilih jam terstruktur: Jam Mulai, Jam Selesai, centang *Sampai Selesai*, dan selector Zona Waktu (*WIB, WITA, WIT*) yang otomatis merangkai teks standar (misal: *08:00 - 10:00 WIB* atau *08:00 WIB - Selesai*), dengan toggle input kustom teks untuk acara khusus (*"Ba'da Isya"*).
    - Tombol Sinkronisasi Kilat: 1-klik untuk menyelaraskan tanggal countdown ke seluruh sesi acara dan menyamakan jadwal/tempat Resepsi dengan Akad.
- **Menu 5: Wedding Budget & Checklist Vendor Tracker (v1.21.0)**:
  - **Dasbor Finansial Terpusat**: 4 Kartu KPI real-time (Target Anggaran, Kontrak Aktual, Telah Dibayar/DP, dan Sisa Tagihan Pelunasan).
  - **Status & Realisasi Pembayaran**: Progress bar persentase pembayaran terbayar, badge status *Lunas*, *DP Terbayar*, dan *Belum Bayar*.
  - **Manajemen Vendor & Kontak Cepat WhatsApp**: Kategori pos (Venue, Katering, MUA, Dekorasi, Foto, Hiburan, Souvenir, Cincin, Logistik), nama vendor, tanggal jatuh tempo, dan tombol 1-klik chat WhatsApp via `wa.me/62...`.
  - **Checklist Kesiapan Logistik Hari-H**: Tombol centang 1-klik untuk menandai kesiapan vendor dan logistik.
  - **10 Template Pos Anggaran Nusantara (1-Klik)**: Tombol pemuatan otomatis 10 pos biaya umum pernikahan adat Nusantara.
  - **Export Rekap Anggaran (CSV UTF-8 BOM)**: Unduh seluruh rincian anggaran, kontrak, dan sisa pembayaran ke berkas Excel.
- **Menu 6: Buku Tamu RSVP & Export CSV**: Daftar konfirmasi kehadiran dengan pencarian latar *real-time*, penomoran urut otomatis 1-indexed (`#`), dan tombol **Export ke Excel (CSV)** berformat UTF-8 BOM.
- **Export & Reporting Suite untuk Wedding Organizer & Klien (v1.48.0)**:
  - **All-in-One Master Workbook Excel (.xlsx)**: Mengunduh seluruh data operasional pernikahan dalam 1 workbook multi-sheet terstruktur: *Sheet 1: Ringkasan Eksekutif* (KPI & metrik statistik), *Sheet 2: Buku Tamu & RSVP* (plot meja, check-in, ucapan), *Sheet 3: Susunan Meja WO* (zona, kapasitas, terisi, daftar tamu), dan *Sheet 4: Rincian Anggaran & Vendor* (estimasi vs aktual, status lunas/DP, sisa hutang).
  - **Dokumen Print-Ready PDF Berstandar WO (.pdf)**: Layout resmi A4 dengan kop nama mempelai, tanggal acara, ringkasan KPI eksekutif di pembuka, penomoran halaman otomatis (*Halaman X dari Y*), serta tabel bersih siap cetak di lokasi resepsi.
  - **Pusat Laporan & Ekspor Modal**: Modal interaktif di Admin Panel untuk mengunduh master bundle 1-klik atau lembaran dokumen terpisah per divisi lapangan.
  - **Tombol Ekspor Terintegrasi di Tiap Modul**: Akses cepat ekspor Excel (.xlsx) dan PDF langsung dari tab Buku Tamu, RSVP, Susunan Meja, dan Pelacak Anggaran.
  - **Zero Server Overhead**: Pembuatan file disintesis 100% di browser pengguna (*client-side streaming*) dengan pustaka `xlsx` dan `jspdf`, menghemat bandwidth dan CPU server.
- **Developer Floating DebugBar Suite (v1.47.0)**:
  - **In-App Full-Stack Profiler**: Terinspirasi dari *Laravel Debugbar*, panel pengembang melayang di layar aplikasi untuk memantau performa frontend dan backend secara *real-time* di lingkungan pengembangan (`import.meta.env.DEV`).
  - **Pill Mengambang & Shortcut Cepat**: Tampil ringkas sebagai *floating pill* status cepat di sudut kiri bawah layar dan dapat dibuka/ditutup instan via pintasan keyboard **`Ctrl + Shift + D`**.
  - **5 Tab Analitik Lengkap**:
    1. *🗄️ Queries*: Inspeksi kueri SQL MySQL yang dieksekusi Express dengan durasi milidetik, parameter bindings, dan tombol 1-klik *Copy SQL*.
    2. *🌐 REST API*: Riwayat permintaan API, durasi respons jaringan (ms), status HTTP (200, 401, 429), dan inspeksi data JSON bolak-balik.
    3. *⚡ Realtime Socket*: Pemantau koneksi WebSocket Gateway, latensi ping, dan stream event real-time (`config:updated`, `wish:added`, dll).
    4. *🎨 State & Tema*: Inspeksi token warna tema aktif, konfigurasi mempelai, dan parameter nama tamu URL (`?to=...`).
    5. *⏱️ Performance*: Metrik waktu muat, ukuran layar viewport, dan lingkungan runtime.
  - **Zero Production Leak**: Modul otomatis di-*tree-shake* habis pada build produksi sehingga ukuran bundle produksi tetap bersih 0 byte.
- **Amplop Interaktif & 3D Wax Seal Unfolding Animation (v1.46.0)**:
  - **Amplop Fisik 3D & Segel Lilin Realistis**: Pengalaman pembuka undangan elegan dengan kantong amplop berbayangan realistis, segel lilin (*wax seal*) bertekstur organik timbul dengan monogram inisial mempelai otomatis (misal: `H & N`), serta efek kilauan (*sparkle hint*).
  - **Animasi Unfolding 3D & Micro-burst**: Mengetuk segel lilin atau tombol "Buka Undangan" memicu hamburan partikel kilau emas (*sparkle burst*), penutup amplop atas (*top flap*) melipat ke atas 180° menggunakan CSS 3D transforms (`rotateX(-180deg)`), dan kartu surat undangan meluncur naik keluar dari kantong secara dramatis sebelum beralih ke isi undangan.
  - **Acoustic Synthesizer Native (Web Audio API)**: Efek audio lilin pecah (*wax seal fracture snap*), desiran kertas (*parchment rustle*), dan glissando harpa emas disintesis langsung di peramban tanpa file eksternal (0ms lag, 100% offline).
  - **Adaptif Lintas Tema**: Komponen bersama `InteractiveEnvelopeCoverCard.tsx` dirancang 100% netral budaya di `src/modules/frontend/shared/components/` dan otomatis beradaptasi dengan palet tema aktif (Betawi sage/red, Jawa royal dark green/gold, Sunda priangan/gold, Minimalist modern slate/beige, Royal decree gold/burgundy, dll).
- **Playlist Multi-Track Audio Studio & Smart Auto-Ducking (v1.45.0)**:
  - **Smart Voice-Memo Auto-Ducking**: Integrasi event bus `wedding:voice-memo-play` yang secara cerdas meredupkan (*ducking*) volume musik latar dari 75% ke 15% secara halus ketika tamu memutar pesan suara/audio doa pada kartu ucapan, dan mengembalikannya ke volume normal saat audio selesai.
  - **Floating Audio Studio Card**: Antarmuka kontrol musik melayang dengan panel piringan hitam (*vinyl disc*), bar equalizer animasi, marquee judul lagu yang sedang diputar, slider volume interaktif (0%–100%), tombol mute/unmute cepat, navigasi Prev/Next, serta laci mini-tracklist daftar putar.
  - **Manajemen Playlist Dinamis di Panel Admin**: Konfigurasi judul lagu (*track title*), pengurutan urutan lagu dengan tombol panah naik/turun (*reorder*), slider persentase volume awal undangan (*default volume*), dan sinkronisasi instan multi-perangkat via WebSocket.
- **Keamanan REST API & Autentikasi JWT Bearer Token (v1.44.4)**:
  - Seluruh endpoint mutasi konfigurasi dan data administratif (`/api/config`, `/api/guests`, `/api/budget`, `/api/checkins`, `/api/upload`, mutasi `/api/seating`, mutasi `/api/trivia`, pembacaan/penghapusan `/api/rsvps`, dan moderasi `/api/wishes`) dilindungi middleware otorisasi JWT Bearer token valid 7 hari.
  - Sisi klien (`src/services/api.ts`) otomatis menginjeksi token otentikasi dari `sessionStorage` dan melakukan pembersihan sesi instan (*auto-logout*) via event global `auth:unauthorized` ketika token kedaluwarsa (HTTP 401).
- **Anti-Spam Sliding-Window Rate Limiting (v1.44.4)**:
  - Pembatasan ketat 2 pengiriman per 60 detik per IP pada form publik RSVP & Doa (`POST /api/rsvps`, `POST /api/wishes`) serta 5 percobaan per 5 menit pada endpoint login admin (`POST /api/auth/login`) guna mencegah serangan *brute force* dan banjir bot.
  - Mendukung ekstraksi IP pengunjung riil di balik reverse proxy Cloudflare/Nginx (`x-forwarded-for`) dan respons status HTTP 429 Too Many Requests yang ramah pengguna.
- **Query Limits & Pagination Doa Dinamis (v1.44.4)**:
  - Pengambilan data ucapan doa sisi tamu dibatasi default `LIMIT 50` dengan dukungan tombol paginasi "Muat Doa Sebelumnya" (*offset pagination*) untuk menghemat konsumsi memori dan bandwidth browser. Dukungan parameter `?all=true` untuk layar panggung pameran live (`/live`) dan Dasbor Admin.
- **Penerapan Penuh 8 Pilar UI/UX Interaktif (`interactive-ux-standards`)**:
  1. *Toast Alerts*: Umpan balik status sukses dan error mengambang yang ramah pengguna (auto-dismiss 3,5 detik).
  2. *SweetAlert2 Confirmation Modals*: Dialog konfirmasi hapus data dengan badge bahaya dan tombol *Icon + Text*.
  3. *Live Background Search*: Pencarian real-time pada data RSVP & Wishes secara instan tanpa mengotori URL browser.
  4. *Full-Screen Viewport Backdrop*: Penutup latar modal `fixed inset-0 w-screen h-screen z-[9999]` dengan pencegah scroll latar (`overflow: hidden`).
  5. *Input Icon Groups & Placeholders*: Seluruh form input dilengkapi grup ikon semantik dan teks panduan format.
  6. *Drag & Drop File Upload*: Dropzone interaktif dengan kompresi Canvas otomatis dan pratinjau kartu berkas terunggah (*itemized preview card*).
  7. *Dual Button Convention*: Tombol UI umum berformat *Icon + Text*, sedangkan tombol aksi tabel berformat *Icon-Only*.
  8. *Tabel Responsif Bernomor Otomatis (`#`)*: Kolom nomor urut dinamis 1-indexed yang tetap konsisten saat difilter.

---

## 📋 Prasyarat Sistem

Sebelum memulai instalasi, pastikan lingkungan komputer atau server Anda memenuhi spesifikasi berikut:

- **Node.js**: Versi `18.0.0` atau lebih tinggi (Direkomendasikan: `v20.x` atau `v22.x LTS`).
- **Basis Data Relasional**: MySQL 5.7+ / 8.0+ atau MariaDB (sudah tersedia otomatis di Laragon / XAMPP).
- **Package Manager**: Standar proyek menggunakan **`npm`** (`npm run lint`, `npm run dev`, `npm run server`).
- **Peramban Web Modern**: Google Chrome, Mozilla Firefox, Apple Safari, atau Microsoft Edge versi terbaru.

---

## 🚀 Panduan Instalasi

Ikuti langkah-langkah berikut untuk memasang dan menjalankan proyek di komputer lokal:

### 1. Kloning Repositori
```bash
git clone https://github.com/hndko/app_weddingbetawi_react.git
cd app_weddingbetawi_react
```

### 2. Pasang Dependensi Proyek
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin template konfigurasi lingkungan dan buat kunci rahasia:

```bash
# 1. Salin berkas template
cp .env.example .env

# 2. Hasilkan kunci rahasia acak berstandar keamanan tinggi untuk JWT_SECRET
npm run secret:generate
```

Buka file `.env` yang baru dibuat dan sesuaikan konfigurasi koneksi database MySQL Anda:
```env
# Frontend Client Configuration
VITE_API_URL=http://localhost:5000

# Server Backend Configuration
PORT=5000
NODE_ENV=development

# Database MySQL aaPanel / Localhost
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_weddingbetawi

# Security & CORS
JWT_SECRET=rahasia_jwt_acak_super_aman_2026_wedding
CORS_ORIGIN=http://localhost:3000
```

### 4. Eksekusi Migrasi & Seeder Database
Pastikan service MySQL di Laragon aktif, lalu jalankan perintah DDL dan inisialisasi akun:
```bash
npm run db:migrate
npm run db:seed
```

---

## 💻 Panduan Penggunaan

### Menjalankan Server Backend (Port 5000)
Buka terminal pertama dan jalankan:
```bash
npm run server
```
Server REST API dan Socket.io akan aktif pada `http://localhost:5000`.

### Menjalankan Server Frontend (Port 3000)
Buka terminal kedua dan jalankan:
```bash
npm run dev
```
Buka browser dan akses alamat default: `http://localhost:3000`.

### Menguji Personalisasi Nama Tamu
Tambahkan parameter `?to=` pada akhir URL undangan:
- Mengundang perorangan: `http://localhost:3000/?to=Budi+Santoso`
- Mengundang keluarga: `http://localhost:3000/?to=Bapak+Ahmad+%26+Keluarga`

### Mengakses Halaman Admin
Akses path `/login` pada peramban Anda (setelah memasukkan username & password valid, sistem otomatis mengalihkan URL ke `/modules`):
- `http://localhost:3000/login`

### Melakukan Kompilasi Produksi (Production Build)
```bash
npm run build
```
File hasil kompilasi yang siap di-hosting akan tersimpan di dalam folder `dist/`.

---

## 🔐 Kredensial Default

Untuk keperluan pengujian awal dan instalasi baru, sistem telah menyediakan akun administrator bawaan:

| Tipe Akun | Lokasi Akses | Username | Password Default | Otoritas |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | URL `/login` (dialihkan ke `/modules`) | **`superadmin`** | **`password`** | Akses penuh seluruh modul admin |

> [!TIP]
> **Fitur Ganti Password Mandiri**: Anda dapat mengganti kata sandi administrator kapan saja langsung melalui antarmuka Admin Panel dengan mengklik tombol **"Ganti Password"** (`<KeyRound />`) di header dasbor. Password baru akan di-hash menggunakan algoritma `bcryptjs` dan diperbarui di basis data MySQL.

---

## 🗄️ Panduan Setup Basis Data MySQL & Migrasi

Aplikasi ini menggunakan basis data relasional mandiri tanpa ketergantungan pada layanan cloud pihak ketiga berbayar:

### 1. Buat Basis Data di Laragon / phpMyAdmin
1. Buka **Laragon** > klik **Database** (membuka HeidiSQL) atau buka `http://localhost/phpmyadmin`.
2. Buat database baru bernama `db_weddingbetawi`:
   ```sql
   CREATE DATABASE db_weddingbetawi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 2. Jalankan Skrip Migrasi
Di terminal proyek, jalankan:
```bash
npm run db:migrate
```
Perintah ini akan secara otomatis membuat 9 tabel terstruktur (`users`, `wedding_config`, `wishes`, `rsvps`, `guests`, `budget_items`, `seating_tables`, `trivia_questions`, `checkins`).

### 3. Jalankan Skrip Seeder
```bash
npm run db:seed
```
Perintah ini akan menginisialisasi akun `superadmin` dengan password `password` yang telah di-hash dengan `bcryptjs` serta memuat konfigurasi default pernikahan ke tabel `wedding_config`.

---

## ☁️ Panduan Deployment Produksi (Self-Hosted)

Aplikasi ini dirancang untuk kemudahan deployment mandiri pada berbagai infrastruktur server:

1. **VPS Linux (Ubuntu 22.04 LTS + Nginx + PM2)**:
   - Menjalankan backend Express & Socket.io secara persisten menggunakan process manager **PM2**.
   - Melayani aset frontend statis (`dist/`) melalui **Nginx Web Server**.
   - Mengonfigurasi reverse proxy Nginx untuk meneruskan trafik `/api/`, `/socket.io/`, dan `/uploads/` ke port 5000.
   - Mengamankan koneksi dengan sertifikat SSL gratis **Let's Encrypt** (`certbot`).
2. **Shared Hosting (cPanel)**:
   - Memanfaatkan fitur **Setup Node.js App** di cPanel untuk menjalankan backend.
   - Mengelola basis data MySQL melalui cPanel **MySQL Database Wizard**.
3. **aaPanel Control Panel**:
   - Menjalankan backend Express di port 5000 via modul **Node project** (menggunakan package manager **npm** dan auto-start daemon).
   - Melayani frontend SPA `dist/` dan routing reverse proxy (`/api/`, `/socket.io/`, `/uploads/`) via server block Nginx aaPanel ber-SSL Let's Encrypt.

> 📖 **Panduan Deployment Lengkap**: Untuk langkah-langkah konfigurasi server block Nginx, PM2 startup, dan SSL secara terperinci, silakan merujuk ke dokumen resmi [**`docs/04-panduan-deployment.md`**](docs/04-panduan-deployment.md).

---

## 🤝 Panduan Kontribusi

Kontribusi dan saran perbaikan sangat kami hargai! Untuk berkontribusi pada repositori ini:

1. Lakukan **Fork** pada repositori ini.
2. Buat *branch* fitur baru Anda:
   ```bash
   git checkout -b fitur/NamaFiturKeren
   ```
3. Lakukan *commit* terhadap perubahan Anda dengan pesan yang deskriptif:
   ```bash
   git commit -m "feat: menambahkan animasi kelopak bunga jatuh"
   ```
4. *Push* branch Anda ke GitHub:
   ```bash
   git push origin fitur/NamaFiturKeren
   ```
5. Buka repositori asli dan ajukan **Pull Request**.

---

## 📄 Lisensi

Proyek ini didistribusikan di bawah lisensi terbuka **MIT License**. Anda bebas menggunakan, memodifikasi, dan mendistribusikan kode ini untuk keperluan pribadi maupun komersial. Lihat berkas [LICENSE](LICENSE) untuk informasi lisensi selengkapnya.

---

<div align="center">
  <sub>Dibuat dengan penuh cinta dan dedikasi untuk melestarikan keindahan pernikahan Nusantara, Modern, dan Islami dalam era digital. 💍</sub>
</div>
