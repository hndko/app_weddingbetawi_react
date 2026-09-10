# 🤖 AGENTS.md — Panduan & Aturan Proyek untuk AI Assistant & Coding Agents

Dokumen ini adalah **sumber kebenaran tunggal (*Single Source of Truth*)** untuk seluruh AI Assistant, Coding Agents, LLM Pair Programmer, dan pengembang yang bekerja pada repositori **Mari Partner - Digital Wedding Invitation SPA**. 

Setiap agen yang menginspeksi, memodifikasi, atau menambahkan kode pada proyek ini **WAJIB** membaca, memahami, dan mematuhi seluruh aturan di bawah ini tanpa pengecualian.

---

## 📌 Metadata Proyek
- **Nama Proyek**: Mari Partner Digital Wedding Invitation SPA
- **Versi Aplikasi Saat Ini**: `v1.57.2`
- **Tech Stack**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Node.js + Express (TypeScript), MySQL / MariaDB (Laragon), Socket.io 4.8, Motion 12.23, PWA (Workbox), Vitest, Autocannon
- **Tipe Aplikasi**: Full-Stack Single Page Application (SPA + Node.js Express REST API)
- **Status CI/CD & Deploy**: Self-Hosted (PM2 + Nginx / cPanel / aaPanel)

---

## 🏛️ 10 Pilar Aturan Wajib untuk AI Assistant & Coding Agents

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   10 PILAR ATURAN WAJIB CODING AGENT                             │
├───────────────────┬───────────────────┬───────────────────┬──────────────────────┤
│ 1. Prime Directive│ 2. Clean Arch     │ 3. OWASP Security │ 4. Clean Code Hygiene│
│ 5. UX & Modals    │ 6. Realtime Perf  │ 7. Test & Verify  │ 8. SemVer (1.0.X)    │
│ 9. Git Auto-Push  │ 10. Mandatory Sync│                   │                      │
└───────────────────┴───────────────────┴───────────────────┴──────────────────────┘
```

---

### 🎯 1. Peran, Otoritas & Prinsip Kerja AI Agent (Role & Prime Directives)
1. **Peran Senior Engineer & Tech Lead**: Agen bertindak sebagai Senior Full-Stack Engineer, Security Auditor, dan Clean Code Evangelist. Berikan solusi berstandar industri dengan penjelasan yang lugas dan berbobot teknis tinggi (*anti-slop*).
2. **Prinsip Nol Asumsi & Non-Halusinasi**: Dilarang mengasumsikan keberadaan berkas, dependensi, fungsi, atau skema basis data sebelum memeriksa berkas aslinya secara langsung.
3. **Preservasi Logika Bisnis & Invarian Domain**: Setiap modifikasi kode tidak boleh merusak logika bisnis inti:
   - Alur RSVP tamu (status kehadiran, jumlah tamu, pesan doa).
   - Pengiriman dan moderasi ucapan (*wishes stream*).
   - Generator link WhatsApp tamu dengan enkripsi parameter URL yang valid.
   - Kontrol audio background musik, playlist, dan state interaksi pengguna.
   - Manajemen konten mempelai & jadwal via Admin Panel.
4. **Prinsip Non-Destruktif**: Dilarang menghapus konfigurasi krusial, variabel `.env`, atau data produksi tanpa instruksi eksplisit dari pengguna.

---

### 🏗️ 2. Arsitektur Kode & Pemisahan Tanggung Jawab (Separation of Concerns)
1. **Struktur Direktori Modular Terstandarisasi (`src/modules/`)**:
   - `src/modules/auth/`: Modul autentikasi panel admin (`Login.tsx`).
   - `src/modules/backend/`: Modul pengelolaan data dan dasbor admin (`Panel.tsx`, `components/GuestManagerTab.tsx`, `components/ConfigEditorTab.tsx`, `components/RsvpManagerTab.tsx`, `components/WishesManagerTab.tsx`, `components/ReceptionCheckin.tsx`, `components/SeatingChartManager.tsx`, `components/BudgetVendorTracker.tsx`, `components/TriviaQuizManager.tsx`, `components/ExportReportModal.tsx`, `components/WhatsAppBroadcastModal.tsx`, `components/DragDropUpload.tsx`, `components/ThemeSelector.tsx`, `components/EventScheduleEditor.tsx`, `components/ScrollableTabsContainer.tsx`).
   - `src/modules/frontend/shared/`: Komponen dan seksi bersama lintas tema (`components/BottomNavigation.tsx`, `components/MusicPlayer.tsx`, `components/SEO.tsx`, `sections/RSVPSection.tsx`, `sections/WishesSection.tsx`, `sections/CountdownSection.tsx`, `sections/EventSection.tsx`, `sections/GallerySection.tsx`, `sections/LocationSection.tsx`, `sections/LoveStory.tsx`, `sections/WeddingGift.tsx`).
   - `src/modules/frontend/themes/`: Modul tema modular (`betawi/`, `jawa/`, `index.ts`, `types.ts`).
   - `server/`: Backend Node.js Express + MySQL + Socket.io (`src/routes/`, `src/db/`, `uploads/`).
   - `src/services/api.ts`: Client SDK REST API terpusat untuk komunikasi backend.
   - `src/types.ts`: Deklarasi tipe TypeScript global dan interface domain.
   - `src/index.css`: Konfigurasi Tailwind CSS v4 dan styling global.
2. **Thin Presentational Components**: Komponen antarmuka fokus pada rendering UI. Logika manipulasi state kompleks, integrasi database, atau format string wajib didelegasikan ke fungsi pembantu (*helper*), custom hooks, atau service SDK.
3. **Penyimpanan Berkas Efisien & Pembersihan Disk Otomatis (*Zero Storage Leak*)**: Seluruh foto profil mempelai, banner, dan gambar QRIS yang diunggah dikelola oleh Multer di `server/uploads/` dengan sistem pembersihan disk otomatis (*auto-unlink*). File lama di server otomatis dihapus dari disk saat foto diganti atau dihapus untuk mencegah pembengkakan penyimpanan. Berkas fisik di `server/uploads/` diabaikan oleh Git via `.gitignore` dengan preservasi `.gitkeep`.
4. **Single Page Routing**: Navigasi menggunakan state lokal dan *smooth scrolling* internal section. Rute admin dikelola via path khusus `/login` dan `/modules` dengan sinkronisasi History API, serta penanganan parameter query nama tamu (`?to=Nama+Tamu`) secara elegan.
5. **Standarisasi Penamaan Folder Lowercase Murni (`src/modules/`)**:
   - Seluruh folder di dalam `src/modules/` WAJIB selalu menggunakan huruf kecil penuh: `auth/`, `backend/`, `frontend/`, `shared/`, `themes/`.
   - DILARANG KERAS menggunakan huruf kapital atau campuran huruf besar-kecil pada penamaan direktori maupun impor berkas modul guna mencegah galat *case-sensitivity* lintas sistem operasi (Windows vs Linux vs Vercel Serverless CI/CD) dan error kompilasi TypeScript `TS1149`/`TS1261`.
6. **Invarian Netral Budaya pada Layer Bersama (`shared/`)**:
   - Direktori `src/modules/frontend/shared/` mengisolasi komponen bersama (`BottomNavigation`, `MusicPlayer`, `SEO`) dan seksi data domain bersama (`RSVP`, `Wishes`, `Countdown`, `Event`, `Gallery`, `Location`, `LoveStory`, `WeddingGift`).
   - Seluruh berkas di `src/modules/frontend/shared/` WAJIB 100% netral budaya (*culturally agnostic*). DILARANG mengimpor atau merender ornamen khusus adat tertentu (seperti Ondel-ondel, siluet Monas, Rumah Kebaya, atau Gunungan Wayang). Gunakan ornamen pemisah netral (`SectionDivider`).
8. **Standar Paket Aset Default Luring Tema (*Offline Default Theme Assets Suite*)**:
   - Setiap tema pada `THEME_CATALOG` (`src/modules/frontend/themes/index.ts`) WAJIB menyediakan paket aset lokal mandiri di `public/assets/themes/{theme_id}/`:
     - `thumbnail.jpg` atau `thumbnail.svg`
     - `pattern.svg`
     - `favicon.svg`
   - DILARANG mengandalkan URL eksternal (seperti Unsplash atau CDN pihak ketiga) untuk aset dasar tema guna menjamin aplikasi tetap mandiri, tahan gangguan jaringan, dan dapat diakses luring (*zero external dependency*).
9. **Invarian Routing Express 5 & Penanganan SPA Fallback**:
   - Pada runtime Express v5 (`express@5.x`), DILARANG menggunakan wildcard string `app.get('*', ...)` karena adanya *breaking change* pada pustaka `path-to-regexp` yang akan melempar galat fatal `PathError [TypeError]: Missing parameter name at index 1: *` saat server booting.
   - Penanganan rute fallback Single Page Application (SPA) WAJIB menggunakan middleware tanpa path string:
     ```typescript
     app.use((req, res, next) => {
       if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/socket.io')) {
         return res.sendFile(path.join(distPath, 'index.html'));
       }
       next();
     });
     ```

---

### 🔒 3. Standar Keamanan & Sanitasi Input (Security & OWASP Guardrails)
1. **Isolasi Rahasia & Kredensial (.env & .env.example)**:
   - DILARANG KERAS mengekspos kredensial database, JWT Secret, atau API Key produksi ke repositori publik.
   - Semua variabel lingkungan klien wajib menggunakan prefix `VITE_` (misal: `VITE_API_URL`).
   - Variabel backend (`DB_*`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`) disimpan secara aman di `.env` lokal.
   - File kredensial lokal dan rahasia wajib selalu terdaftar di `.gitignore`.
   - **Konsistensi Mutlak `.env` dan `.env.example`**: Seluruh variabel lingkungan pada `.env` dan `.env.example` WAJIB 100% sinkron dan konsisten (kunci yang sama, urutan yang sama, dan format penamaan yang sama). Setiap kali ada penambahan atau modifikasi variabel baru pada `.env`, `.env.example` WAJIB langsung diperbarui dengan nilai placeholder/dummy, dan sebaliknya. Variabel usang atau tidak terpakai wajib dieliminasi dari kedua berkas.
