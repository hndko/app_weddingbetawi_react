import React from 'react';
import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { MastheadBanner } from './decorations/MastheadBanner';
import { FloatingVintageEphemera } from './decorations/FloatingVintageEphemera';
import { AnimatedPostalStamp } from './decorations/AnimatedPostalStamp';
import { playTypewriterBell } from './utils/vintageAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playTypewriterBell();
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 overflow-y-auto overflow-x-hidden no-scrollbar py-5 bg-[#F4EBD9] text-[#1E1E1E]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Halftone Newspaper Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1E1E1E 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Floating Vintage Ephemera */}
      <FloatingVintageEphemera className="opacity-70" />

      {/* Top Newspaper Masthead */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-20 shrink-0"
      >
        <MastheadBanner />
      </motion.div>

      {/* Center Lead Story Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-sm my-2 bg-[#FAF5EE] p-3.5 sm:p-4 border-2 border-[#1E1E1E] shadow-sm relative"
      >
        {/* Corner Stamp */}
        <div className="absolute -top-5 -right-3 z-30">
          <AnimatedPostalStamp size={62} color="#8B3A2B" text="OFFICIAL DISPATCH" />
        </div>

        <span className="text-[8.5px] tracking-[0.25em] font-mono font-bold uppercase text-[#8B3A2B] mb-0.5">
          EXTRA! EXTRA! READ ALL ABOUT IT!
        </span>

        <h2 className="font-heading font-black text-xl sm:text-2xl text-[#141414] leading-tight uppercase mb-2">
          TWO HEARTS UNITED IN ETERNAL CELEBRATION
        </h2>

        {/* Couple Names Headline */}
        <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-serif font-bold text-[#1E1E1E] my-1.5">
          <span className="underline decoration-[#8B3A2B] decoration-2 underline-offset-4">
            {weddingConfig.groom.nickname}
          </span>
          <span className="italic font-serif text-[#8B3A2B] text-lg font-normal">&amp;</span>
          <span className="underline decoration-[#8B3A2B] decoration-2 underline-offset-4">
            {weddingConfig.bride.nickname}
          </span>
        </div>

        <p className="font-serif italic text-xs text-[#555555] mt-0.5 leading-relaxed">
          "Witness the joyous beginning of a lifelong union on this historic occasion."
        </p>

        <div className="w-full h-px bg-[#1E1E1E]/30 my-2" />

        <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#333333] font-semibold">
          DATE OF RECORD: {weddingConfig.dateStr}
        </span>
      </motion.div>

      {/* Bottom Guest Dispatch Telegram & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-xs shrink-0"
      >
        {/* Telegram Envelope Card */}
        <div className="w-full bg-[#FAF5EE] border-2 border-dashed border-[#1E1E1E] p-2.5 sm:p-3 shadow-sm mb-2.5 flex flex-col items-center">
          <span className="text-[8.5px] uppercase tracking-widest text-[#8B3A2B] font-mono font-bold mb-0.5">
            • SPECIAL INVITATION DISPATCH FOR •
          </span>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#1E1E1E] capitalize px-2 line-clamp-2">
            {guestName}
          </h3>
          <span className="text-[8.5px] font-mono text-[#666666] mt-0.5 tracking-wider">
            RECIPIENT OF HONOR • FIRST CLASS
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOpenInvitation}
          className="w-full py-2.5 px-5 bg-[#1E1E1E] text-[#FAF5EE] border-2 border-[#1E1E1E] font-heading font-bold text-xs sm:text-sm tracking-widest uppercase shadow-md flex items-center justify-center gap-2 hover:bg-[#8B3A2B] hover:border-[#8B3A2B] transition-all cursor-pointer"
        >
          <MailOpen size={15} />
          <span>Buka Edisi Khusus Pernikahan</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
