import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { BosaraOrnament } from './decorations/BosaraOrnament';
import { SaorajaRoof } from './decorations/SaorajaRoof';
import { FloatingBentePandan } from './decorations/FloatingBentePandan';
import { playBugisGong } from './utils/bugisAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playBugisGong();
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-10 pb-8 bg-gradient-to-b from-[#3A0810] via-[#721422] to-[#28050B] text-[#FAF6F0]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Subtle Lipa Sabbe Weave Lattice Texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Pandan Leaves and Bente' Rice Particles */}
      <FloatingBentePandan className="opacity-75" />

      {/* Top Saoraja Roof Pediment Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center shrink-0 mt-2"
      >
        <SaorajaRoof width={220} height={55} primaryColor="#2A050A" goldColor="#D4AF37" />

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-1"
        >
          <BosaraOrnament size={96} primaryColor="#D4AF37" secondaryColor="#8B1E1E" accentColor="#FFE082" />
        </motion.div>

        <span className="text-[11px] tracking-[0.3em] text-[#D4AF37] uppercase mt-2 font-serif font-semibold flex items-center gap-1.5">
          <Sparkles size={11} className="text-[#FFE082]" />
          <span>BARUGA SAORAJA BUGIS</span>
          <Sparkles size={11} className="text-[#FFE082]" />
        </span>

        {/* Lontara Script */}
        <span className="text-[12px] tracking-[0.25em] text-[#FFE082]/90 mt-0.5 font-serif">
          ᨔ ᨒ ᨆ • SALAMA'
        </span>
      </motion.div>

      {/* Center Couple Names */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full my-4"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF6F0] leading-tight drop-shadow-md">
          {weddingConfig.groom.nickname}
        </h1>
        <span className="text-2xl text-[#D4AF37] font-serif italic my-1 drop-shadow-sm">&amp;</span>
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF6F0] leading-tight drop-shadow-md">
          {weddingConfig.bride.nickname}
        </h1>
        <p className="text-xs sm:text-[13px] text-[#E2D9CC] tracking-widest mt-2 uppercase font-sans font-light">
          {weddingConfig.dateStr}
        </p>
      </motion.div>

      {/* Bottom Guest Card & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-xs shrink-0"
      >
        <div className="w-full bg-[#1C0306]/75 border border-[#D4AF37]/50 rounded-2xl p-4 shadow-xl backdrop-blur-md mb-4 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-sans font-semibold mb-1">
            TABEE' SOMPA / KEPADA YTH:
          </span>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF6F0] capitalize px-2 line-clamp-2">
            {guestName}
          </h3>
          <span className="text-[10px] text-[#E2D9CC]/75 mt-1 font-sans">
            Tamu Undangan Kehormatan
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenInvitation}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-[#3A0810] font-heading font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2.5 hover:brightness-105 transition-all cursor-pointer"
        >
          <MailOpen size={17} className="stroke-[2.5]" />
          <span>Buka Undangan Adat Bugis</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
