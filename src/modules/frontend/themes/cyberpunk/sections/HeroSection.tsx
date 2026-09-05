import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Radio } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { CyberpunkHUDHeader } from '../decorations/CyberpunkHUDHeader';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative pt-12 pb-10 px-5 flex flex-col items-center text-center overflow-hidden">
      {/* Cyberpunk HUD Header */}
      <CyberpunkHUDHeader className="mb-4" />

      {/* Holographic Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/40 text-[#00F0FF] text-[11px] font-mono font-bold tracking-widest uppercase mb-3 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
      >
        <Radio size={12} className="animate-pulse text-[#FF007F]" />
        <span>CYBER MATRIMONY // ACCESS GRANTED</span>
      </motion.div>

      {/* Cyber Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-gray-400 uppercase tracking-widest mb-1 font-mono"
      >
        Neural Synchrony of Two Souls
      </motion.p>

      {/* Couple Names with Cyber Neon Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center my-3"
      >
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#00F0FF] tracking-tight drop-shadow-[0_0_12px_rgba(0,240,255,0.6)] uppercase">
          {weddingConfig.groom.nickname}
        </h1>
        <span className="text-2xl sm:text-3xl font-mono text-[#FF007F] my-0.5 drop-shadow-[0_0_8px_rgba(255,0,127,0.7)]">&amp;</span>
        <h1 className="font-heading text-4xl sm:text-5xl font-black text-[#FF007F] tracking-tight drop-shadow-[0_0_12px_rgba(255,0,127,0.6)] uppercase">
          {weddingConfig.bride.nickname}
        </h1>
      </motion.div>

      {/* Date & Venue Holographic HUD Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 w-full max-w-xs bg-[#0F1020]/90 backdrop-blur-md rounded-2xl p-4 border border-[#00F0FF]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] flex flex-col gap-2.5 text-xs text-gray-200"
      >
        <div className="flex items-center justify-center gap-2 font-mono font-bold text-[#FFE600]">
          <Calendar size={14} className="text-[#00F0FF]" />
          <span>{weddingConfig.dateStr}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-mono">
          <MapPin size={13} className="text-[#FF007F] shrink-0" />
          <span className="truncate">{weddingConfig.events.resepsi.venue}</span>
        </div>
      </motion.div>
    </section>
  );
};
