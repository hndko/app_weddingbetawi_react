import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MapPin, Calendar } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { MahkotaSuntiang } from '../decorations/MahkotaSuntiang';
import { FloatingSongketPetals } from '../decorations/FloatingSongketPetals';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[580px] flex flex-col items-center justify-between text-center px-6 py-12 bg-gradient-to-b from-[#4A0713] via-[#7B1122] to-[#35040D] text-[#FAF5F0] overflow-hidden">
      {/* Subtle Diamond Songket Lattice Texture */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Floating Songket Spangles & Petals */}
      <FloatingSongketPetals className="opacity-75" />

      {/* Rotating Traditional Songket Diamond Watermark in Background */}
      <motion.div
        className="absolute w-[380px] h-[380px] pointer-events-none opacity-[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-[#D4AF37] stroke-[1.2]">
          <polygon points="100,10 190,100 100,190 10,100" />
          <polygon points="100,25 175,100 100,175 25,100" />
          <polygon points="100,40 160,100 100,160 40,100" />
          <line x1="10" y1="100" x2="190" y2="100" />
          <line x1="100" y1="10" x2="100" y2="190" />
        </svg>
      </motion.div>

      {/* Top Emblem & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center mt-2"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MahkotaSuntiang size={92} primaryColor="#D4AF37" secondaryColor="#997A15" accentColor="#FFF3C4" />
        </motion.div>

        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.3em] text-[#D4AF37] uppercase font-serif font-semibold mt-3">
          <Sparkles size={11} className="text-[#FFF3C4]" />
          <span>BARALEK GADANG</span>
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
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF5F0] leading-tight drop-shadow-md">
          {weddingConfig.groom.nickname}
        </h1>
        <span className="text-xl sm:text-2xl text-[#D4AF37] font-serif italic my-1 font-normal">
          jo
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl text-[#FAF5F0] leading-tight drop-shadow-md">
          {weddingConfig.bride.nickname}
        </h1>

        <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-4" />

        {/* Minang Proverb */}
        <p className="text-[11px] text-[#FFF3C4]/90 tracking-wider italic font-serif max-w-xs">
          "Adat Basandi Syarak, Syarak Basandi Kitabullah"
        </p>
      </motion.div>

      {/* Bottom Event Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-[#FAF5F0]/90 bg-[#35040D]/70 backdrop-blur-xs px-5 py-2.5 rounded-full border border-[#D4AF37]/40 shadow-sm"
      >
        <span className="flex items-center gap-1.5 font-medium">
          <Calendar size={13} className="text-[#D4AF37]" />
          <span>{weddingConfig.dateStr}</span>
        </span>
        <span className="hidden sm:inline text-[#D4AF37]">•</span>
        <span className="flex items-center gap-1.5 font-medium">
          <MapPin size={13} className="text-[#D4AF37]" />
          <span>{weddingConfig.events[0]?.venueName || 'Rumah Gadang Pusako'}</span>
        </span>
      </motion.div>
    </section>
  );
};