2. **Pencegahan Cross-Site Scripting (XSS)**:
   - Semua data dinamis dari pengguna (nama tamu, pesan ucapan, konfirmasi RSVP) wajib di-escape oleh React secara alami.
   - DILARANG menggunakan `dangerouslySetInnerHTML` tanpa pustaka sanitasi HTML pihak ketiga (seperti DOMPurify).
3. **Keamanan Basis Data MySQL & Prepared Statements (SQLi Guard)**:
   - Seluruh kueri basis data pada REST API wajib menggunakan *parameterized queries* / *prepared statements* (`mysql2/promise`) untuk mencegah kerentanan SQL Injection.
4. **Proteksi Panel Admin, Hashing Password & IDOR Guard**:
   - Rute panel admin dilindungi oleh autentikasi berbasis database MySQL tabel `users`.
   - Kata sandi wajib di-hash menggunakan algoritma `bcryptjs` (salt rounds 10). DILARANG menyimpan kata sandi dalam bentuk plaintext.
   - Fitur ganti password admin (`PUT /api/auth/password`) WAJIB mengikat identitas pengguna ke token JWT yang terautentikasi (`user.id`) untuk mencegah serangan IDOR (Insecure Direct Object Reference) serta memvalidasi minimal 6 karakter.
5. **Aturan Konfigurasi Web Server Nginx & Kompatibilitas Cloudflare**:
   - **Pencegahan Loop Redirect**: Jika domain publik menggunakan Cloudflare dengan mode enkripsi **Flexible**, DILARANG menyertakan blok redirect `if ($server_port !~ 443) { rewrite ... }` di konfigurasi Nginx server origin guna mencegah galat browser *ERR_TOO_MANY_REDIRECTS*.
   - **Protokol Pembersihan Vhost Hantu (*Ghost Cache/Vhost Cleanup*)**: Apabila perintah `nginx -t` atau tombol Save di aaPanel gagal dengan galat `mkdir() ".../proxy_cache_dir" failed (2: No such file or directory)`, pengembang/agen wajib memeriksa sisa konfigurasi website usang dengan `grep -rn` di `/www/server/panel/vhost/nginx/`, menghapus berkas konfigurasi mati tersebut, dan memvalidasi kelulusan `nginx -t` sebelum me-reload Nginx.
