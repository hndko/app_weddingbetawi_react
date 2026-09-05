# 🤖 AGENTS.md — Panduan & Aturan Proyek untuk AI Assistant & Coding Agents

Dokumen ini adalah **sumber kebenaran tunggal (*Single Source of Truth*)** untuk seluruh AI Assistant, Coding Agents, LLM Pair Programmer, dan pengembang yang bekerja pada repositori **Betawi Heritage - Digital Wedding Invitation SPA**. 

Setiap agen yang menginspeksi, memodifikasi, atau menambahkan kode pada proyek ini **WAJIB** membaca, memahami, dan mematuhi seluruh aturan di bawah ini tanpa pengecualian.

---

## 📌 Metadata Proyek
- **Nama Proyek**: Betawi Heritage Digital Wedding Invitation SPA
- **Versi Aplikasi Saat Ini**: `v1.16.0`
- **Tech Stack**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS v4, Firebase Firestore 12.17, Motion 12.23
- **Tipe Aplikasi**: Client-Side Single Page Application (SPA)
- **Status CI/CD & Deploy**: Vercel Serverless Static Hosting

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
   - `src/modules/backend/`: Modul pengelolaan data dan dasbor admin (`Panel.tsx`, `components/DragDropUpload.tsx`, `components/ThemeSelector.tsx`, `components/EventScheduleEditor.tsx`).
   - `src/modules/frontend/shared/`: Komponen dan seksi bersama lintas tema (`components/BottomNavigation.tsx`, `components/MusicPlayer.tsx`, `components/SEO.tsx`, `sections/RSVPSection.tsx`, `sections/WishesSection.tsx`, `sections/CountdownSection.tsx`, `sections/EventSection.tsx`, `sections/GallerySection.tsx`, `sections/LocationSection.tsx`, `sections/LoveStory.tsx`, `sections/WeddingGift.tsx`).
   - `src/modules/frontend/themes/`: Modul tema modular (`betawi/`, `jawa/`, `index.ts`, `types.ts`).
   - `public/assets/themes/{theme_id}/`: Aset default lokal offline (thumbnail, favicon, pattern) per tema.
   - `src/types.ts`: Deklarasi tipe TypeScript global dan interface domain.
   - `src/lib/firebase.ts`: Konfigurasi SDK Firebase dan instance Firestore.
   - `src/index.css`: Konfigurasi Tailwind CSS v4 dan styling global.
2. **Thin Presentational Components**: Komponen antarmuka fokus pada rendering UI. Logika manipulasi state kompleks, integrasi database, atau format string wajib didelegasikan ke fungsi pembantu (*helper*) atau *custom hooks*.
3. **Penyimpanan Gambar Efisien (Zero Storage Cost)**: Seluruh kompresi foto galeri atau QRIS dilakukan pada sisi klien via Canvas API (Base64 JPEG kompresi ~80-120KB) yang langsung disimpan ke Firestore tanpa memerlukan backend server atau Firebase Storage berbayar.
4. **Single Page Routing**: Navigasi menggunakan state lokal dan *smooth scrolling* internal section. Rute admin dikelola via path khusus `/login` dan `/modules` dengan sinkronisasi History API, serta penanganan parameter query nama tamu (`?to=Nama+Tamu`) secara elegan.
5. **Standarisasi Penamaan Folder Lowercase Murni (`src/modules/`)**:
   - Seluruh folder di dalam `src/modules/` WAJIB selalu menggunakan huruf kecil penuh: `auth/`, `backend/`, `frontend/`, `shared/`, `themes/`.
   - DILARANG KERAS menggunakan huruf kapital atau campuran huruf besar-kecil pada penamaan direktori maupun impor berkas modul guna mencegah galat *case-sensitivity* lintas sistem operasi (Windows vs Linux vs Vercel Serverless CI/CD) dan error kompilasi TypeScript `TS1149`/`TS1261`.
