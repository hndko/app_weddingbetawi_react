import React from 'react';
import { motion } from 'motion/react';
import { Scroll, Crown } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { RoyalScrollHeader } from './decorations/RoyalScrollHeader';
import { FloatingGoldenStardust } from './decorations/FloatingGoldenStardust';
import { playWaxSealCrack, playRoyalHarpChime } from './utils/royalAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playWaxSealCrack();
    setTimeout(() => {
      playRoyalHarpChime();
    }, 120);
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 overflow-y-auto overflow-x-hidden no-scrollbar py-6 bg-[#F5E6CA] text-[#2C1810] font-serif"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Parchment Grain Texture */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/themes/royal/pattern.svg')`,
          backgroundSize: '80px 80px',
        }}
      />
      <FloatingGoldenStardust count={12} />

      {/* Top Royal Crown Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-20 shrink-0"
      >
        <RoyalScrollHeader />
      </motion.div>

      {/* Center Parchment Envelope Card with 3D Wax Seal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-sm my-2 bg-gradient-to-b from-[#FFFDF9] to-[#FBF6EE] p-5 rounded-3xl border-2 border-[#D4AF37] shadow-xl relative"
      >
        {/* 3D Wax Seal Stamp */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[#DC2626] via-[#991B1B] to-[#5B0E0E] border-2 border-[#7F1D1D] shadow-lg flex items-center justify-center -mt-10 mb-2 relative"
        >
          <div className="w-12 h-12 rounded-full border border-dashed border-[#FCA5A5]/60 flex items-center justify-center text-white">
            <Crown size={22} className="text-[#FDE68A] drop-shadow-xs" />
          </div>
        </motion.div>

        <span className="text-[9px] tracking-[0.25em] font-bold uppercase text-[#854D0E] mb-1">
          TITAH PERNIKAHAN AGUNG
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C1810] leading-tight my-1">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h1>

        <p className="italic text-xs text-[#78350F] mt-0.5">
          "Dua insan bersatu dalam janji suci dan kemuliaan cinta."
        </p>

        <div className="w-16 h-0.5 bg-[#D4AF37] my-3" />

        <span className="text-xs font-semibold text-[#854D0E]">
          {weddingConfig.dateStr}
        </span>
      </motion.div>

      {/* Bottom Guest Scroll & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-xs shrink-0"
      >
        {/* Guest Name Scroll */}
        <div className="w-full bg-[#FFFDF9] border border-[#D4AF37] rounded-2xl p-3 shadow-md mb-3 flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-widest text-[#854D0E] font-bold mb-0.5">
            Kepada Tamu Kehormatan Kerajaan:
          </span>
          <h3 className="text-base sm:text-lg font-bold text-[#2C1810] capitalize px-2 line-clamp-2">
            {guestName}
          </h3>
          <span className="text-[9px] text-[#78350F] mt-0.5 italic">
            Titah Undangan Resmi Tingkat Utama
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenInvitation}
          className="w-full py-3 px-6 bg-gradient-to-r from-[#2C1810] via-[#4A2616] to-[#2C1810] text-[#FFF3C4] border-2 border-[#D4AF37] rounded-2xl font-bold text-xs sm:text-sm tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 hover:brightness-125 transition-all cursor-pointer"
        >
          <Scroll size={16} />
          <span>Buka Titah Kerajaan</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