6. **Autentikasi JWT Bearer Token pada Endpoint Admin**:
   - Seluruh endpoint mutasi konfigurasi dan data administratif (`/api/config`, `/api/guests`, `/api/budget`, `/api/checkins`, `/api/upload`, mutasi `/api/seating`, mutasi `/api/trivia`, pembacaan/penghapusan `/api/rsvps`, dan moderasi `/api/wishes`) WAJIB dilindungi oleh middleware `authenticateJwt` dengan validasi token `Bearer <token>`.
   - Token ditandatangani dengan masa berlaku 7 hari menggunakan `JWT_SECRET`. Sisi klien (`src/services/api.ts`) otomatis menyertakan token dari `sessionStorage` dan merespons status HTTP 401 dengan melempar event `auth:unauthorized` serta pembersihan session.
7. **Rate Limiting Anti-Spam Sliding Window**:
   - Endpoint publik penerima data pengguna (`POST /api/wishes` dan `POST /api/rsvps`) WAJIB dilindungi oleh rate limiter sliding-window berbasis IP dengan batas ketat maksimum 2 permohonan per 60 detik per IP.
   - Endpoint login admin (`POST /api/auth/login`) dibatasi maksimum 5 permohonan per 5 menit per IP guna mencegah serangan *brute-force*.
   - Pelanggaran limit wajib mengembalikan status HTTP 429 Too Many Requests beserta header `Retry-After`.
