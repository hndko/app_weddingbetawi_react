import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, Calendar } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { CandiBentarGapura } from '../decorations/CandiBentarGapura';
import { FloatingJepun } from '../decorations/FloatingJepun';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[580px] flex flex-col items-center justify-between text-center px-6 py-12 bg-gradient-to-b from-[#3D1403] via-[#7C2D12] to-[#240C02] text-[#FAF6F0] overflow-hidden">
      {/* Subtle Patra Punggel Floral Geometry Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#E5C158 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Frangipani / Jepun Bali Petals */}
      <FloatingJepun count={6} className="opacity-75" />

      {/* Rotating Solar Mandala Watermark in Background */}
      <motion.div
        className="absolute w-[380px] h-[380px] pointer-events-none opacity-[0.07] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-[#E5C158] stroke-[1.2]">
          <circle cx="100" cy="100" r="90" />
          <circle cx="100" cy="100" r="70" strokeDasharray="4 4" />
          <polygon points="100,15 125,75 185,100 125,125 100,185 75,125 15,100 75,75" />
          <polygon points="100,35 118,82 165,100 118,118 100,165 82,118 35,100 82,82" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Top Emblem: Candi Bentar Gateway */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center mt-2"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <CandiBentarGapura size={150} primaryColor="#E5C158" accentColor="#FFF3C4" showTedung={true} />
        </motion.div>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.3em] text-[#E5C158] uppercase font-serif font-semibold mt-2">
          <Sparkles size={11} className="text-[#FFF3C4]" />
          <span>PAWIWAHAN ADAT BALI</span>
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

      {/* Bottom Event Date & Venue Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-2 mb-2 w-full max-w-[280px]"
      >
        <div className="flex items-center justify-center gap-2 bg-[#1C1917]/60 backdrop-blur-sm border border-[#E5C158]/35 rounded-full px-4 py-2 w-full shadow-inner">
          <Calendar size={13} className="text-[#E5C158] shrink-0" />
          <span className="text-xs font-serif text-[#FAF6F0]/90 tracking-wide font-medium truncate">
            {weddingConfig.dateStr || 'Minggu, 20 September 2026'}
          </span>
        </div>

        {weddingConfig.events?.resepsi?.venue && (
          <div className="flex items-center justify-center gap-2 bg-[#1C1917]/40 backdrop-blur-xs border border-[#E5C158]/20 rounded-full px-4 py-1.5 w-full">
            <MapPin size={12} className="text-[#E5C158] shrink-0" />
            <span className="text-[11px] text-[#FAF6F0]/80 font-light truncate">
              {weddingConfig.events.resepsi.venue}
            </span>
          </div>
        )}
      </motion.div>
    </section>
  );
};
