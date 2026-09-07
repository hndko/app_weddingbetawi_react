import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { MahkotaSiger } from './decorations/MahkotaSiger';
import { FloatingJasmineRonce } from './decorations/FloatingJasmineRonce';
import { InteractiveEnvelopeCoverCard } from '../../shared/components/InteractiveEnvelopeCoverCard';

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
        className="z-30 w-full max-w-[330px] shrink-0"
      >
        <InteractiveEnvelopeCoverCard
          onOpen={onOpen}
          guestName={guestName}
          recipientLabel="Kahatur Kasumpingan Para Wargi Sadaya:"
          buttonText="Buka Serat Ulem"
          themeStyle={{
            envelopePocketBg: 'rgba(20, 38, 29, 0.94)',
            envelopeFlapBg: 'rgba(25, 46, 36, 0.98)',
            envelopeBorder: 'rgba(212, 175, 55, 0.45)',
            waxColor: '#881337',
            waxRingColor: '#D4AF37',
            waxTextColor: '#FAF9F5',
            letterBg: 'rgba(37, 68, 53, 0.96)',
            letterBorder: 'rgba(212, 175, 55, 0.35)',
            letterTextColor: '#FAF9F5',
            letterMutedColor: '#E6D5B8',
            buttonBg: 'linear-gradient(to right, #B38B22, #D4AF37, #B38B22)',
            buttonText: '#14261D',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