8. **Pengamanan Unggah Berkas Gambar (*Upload Security Guard & Anti-Stored XSS*)**:
   - Endpoint upload (`server/src/routes/upload.ts`) WAJIB memvalidasi ganda: MIME type (`image/jpeg`, `image/png`, `image/webp`) DAN ekstensi berkas (`.jpg`, `.jpeg`, `.png`, `.webp`).
   - Berkas format vektor SVG (`image/svg+xml`) DILARANG KERAS diunggah guna mengeliminasi 100% celah Stored XSS via payload script tersembunyi.
   - Ekstensi berkas fisik di disk server selalu disintesis dari MIME type yang telah divalidasi (`safeExt`).
9. **Content Security Policy (CSP) & HTTP Header Hardening (`helmet`)**:
   - Server Express wajib mengaktifkan `helmet` dengan whitelist CSP ketat yang mendukung YouTube IFrame, Google Maps, Google Fonts, dan Socket.io.
   - Resource policy wajib menyertakan `crossOriginResourcePolicy: { policy: "cross-origin" }` agar aset unggahan di `/uploads` dapat dimuat dengan aman oleh klien.
10. **Proteksi DoS Body Parser & JWT Secret Production Enforcement**:
    - Limit `express.json()` dan `express.urlencoded()` dibatasi maksimum `2mb` (bukan 50mb) untuk mencegah kehabisan memori server (*Memory Exhaustion DoS*).
    - Pada lingkungan produksi (`NODE_ENV === 'production'`), server wajib memeriksa `JWT_SECRET` dan menolak booting (`process.exit(1)`) jika kunci kosong atau masih menggunakan string fallback bawaan.

---

### 💎 4. Kualitas Kode & Anti-Slop (Clean Code & Quality Invariants)
1. **TypeScript Strict (Zero Tolerance for `any`)**:
    - DILARANG menggunakan tipe `any`. Gunakan tipe data eksplisit, *union types*, atau `unknown` dengan *type guard*.
    - Setiap entitas data (`Wish`, `RSVPResponse`, `WeddingConfig`, `MusicSettings`, `Guest`, `BudgetItem`, `SeatingTable`, `TriviaQuestion`, `Checkin`) wajib memiliki interface lengkap di `src/types.ts`.
2. **Kebersihan Kode (Zero Dead Code & AI-Slop)**:
   - Hapus seluruh `console.log`, `alert()`, `confirm()`, atau `debugger` sisa pengujian.
   - Dilarang meninggalkan komentar generik khas AI (contoh: `// import React from react`, `// this is a function`). Komentar hanya ditulis untuk menjelaskan alasan arsitektural (*why*), bukan aksi kode (*what*).
   - Dilarang meninggalkan blok kode usang yang dikomentari (*commented-out dead code*), `TODO`, atau `FIXME`.
3. **Konvensi Penamaan**:
   - Komponen React: `PascalCase` (`RSVPSection.tsx`, `AdminPanel.tsx`).
   - Hooks & Fungsi: `camelCase` (`useWeddingData`, `formatDateIndonesia`).
   - Konstanta Global: `UPPER_SNAKE_CASE` (`DEFAULT_PASSCODE`, `COLLECTION_WISHES`).
   - Tipe & Interface: `PascalCase` (`RSVPData`, `WeddingConfig`).

---

### 🎨 5. Standar Desain UI/UX & Interaktivitas (Interactive Design System)
Proyek ini mengadopsi secara penuh spesifikasi **Skill Global `interactive-ux-standards`**:
1. **Toast Alerts (Zero Native/Manual Alerts)**:
   - DILARANG menggunakan `window.alert()`. Gunakan toast mengambang beranimasi dengan status (success/error), icon, dan auto-dismiss 3,5 detik.
2. **SweetAlert-Style Confirmation Modals**:
   - DILARANG menggunakan `window.confirm()`. Aksi destruktif wajib memicu modal konfirmasi animasi berstatus badge bahaya, tombol Batal (`<X size={15}/> Batal`), dan tombol konfirmasi (`<Trash2 size={15}/> Ya, Hapus`).
3. **Pencarian Real-Time In-Memory (Zero URL Pollution)**:
   - Pencarian tabel data (RSVP & Wishes) wajib menyaring state di latar belakang tanpa mengubah query parameter di URL browser (`?search=`), dilengkapi tombol reset instan.
4. **Full-Screen Viewport Backdrop Overlay**:
   - Backdrop modal wajib menutup 100% layar menggunakan `fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm` dengan pencegahan scroll latar (`document.body.style.overflow = 'hidden'`).
5. **Form Controls dengan Icon Group & Placeholder Wajib**:
   - Setiap form control (`<input>`, `<select>`, `<textarea>`) wajib dibungkus kontainer grup ikon semantik di sisi kiri dan dilengkapi placeholder bernilai contoh yang jelas.
6. **Drag & Drop File Upload dengan Preview List**:
   - Form upload foto (profil mempelai, QRIS, galeri) wajib mendukung dropzone drag-and-drop interaktif, kompresi otomatis Canvas, serta kartu pratinjau foto terunggah di bawahnya lengkap dengan thumbnail dan tombol hapus/ganti.
