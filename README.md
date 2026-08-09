# 💍 app_weddinginvitation_react

Undangan pernikahan digital interaktif dan responsif dengan tema budaya Betawi, dibangun menggunakan React dan TypeScript.

## 📋 Daftar Isi
- [Deskripsi Proyek](#-deskripsi-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## 📖 Deskripsi Proyek
Proyek ini adalah aplikasi web *Single Page Application* (SPA) untuk undangan pernikahan digital. Aplikasi ini memecahkan masalah penyebaran undangan fisik dengan menyediakan platform *online* yang elegan, interaktif, dan mudah dibagikan. 

**Fitur Utama:**
* ✨ Animasi dan transisi yang halus menggunakan `motion/react`.
* 📱 Desain responsif (*mobile-first*) dengan Tailwind CSS.
* 🎵 Pemutar musik latar belakang terintegrasi.
* 🖼️ Galeri foto dengan fitur *lazy loading* untuk performa optimal (skor Lighthouse tinggi).
* 💌 Bagian RSVP, informasi acara, dan ucapan doa.
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
- Untuk mengundang **Guest A & Guest B**: `https://domainundangan.com/?to=Guest%20A%20&%20Guest%20B`

(Spasi dan karakter khusus seperti `&` idealnya di-encode sebagai `%20` untuk spasi dan `%26` untuk `&`, meskipun browser modern umumnya dapat menanganinya dengan baik.)

**Untuk membangun (*build*) versi produksi:**
```bash
npm run build
```
Hasil *build* akan berada di dalam folder `dist/`.

## 🤝 Kontribusi
Kami terbuka untuk kontribusi! Jika Anda ingin memperbarui atau memperbaiki kode proyek ini, ikuti aturan berikut:
1. Lakukan *Fork* pada repositori ini.
2. Buat *branch* khusus untuk fitur atau perbaikan Anda (`git checkout -b fitur/FiturBaru`).
3. Lakukan *commit* perubahan Anda dengan pesan yang jelas (`git commit -m 'Menambahkan FiturBaru'`).
4. *Push* ke *branch* Anda (`git push origin fitur/FiturBaru`).
5. Ajukan *Pull Request* ke *branch* utama.

Pastikan kode Anda lolos pengecekan dengan menjalankan `npm run lint` sebelum mengajukan *Pull Request*.

## 📄 Lisensi
Hak cipta © 2026. Proyek ini dilisensikan di bawah [MIT License](LICENSE). Anda diizinkan untuk menggunakan, memodifikasi, dan mendistribusikan kode ini untuk keperluan pribadi maupun komersial sesuai dengan syarat dan ketentuan lisensi tersebut.
