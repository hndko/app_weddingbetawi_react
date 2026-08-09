| Prioritas | Lokasi File | Masalah | Risiko | Perbaikan |
| --------- | ----------- | ------- | ------ | --------- |
| Critical | `/index.html` | Tidak ada metadata static untuk fallback social media crawler (WhatsApp, FB) yang tidak menjalankan JS | Tampilan link preview kosong atau hanya title generic. | Menambahkan `<title>`, `<meta description>`, Open Graph (`og:*`), dan Twitter Card statis. |
| High | `/src/App.tsx` | Metadata SPA statis dan tidak adaptif | Title dan deskripsi tidak update mengikuti nama mempelai dari konfigurasi Firebase | Menggunakan `react-helmet-async` pada `/src/App.tsx` untuk metadata dinamis. |
| High | `/public/robots.txt` | Tidak ada `robots.txt` | Halaman `/admin` bisa diindeks mesin pencari secara tak sengaja | Membuat `robots.txt` dengan `Disallow: /admin`. |
| Medium | `/public/sitemap.xml` | Tidak ada peta situs | Google kesulitan menemukan halaman publik (undangan) | Membuat `sitemap.xml` berisi URL statis untuk halaman utama. |
| Medium | `/src/App.tsx` | Halaman admin tidak diblokir indexer di level HTML | Halaman admin tampil di hasil pencarian Google | Menambahkan `<SEO robots="noindex, nofollow" />` saat route ke admin. |
| Low | `/public/*` | Tidak ada favicon, touch icons, dan manifest | Tab browser polos dan PWA tidak dikenali | Membuat favicon dan PWA app icon statis di direktori `public`. |
| Medium | `/src/components/admin/AdminPanel.tsx` | Metadata SEO belum bisa diubah melalui Admin Panel | Pengguna tidak dapat menyesuaikan judul dan link preview secara dinamis | Menambahkan tab Pengaturan SEO di Admin Panel yang terhubung ke Firebase. |
