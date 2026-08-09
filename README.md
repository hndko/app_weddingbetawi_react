# 💍 app_weddinginvitation_react

Undangan pernikahan digital interaktif dan responsif dengan tema budaya Betawi, dibangun menggunakan React dan TypeScript.

## 📋 Daftar Isi
- [Deskripsi Proyek](#-deskripsi-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [🔐 Admin Panel & Generator Link Tamu](#-admin-panel--generator-link-tamu)
- [☁️ Panduan Deploy ke Vercel](#️-panduan-deploy-ke-vercel)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## 📖 Deskripsi Proyek
Proyek ini adalah aplikasi web *Single Page Application* (SPA) untuk undangan pernikahan digital. Aplikasi ini memecahkan masalah penyebaran undangan fisik dengan menyediakan platform *online* yang elegan, interaktif, dan mudah dibagikan. 

**Fitur Utama:**
* ✨ Animasi dan transisi yang halus menggunakan `motion/react`.
* 📱 Desain responsif (*mobile-first*) dengan Tailwind CSS.
* 🎵 Pemutar musik latar belakang terintegrasi.
* 🖼️ Galeri foto dengan fitur *lazy loading* untuk performa optimal.
* 💌 Bagian RSVP, informasi acara, dan ucapan doa real-time terintegrasi Firebase Firestore.
* 🛠️ Admin Panel internal untuk kustomisasi isi undangan & generator link pesan WhatsApp.
* 🚀 Dibangun dengan Vite untuk proses *build* yang sangat cepat.

## 🛠️ Prasyarat
Sebelum menginstal proyek ini, pastikan sistem Anda memenuhi persyaratan berikut:
* **Node.js**: Versi 18.0.0 atau lebih baru.
* **npm**: Versi 9.0.0 atau lebih baru.

## 💻 Instalasi
Ikuti langkah-langkah di bawah ini untuk mengunduh dan memasang proyek di lingkungan lokal Anda:

1. **Kloning repositori:**
   ```bash
   git clone https://github.com/username/app_weddinginvitation_react.git
   ```

2. **Masuk ke direktori proyek:**
   ```bash
   cd app_weddinginvitation_react
   ```

3. **Instal dependensi:**
   ```bash
   npm install
   ```

## 🚀 Penggunaan
Berikut adalah cara untuk menjalankan aplikasi di lingkungan pengembangan lokal:

1. **Jalankan *development server*:**
   ```bash
   npm run dev
   ```

2. **Akses di browser:**
   Buka peramban web Anda dan kunjungi `http://localhost:3000`.

### 👥 Kustomisasi Nama Tamu Undangan
Untuk menampilkan nama tamu undangan secara spesifik di halaman depan (sampul), Anda dapat menambahkan parameter `?to=` di akhir URL undangan saat membagikannya.

**Contoh Penggunaan:**
- Jika URL utama: `https://domainundangan.com`
- Untuk mengundang **Budi**: `https://domainundangan.com/?to=Budi`
- Untuk mengundang **Bapak Ahmad & Keluarga**: `https://domainundangan.com/?to=Bapak%20Ahmad%20%26%20Keluarga`

---

## 🔐 Admin Panel & Generator Link Tamu

Untuk menjaga estetika tampilan undangan tamu, **tombol/toggle Admin telah dihilangkan dari layar utama**. 

### Cara Mengakses Admin Panel:
1. Buka URL undangan Anda lalu tambahkan parameter `?admin=true` atau `/admin` di paling belakang URL, contoh:
   - `https://domainundangan.com/?admin=true` atau `http://localhost:3000/?admin`
2. Masukkan passcode admin default: **`password`**
3. Di dalam Admin Panel, Anda dapat:
   - 🔗 **Membuat Link Tamu**: Ketik nama tamu dan langsung salin pesan & link yang siap dibagikan ke WhatsApp.
   - ✏️ **Edit Data Website**: Mengubah nama mempelai, tanggal acara, lokasi, rekening bank, hingga foto galeri (tersimpan otomatis ke Firestore).
   - 👥 **Pantau RSVP & Ucapan**: Melihat respon kehadiran dan pesan doa secara *real-time*.

---

## 🔥 Panduan Setup Database (Firebase) & Environment Variables

Jika Anda men-deploy undangan ini dari awal menggunakan akun Vercel milik Anda sendiri dan ingin menggunakan database Firebase baru, berikut adalah langkah-langkah lengkap untuk mendapatkan konfigurasi (Secret Values):

### 1. Buat Proyek Firebase Baru
1. Buka website **[Firebase Console](https://console.firebase.google.com/)** dan login menggunakan akun Google Anda.
2. Klik tombol **"Add project"** (Tambah proyek).
3. Masukkan nama proyek (misalnya: `undangan-pernikahan-saya`).
4. Matikan (Disable) *Google Analytics* jika tidak diperlukan, lalu klik **"Create project"**.
5. Tunggu proses selesai, lalu klik **"Continue"**.

### 2. Buat Database Firestore
1. Di menu sebelah kiri (sidebar), klik **"Build"** (atau "Bina") > **"Firestore Database"**.
2. Klik tombol **"Create database"**.
3. Pilih lokasi server yang dekat (misal: `asia-southeast2` untuk Jakarta), lalu klik **Next**.
4. Pilih **"Start in production mode"**, lalu klik **Create**.
5. Setelah database berhasil dibuat, buka tab **"Rules"** (Aturan) di atas tabel data.
6. Ubah kode *rules* tersebut menjadi kode berikut:
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
7. Klik tombol **"Publish"**.

⚠️ **Notifikasi "Your security rules are defined as public"**
Jika Anda mendapatkan notifikasi tersebut setelah mengganti rules di atas, **Anda bisa mengabaikannya untuk saat ini**. Aturan (`allow read, write: if true;`) ini sengaja dipasang agar proses pengembangan dan pengisian form RSVP/Ucapan dari tamu dapat langsung berjalan tanpa perlu setup autentikasi login tamu (lebih mudah untuk di akses tamu). Jika ada data spam, Anda selalu bisa menghapusnya lewat menu Admin Panel.

💡 **Catatan Terkait Upload Foto (Tidak Butuh Firebase Storage)**
Sistem undangan ini sekarang menggunakan teknik konversi dan kompresi foto menjadi teks (`Base64`) langsung ke dalam *database Firestore*. Anda **tidak perlu mengaktifkan atau membayar tagihan Firebase Storage**.

### 3. Dapatkan Kredensial Environment Variables (Secret Values)
1. Di menu sebelah kiri atas, klik ikon roda gigi (⚙️ **Settings**) tepat di bawah tulisan "Project Overview", lalu pilih **"General"**.
2. Gulir layar Anda perlahan ke bagian paling bawah sampai menemukan bagian **"Your apps"**.
3. Karena Anda belum menambahkan aplikasi, Anda akan melihat beberapa ikon (iOS, Android, Web, Unity, dll). Klik tombol berikon **`</>` (Web)**.
4. Masukkan nama panggilan aplikasi (misal: `web-undangan`), biarkan *checkbox* Firebase Hosting kosong, lalu klik **"Register app"**.
5. Anda akan melihat sekumpulan kode di dalam blok `firebaseConfig`. **Inilah secret values yang Anda butuhkan!**
   Kodenya akan terlihat seperti ini:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyB-xxxxxxxxxxxx",
     authDomain: "proyek-anda.firebaseapp.com",
     projectId: "proyek-anda",
     storageBucket: "proyek-anda.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:12345:web:abcd"
   };
   ```
6. Copy nilai-nilai tersebut (tanpa tanda kutip), lalu klik **"Continue to console"**.

### 4. Masukkan Secret Values ke Aplikasi Anda

**Cara A: Di Komputer Anda (Localhost)**
1. Buat file baru dengan nama `.env` di folder utama aplikasi Anda (bisa dengan mengkopi file `.env.example`).
2. Isi *value* yang kosong dengan data dari kode yang Anda dapatkan di langkah 3:
   ```env
   VITE_FIREBASE_API_KEY="AIzaSyB-xxxxxxxxxxxx"
   VITE_FIREBASE_AUTH_DOMAIN="proyek-anda.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="proyek-anda"
   VITE_FIREBASE_STORAGE_BUCKET="proyek-anda.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
   VITE_FIREBASE_APP_ID="1:12345:web:abcd"
   VITE_FIREBASE_DATABASE_ID="" # (Bisa dikosongkan untuk database bawaan)
   ```

**Cara B: Di Dashboard Vercel (Production)**
1. Buka dashboard proyek Anda di **[Vercel](https://vercel.com/)**.
2. Masuk ke menu **Settings** > **Environment Variables**.
3. Tambahkan *Key* (contoh: `VITE_FIREBASE_API_KEY`) dan *Value* (contoh: `AIzaSyB-xxxxxxxxxxxx`) satu per satu dari data langkah 3.
4. Klik **Save** setiap kali menambah variabel.
5. Setelah semua ke-6 variabel (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID) ditambahkan, Anda perlu memicu *build* baru agar variabel diterapkan:
   - Buka tab **Deployments**.
   - Klik titik tiga (⋮) pada deployment terbaru, lalu pilih **Redeploy**.

---

## ☁️ Panduan Deploy ke Vercel

Apakah sudah otomatis atau ada yang perlu disetup di Vercel?
**Jawabannya: Hampir 100% Otomatis!** 

File konfigurasi Firebase (`firebase-applet-config.json`) sudah ada di dalam proyek ini, sehingga Vite & Vercel akan langsung membundel konfigurasi database tersebut tanpa Anda harus memasukkan Environment Variable secara manual di Vercel Dashboard.

### Langkah-Langkah Deploy ke Vercel:

1. **Push Proyek ke GitHub / GitLab / Bitbucket**:
   ```bash
   git add .
   git commit -m "Siap deploy ke Vercel"
   git push origin main
   ```

2. **Import Proyek di Vercel**:
   - Buka dashboard [Vercel](https://vercel.com) dan klik **Add New > Project**.
   - Hubungkan akun GitHub Anda dan pilih repositori `app_weddinginvitation_react`.

3. **Konfigurasi Build Settings (Otomatis)**:
   Vercel akan secara otomatis mendeteksi **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Klik Deploy**:
   - Klik tombol **Deploy**. Tunggu proses *build* selesai sekitar 1 menit.
   - Website undangan pernikahan Anda sudah langsung aktif dan siap digunakan secara publik!

*(Opsional)* Jika di kemudian hari Anda ingin memindahkan kredensial Firebase ke Environment Variables Vercel, Anda dapat menambahkan variabel berikut di Vercel Dashboard (**Settings > Environment Variables**):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_DATABASE_ID`

---

## 🤝 Kontribusi
Kami terbuka untuk kontribusi! Jika Anda ingin memperbarui atau memperbaiki kode proyek ini, ikuti aturan berikut:
1. Lakukan *Fork* pada repositori ini.
2. Buat *branch* khusus untuk fitur atau perbaikan Anda (`git checkout -b fitur/FiturBaru`).
3. Lakukan *commit* perubahan Anda dengan pesan yang jelas (`git commit -m 'Menambahkan FiturBaru'`).
4. *Push* ke *branch* Anda (`git push origin fitur/FiturBaru`).
5. Ajukan *Pull Request* ke *branch* utama.

Pastikan kode Anda lolos pengecekan dengan menjalankan `npm run lint` sebelum mengajukan *Pull Request*.

## 📄 Lisensi
Hak cipta © 2026. Proyek ini dilisensikan di bawah [MIT License](LICENSE).

