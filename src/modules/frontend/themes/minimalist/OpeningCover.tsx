import React from 'react';
import { motion } from 'motion/react';
import { MailOpen, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { BotanicalEucalyptus } from './decorations/BotanicalEucalyptus';
import { FloatingBotanicalLeaves } from './decorations/FloatingBotanicalLeaves';
import { InteractiveEnvelopeCoverCard } from '../../shared/components/InteractiveEnvelopeCoverCard';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-10 pb-8 bg-gradient-to-b from-[#E2E8F0] via-[#F7FAFC] to-[#EDF2F7] text-[#2D3748]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Subtle Dot Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2D3748 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Botanical Leaves & Soft Spores */}
      <FloatingBotanicalLeaves className="opacity-60" />

      {/* Top Botanical Sprig Emblem */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center shrink-0 mt-2"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <BotanicalEucalyptus size={105} primaryColor="#2D3748" secondaryColor="#9AA79C" accentColor="#D4AF37" />
        </motion.div>
        
        <span className="text-[10px] tracking-[0.3em] text-[#718096] uppercase mt-2 font-sans font-medium flex items-center gap-1.5">
          <Sparkles size={11} className="text-[#9AA79C]" />
          <span>THE WEDDING OF</span>
          <Sparkles size={11} className="text-[#9AA79C]" />
        </span>
      </motion.div>

      {/* Center Couple Names */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full my-4"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-[#1A202C] leading-tight font-normal">
          {weddingConfig.groom.nickname}
          <span className="block text-2xl sm:text-3xl text-[#9AA79C] my-1 font-serif italic font-light">
            &amp;
          </span>
          {weddingConfig.bride.nickname}
        </h1>

        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#9AA79C] to-transparent my-3" />
        
        <p className="text-xs tracking-[0.2em] text-[#718096] uppercase font-sans font-medium">
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
          recipientLabel="Dear Honored Guest:"
          buttonText="Open Invitation"
          themeStyle={{
            envelopePocketBg: 'rgba(255, 255, 255, 0.94)',
            envelopeFlapBg: 'rgba(247, 250, 252, 0.98)',
            envelopeBorder: 'rgba(203, 213, 225, 0.65)',
            waxColor: '#475569',
            waxRingColor: '#94A3B8',
            waxTextColor: '#FFFFFF',
            letterBg: 'rgba(255, 255, 255, 0.98)',
            letterBorder: 'rgba(226, 232, 240, 0.85)',
            letterTextColor: '#1A202C',
            letterMutedColor: '#718096',
            buttonBg: 'linear-gradient(to right, #2D3748, #4A5568, #2D3748)',
            buttonText: '#FFFFFF',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
