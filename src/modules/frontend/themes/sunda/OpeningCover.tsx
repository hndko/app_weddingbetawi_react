import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { MahkotaSiger } from './decorations/MahkotaSiger';
import { FloatingJasmineRonce } from './decorations/FloatingJasmineRonce';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-10 pb-8 bg-gradient-to-b from-[#192E24] via-[#254435] to-[#14261D] text-[#FAF9F5]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Subtle Priangan Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Sacred Jasmine & Gold Dust Animation */}
      <FloatingJasmineRonce className="opacity-65" />

      {/* Top Mahkota Siger Emblem */}
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
          <MahkotaSiger size={110} color="#D4AF37" accentColor="#4A6B5D" />
        </motion.div>
        
        <span className="text-[11px] tracking-[0.3em] text-[#E6D5B8] uppercase mt-2 font-medium flex items-center gap-1.5">
          <Sparkles size={11} className="text-[#D4AF37]" />
          <span>PAWIWAHAN SUNDA PARAHYANGAN</span>
          <Sparkles size={11} className="text-[#D4AF37]" />
        </span>
      </motion.div>

      {/* Center Couple Names */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full my-4"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF9F5] leading-tight drop-shadow-md">
          {weddingConfig.groom.nickname}
          <span className="block text-2xl sm:text-3xl text-[#E6D5B8] my-1 font-serif italic font-normal">
            sareng
          </span>
          {weddingConfig.bride.nickname}
        </h1>

        <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3" />
        
        <p className="text-xs tracking-widest text-[#E6D5B8]/90 uppercase font-medium">
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
        <div className="bg-[#14261D]/85 backdrop-blur-md px-5 py-5 rounded-2xl border border-[#D4AF37]/40 shadow-xl relative overflow-hidden flex flex-col items-center">
          {/* Subtle golden corner highlights */}
          <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-[#D4AF37]" />
          <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-[#D4AF37]" />
          <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-[#D4AF37]" />
          <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-[#D4AF37]" />

          <p className="text-[11px] text-[#FAF9F5]/70 mb-1 tracking-wide font-light">
            Kahatur Kasumpingan Para Wargi Sadaya:
          </p>
          <p className="font-heading text-xl text-[#FAF9F5] mb-4 font-bold text-center">
            {guestName}
          </p>

          <button
            type="button"
            onClick={onOpen}
            className="w-full bg-gradient-to-r from-[#B38B22] via-[#D4AF37] to-[#B38B22] text-[#14261D] font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-xs tracking-wide uppercase"
          >
            <MailOpen size={16} />
            <span>Buka Serat Ulem</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
