import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, Calendar } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { RumaBolonHeader } from '../decorations/RumaBolonHeader';
import { FloatingGorgaPetals } from '../decorations/FloatingGorgaPetals';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[580px] flex flex-col items-center justify-between text-center px-6 py-12 bg-gradient-to-b from-[#2A080B] via-[#5C1417] to-[#141210] text-[#FAF6F0] overflow-hidden">
      {/* Subtle Ulos & Gorga Dot Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#E5C158 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Gold & Sirih Petals */}
      <FloatingGorgaPetals count={6} className="opacity-75" />

      {/* Rotating Sacred Gorga Medallion Watermark in Background */}
      <motion.div
        className="absolute w-[400px] h-[400px] pointer-events-none opacity-[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-[#E5C158] stroke-[1.2]">
          <circle cx="100" cy="100" r="92" />
          <circle cx="100" cy="100" r="74" strokeDasharray="4 4" />
          <polygon points="100,10 128,72 190,100 128,128 100,190 72,128 10,100 72,72" />
          <circle cx="100" cy="100" r="45" strokeDasharray="2 4" />
        </svg>
      </motion.div>

      {/* Top Emblem: Ruma Bolon Sweeping Roof */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center mt-2 max-w-sm w-full"
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full"
        >
          <RumaBolonHeader height={85} />
        </motion.div>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.3em] text-[#E5C158] uppercase font-serif font-semibold mt-1">
          <Sparkles size={11} className="text-[#FFF3C4]" />
          <span>UNJUK ADAT BOLON BATAK TOBA</span>
          <Sparkles size={11} className="text-[#FFF3C4]" />
        </div>
      </motion.div>

      {/* Center Couple Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 my-6 flex flex-col items-center"
      >
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF6F0] leading-tight drop-shadow-md">
          {weddingConfig.groom.nickname}
        </h1>
        <div className="my-1.5 flex items-center justify-center gap-3">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#E5C158]" />
          <span className="text-2xl sm:text-3xl text-[#E5C158] font-serif italic font-normal">&amp;</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#E5C158]" />
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF6F0] leading-tight drop-shadow-md">
          {weddingConfig.bride.nickname}
        </h1>
      </motion.div>

      {/* Date, Location & Traditional Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-2 mb-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C1917]/70 border border-[#E5C158]/40 backdrop-blur-xs text-xs text-[#FFF3C4] shadow-sm">
          <Calendar size={13} className="text-[#E5C158]" />
          <span className="font-medium tracking-wide">
            {weddingConfig.events?.resepsi?.date || weddingConfig.events?.akad?.date || weddingConfig.dateStr}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#FAF6F0]/80 mt-0.5">
          <MapPin size={12} className="text-[#E5C158] shrink-0" />
          <span className="font-medium tracking-wide">
            {weddingConfig.events?.resepsi?.venue || weddingConfig.events?.akad?.venue || 'Gedung Pertemuan'}
          </span>
        </div>

        {/* Batak Sacred Blessing Tag */}
        <p className="text-[11px] text-[#E5C158] tracking-widest uppercase font-serif mt-2 italic font-semibold">
          &ldquo;Horas Jala Gabe!&rdquo;
        </p>
      </motion.div>
    </section>
  );
};
