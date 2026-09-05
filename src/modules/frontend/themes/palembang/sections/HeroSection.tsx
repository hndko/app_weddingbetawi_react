import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, MapPin } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { MahkotaAesanGede } from '../decorations/MahkotaAesanGede';
import { RumahLimasArch } from '../decorations/RumahLimasArch';
import { FloatingCempakaMelati } from '../decorations/FloatingCempakaMelati';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[580px] flex flex-col items-center justify-between text-center px-6 py-12 bg-gradient-to-b from-[#3A020B] via-[#780016] to-[#240106] text-[#FAF5EE] overflow-hidden">
      {/* Subtle Songket Lepus Diamond Lattice Background */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Cempaka & Melati Petals */}
      <FloatingCempakaMelati className="opacity-75" />

      {/* Rumah Limas Roof Arch Header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[340px] opacity-40 pointer-events-none">
        <RumahLimasArch width="100%" height={70} primaryColor="#2A0108" goldColor="#D4AF37" />
      </div>

      {/* Top Sacred Mahkota Kesuhun Aesan Gede Emblem */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center mt-6"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MahkotaAesanGede size={90} primaryColor="#780016" goldColor="#D4AF37" accentColor="#FFE082" />
        </motion.div>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.3em] text-[#D4AF37] uppercase font-serif font-semibold mt-3">
          <Sparkles size={11} className="text-[#FFE082]" />
          <span>KEMEGAHAN SRIWIJAYA • AESAN GEDE</span>
          <Sparkles size={11} className="text-[#FFE082]" />
        </div>

        <span className="text-[11px] tracking-[0.2em] text-[#FFE082]/90 mt-1 font-serif">
          KESULTANAN PALEMBANG DARUSSALAM
        </span>
      </motion.div>

      {/* Center Couple Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 my-6 flex flex-col items-center"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF5EE] leading-tight drop-shadow-md">
          {weddingConfig.groom.nickname}
        </h1>
        <span className="font-serif italic text-2xl text-[#D4AF37] my-1 drop-shadow-sm">&amp;</span>
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF5EE] leading-tight drop-shadow-md">
          {weddingConfig.bride.nickname}
        </h1>
      </motion.div>

      {/* Bottom Event Date & Venue Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-3 w-full max-w-xs"
      >
        <div className="w-full py-2.5 px-4 rounded-xl bg-[#1C0105]/65 border border-[#D4AF37]/45 backdrop-blur-xs flex items-center justify-center gap-2 text-xs sm:text-[13px] text-[#FAF5EE]">
          <Calendar size={14} className="text-[#D4AF37] shrink-0" />
          <span className="font-medium tracking-wide">
            {weddingConfig.dateStr}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#E8DCCC] tracking-wider">
          <MapPin size={12} className="text-[#D4AF37]" />
          <span>{weddingConfig.events.resepsi?.venue || weddingConfig.events.akad?.venue || 'Rumah Limas Palembang'}</span>
        </div>
      </motion.div>
    </section>
  );
};
