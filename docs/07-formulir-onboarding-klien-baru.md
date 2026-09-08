# 📋 Formulir Onboarding & Pengumpulan Data Klien Baru

Dokumen ini adalah **SOP standar pengumpulan data calon pengantin** setelah mereka menyetujui pesanan (*deal*). Anda dapat menyalin teks di bawah ini dan langsung mengirimkannya ke klien melalui WhatsApp atau memindahkannya ke formulir Google Forms.

---

## 📲 Template Teks WhatsApp Siap Salin (Kirim ke Calon Pengantin)

```text
Halo Kak [Nama Pengantin/WO], selamat atas persiapan hari bahagianya! ✨

Agar tim kami bisa langsung memproses pembuatan website undangan digital & sistem meja resepsi Kakak, mohon bantuannya untuk melengkapi formulir data di bawah ini ya Kak:

💍 DATA MEMPELAI PRIA
• Nama Lengkap & Gelar: 
• Nama Panggilan: 
• Putra dari Bapak: 
• & Ibu: 
• Anak ke- (contoh: Putra pertama): 
• Akun Instagram: @...
• Foto Profil Pria: (Kirim via lampiran dokumen WA / Google Drive)

💍 DATA MEMPELAI WANITA
• Nama Lengkap & Gelar: 
• Nama Panggilan: 
• Putri dari Bapak: 
• & Ibu: 
• Anak ke- (contoh: Putri kedua): 
• Akun Instagram: @...
• Foto Profil Wanita: (Kirim via lampiran dokumen WA / Google Drive)

📅 RANGKAIAN ACARA
1. AKAD NIKAH / PEMBERKATAN
• Hari & Tanggal: 
• Waktu / Jam: (contoh: 08.00 - 10.00 WIB)
• Nama Tempat / Venue: 
• Alamat Lengkap: 
• Link Google Maps: 

2. RESEPSI PERNIKAHAN
• Hari & Tanggal: 
• Waktu / Jam: (contoh: 11.00 - 14.00 WIB)
• Nama Tempat / Venue: 
• Alamat Lengkap: 
• Link Google Maps: 

🎨 PREFERENSI DESAIN & MUSIK
• Pilihan Tema: (Pilih dari katalog 35 tema, misal: Betawi, Jawa, Sunda, Minang, Royal, Minimalist, dll)
• Judul Lagu / Link YouTube Musik Latar: 
• Mode Putar Musik: (Repeat All / Repeat One / Shuffle / Linear)

🎁 HADIAH PERNIKAHAN / AMPLOP DIGITAL
• Rekening Bank 1: [Nama Bank] - [Nomor Rekening] - a.n [Nama Pemilik]
• Rekening Bank 2 (opsional): [Nama Bank] - [Nomor Rekening] - a.n [Nama Pemilik]
• Barcode QRIS: (Kirimkan gambar/file foto QRIS jika ada)

📸 FOTO PREWEDDING & KISAH CINTA
• Foto Galeri: (Kirimkan 5 - 20 foto prewedding terbaik via Google Drive)
• Kisah Cinta (Singkat per fase):
  1. Pertama Bertemu (Tahun & Cerita singkat):
  2. Mulai Menjalin Kasih (Tahun & Cerita):
  3. Lamaran / Tunangan (Tahun & Cerita):

Terima kasih banyak Kak! Jika data sudah lengkap, estimasi proses pembuatan adalah 1x24 jam. Kami akan kirimkan link preview perdananya untuk ditinjau bersama ya Kak. 🙏✨
```

---

## 📊 Format Standar Impor Buku Tamu Excel (.xlsx / .csv)

Jika klien atau Wedding Organizer memiliki daftar nama tamu dalam jumlah ratusan, **jangan input satu per satu secara manual**. Minta mereka mengisi template spreadsheet dengan kolom-kolom berikut:

### Tabel Skema Kolom Template:
| Kolom A | Kolom B | Kolom C | Kolom D | Kolom E | Kolom F |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nama Tamu** | **Nomor WhatsApp** | **Tier VIP** | **Nomor Meja** | **Estimasi Pax** | **Catatan Protokoler** |
| *Wajib diisi* | *Opsional (format: 08xx / 628xx)* | *Pilihan: `vvip`, `vip`, `family`, `regular`* | *Opsional (contoh: Meja 01, VIP-A)* | *Default: 1 atau 2* | *Opsional (contoh: Kursi roda, Rombongan Menteri)* |

### Contoh Isi Baris Data:
```csv
Nama Tamu,Nomor WhatsApp,Tier VIP,Nomor Meja,Estimasi Pax,Catatan Protokoler
dr. H. Muhammad Rizky Sp.A,081234567890,vvip,VIP-01,2,Duduk berdampingan dengan keluarga mempelai pria
Bapak Hendra Wijaya & Partner,081298765432,vip,Meja 04,2,Tamu VIP rekanan kantor pusat
Keluarga Besar H. Ahmad Fauzi,085712345678,family,Meja 02,4,Alokasi dekat panggung pelaminan
Siti Rahmawati S.Kom,081345678901,regular,Meja 08,1,-
```

### Cara Memasukkan ke Sistem (1-Klik Massal):
1. Buka panel admin: `https://domainanda.com/modules` (Tab **Buku Tamu / Daftar Undangan**).
2. Klik tombol **Impor Tamu (Excel / CSV)**.
3. Unggah file spreadsheet tersebut. Sistem akan memvalidasi data dan memasukkannya ke database MySQL dalam satu transaksi atomik dalam hitungan detik.
4. Tautan WhatsApp otomatis terbuat untuk masing-masing tamu secara instan!

---

## 📁 Struktur Penyimpanan Berkas Klien di Google Drive

Untuk menjaga kerapian file dari setiap pesanan klien, buat folder di Google Drive Anda dengan format:

```text
📁 Mari Partner - Client Projects/
└── 📁 2026-10-24_Dimas_Anisa/
    ├── 📄 Data_Mempelai_dan_Acara.txt
    ├── 📊 Daftar_Tamu_Undangan.xlsx
    ├── 📁 Foto_Profil/
    │   ├── groom_dimas.jpg
    │   └── bride_anisa.jpg
    ├── 📁 Foto_Galeri_Prewedding/
    │   ├── gallery_01.jpg
    │   ├── gallery_02.jpg
    │   └── ...
    └── 📁 Pembayaran_dan_QRIS/
        ├── qris_dimas_anisa.png
        └── bukti_transfer_dp.pdf
```
