import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { RoyalScrollHeader } from '../decorations/RoyalScrollHeader';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative pt-12 pb-10 px-5 flex flex-col items-center text-center overflow-hidden">
      {/* Royal Crown Header */}
      <RoyalScrollHeader className="mb-3" />

      {/* Proclamation Pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#854D0E]/10 border border-[#D4AF37] text-[#854D0E] text-[10px] font-bold tracking-widest uppercase mb-2 font-serif"
      >
        <Sparkles size={11} className="text-[#D4AF37]" />
        <span>IMPERIAL WEDDING PROCLAMATION</span>
        <Sparkles size={11} className="text-[#D4AF37]" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-serif italic text-xs text-[#78350F] mb-1"
      >
        The Royal Union of
      </motion.p>

      {/* Couple Royal Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center my-3"
      >
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-wide">
          {weddingConfig.groom.nickname}
        </h1>
        <span className="text-xl sm:text-2xl font-serif italic text-[#D4AF37] my-0.5">&amp;</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] tracking-wide">
          {weddingConfig.bride.nickname}
        </h1>
      </motion.div>

      {/* Royal Date & Venue Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-3 w-full max-w-xs bg-white/80 backdrop-blur-xs rounded-2xl p-4 border border-[#D4AF37]/60 shadow-md flex flex-col gap-2 font-serif text-xs text-[#2C1810]"
      >
        <div className="flex items-center justify-center gap-2 font-bold text-[#854D0E]">
          <Calendar size={14} className="text-[#D4AF37]" />
          <span>{weddingConfig.dateStr}</span>
        </div>
        <div className="h-px bg-[#D4AF37]/30 w-full" />
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#78350F]">
          <MapPin size={13} className="text-[#854D0E] shrink-0" />
          <span className="line-clamp-1">{weddingConfig.events.resepsi.venue}</span>
        </div>
      </motion.div>
    </section>
  );
};