7. **Standar Desain Tombol (Dual Button Rule)**:
   - **Tombol Form & UI Umum**: Wajib memiliki **Icon + Text** (contoh: `<Save size={16}/> Simpan Data`).
   - **Tombol Aksi Tabel**: Wajib **Icon-Only** (contoh: `<Trash2 size={15}/>`) dengan atribut `title` dan `aria-label` yang jelas agar kolom tabel tetap rapi dan ringkas.
8. **Penomoran Otomatis Kolom Tabel (`#`)**:
   - Setiap tabel data wajib memiliki kolom pertama `#` dengan penomoran urut otomatis 1-indexed (`index + 1`), yang tetap urut saat data disaring oleh fitur pencarian.
9. **Desain Responsif & Estetika Budaya**:
   - Desain sempurna pada mobile (360px-430px) dengan tipografi berkelas, adaptasi palet warna tematik yang harmonis, dan proporsi elemen visual yang nyaman diakses satu tangan.
10. **Paket Animasi Dekorasi Tematik (*Theme Animated Decorations Suite*)**:
    - Setiap tema aktif (status `ready`) WAJIB menyertakan minimal dua varian dekorasi beranimasi halus menggunakan `motion/react`:
      1. *Floating Particles / Petals* (contoh: `FloatingFlowers` di Betawi, `FloatingMelati` di Jawa) yang melayang dengan rotasi perlahan, pergeseran sumbu X/Y lembut, dan variasi skala.
      2. *Swaying Corner Filigree / Vines* pada bingkai utama `AppFrame` (contoh: `AnimatedFloralVines` di Betawi, `AnimatedJavaneseFiligree` di Jawa).
    - Seluruh elemen dekorasi beranimasi WAJIB menyertakan kelas utilitas Tailwind `pointer-events-none` agar tidak menghalangi gestur sentuh pengguna, interaksi tombol, ataupun scroll pada layar perangkat seluler.
11. **Master & Modular Export & Reporting Suite (`reportExporter.ts` & `ExportReportModal.tsx`)**:
    - Mendukung ekspor instan All-in-One Master Workbook Excel (`.xlsx` 4-sheet) dan Master Dokumen WO PDF (`.pdf` A4 print-ready) beserta tombol ekspor modular per-tab (Buku Tamu, RSVP, Susunan Meja, dan Anggaran & Vendor).
    - Seluruh proses sintesis berkas dilakukan 100% di browser klien (*client-side streaming*) menggunakan `xlsx` dan `jspdf`, menjamin *zero server load*, privasi data tinggi, dan performa generasi instan.
12. **Suite Kemewahan & Kemitraan Wedding Organizer (Luxury & WO Partnership Suite)**:
    - **VIP Guest Tiering & Dedicated Access Pass**: Klasifikasi tamu bertingkat (`vvip`, `vip`, `family`, `regular`) lengkap dengan lencana kemewahan emas/amber/emerald, alokasi meja prioritas, catatan protokoler VIP, dan passcard digital eksklusif.
    - **Digital Souvenir & Photobooth Redemption Tracker**: Pelacak penukaran suvenir resepsi anti-ganda berbasis scanner dan toggle 1-klik di Reception Check-in & Buku Tamu, tersinkronisasi realtime ke database MySQL.
    - **White-Label Agensi Mode & Dynamic Footer Suite**: Kustomisasi identitas penuh untuk Wedding Organizer (`co_branded` dan `white_label`) yang terintegrasi di seluruh 21 tema undangan via `<AgencyBrandingFooter />`. Menampilkan logo WO, nama, peran kustom (`agencyRole`), tagline, tautan sosial/web/WA, format dedikasi dinamis (`organizedForText`), teks platform (`poweredByText`), URL platform (`poweredByUrl`), serta toggle eliminasi 100% branding platform (`hideMariPartnerBranding`) pada footer publik dan dokumen ekspor WO.
    - **Live Wedding Rundown Broadcaster**: Siaran status rundown pernikahan hari-H secara langsung (*realtime broadcast* via Socket.io `rundown:updated`) dari HP tim WO, memunculkan floating banner siaran status hidup (`🔴 LIVE`) dan drawer linimasa acara pada layar seluruh tamu.
13. **Navigasi Tab Interaktif & Gestur Geser (*ScrollableTabsContainer*)**:
    - Deretan tab dan pill filter yang meluap horizontal (subtab `ConfigEditorTab`, kategori tema `ThemeSelector`, dan zona meja `SeatingChartManager`) WAJIB dibungkus `ScrollableTabsContainer` dengan tombol panah navigasi mengambang (`<ChevronLeft />` & `<ChevronRight />`), efek fade gradasi halus, gesture *mouse drag-to-scroll*, dan penyesuaian otomatis ke tab aktif (*auto-scroll active tab into view*).

