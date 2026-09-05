import React from 'react';
import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { TalawangHeader } from './decorations/TalawangHeader';
import { FloatingDayakFeathers } from './decorations/FloatingDayakFeathers';
import { playSapeStrum, playGongDayak } from './utils/dayakAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playSapeStrum();
    playGongDayak();
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 overflow-y-auto overflow-x-hidden no-scrollbar py-6 bg-[#FBF8F2] text-[#2A0808]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Dayak Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url('/assets/themes/dayak/pattern.svg')`,
          backgroundSize: '90px 90px',
        }}
      />

      {/* Floating Dayak Feathers & Amber Sparks */}
      <FloatingDayakFeathers />

      {/* Top Talawang Shield Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-20 shrink-0"
      >
        <TalawangHeader size="md" />
      </motion.div>

      {/* Center Couple Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-sm my-2 bg-white/95 backdrop-blur-xs p-6 rounded-3xl border-2 border-[#D4AF37] shadow-xl relative"
      >
        <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#8B0000] mb-1">
          WALIMATUL 'URS • DAYAK KENYAH
        </span>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#8B0000] leading-tight my-1">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h1>

        <p className="font-serif italic text-xs text-[#AA7C11] mt-1 font-semibold">
          "Adil Ka' Talino, Bacuramin Ka' Saruga, Basengat Ka' Jubata"
        </p>

        <div className="w-16 h-0.5 bg-[#D4AF37] my-3 opacity-60" />

        <span className="text-xs font-semibold text-[#2A0808]">
          {weddingConfig.dateStr}
        </span>
      </motion.div>

      {/* Bottom Recipient Guest Info & Open Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-xs shrink-0 mt-2"
      >
        <div className="bg-white/90 border border-[#D4AF37]/50 rounded-2xl p-3.5 w-full mb-3 shadow-xs">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5 font-medium">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="font-bold text-sm text-[#8B0000] truncate">
            {guestName || 'Tamu Undangan'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-3 rounded-2xl bg-[#8B0000] hover:bg-[#A30000] text-[#FFF3C4] font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-md shadow-[#8B0000]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <MailOpen size={16} className="text-[#D4AF37]" />
          <span>Buka Undangan</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
