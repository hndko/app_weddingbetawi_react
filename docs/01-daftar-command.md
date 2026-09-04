# 📟 Daftar Perintah Wajib & Operasional (CLI Reference)

Dokumen ini memuat referensi perintah baris perintah (*Command Line Interface*) lengkap untuk pengelolaan proyek **app_weddingbetawi_react** pada seluruh tahap siklus pengembangan: mulai dari instalasi, server lokal, pengujian tipe TypeScript, kompilasi produksi, hingga troubleshooting teknis.

---

## ⚙️ 1. Parameter Lingkungan Sistem

| Parameter | Nilai Standar | Keterangan |
| :--- | :--- | :--- |
| **Runtime Engine** | `Node.js >= 18.0.0` (Aktif: `v22.22.1`) dengan `npm >= 9.0.0` | Menggunakan npm murni sebagai package manager standar proyek. |
| **Development Server** | Vite 6.2 | Mendukung Fast Refresh (HMR). |
| **Port Default** | `3000` | Dikonfigurasi dengan binding `--host=0.0.0.0` agar dapat diakses dari smartphone pada jaringan Wi-Fi lokal yang sama. |
| **Target Build Output** | `./dist` | Berisi berkas statis `index.html`, berkas `.js`, dan `.css` hasil minifikasi. |
| **Database Engine** | Google Cloud Firestore (NoSQL) | Terhubung via Firebase Client SDK v12. |

---

## 🚀 2. Perintah Server Pengembangan (Localhost)

Aplikasi telah dikonfigurasi untuk berjalan pada host `0.0.0.0` dan port `3000`:

```bash
# Menjalankan dev server menggunakan npm
npm run dev
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

## 🔥 7. Manajemen Firebase & Security Rules

Jika Anda memiliki Firebase CLI (`firebase-tools`) terpasang secara global:

```bash
# Login ke akun Google Firebase Anda
firebase login

# Memeriksa daftar proyek Firebase aktif
firebase projects:list

# Deploy aturan keamanan Firestore (firestore.rules) ke cloud
firebase deploy --only firestore:rules
```

---

## 🌿 8. Konvensi Git & Conventional Commits

Proyek ini menerapkan standar pesan commit *Conventional Commits* untuk mempermudah pelacakan changelog:

| Tipe Commit | Format Contoh | Kegunaan |
| :--- | :--- | :--- |
| `feat:` | `git commit -m "feat: tambah integrasi countdown live"` | Penambahan fitur atau fungsi baru pada sistem. |
| `fix:` | `git commit -m "fix: atasi layout shift pada sampul mobile"` | Perbaikan bug atau kesalahan logic/UI. |
| `docs:` | `git commit -m "docs: perbarui panduan konfigurasi firebase"` | Penambahan atau pembaruan dokumentasi Markdown. |
| `refactor:` | `git commit -m "refactor: eliminasi native alert menjadi modal"` | Restrukturisasi kode tanpa mengubah fungsionalitas luar. |
| `style:` | `git commit -m "style: rapikan margin ornamen ondel-ondel"` | Penyesuaian formatting CSS, spasi, atau warna. |
| `chore:` | `git commit -m "chore: perbarui dependensi package-lock.json"` | Pembaruan build tooling, library, atau maintenance berkala. |

---

## 🛠️ 9. Troubleshooting & Diagnostik Masalah Umum

### 1. Port 3000 Sedang Digunakan (Port Already in Use)
Jika terminal menampilkan error `Port 3000 is in use, trying another one...`:
```powershell
# Cari proses yang memakai port 3000 di Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Matikan proses tersebut secara paksa (Ganti <PID> dengan Process ID yang ditemukan)
Stop-Process -Id <PID> -Force
```

### 2. Error Rollup Native Binary di Windows (`@rollup/rollup-win32-x64-msvc`)
Jika saat build muncul error `Cannot find module @rollup/rollup-win32-x64-msvc`:
```bash
npm install -D @rollup/rollup-win32-x64-msvc
```

### 3. Masalah Koneksi Database Firestore
- **Gejala**: Form RSVP atau ucapan gagal dikirim, atau data tidak muncul di layar.
- **Pemeriksaan Solusi**:
  1. Pastikan berkas `.env` ada di root proyek dan memuat kredensial `VITE_FIREBASE_API_KEY` dan `VITE_FIREBASE_PROJECT_ID` yang benar.
  2. Buka **Firebase Console > Firestore Database > Rules** dan pastikan rules mengizinkan operasi read/write:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```

---

## 📋 10. Cheatsheet Harian (Daily Operational Cheatsheet)

| Kebutuhan Operasional | Perintah Cepat CLI |
| :--- | :--- |
| Memulai pekerjaan harian (Dev server) | `npm run dev` |
| Verifikasi tipe sebelum commit | `npm run lint` |
| Menguji hasil kompilasi web | `npm run build && npm run preview` |
| Menambahkan pustaka ikon baru | `npm install <nama-library>` |
| Mengirim perubahan ke repositori | `git add . && git commit -m "feat: ..." && git push origin main` |
| Deploy instan ke Vercel | `git push origin main` *(otomatis via Webhook Vercel)* |