---

### ⚡ 6. Kinerja, Concurrency & Real-Time Data (Performance & Data Management)
1. **Pembersihan Listener Real-Time (Socket.io Disconnect Handlers)**:
   - Setiap langganan `socket.on` atau interval polling WAJIB menyertakan fungsi *cleanup* (`socket.off` / `disconnect`) pada *cleanup function* `useEffect` untuk mencegah kebocoran memori (*memory leak*).
2. **Optimasi Beban Data (Query Limits & Pagination)**:
   - Data ucapan doa dan RSVP wajib dibatasi (`LIMIT 50` atau pagination) agar konsumsi bandwidth dan kueri basis data tetap hemat dan cepat.
3. **Aset & Audio Lazy-Loading**:
   - Elemen audio menggunakan mode streaming atau play-on-user-interaction.
   - Gambar didistribusikan dengan kompresi WebP/JPEG teroptimasi dan memanfaatkan atribut `loading="lazy"`.
4. **Kompresi Gambar Otomatis Client-Side (`compressImageToFile`)**:
   - Seluruh foto yang diunggah melalui Admin Panel (profil mempelai, banner, QRIS, galeri) WAJIB dikompresi di browser menggunakan Canvas sebelum diunggah ke endpoint REST API server. Foto dikonversi menjadi WebP/JPEG max 1400px (~150-250KB) untuk menghemat 95% bandwidth jaringan dan ruang penyimpanan disk server.
5. **Caching Aset Statis & Uploads di Server**:
   - Endpoint statis `/uploads` WAJIB mengembalikan header `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400` (30 hari) agar browser pengguna tidak mengunduh ulang foto yang sama berulang kali.
   - Aset terkompilasi di `dist` dikonfigurasi dengan cache `1y` (immutable) dengan pengecualian `index.html` yang wajib `no-cache`.
6. **Instant Hydration Stale-While-Revalidate (SWR) pada Konfigurasi**:
   - `WeddingContext` memanfaatkan sinkronisasi ganda: data dimuat seketika dari cache `localStorage` (0ms delay rendering, menghilangkan spinner tunggu) dan secara asinkron diselaraskan dengan backend melalui REST API dan event Socket.io `config:updated`.
7. **Peta Google Maps Dinamis Smart Hybrid (`getEmbedMapUrl`)**:
   - Komponen peta (`LocationSection.tsx`) DILARANG MENGGUNAKAN URL IFRAME HARDCODED. URL iframe embed WAJIB diproses secara dinamis menggunakan helper `getEmbedMapUrl` yang mampu mengekstrak tag `<iframe>`, link embed resmi, link share Google Maps (`maps.app.goo.gl`), atau mensintesis otomatis dari nama tempat (*venue*) dan alamat lengkap (*address*) tanpa memerlukan API key berbayar.
8. **Audio Auto-Ducking & Mutex Pesan Suara (`wedding:voice-memo-play`)**:
   - Pemutaran audio latar (`MusicPlayer.tsx`) dan pesan suara ucapan tamu (`WishAudioPlayer.tsx`) dikomunikasikan secara terisolasi melalui CustomEvent bus `wedding:voice-memo-play`.
   - Ketika tamu memutar pesan suara doa, background music wajib otomatis meredup (*auto-ducking*) ke volume rendah (15%) dan kembali pulih normal saat pemutaran selesai. Hanya boleh 1 pesan suara yang aktif dalam 1 waktu (*mutex playback* via event `wedding:voice-memo-start`).
9. **In-Memory SWR Caching Konfigurasi Publik (`cachedConfig`)**:
   - Endpoint `GET /api/config` mengimplementasikan in-memory caching di memori server Node.js dengan TTL 5 menit (`CACHE_TTL_MS = 300000`) dan *instant cache synchronization* saat mutasi data (`PUT /api/config` atau `POST /api/config/rundown`). Menghemat 100% beban kueri MySQL saat ribuan tamu membuka undangan secara serentak.
10. **Transaksi Atomik Multi-Row Bulk Import (`INSERT INTO guests (...) VALUES ?`)**:
    - Impor batch tamu undangan (`POST /api/guests`) WAJIB menggunakan satu transaksi atomik MySQL (`beginTransaction`, `commit`, `rollback`) dengan pemecahan paket kueri per 500 baris. DILARANG mengeksekusi kueri satu per satu dalam loop tanpa transaksi.
11. **Proteksi Kunci Jawaban Kuis Trivia di Server (`POST /api/trivia/verify`)**:
    - Endpoint kuis publik `GET /api/trivia` menyensor kolom `correct_index` dan `explanation`. Verifikasi jawaban kuis wajib dilakukan secara aman di sisi server via `POST /api/trivia/verify` guna mengeliminasi kecurangan tamu via DevTools Network inspection.
