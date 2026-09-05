import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  QrCode,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { generateQRCodeDataURL } from '../../../../utils/qrGenerator';
import { playStageChime } from '../../../../utils/stageChime';
import type { Wish } from '../../../../types';

export function LiveWishesProjector() {
  const { weddingConfig } = useWeddingConfig();
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Carousel & Spotlight state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cycleSpeedSeconds, setCycleSpeedSeconds] = useState<number>(7);
  const [spotlightWish, setSpotlightWish] = useState<Wish | null>(null);
  const initialLoadRef = useRef<boolean>(true);
  const previousLatestIdRef = useRef<string | null>(null);

  // Audio & Fullscreen state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Operator bar auto-hide state
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const hideControlsTimerRef = useRef<number | null>(null);

  const coupleNames = `${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
  const eventDate = weddingConfig.events.resepsi.date || weddingConfig.dateStr || 'Hari Bahagia';
  const eventVenue = weddingConfig.events.resepsi.venue || 'Ballroom Resepsi';

  // Generate QR Code for guests to send wishes
  useEffect(() => {
    let isMounted = true;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const wishUrl = `${origin}/#ucapan`;

    generateQRCodeDataURL(wishUrl, {
      width: 400,
      margin: 2,
      darkColor: '#1A2E26',
      lightColor: '#FFFFFF',
    }).then((url) => {
      if (isMounted) {
        setQrDataUrl(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Auto-hide controls bar on mouse inactivity
  const handleMouseMove = useCallback(() => {
    setIsControlsVisible(true);
    if (hideControlsTimerRef.current) {
      window.clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = window.setTimeout(() => {
      setIsControlsVisible(false);
    }, 3500);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideControlsTimerRef.current) {
        window.clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [handleMouseMove]);

  // Real-time Firestore sync for wishes
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Wish[];

      if (docs.length > 0) {
        const newest = docs[0];

        // If not initial load and a brand new wish arrived
        if (!initialLoadRef.current && newest.id && newest.id !== previousLatestIdRef.current) {
          // Play chime sound if not muted
          if (!isAudioMuted) {
            playStageChime();
          }
          // Show spotlight celebration modal for 6.5 seconds
          setSpotlightWish(newest);
          setTimeout(() => {
            setSpotlightWish(null);
          }, 6500);
        }

        previousLatestIdRef.current = newest.id || null;
      }

      initialLoadRef.current = false;
      setWishes(docs);
    });

    return () => unsubscribe();
  }, [isAudioMuted]);

  // Auto-cycle carousel timer
  useEffect(() => {
    if (isPaused || wishes.length <= 1 || spotlightWish) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wishes.length);
    }, cycleSpeedSeconds * 1000);

    return () => clearInterval(interval);
  }, [isPaused, cycleSpeedSeconds, wishes.length, spotlightWish]);

  // Current active wish to display in main view
  const currentWish = useMemo(() => {
    if (wishes.length === 0) return null;
    return wishes[currentIndex % wishes.length];
  }, [wishes, currentIndex]);

  // Handle manual next/prev
  const handleNextWish = () => {
    if (wishes.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % wishes.length);
  };

  const handlePrevWish = () => {
    if (wishes.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + wishes.length) % wishes.length);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen bg-[#0E1713] text-white overflow-hidden flex flex-col justify-between select-none font-body"
    >
      {/* Background Animated Gradient & Floating Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sage-dark/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#D4AF37]/15 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(40,65,55,0.25)_0%,rgba(14,23,19,0.95)_70%)]" />

        {/* Ambient floating gold particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#D4AF37]"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 8.5) % 95}%`,
              top: `${(i * 11) % 90}%`,
              opacity: 0.35,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + (i % 5),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* TOPBAR: Ballroom Stage Brand */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C7851] flex items-center justify-center text-black font-bold shadow-lg shadow-[#D4AF37]/20">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="font-heading text-lg font-bold tracking-wider text-[#F2E3C6]">
              {coupleNames}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-white/50">
              Walimatul Ursy Live Stage Screen
            </p>
          </div>
        </div>

        {/* Live Indicator Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>LIVE INTERACTIVE STREAM</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
            <Heart size={13} className="text-red-400 fill-red-400" />
            <span className="font-bold text-white">{wishes.length}</span>
            <span className="text-white/60">Doa Restu</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: 16:9 Split Stage Cinema */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full items-center">
        {/* LEFT COLUMN: Monogram, Event Info, & Interactive QR Code (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full max-h-[580px] bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          <div>
            {/* Monogram Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-semibold tracking-widest uppercase mb-4">
              <Sparkles size={12} />
              <span>The Wedding Celebration</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#FAF5EE] leading-tight mb-2">
              {coupleNames}
            </h2>

            <p className="text-xs text-white/60 leading-relaxed mb-6">
              Terima kasih atas kehadiran dan segenap untaian doa restu tulus yang Anda berikan.
            </p>

            <div className="space-y-2.5 text-xs text-white/70 bg-black/20 p-3.5 rounded-2xl border border-white/5 mb-6">
              <div className="flex items-center gap-2.5">
                <Calendar size={14} className="text-[#D4AF37] shrink-0" />
                <span className="truncate">{eventDate}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[#D4AF37] shrink-0" />
                <span className="truncate">{eventVenue}</span>
              </div>
            </div>
          </div>

          {/* Interactive QR Code Card */}
          <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-[#D4AF37]/30 rounded-2xl p-4 text-center shadow-lg">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#D4AF37] mb-2.5 uppercase tracking-wider">
              <QrCode size={14} />
              <span>Kirim Doa Restu via HP</span>
            </div>

            <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-xl shadow-md border border-white/20 mb-2.5 flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scan untuk Kirim Doa"
                  className="w-full h-full object-contain select-none"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg animate-pulse" />
              )}
            </div>

            <p className="text-[11px] text-white/60 leading-tight">
              Arahkan kamera ponsel Anda ke QR Code untuk mengirim ucapan langsung ke layar ini.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Flowing Wish Spotlight & Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-center h-full max-h-[580px] relative">
          <AnimatePresence mode="wait">
            {wishes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white/[0.04] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center backdrop-blur-xl h-full"
              >
                <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mb-4 border border-[#D4AF37]/20">
                  <Heart size={36} />
                </div>
                <h3 className="font-heading text-2xl font-bold text-white mb-2">
                  Menunggu Doa Restu Pertama...
                </h3>
                <p className="text-sm text-white/60 max-w-md">
                  Pindai QR Code di samping untuk menjadi tamu pertama yang mengirimkan ucapan doa restu ke layar panggung!
                </p>
              </motion.div>
            ) : (
              currentWish && (
                <motion.div
                  key={currentWish.id || currentIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.96 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="relative bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.02] border border-[#D4AF37]/40 rounded-3xl p-8 sm:p-10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between h-full overflow-hidden"
                >
                  {/* Subtle Background Watermark Quote */}
                  <div className="absolute -top-10 -right-6 text-white/[0.03] text-[200px] font-serif select-none pointer-events-none">
                    “
                  </div>

                  {/* Top Wish Header: Sender Name & Relative Time */}
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        {/* Avatar Initial Circle */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#8C7851] to-sage-dark flex items-center justify-center text-white font-heading font-bold text-2xl shadow-lg border border-white/20 shrink-0">
                          {currentWish.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#FAF5EE] tracking-wide line-clamp-1">
                            {currentWish.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-white/50 mt-0.5">
                            <Clock size={12} className="text-[#D4AF37]" />
                            <span>{currentWish.time || 'Tamu Undangan'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Counter Indicator */}
                      <div className="text-xs font-mono font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 shrink-0">
                        {currentIndex + 1} / {wishes.length}
                      </div>
                    </div>

                    {/* Main Wish Text */}
                    <div className="my-auto py-4">
                      <p className="font-heading text-xl sm:text-2xl lg:text-3xl text-white/95 leading-relaxed font-normal italic">
                        "{currentWish.text}"
                      </p>
                    </div>
                  </div>

                  {/* Bottom Wish Footer Info */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <Heart size={14} className="fill-[#D4AF37]" />
                      <span className="font-semibold">Doa Restu Sahabat & Keluarga</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>Bergulir otomatis setiap {cycleSpeedSeconds}s</span>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* BOTTOM FLOATING OPERATOR CONTROLS BAR (Auto-hides on idle) */}
      <footer
        className={`relative z-20 px-8 py-4 flex items-center justify-between transition-opacity duration-500 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/modules';
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            title="Keluar / Kembali"
          >
            <ArrowLeft size={14} />
            <span>Kembali</span>
          </button>
        </div>

        {/* Center Control Group: Play/Pause, Prev, Next, Speed Selector */}
        <div className="flex items-center gap-2 bg-black/50 border border-white/15 px-3 py-1.5 rounded-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={handlePrevWish}
            disabled={wishes.length <= 1}
            className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
            title="Ucapan Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl hover:bg-white/10 text-[#D4AF37] transition-colors cursor-pointer"
            title={isPaused ? 'Lanjutkan Putar Otomatis' : 'Jeda Rotasi'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          <button
            type="button"
            onClick={handleNextWish}
            disabled={wishes.length <= 1}
            className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-30"
            title="Ucapan Berikutnya"
          >
            <ChevronRight size={16} />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" />

          {/* Speed Selector Buttons */}
          <div className="flex items-center gap-1 text-[11px] font-semibold">
            {[4, 7, 10].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setCycleSpeedSeconds(spd)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  cycleSpeedSeconds === spd
                    ? 'bg-[#D4AF37] text-black font-bold'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {spd}s
              </button>
            ))}
          </div>
        </div>

        {/* Right Action Group: Sound Mute & Fullscreen Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isAudioMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                : 'bg-white/10 border-white/15 text-white hover:bg-white/20'
            }`}
            title={isAudioMuted ? 'Nyalakan Suara Chime' : 'Matikan Suara Chime'}
          >
            {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (F11)'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </footer>

      {/* REAL-TIME SPOTLIGHT OVERLAY (Celebration Pop-up when a new wish arrives) */}
      <AnimatePresence>
        {spotlightWish && (
          <div className="fixed inset-0 w-screen h-screen z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: -40 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              className="relative w-full max-w-2xl bg-gradient-to-b from-[#1C2C23] to-[#0E1713] border-2 border-[#D4AF37] rounded-3xl p-8 sm:p-12 text-center shadow-[0_0_80px_rgba(212,175,55,0.35)] overflow-hidden"
            >
              {/* Top celebration icon badge */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C7851] text-black flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#D4AF37]/30">
                <Sparkles size={36} />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">
                <span>✨ Untaian Doa Restu Baru Masuk!</span>
              </div>

              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
                {spotlightWish.name}
              </h3>

              <div className="my-6 p-6 rounded-2xl bg-white/[0.04] border border-white/10">
                <p className="font-heading text-xl sm:text-2xl text-[#FAF5EE] italic leading-relaxed">
                  "{spotlightWish.text}"
                </p>
              </div>

              <p className="text-xs text-[#D4AF37]/80 uppercase tracking-widest font-semibold">
                Terima kasih atas doa restu indahnya untuk {coupleNames}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
