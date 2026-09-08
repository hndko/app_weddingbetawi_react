import React, { useState, useEffect, useCallback } from "react";
import { motion } from 'motion/react';
import { api } from '../../../../services/api';
import { socket } from '../../../../services/socket';
import { useGuestName } from '../../../../hooks/useGuestName';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';
import { AlertCircle, CheckCircle2, User, MessageSquareQuote, Send, ChevronDown, Loader2 } from 'lucide-react';
import { Wish } from '../../../../types';
import { VoiceMemoRecorder } from '../components/VoiceMemoRecorder';
import { WishAudioPlayer } from '../components/WishAudioPlayer';

function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-gold opacity-60 ${className}`} aria-hidden="true">
      <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-current" />
      <span className="text-xs">✦</span>
      <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

const defaultWishes: Wish[] = [
  { id: '1', name: 'Andi & Keluarga', text: 'Selamat menempuh hidup baru, semoga menjadi keluarga sakinah mawaddah warahmah.', time: '2 jam lalu' },
  { id: '2', name: 'Siti', text: 'Happy wedding! Lancar-lancar terus yaa dan bahagia selalu.', time: '5 jam lalu' },
];

export function WishesSection() {
  const defaultGuestName = useGuestName();
  const { tokens, isDark } = useThemeTokens();
  const [wishes, setWishes] = useState<Wish[]>(defaultWishes);
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreFromApi, setHasMoreFromApi] = useState(true);

  useEffect(() => {
    if (defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setName(defaultGuestName);
    }
  }, [defaultGuestName]);

  const loadWishes = useCallback(async () => {
    try {
      const data = await api.getWishes({ limit: 50, offset: 0 });
      if (data && data.length > 0) {
        setWishes(data);
        if (data.length < 50) {
          setHasMoreFromApi(false);
        }
      }
    } catch {
      // Fallback to defaultWishes
    }
  }, []);

  useEffect(() => {
    loadWishes();

    const handleWishCreated = (newWish: Wish) => {
      setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)]);
    };

    const handleWishDeleted = (deletedId: string) => {
      setWishes((prev) => prev.filter((w) => w.id !== deletedId));
    };

    socket.on('wish:created', handleWishCreated);
    socket.on('wish:deleted', handleWishDeleted);

    return () => {
      socket.off('wish:created', handleWishCreated);
      socket.off('wish:deleted', handleWishDeleted);
    };
  }, [loadWishes]);

  const handleLoadMore = async () => {
    if (visibleCount < wishes.length) {
      setVisibleCount((prev) => prev + 5);
      return;
    }
    if (!hasMoreFromApi || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const more = await api.getWishes({ limit: 50, offset: wishes.length });
      if (more && more.length > 0) {
        setWishes((prev) => [...prev, ...more]);
        setVisibleCount((prev) => prev + Math.min(5, more.length));
        if (more.length < 50) {
          setHasMoreFromApi(false);
        }
      } else {
        setHasMoreFromApi(false);
      }
    } catch {
      setHasMoreFromApi(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wishText.trim()) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await api.createWish({
        name: name.trim(),
        text: wishText.trim(),
        time: 'Baru saja',
      });
      setWishText('');
      setAudioUrl(null);
      setAudioDuration(0);
      setSuccessMessage('Ucapan dan doa Anda berhasil dikirimkan!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('Terlalu banyak') || msg.includes('429')) {
        setErrorMessage('Terlalu banyak pengiriman pesan. Mohon tunggu 1 menit sebelum mengirim ucapan lagi.');
      } else {
        setErrorMessage(msg || 'Gagal mengirim ucapan. Silakan periksa koneksi internet Anda dan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="py-24 px-6 relative overflow-hidden flex flex-col items-center transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <div className="max-w-[340px] w-full mx-auto relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
           <h3 
             className="font-heading text-4xl mb-4 font-bold"
             style={{ color: tokens.textPrimary }}
           >
             Ucapan & Doa
           </h3>
           <SectionDivider />
        </div>

        <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-3">
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}
          <div className="relative flex items-center">
            <User size={16} className="absolute left-3.5 pointer-events-none" style={{ color: tokens.accent }} aria-hidden="true" />
            <input 
              type="text" 
              placeholder="Nama Lengkap Anda" 
              aria-label="Nama Lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl pl-10 pr-4 py-3.5 text-[13px] outline-none transition-all focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-1"
              style={{
                backgroundColor: tokens.inputBg,
                border: `1px solid ${tokens.inputBorder}`,
                color: tokens.inputText,
              }}
            />
          </div>
          <div className="relative flex">
            <MessageSquareQuote size={16} className="absolute left-3.5 top-3.5 pointer-events-none" style={{ color: tokens.accent }} aria-hidden="true" />
            <textarea 
              placeholder="Tulis ucapan dan doa restu terbaik Anda..."
              aria-label="Tulis ucapan dan doa restu terbaik Anda"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              required
              rows={3}
              className="w-full rounded-xl pl-10 pr-4 py-3.5 text-[13px] outline-none transition-all resize-none focus-visible:ring-2 focus-visible:ring-sage/60 focus-visible:ring-offset-1"
              style={{
                backgroundColor: tokens.inputBg,
                border: `1px solid ${tokens.inputBorder}`,
                color: tokens.inputText,
              }}
            />
          </div>

          <VoiceMemoRecorder
            onAudioRecorded={(url, dur) => {
              setAudioUrl(url);
              setAudioDuration(dur);
            }}
            accentColor={tokens.accent}
            isDark={isDark}
          />

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl text-[13px] font-semibold tracking-wide transition-all disabled:opacity-70 shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98 focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.btnPrimaryText
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send size={16} aria-hidden="true" />
                <span>Kirim Ucapan Restu</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
          {wishes.slice(0, visibleCount).map((wish, index) => (
            <motion.div 
              key={wish.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-5 rounded-2xl backdrop-blur-md transition-all duration-300",
                isDark ? "shadow-lg shadow-black/50" : "shadow-sm"
              )}
              style={{
                backgroundColor: tokens.cardBg,
                border: `1px solid ${tokens.cardBorder}`,
              }}
            >
              <div className="flex justify-between items-baseline mb-2">
                 <h5 
                   className="font-heading text-lg font-bold"
                   style={{ color: tokens.accent }}
                 >
                   {wish.name}
                 </h5>
                 <span 
                   className="text-[9px] tracking-wider uppercase font-medium"
                   style={{ color: tokens.textMuted }}
                 >
                   {wish.time}
                 </span>
              </div>
              <p 
                className="text-[13px] leading-relaxed italic"
                style={{ color: tokens.textPrimary }}
              >
                "{wish.text}"
              </p>

              {wish.audioUrl && (
                <WishAudioPlayer
                  audioUrl={wish.audioUrl}
                  durationSeconds={wish.audioDuration}
                  accentColor={tokens.accent}
                  isDark={isDark}
                />
              )}
            </motion.div>
          ))}
          {(wishes.length > visibleCount || hasMoreFromApi) && (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="mt-2 text-xs font-semibold hover:underline py-2 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              style={{ color: tokens.accent }}
            >
              {isLoadingMore ? <Loader2 size={14} className="animate-spin" /> : <ChevronDown size={14} />}
              <span>
                {visibleCount < wishes.length
                  ? `Lihat Lebih Banyak (${wishes.length - visibleCount})`
                  : 'Muat Doa Sebelumnya'}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
