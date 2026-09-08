export const config = {
  theme: "betawi",
  groom: {
    nickname: "Cecep",
    fullName: "Cecep Pratama",
    parents: "Putra dari Bapak H. Abdullah & Ibu Hj. Siti Aminah",
    instagram: "@rizkypratama",
    image: "/assets/defaults/groom.jpg"
  },
  bride: {
    nickname: "Ipeh",
    fullName: "Ipeh Putri",
    parents: "Putri dari Bapak H. Rahman & Ibu Hj. Fatimah",
    instagram: "@aisyahputri",
    image: "/assets/defaults/bride.jpg"
  },
  dateStr: "Minggu, 20 September 2026",
  dateISO: "2026-09-20T09:00:00+07:00",
  events: {
    akad: {
      title: "AKAD NIKAH",
      day: "Minggu",
      date: "20 September 2026",
      time: "09:00 - 11:00 WIB",
      venue: "Masjid Cut Meutia",
      address: "Jl. Taman Cut Mutiah No.1, Menteng, Jakarta Pusat",
      mapUrl: "https://maps.app.goo.gl/..."
    },
    resepsi: {
      title: "RESEPSI",
      day: "Minggu",
      date: "20 September 2026",
      time: "19:00 - 22:00 WIB",
      venue: "Gedung Smesco",
      address: "Jl. Gatot Subroto Kav. 94, Pancoran, Jakarta Selatan",
      mapUrl: "https://maps.app.goo.gl/..."
    }
  },
  gallery: [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1510076857177-7470076d4098?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  ],
  galleryLayout: 'editorial' as const,
  banks: [
    {
      name: "BCA",
      account: "1234567890",
      holder: "Cecep Pratama",
      isQris: false,
    },
  ],
  loveStory: [
    {
      year: "2021",
      title: "Pertama Bertemu",
      description: "Pertemuan pertama kami di sebuah acara kebudayaan Betawi di Setu Babakan."
    },
    {
      year: "2023",
      title: "Menjalin Hubungan",
      description: "Setelah mengenal lebih jauh, kami memutuskan untuk memulai lembaran baru bersama."
    },
    {
      year: "2025",
      title: "Lamaran",
      description: "Dengan restu kedua orang tua, kami melangkah ke jenjang yang lebih serius."
    },
    {
      year: "2026",
      title: "Menikah",
      description: "Puncak perjalanan cinta kami, mengikat janji suci di hadapan Allah SWT."
    }
  ],
  musicUrl: "https://www.youtube.com/watch?v=RO75uUZiAw0",
  music: {
    playlist: [
      { 
        url: "https://www.youtube.com/watch?v=RO75uUZiAw0",
        title: "Kidung Asmaradana (Instrumental)",
      }
    ],
    mode: 'repeat-all' as const,
    defaultVolume: 75
  },
  seo: {
    title: "The Wedding of Cecep & Ipeh | Wedding Invitation",
    description: "Kami mengundang Anda untuk hadir di acara pernikahan kami.",
    keywords: "wedding, pernikahan, undangan digital, Cecep, Ipeh",
    image: "/assets/betawi-themes/images/og-image.jpg"
  },
  agencyBranding: {
    mode: 'co_branded' as const,
    agencyName: 'Mari Partner Wedding Organizer',
    agencyRole: 'Official Wedding Organizer',
    agencyTagline: 'Professional Wedding Planner & Digital Concierge',
    agencyInstagram: '@maripartner.wedding',
    agencyWebsite: 'https://maripartner.com',
    agencyPhone: '+6281234567890',
    poweredByText: 'Powered by Mari Partner Digital Wedding Invitation Platform',
    poweredByUrl: 'https://maripartner.com',
    hideMariPartnerBranding: false,
  },
  liveRundown: {
    isActive: false,
    currentEvent: 'Akad Nikah & Ijab Qabul',
    customNote: 'Silakan tamu menempati kursi yang telah disediakan di area akad',
    updatedAt: new Date().toISOString(),
  },
  rundownSchedule: [
    { id: 'rd-1', time: '08:30 - 09:00', title: 'Penyambutan Tamu & Keluarga', description: 'Registrasi buku tamu digital di meja resepsi', zone: 'Lobi Utama' },
    { id: 'rd-2', time: '09:00 - 10:30', title: 'Akad Nikah & Ijab Qabul', description: 'Prosesi ijab qabul dan doa bersama keluarga inti', zone: 'Area Akad' },
    { id: 'rd-3', time: '11:00 - 12:30', title: 'Prosesi Adat & Temu Pengantin', description: 'Upacara adat budaya dan sungkeman kedua orang tua', zone: 'Pelaminan' },
    { id: 'rd-4', time: '12:30 - 14:00', title: 'Ramah Tamah & Prasmanan Resepsi', description: 'Santap siang prasmanan dan hiburan musik pengiring', zone: 'Ballroom' },
    { id: 'rd-5', time: '14:00 - 15:00', title: 'Sesi Foto Bersama & Penutupan', description: 'Sesi foto VIP, rekan kerja, dan sahabat mempelai', zone: 'Panggung Utama' },
  ],
  cover: {
    title: "The Wedding Of",
    salutation: "Kepada Yth. Bapak/Ibu/Saudara/i",
    buttonText: "Buka Undangan",
  },
  greeting: {
    salutation: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
    introText: "Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada acara resepsi pernikahan kami.",
  },
  quote: {
    enabled: true,
    text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
    source: "QS. Ar-Rum: 21",
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
  },
  closing: {
    thankText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
    salutation: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  },
  physicalGift: {
    enabled: false,
    recipientName: "Cecep Pratama & Ipeh Putri",
    phone: "+6281234567890",
    address: "Jl. Taman Cut Mutiah No. 1, RT 01 / RW 05, Menteng, Jakarta Pusat, DKI Jakarta 10350",
    notes: "Dapat dititipkan ke pos sekuriti jika penerima sedang tidak di tempat.",
  },
  streaming: {
    enabled: false,
    platform: "youtube" as const,
    url: "https://youtube.com/live/placeholder",
    label: "Live Streaming Akad & Resepsi",
  },
};