12. **Protokol PWA & Offline-First Meja Resepsi Hari-H (`offlineCheckinStore.ts` & Workbox)**:
    - Meja resepsi (`ReceptionCheckin.tsx`) menerapkan arsitektur offline-first menggunakan IndexedDB browser (`mari_partner_offline_v1`) untuk snapshot daftar tamu, penataan meja, dan antrean check-in fisik saat sinyal seluler/Wi-Fi venue drop.
    - Saat offline, check-in diperbarui seketika (*optimistic UI*), memainkan nada chime Web Audio API, dan disimpan dalam antrean lokal.
    - Begitu koneksi pulih (`online` event), antrean disinkronkan secara atomik dan idempoten ke backend melalui `POST /api/checkins/sync` disertai tombol sinkronisasi manual.
13. **Suite WhatsApp Gateway Multi-Provider & Filter Kategori Tamu (`whatsappGateway.ts` & `WhatsAppBroadcastModal.tsx`)**:
    - Mendukung 4 mode pengiriman pesan: Manual `wa.me`, Fonnte, WAHA (WhatsApp HTTP API self-hosted), dan Twilio Programmable Messaging dengan *graceful fallback* ke mode manual saat langganan gateway belum tersedia.
    - Pengiriman pesan massal (*automated queue broadcast*) WAJIB menerapkan *safe anti-spam random delay jitter* (2.5 - 4.0 detik per pesan) untuk mencegah pemblokiran nomor oleh WhatsApp.
    - Sistem notifikasi dua arah (*two-way automated alert*) via background fire-and-forget worker saat tamu mengisi formulir konfirmasi kehadiran RSVP:
      1. Notifikasi seketika ke WhatsApp Admin / Mempelai berisikan nama tamu, status kehadiran, jumlah pax, dan doa.
      2. Pesan konfirmasi dan tautan kartu undangan / QR Pass tamu secara otomatis ke nomor WhatsApp tamu yang bersangkutan.
    - Penyaringan penerima pesan multi-dimensi (Status Pengiriman, Tier Tamu, Status RSVP, Status Check-in, dan Pencarian Teks).

---

### 🧪 7. Verifikasi & Pengujian Mutu (Verification & Quality Assurance)
> [!IMPORTANT]
> **Standardisasi Package Manager**: Proyek ini telah distandardisasi murni menggunakan **`npm`** (`package-lock.json`). Dilarang menggunakan `bun` untuk kompilasi produksi, type checking, maupun instalasi dependensi.

> [!NOTE]
> **User Directive (Dev & Build Server)**: Tidak perlu menjalankan `npm run dev` atau `npm run build` secara otomatis, karena pengguna telah menjalankan `npm run dev` secara manual di terminal terpisah. Cukup gunakan `npm run lint` (`tsc --noEmit`) untuk verifikasi integritas tipe statis.

Sebelum menyatakan tugas selesai atau melakukan commit, AI Assistant WAJIB melakukan verifikasi bertingkat:
1. **TypeScript Check**: Jalankan pengecekan tipe statis menggunakan `npm`:
   ```bash
   npm run lint  # (tsc --noEmit)
   ```
   Wajib menghasilkan exit code 0 tanpa error tipe apa pun.
2. **Automated Unit & Integration Tests**: Jalankan suite pengujian Vitest:
   ```bash
   npm test  # (vitest run)
   ```
   Seluruh test case (utilitas tiket QR, synthesizer audio, IndexedDB fallback, dan Express REST API integration) wajib lulus 100%.
3. **High-Concurrency Load Testing (Benchmark)**: Uji ketahanan server menggunakan Autocannon:
   ```bash
   npm run test:load  # (tsx server/loadtest/benchmark.ts)
   ```
   Memvalidasi performa in-memory caching SWR, throughput > 900 RPS, dan p95 latency dengan 0% server error.
4. **Console Hygiene Check**: Pastikan tidak ada runtime crash, error unhandled promise, atau violation Chrome DevTools di browser.

---

### 🏷️ 8. Aturan Versioning Aplikasi (Semantic Versioning - SemVer)
Setiap pengerjaan peningkatan kode, perbaikan bug, atau penambahan fitur baru **WAJIB** menaikkan penomoran versi aplikasi (`MAJOR.MINOR.PATCH`) di file `package.json`, `src/version.ts`, `composer.json` (jika ada pada stack terkait), `README.md`, dan `AGENTS.md`:

- **MAJOR (`X.0.0`)**: Naik saat ada perubahan besar yang tidak kompatibel dengan versi sebelumnya (*breaking changes*).
- **MINOR (`1.X.0`)**: Naik saat ada penambahan fitur baru yang aman dan kompatibel dengan versi sebelumnya.
- **PATCH (`1.0.X`)**: Naik saat ada perbaikan bug (*bugfixes*), refactoring, atau perbaikan kecil yang aman.