6. **Invarian Netral Budaya pada Layer Bersama (`shared/`)**:
   - Direktori `src/modules/frontend/shared/` mengisolasi komponen bersama (`BottomNavigation`, `MusicPlayer`, `SEO`) dan seksi data domain bersama (`RSVP`, `Wishes`, `Countdown`, `Event`, `Gallery`, `Location`, `LoveStory`, `WeddingGift`).
   - Seluruh berkas di `src/modules/frontend/shared/` WAJIB 100% netral budaya (*culturally agnostic*). DILARANG mengimpor atau merender ornamen khusus adat tertentu (seperti Ondel-ondel, siluet Monas, Rumah Kebaya, atau Gunungan Wayang). Gunakan ornamen pemisah netral (`SectionDivider`).
7. **Standar Paket Aset Default Luring Tema (*Offline Default Theme Assets Suite*)**:
   - Setiap tema pada `THEME_CATALOG` (`src/modules/frontend/themes/index.ts`) WAJIB menyediakan paket aset lokal mandiri di `public/assets/themes/{theme_id}/`:
     - `thumbnail.jpg` atau `thumbnail.svg`
     - `pattern.svg`
     - `favicon.svg`
   - DILARANG mengandalkan URL eksternal (seperti Unsplash atau CDN pihak ketiga) untuk aset dasar tema guna menjamin aplikasi tetap mandiri, tahan gangguan jaringan, dan dapat diakses luring (*zero external dependency*).

---

### 🔒 3. Standar Keamanan & Sanitasi Input (Security & OWASP Guardrails)
1. **Isolasi Rahasia & Kredensial (.env & .env.example)**:
   - DILARANG KERAS mengekspos API Key produksi, Firebase Service Account, atau OAuth credentials ke repositori publik.
   - Semua variabel lingkungan klien wajib menggunakan prefix `VITE_` (misal: `VITE_FIREBASE_API_KEY`).
   - File kredensial lokal dan rahasia wajib selalu terdaftar di `.gitignore`.
   - **Konsistensi Mutlak `.env` dan `.env.example`**: Seluruh variabel lingkungan pada `.env` dan `.env.example` WAJIB 100% sinkron dan konsisten (kunci yang sama, urutan yang sama, dan format penamaan yang sama). Setiap kali ada penambahan atau modifikasi variabel baru pada `.env`, `.env.example` WAJIB langsung diperbarui dengan nilai placeholder/dummy, dan sebaliknya. Variabel usang atau tidak terpakai wajib dieliminasi dari kedua berkas.
2. **Pencegahan Cross-Site Scripting (XSS)**:
   - Semua data dinamis dari pengguna (nama tamu, pesan ucapan, konfirmasi RSVP) wajib di-escape oleh React secara alami.
   - DILARANG menggunakan `dangerouslySetInnerHTML` tanpa pustaka sanitasi HTML pihak ketiga (seperti DOMPurify).
3. **Aturan Keamanan Firestore (Firestore Security Rules)**:
   - Pastikan aturan Firestore membatasi kuota panjang karakter (misal: nama maksimal 100 karakter, pesan doa maksimal 500 karakter).
   - Dokumen konfigurasi admin (`settings`) hanya boleh dimutasi oleh admin terotentikasi.
4. **Proteksi Panel Admin**:
   - Rute panel admin wajib dilindungi oleh passcode atau verifikasi Firebase Auth.
   - Cegah *brute-force* sederhana dengan penanganan delay visual pada UI.

---

### 💎 4. Kualitas Kode & Anti-Slop (Clean Code & Quality Invariants)
1. **TypeScript Strict (Zero Tolerance for `any`)**:
   - DILARANG menggunakan tipe `any`. Gunakan tipe data eksplisit, *union types*, atau `unknown` dengan *type guard*.
   - Setiap entitas Firestore (`Wishes`, `RSVP`, `WeddingContent`, `MusicTrack`) wajib memiliki interface lengkap di `src/types.ts`.
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

---

