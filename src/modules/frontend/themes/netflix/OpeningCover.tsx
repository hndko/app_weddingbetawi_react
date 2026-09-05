import React from 'react';
import { motion } from 'motion/react';
import { Play, Film, Sparkles, Star } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { FloatingCinemaParticles } from './decorations/FloatingCinemaParticles';
import { playNetflixTadum } from './utils/audioSynthesizer';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpen = () => {
    // Play the iconic Netflix "Ta-Dum!" sound synthesizer
    playNetflixTadum();
    // Trigger opening animation & audio background
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-8 pb-8 bg-gradient-to-b from-[#1C0506] via-[#121212] to-[#0A0A0A] text-white"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Subtle Film Strip Grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#E50914 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Cinema Sparks */}
      <FloatingCinemaParticles count={8} className="opacity-75" />

      {/* Top Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 flex flex-col items-center shrink-0 mt-1 max-w-sm w-full"
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-black/70 border border-[#282828] shadow-[0_0_15px_rgba(229,9,20,0.25)]">
          <span className="text-[#E50914] font-black text-sm tracking-wider">N</span>
          <span className="text-[10px] tracking-[0.25em] text-white uppercase font-bold">
            ORIGINAL WEDDING PREMIERE
          </span>
        </div>
      </motion.div>

      {/* Center: Movie Teaser Poster Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-20 flex flex-col items-center my-3 max-w-xs w-full"
      >
        {/* Poster Card */}
        <div className="relative w-52 h-64 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border border-[#333333] shadow-[0_16px_36px_rgba(0,0,0,0.9)] flex flex-col justify-between p-3.5 group">
          {/* Poster Image */}
          <img
            src={weddingConfig.groom.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
            alt="Movie Poster"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

          {/* Top Badges inside Poster */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div className="px-2 py-0.5 rounded bg-[#E50914] text-[9px] font-black text-white uppercase tracking-wider">
              TOP 1
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[#E5C158] font-bold">
              <Star size={11} fill="#E5C158" />
              <span>99% Match</span>
            </div>
          </div>

          {/* Center Play Icon Outline */}
          <div className="relative z-10 self-center w-14 h-14 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-xl">
            <Play fill="currentColor" size={20} className="ml-1 text-[#E50914]" />
          </div>

          {/* Bottom Title on Poster */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-[9px] font-extrabold text-[#E50914] tracking-[0.25em] uppercase">
              THE WEDDING PREMIERE
            </span>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-wide">
              {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
            </h2>
            <span className="text-[10px] text-[#AAAAAA] mt-0.5">
              {weddingConfig.dateStr || '20 September 2026'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Guest Invitation Pass (Cinema Screening Ticket) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-20 w-full max-w-xs bg-[#161616]/90 backdrop-blur-md rounded-xl border border-[#282828] p-4 shadow-xl flex flex-col items-center"
      >
        <span className="text-[10px] tracking-[0.2em] text-[#888888] uppercase font-semibold">
          SPECIAL GUEST INVITATION:
        </span>
        <h3 className="text-lg sm:text-xl font-heading font-bold text-white mt-1 capitalize text-center">
          {guestName}
        </h3>
        <div className="mt-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#E50914]/15 border border-[#E50914]/30">
          <Film size={11} className="text-[#E50914]" />
          <span className="text-[10px] text-[#E50914] font-semibold tracking-wide">
            VIP Screening Pass • Premiere Row
          </span>
        </div>
      </motion.div>

      {/* Big Netflix Red Play Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="relative z-20 w-full max-w-xs mt-3 flex flex-col items-center gap-2"
      >
        <button
          onClick={handleOpen}
          className="group w-full py-3.5 px-6 rounded-md bg-[#E50914] hover:bg-[#B81D24] text-white font-extrabold text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.5)] hover:shadow-[0_0_28px_rgba(229,9,20,0.7)] flex items-center justify-center gap-2.5 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-white text-[#E50914] flex items-center justify-center transition-transform group-hover:scale-110">
            <Play fill="currentColor" size={12} className="ml-0.5" />
          </div>
          <span>TONTON TRAILER &amp; BUKA</span>
        </button>
        <span className="text-[10px] text-[#888888] tracking-wider">
          Ketuk untuk efek suara sinematik &amp; musik
        </span>
      </motion.div>
    </motion.div>
  );
};
