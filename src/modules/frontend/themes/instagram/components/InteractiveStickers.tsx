import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, MapPin, Music2, CheckCircle2, Heart } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../lib/firebase';
import { useGuestName } from '../../../../../hooks/useGuestName';
import { playHeartChime } from '../utils/instagramAudio';

/* =========================================================
   1. COUNTDOWN STICKER
   ========================================================= */
interface CountdownStickerProps {
  targetDateISO: string;
  title?: string;
}

export const CountdownSticker: React.FC<CountdownStickerProps> = ({
  targetDateISO,
  title = 'Menuju Hari Bahagia 💍',
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDateISO).getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetDateISO]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl bg-white/95 text-neutral-900 shadow-xl overflow-hidden max-w-[260px] mx-auto border border-white/40 select-none pointer-events-auto"
    >
      {/* Sticker Header */}
      <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF0069] px-3 py-1.5 flex items-center justify-between text-white">
        <span className="text-[11px] font-bold tracking-tight">{title}</span>
        <Bell size={12} className="text-white/90" />
      </div>

      {/* Countdown Digits */}
      <div className="p-3 grid grid-cols-4 gap-1.5 text-center">
        <div className="bg-neutral-100 rounded-lg p-1.5">
          <span className="block text-base font-black font-mono leading-none text-neutral-900">
            {timeLeft.days}
          </span>
          <span className="text-[8px] uppercase font-bold text-neutral-500 mt-0.5 block">
            Hari
          </span>
        </div>
        <div className="bg-neutral-100 rounded-lg p-1.5">
          <span className="block text-base font-black font-mono leading-none text-neutral-900">
            {timeLeft.hours}
          </span>
          <span className="text-[8px] uppercase font-bold text-neutral-500 mt-0.5 block">
            Jam
          </span>
        </div>
        <div className="bg-neutral-100 rounded-lg p-1.5">
          <span className="block text-base font-black font-mono leading-none text-neutral-900">
            {timeLeft.minutes}
          </span>
          <span className="text-[8px] uppercase font-bold text-neutral-500 mt-0.5 block">
            Menit
          </span>
        </div>
        <div className="bg-neutral-100 rounded-lg p-1.5">
          <span className="block text-base font-black font-mono leading-none text-[#FF0069]">
            {timeLeft.seconds}
          </span>
          <span className="text-[8px] uppercase font-bold text-[#FF0069] mt-0.5 block">
            Detik
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* =========================================================
   2. RSVP POLL STICKER
   ========================================================= */
export const RSVPPollSticker: React.FC = () => {
  const defaultGuestName = useGuestName();
  const [voted, setVoted] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState({ hadir: 88, tidakHadir: 12 });

  useEffect(() => {
    const saved = localStorage.getItem('ig_poll_voted');
    if (saved) setVoted(saved);
  }, []);

  const handleVote = async (choice: 'hadir' | 'tidak_hadir') => {
    if (voted) return;
    setVoted(choice);
    playHeartChime();
    localStorage.setItem('ig_poll_voted', choice);

    if (choice === 'hadir') {
      setVoteCount((prev) => ({ ...prev, hadir: prev.hadir + 1 }));
    } else {
      setVoteCount((prev) => ({ ...prev, tidakHadir: prev.tidakHadir + 1 }));
    }

    try {
      await addDoc(collection(db, 'rsvps'), {
        name: defaultGuestName || 'Tamu Instagram Story',
        guestCount: 1,
        attendance: choice,
        notes: 'Dikonfirmasi via Instagram Story Poll Sticker',
        createdAt: serverTimestamp(),
      });
    } catch {
      // Non-blocking fallback
    }
  };

  const total = voteCount.hadir + voteCount.tidakHadir;
  const hadirPercent = Math.round((voteCount.hadir / total) * 100);
  const tidakHadirPercent = 100 - hadirPercent;

  return (
    <div className="rounded-2xl bg-white text-neutral-900 p-3.5 shadow-2xl max-w-[260px] mx-auto border border-white/40 select-none pointer-events-auto">
      <h4 className="text-xs font-bold text-center mb-2.5 text-neutral-800">
        Apakah kamu akan hadir? ✨
      </h4>

      <div className="space-y-2">
        {/* Option 1: Hadir */}
        <button
          type="button"
          onClick={() => handleVote('hadir')}
          className={`w-full relative h-10 rounded-xl overflow-hidden border transition-all cursor-pointer ${
            voted === 'hadir'
              ? 'border-[#00E676] shadow-sm'
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          {voted && (
            <div
              className="absolute inset-y-0 left-0 bg-[#00E676]/20 transition-all duration-500"
              style={{ width: `${hadirPercent}%` }}
            />
          )}
          <div className="relative z-10 h-full px-3 flex items-center justify-between text-xs font-bold text-neutral-900">
            <span>Pasti Hadir! 😍</span>
            {voted && <span>{hadirPercent}%</span>}
          </div>
        </button>

        {/* Option 2: Tidak Hadir */}
        <button
          type="button"
          onClick={() => handleVote('tidak_hadir')}
          className={`w-full relative h-10 rounded-xl overflow-hidden border transition-all cursor-pointer ${
            voted === 'tidak_hadir'
              ? 'border-neutral-400 shadow-sm'
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
        >
          {voted && (
            <div
              className="absolute inset-y-0 left-0 bg-neutral-200 transition-all duration-500"
              style={{ width: `${tidakHadirPercent}%` }}
            />
          )}
          <div className="relative z-10 h-full px-3 flex items-center justify-between text-xs font-bold text-neutral-700">
            <span>Maaf Berhalangan 🙏</span>
            {voted && <span>{tidakHadirPercent}%</span>}
          </div>
        </button>
      </div>

      {voted && (
        <div className="flex items-center justify-center gap-1 mt-2 text-[10px] font-semibold text-[#00E676]">
          <CheckCircle2 size={11} />
          <span>Suara Anda telah tersimpan</span>
        </div>
      )}
    </div>
  );
};

/* =========================================================
   3. MUSIC STICKER
   ========================================================= */
interface MusicStickerProps {
  title?: string;
  artist?: string;
  cover?: string;
}

export const MusicSticker: React.FC<MusicStickerProps> = ({
  title = 'Wedding Love Theme',
  artist = 'Cecep & Ipeh Playlist',
  cover,
}) => {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-lg select-none pointer-events-auto">
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF7A00] to-[#FF0069] flex items-center justify-center shrink-0">
        <Music2 size={11} className="text-white" />
      </div>
      <div className="flex flex-col text-left leading-none">
        <span className="text-[11px] font-bold text-white truncate max-w-[120px]">
          {title}
        </span>
        <span className="text-[9px] text-white/70 truncate max-w-[120px] mt-0.5">
          {artist}
        </span>
      </div>
      {/* Equalizer animation */}
      <div className="flex items-center gap-0.5 h-3 ml-1">
        <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]" />
        <span className="w-0.5 h-3.5 bg-white rounded-full animate-bounce [animation-delay:-0.4s]" />
        <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s]" />
      </div>
    </div>
  );
};

/* =========================================================
   4. LOCATION STICKER
   ========================================================= */
interface LocationStickerProps {
  venue: string;
  mapUrl?: string;
}

export const LocationSticker: React.FC<LocationStickerProps> = ({
  venue,
  mapUrl = 'https://maps.google.com',
}) => {
  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-[#007AFF] shadow-md transition-all select-none pointer-events-auto active:scale-95"
    >
      <MapPin size={13} className="text-[#FF0069]" />
      <span className="text-xs font-bold truncate max-w-[170px]">{venue}</span>
    </a>
  );
};