### ⚡ 6. Kinerja, Concurrency & Firestore Real-Time (Performance & Data Management)
1. **Pembersihan Listener Real-Time (Cleanup Handlers)**:
   - Setiap langganan `onSnapshot` Firestore WAJIB menyertakan fungsi *unsubscribe* pada *cleanup function* `useEffect` untuk mencegah kebocoran memori (*memory leak*).
2. **Optimasi Beban Data (Query Limits & Pagination)**:
   - Data ucapan doa dan RSVP wajib dibatasi (`limit(50)` atau pagination) agar konsumsi bandwidth dan Firestore Read tetap hemat dan cepat.
3. **Aset & Audio Lazy-Loading**:
   - Elemen audio menggunakan mode streaming atau play-on-user-interaction.
   - Gambar didistribusikan dengan kompresi WebP/JPEG teroptimasi dan memanfaatkan atribut `loading="lazy"`.

---

### 🧪 7. Verifikasi & Pengujian Mutu (Verification & Quality Assurance)
> [!IMPORTANT]
> **Standardisasi Package Manager**: Proyek ini telah distandardisasi murni menggunakan **`npm`** (`package-lock.json`). Dilarang menggunakan `bun` untuk kompilasi produksi, type checking, maupun instalasi dependensi.

Sebelum menyatakan tugas selesai atau melakukan commit, AI Assistant WAJIB melakukan verifikasi bertingkat:
1. **TypeScript Check**: Jalankan pengecekan tipe statis menggunakan `npm`:
   ```bash
   npm run lint  # (tsc --noEmit)
   ```
   Wajib menghasilkan exit code 0 tanpa error tipe apa pun.
2. **Production Build Check**: Jalankan proses kompilasi produksi Vite menggunakan `npm`:
   ```bash
   npm run build
   ```
   Wajib sukses menghasilkan bundel `dist/` tanpa peringatan fatal.
3. **Console Hygiene Check**: Pastikan tidak ada runtime crash atau error unhandled promise di browser.

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
2. **Sinkronisasi README.md**: Setiap kali ada penambahan fitur baru, perbaikan besar, perubahan API, atau kenaikan versi, **WAJIB** langsung memperbarui `README.md`.
3. **Sinkronisasi Docs Suite (`docs/`)**: Apabila terdapat penambahan perintah CLI baru, fitur admin baru, atau perubahan alur deploy, perbarui dokumen terkait di `docs/01-daftar-command.md`, `docs/02-buku-panduan-pengguna.md`, `docs/03-developer-guide.md`, atau `docs/04-panduan-deployment.md`.

---

## 📋 Checklist Verifikasi Akhir Sebelum Selesai (Pre-Completion Protocol)

Sebelum AI Assistant mengakhiri sesi pengerjaan tugas, lakukan pengecekan berikut secara berurutan:
- [ ] Kode bebas dari tipe `any`, komentar *slop*, `console.log`, dan dialog browser `alert()` / `confirm()`.
- [ ] Struktur direktori modul pada `src/modules/` 100% konsisten berhuruf kecil murni (`auth`, `backend`, `frontend`, `shared`, `themes`).
- [ ] Seluruh seksi bersama di `src/modules/frontend/shared/` 100% netral budaya tanpa ketergantungan ornamen adat spesifik.
- [ ] Setiap tema memiliki paket aset default luring di `public/assets/themes/{id}/` dan animasi dekorasi tematik (`motion/react`).
- [ ] Berkas `.env` dan `.env.example` 100% konsisten dalam kunci, urutan, dan penamaan (Pilar 3).
- [ ] Menjalankan verifikasi tipe `tsc --noEmit` / `npm run lint` dan lulus 100%.
- [ ] Menjalankan uji kompilasi `npm run build` dan sukses menghasilkan `dist/`.
- [ ] Versi SemVer dinaikkan di `package.json`, `src/version.ts`, `README.md`, dan `AGENTS.md` (Pilar 8).
- [ ] Dokumentasi `README.md` dan `AGENTS.md` tersinkronisasi dengan perubahan terbaru (Pilar 10).
- [ ] Melakukan Git commit dengan format *Conventional Commits* dan melakukan push ke repositori GitHub (Pilar 9).
