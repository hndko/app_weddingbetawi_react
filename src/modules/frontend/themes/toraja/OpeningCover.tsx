import React from 'react';
import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { TongkonanRoofHeader } from './decorations/TongkonanRoofHeader';
import { FloatingTorajaMotifs } from './decorations/FloatingTorajaMotifs';
import { playPapompangBlow, playGongToraja } from './utils/torajaAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playPapompangBlow();
    playGongToraja();
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 overflow-y-auto overflow-x-hidden no-scrollbar py-6 bg-[#F7F2EB] text-[#1A1A1A]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Toraja Engravings Pattern Texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url('/assets/themes/toraja/pattern.svg')`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Floating Toraja Motifs */}
      <FloatingTorajaMotifs count={10} />

      {/* Top Roof Arch Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-20 shrink-0"
      >
        <TongkonanRoofHeader />
      </motion.div>

      {/* Center Couple Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-sm my-2 bg-white/95 backdrop-blur-xs p-5 rounded-3xl border-2 border-[#E5A93C] shadow-lg relative"
      >
        <span className="text-[10px] tracking-[0.25em] font-bold uppercase text-[#8B1E19] mb-1">
          PA'BUNTUAN • WALIMATUL 'URS
        </span>

        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#8B1E19] leading-tight my-1">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h1>

        <p className="font-serif italic text-xs text-[#666666] mt-1">
          "Misa' kada dipotuo, pantan kada dipomate"
        </p>

        <div className="w-16 h-0.5 bg-[#E5A93C] my-3" />

        <span className="text-xs font-semibold text-[#1A1A1A]">
          {weddingConfig.dateStr}
        </span>
      </motion.div>

      {/* Bottom Guest Dispatch & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-xs shrink-0"
      >
        {/* Guest Name Card */}
        <div className="w-full bg-white/90 backdrop-blur-xs border border-[#E5A93C]/50 rounded-2xl p-3 shadow-sm mb-3 flex flex-col items-center">
          <span className="text-[9px] uppercase tracking-widest text-[#8B1E19] font-bold mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <h3 className="font-heading text-base sm:text-lg font-bold text-[#1A1A1A] capitalize px-2 line-clamp-2">
            {guestName}
          </h3>
          <span className="text-[9px] text-[#777777] mt-0.5 italic">
            Tamu Undangan Kehormatan
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenInvitation}
          className="w-full py-3 px-6 bg-gradient-to-r from-[#8B1E19] via-[#A8251F] to-[#8B1E19] text-[#FFF2B2] border border-[#E5A93C] rounded-2xl font-heading font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
        >
          <MailOpen size={16} />
          <span>Buka Undangan Adat Toraja</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
