import React from 'react';
import { motion } from 'motion/react';
import { Terminal, KeyRound } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { CyberpunkHUDHeader } from './decorations/CyberpunkHUDHeader';
import { FloatingNeonParticles } from './decorations/FloatingNeonParticles';
import { playCyberGlitch, playLaserSynth } from './utils/cyberpunkAudio';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  const handleOpenInvitation = () => {
    playCyberGlitch();
    playLaserSynth();
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 overflow-y-auto overflow-x-hidden no-scrollbar py-6 bg-[#0A0A12] text-white"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Cyber Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `url('/assets/themes/cyberpunk/pattern.svg')`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating Neon Particles & Data Bits */}
      <FloatingNeonParticles />

      {/* Top HUD Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-20 shrink-0"
      >
        <CyberpunkHUDHeader />
      </motion.div>

      {/* Center Couple Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full max-w-sm my-2 bg-[#0F1020]/95 backdrop-blur-md p-6 rounded-3xl border-2 border-[#00F0FF] shadow-[0_0_25px_rgba(0,240,255,0.25)] relative"
      >
        <span className="text-[10px] tracking-[0.25em] font-mono font-bold uppercase text-[#FF007F] mb-1">
          // CYBER MATRIMONY PROTOCOL
        </span>

        <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#00F0FF] leading-tight my-1 drop-shadow-[0_0_10px_rgba(0,240,255,0.6)] uppercase">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h1>

        <p className="font-mono text-xs text-[#FFE600] mt-1 font-medium">
          [NEO-JAKARTA // SECTOR 7]
        </p>

        <div className="w-20 h-[2px] bg-gradient-to-r from-[#00F0FF] via-[#FF007F] to-[#FFE600] my-3" />

        <span className="text-xs font-mono font-bold text-gray-200">
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
        <div className="bg-black/80 border border-[#00F0FF]/40 rounded-2xl p-3.5 w-full mb-3 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
          <p className="text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-0.5">
            AUTHENTICATED GUEST //
          </p>
          <p className="font-mono font-bold text-sm text-[#00F0FF] truncate">
            {guestName || 'TAMU UNDANGAN'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenInvitation}
          className="w-full py-3 rounded-2xl bg-[#00F0FF] hover:bg-[#38f3ff] text-black font-mono font-black text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <KeyRound size={16} />
          <span>BUKA UNDANGAN DIGITAL</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