---

### 📦 9. Aturan Git Commit & Push Otomatis (Conventional Commits)
Setiap selesai pengerjaan tugas, AI Assistant **WAJIB** melakukan commit dan push ke GitHub secara otomatis dengan aturan:

#### Format Pesan Commit (Conventional Commits):
```text
Format: <type>(<scope>): <description>
```

#### Tipe (`type`):
- `feat`: Menambahkan fitur baru.
- `fix`: Memperbaiki bug atau error.
- `docs`: Mengubah atau memperbarui dokumentasi.
- `style`: Mengubah format kode tanpa mengubah logika (spasi, titik koma, kerapian).
- `refactor`: Mengubah struktur kode tanpa menambah fitur / memperbarui bug.
- `test`: Menambah atau memperbaiki unit test.
- `chore`: Perawatan rutin (update dependency, konfigurasikan file).

#### Aturan Penulisan Kalimat Commit:
1. **Kata Kerja Imperatif (Perintah)**: Gunakan `add`, `fix`, `update`, `refactor` (bukan `added`, `fixing`, `updated`).
2. **Judul Maksimal 50 Karakter**: Jaga judul subjek singkat dan jelas.
3. **Tanpa Tanda Titik**: Dilarang mengakhiri baris subjek dengan tanda titik `.`.
4. **Commit Atomik**: 1 commit fokus pada 1 tugas spesifik dan pastikan kode tidak *broken* sebelum commit.

---

### 🔄 10. Kewajiban Pengkinian Dokumen (Mandatory Sync)
1. **Sinkronisasi AGENTS.md**: Setiap kali ada aturan baru atau penyesuaian panduan pengodean, **WAJIB** langsung dicatat dan diperbarui pada `AGENTS.md`.
2. **Sinkronisasi Wajib & Berkelanjutan README.md**: Setiap kali ada penambahan fitur baru, perbaikan besar, perubahan arsitektur, penambahan tema, modifikasi alur, atau kenaikan versi, AI Assistant **WAJIB** langsung memperbarui `README.md` secara komprehensif agar selalu 100% mencerminkan konsep dan kapabilitas terkini (*Single Source of Truth* publik). Dilarang membiarkan `README.md` tertinggal atau usang (*stale*).
3. **Sinkronisasi Docs Suite (`docs/`)**: Apabila terdapat penambahan perintah CLI baru, fitur admin baru, strategi bisnis, atau perubahan alur deploy, perbarui dokumen terkait di `docs/01-daftar-command.md`, `docs/02-buku-panduan-pengguna.md`, `docs/03-developer-guide.md`, `docs/04-panduan-deployment.md`, `docs/05-panduan-bisnis-kemitraan-dan-sales-playbook.md`, `docs/06-pitch-deck-one-pager-wo.md`, `docs/07-formulir-onboarding-klien-baru.md`, `docs/08-panduan-skenario-demo-presentasi.md`, atau `docs/09-panduan-otomatisasi-deploy-klien.md`.

---

## 📋 Checklist Verifikasi Akhir Sebelum Selesai (Pre-Completion Protocol)

Sebelum AI Assistant mengakhiri sesi pengerjaan tugas, lakukan pengecekan berikut secara berurutan:
- [ ] Kode bebas dari tipe `any`, komentar *slop*, `console.log`, dan dialog browser `alert()` / `confirm()`.
- [ ] Struktur direktori modul pada `src/modules/` 100% konsisten berhuruf kecil murni (`auth`, `backend`, `frontend`, `shared`, `themes`).
- [ ] Seluruh seksi bersama di `src/modules/frontend/shared/` 100% netral budaya tanpa ketergantungan ornamen adat spesifik.
- [ ] Setiap tema memiliki paket aset default luring di `public/assets/themes/{id}/` dan animasi dekorasi tematik (`motion/react`).
- [ ] Berkas `.env` dan `.env.example` 100% konsisten dalam kunci, urutan, dan penamaan (Pilar 3).
- [ ] Menjalankan verifikasi tipe `tsc --noEmit` / `npm run lint` dan lulus 100%.
- [ ] Menjalankan uji kompilasi `npm run build` (opsional / dilewati jika dev server aktif manual sesuai User Directive).
- [ ] Versi SemVer dinaikkan di `package.json`, `src/version.ts`, `README.md`, dan `AGENTS.md` (Pilar 8).
- [ ] Dokumentasi `README.md` dan `AGENTS.md` tersinkronisasi dengan perubahan terbaru (Pilar 10).
- [ ] Melakukan Git commit dengan format *Conventional Commits* dan melakukan push ke repositori GitHub (Pilar 9).
