import React from 'react';
import { motion } from 'motion/react';
import { Scroll, Crown } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { RoyalScrollHeader } from './decorations/RoyalScrollHeader';
import { FloatingGoldenStardust } from './decorations/FloatingGoldenStardust';
import { InteractiveEnvelopeCoverCard } from '../../shared/components/InteractiveEnvelopeCoverCard';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

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
        {/* Royal Crown Emblem */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#854D0E] shadow-md flex items-center justify-center -mt-8 mb-2 border-2 border-[#FFFDF9]">
          <Crown size={22} className="text-[#FFFDF9] drop-shadow-xs" />
        </div>

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

      {/* Bottom Guest Envelope & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-[330px] shrink-0"
      >
        <InteractiveEnvelopeCoverCard
          onOpen={onOpen}
          guestName={guestName}
          recipientLabel="Kepada Tamu Kehormatan Kerajaan:"
          buttonText="Buka Titah Kerajaan"
          buttonIcon={<Scroll size={16} />}
          themeStyle={{
            envelopePocketBg: '#FBF6EE',
            envelopeFlapBg: '#FFFDF9',
            envelopeBorder: '#D4AF37',
            waxColor: '#991B1B',
            waxRingColor: '#D4AF37',
            waxTextColor: '#FFF3C4',
            letterBg: '#FFFDF9',
            letterBorder: '#D4AF37',
            letterTextColor: '#2C1810',
            letterMutedColor: '#854D0E',
            buttonBg: 'linear-gradient(to right, #2C1810, #4A2616, #2C1810)',
            buttonText: '#FFF3C4',
          }}
        />
      </motion.div>
    </motion.div>
  );
};
