import React from 'react';
import { motion } from 'motion/react';
import { Play, Disc, Sparkles, CheckCircle2 } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { FloatingMusicNotes } from './decorations/FloatingMusicNotes';
import { SoundwaveVisualizer } from './decorations/SoundwaveVisualizer';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-8 pb-8 bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#18261E] text-[#FFFFFF]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Subtle Soundwave Dots */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1DB954 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Music Notes & Sound Particles */}
      <FloatingMusicNotes count={8} className="opacity-75" />

      {/* Top Spotify Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex flex-col items-center shrink-0 mt-1 max-w-sm w-full"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818]/90 border border-[#282828] shadow-[0_0_12px_rgba(29,185,84,0.2)]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1DB954] animate-pulse" />
          <span className="text-[10px] tracking-[0.25em] text-[#1DB954] uppercase font-bold">
            SPOTIFY WEDDING PLAYLIST
          </span>
        </div>
      </motion.div>

      {/* Centerpiece: Spinning Vinyl Album Artwork */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-20 flex flex-col items-center my-3 max-w-xs w-full"
      >
        {/* Album Container with Sliding Vinyl */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
          {/* Rotating Vinyl Record behind sleeve */}
          <motion.div
            className="absolute right-0 w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-[#0E0E0E] border-2 border-[#242424] shadow-2xl flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, #252525 0%, #111111 40%, #1A1A1A 65%, #0A0A0A 100%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            {/* Vinyl Groove Rings */}
            <div className="absolute inset-2 rounded-full border border-white/5" />
            <div className="absolute inset-5 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/5" />
            <div className="absolute inset-11 rounded-full border border-white/5" />

            {/* Center Label of Vinyl */}
            <div className="w-16 h-16 rounded-full bg-[#181818] border-2 border-[#1DB954] flex flex-col items-center justify-center p-1 shadow-inner">
              <Disc size={18} className="text-[#1DB954] animate-spin" />
              <span className="text-[8px] tracking-wider text-[#E5C158] font-bold mt-0.5">2026</span>
              <div className="w-2.5 h-2.5 rounded-full bg-[#0A0A0A] mt-0.5" />
            </div>
          </motion.div>

          {/* Album Sleeve Cover (Front Left) */}
          <div className="absolute left-0 w-36 h-36 sm:w-40 sm:h-40 rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#141414] border border-[#2E2E2E] shadow-[0_8px_24px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between p-3.5 z-10">
            <div className="w-full flex justify-between items-center text-[9px] text-[#A7A7A7] font-semibold">
              <span className="text-[#1DB954] font-bold tracking-wider">TRACK 01</span>
              <CheckCircle2 size={12} className="text-[#1DB954]" />
            </div>

            {/* Monogram or Cover Art */}
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl text-[#E5C158] font-bold tracking-wider">
                {weddingConfig.groom.nickname[0] || 'C'} & {weddingConfig.bride.nickname[0] || 'I'}
              </span>
              <span className="text-[8px] text-[#B3B3B3] tracking-[0.2em] uppercase mt-0.5 font-medium">
                The Wedding Album
              </span>
            </div>

            <div className="w-full">
              <SoundwaveVisualizer barCount={9} height={14} color="#1DB954" />
            </div>
          </div>
        </div>

        {/* Title / Couple Names */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-xs text-[#1DB954] font-semibold tracking-wider uppercase mb-1">
            <Sparkles size={13} />
            <span>NOW STREAMING</span>
            <Sparkles size={13} />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl text-white font-bold leading-tight tracking-wide drop-shadow-md">
            {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
          </h1>
          <p className="text-xs text-[#B3B3B3] font-medium tracking-widest mt-1 uppercase">
            {weddingConfig.dateStr || 'Minggu, 20 September 2026'}
          </p>
        </div>
      </motion.div>

      {/* Guest Greeting Card (Spotify Styled) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-20 w-full max-w-xs bg-[#181818]/90 backdrop-blur-md rounded-2xl border border-[#282828] p-4 shadow-xl flex flex-col items-center"
      >
        <span className="text-[10px] tracking-[0.2em] text-[#B3B3B3] uppercase font-semibold">
          SPECIAL INVITATION FOR:
        </span>
        <h3 className="text-lg sm:text-xl font-heading font-bold text-white mt-1 capitalize text-center">
          {guestName}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1DB954]/15 border border-[#1DB954]/30">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
          <span className="text-[10px] text-[#1DB954] font-semibold tracking-wide">
            VIP Guest Pass • Verified
          </span>
        </div>
      </motion.div>

      {/* Big Spotify Vibrant Play Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative z-20 w-full max-w-xs mt-3 flex flex-col items-center gap-2"
      >
        <button
          onClick={onOpen}
          className="group w-full py-3.5 px-6 rounded-full bg-[#1DB954] hover:bg-[#1ED760] text-black font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(29,185,84,0.4)] hover:shadow-[0_0_28px_rgba(29,185,84,0.6)] flex items-center justify-center gap-2.5 active:scale-95"
        >
          <div className="w-7 h-7 rounded-full bg-black text-[#1DB954] flex items-center justify-center transition-transform group-hover:scale-110">
            <Play fill="currentColor" size={14} className="ml-0.5" />
          </div>
          <span>BUKA &amp; PUTAR UNDANGAN</span>
        </button>
        <span className="text-[10px] text-[#888888] tracking-wider">
          Ketuk untuk membuka &amp; mendengarkan musik
        </span>
      </motion.div>
    </motion.div>
  );
};
