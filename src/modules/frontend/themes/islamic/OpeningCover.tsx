import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { IslamicStarCrescent } from './decorations/IslamicStarCrescent';
import { FloatingArabianPetals } from './decorations/FloatingArabianPetals';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-10 pb-8 bg-gradient-to-b from-[#072129] via-[#0F4C5C] to-[#05171D] text-[#FAF6EE]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Subtle Star Dot Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C5A059 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Arabian Petals & Gold Dust */}
      <FloatingArabianPetals className="opacity-70" />

      {/* Top Islamic Star & Crescent Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center shrink-0 mt-2"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <IslamicStarCrescent size={110} primaryColor="#C5A059" secondaryColor="#0F4C5C" accentColor="#E5C158" />
        </motion.div>
        
        <span className="text-[11px] tracking-[0.3em] text-[#E5C158] uppercase mt-2 font-serif font-semibold flex items-center gap-1.5">
          <Sparkles size={11} className="text-[#C5A059]" />
          <span>WALIMATUL 'URS</span>
          <Sparkles size={11} className="text-[#C5A059]" />
        </span>
      </motion.div>

      {/* Center Couple Names */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full my-4"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF6EE] leading-tight drop-shadow-md">
          {weddingConfig.groom.nickname}
          <span className="block text-2xl sm:text-3xl text-[#C5A059] my-1 font-serif italic font-normal">
            &amp;
          </span>
          {weddingConfig.bride.nickname}
        </h1>

        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent my-3" />
        
        <p className="text-xs tracking-widest text-[#E5C158]/90 uppercase font-medium font-serif">
          {weddingConfig.dateStr}
        </p>
      </motion.div>

      {/* Bottom Guest Card & Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="z-30 w-full max-w-[320px] shrink-0"
      >
        <div className="bg-[#072129]/85 backdrop-blur-md px-5 py-5 rounded-2xl border border-[#C5A059]/40 shadow-xl relative overflow-hidden flex flex-col items-center">
          {/* Subtle golden corner highlights */}
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#C5A059]" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#C5A059]" />
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#C5A059]" />
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#C5A059]" />

          <p className="text-[11px] text-[#FAF6EE]/70 mb-1 tracking-wide font-light">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="font-heading text-xl text-[#FAF6EE] mb-4 font-bold text-center">
            {guestName}
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="w-full bg-gradient-to-r from-[#C5A059] via-[#E5C158] to-[#C5A059] text-[#072129] font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-xs tracking-wider uppercase font-serif"
          >
            <MailOpen size={16} />
            <span>Buka Undangan</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
