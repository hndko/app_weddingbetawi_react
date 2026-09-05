import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { ArcadeMarqueeHeader } from './decorations/ArcadeMarqueeHeader';
import { FloatingPixelHearts } from './decorations/FloatingPixelHearts';
import { AnimatedPixelScanlines } from './decorations/AnimatedPixelScanlines';
import { playCoinSound, playLevelUpJingle } from './utils/arcadeAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playCoinSound();
    setTimeout(() => {
      playLevelUpJingle();
    }, 150);
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 overflow-y-auto overflow-x-hidden no-scrollbar py-6 bg-[#0F172A] text-[#F8FAFC] font-mono"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Matrix & Scanlines */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/themes/arcade/pattern.svg')`,
          backgroundSize: '32px 32px',
        }}
      />
      <AnimatedPixelScanlines />
      <FloatingPixelHearts count={10} />

      {/* Top Header Marquee */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-20 shrink-0"
      >
        <ArcadeMarqueeHeader />
      </motion.div>

      {/* Center Title Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-sm my-2 bg-[#1E293B]/95 p-5 rounded-2xl border-2 border-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.3)] relative"
      >
        {/* Pixel Heart Icon */}
        <div className="w-12 h-12 mb-2">
          <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">
            <rect x="2" y="2" width="3" height="2" fill="#F43F5E" />
            <rect x="5" y="2" width="2" height="2" fill="#F43F5E" />
            <rect x="9" y="2" width="2" height="2" fill="#F43F5E" />
            <rect x="11" y="2" width="3" height="2" fill="#F43F5E" />
            <rect x="1" y="4" width="14" height="4" fill="#F43F5E" />
            <rect x="3" y="4" width="2" height="2" fill="#FDA4AF" />
            <rect x="2" y="8" width="12" height="2" fill="#E11D48" />
            <rect x="4" y="10" width="8" height="2" fill="#BE123C" />
            <rect x="6" y="12" width="4" height="2" fill="#9F1239" />
            <rect x="7" y="14" width="2" height="1" fill="#881337" />
          </svg>
        </div>

        <span className="text-[10px] tracking-[0.2em] font-bold text-[#F59E0B] uppercase">
          ★ LEVEL 1: SACRED MATRIMONY ★
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-[#22D3EE] my-1 tracking-wider">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h1>

        <p className="text-[11px] text-slate-300 italic">
          "Co-op mode unlocked for eternity."
        </p>

        <div className="w-full h-px bg-slate-700 my-2.5" />

        <span className="text-xs text-[#10B981] font-bold">
          QUEST DATE: {weddingConfig.dateStr}
        </span>
      </motion.div>

      {/* Bottom Guest Pass & Press Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-xs shrink-0"
      >
        {/* Guest Pass */}
        <div className="w-full bg-[#1E293B] border border-[#22D3EE]/60 rounded-xl p-3 shadow-md mb-3 flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-widest text-[#F59E0B] font-bold mb-0.5">
            [PLAYER 3 - GUEST PASS]
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC] capitalize px-2 line-clamp-2">
            {guestName}
          </h3>
          <span className="text-[9px] text-slate-400 mt-0.5">
            STATUS: VIP ALL-ACCESS PASS
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenInvitation}
          className="w-full py-3 px-6 bg-gradient-to-r from-[#22D3EE] via-[#38BDF8] to-[#22D3EE] text-slate-950 font-black text-xs sm:text-sm tracking-widest uppercase rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.5)] flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
        >
          <Play size={16} className="fill-slate-950" />
          <span>PRESS START TO OPEN</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
