import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { TalawangHeader } from '../decorations/TalawangHeader';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative pt-12 pb-10 px-5 flex flex-col items-center text-center overflow-hidden">
      {/* Talawang Shield Header */}
      <TalawangHeader className="mb-4" />

      {/* Subtitle Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/30 text-[#8B0000] text-[11px] font-bold tracking-widest uppercase mb-3"
      >
        <span>WALIMATUL 'URS • DAYAK KENYAH HERITAGE</span>
      </motion.div>

      {/* Title / Sacred Announcement */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-[#666666] uppercase tracking-widest mb-1 font-serif"
      >
        Pernikahan Suci Adat Dayak Kenyah
      </motion.p>

      {/* Couple Names */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center my-3"
      >
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#8B0000] tracking-tight">
          {weddingConfig.groom.nickname}
        </h1>
        <span className="text-xl sm:text-2xl font-serif text-[#D4AF37] my-0.5">&amp;</span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#8B0000] tracking-tight">
          {weddingConfig.bride.nickname}
        </h1>
      </motion.div>

      {/* Date & Venue Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 w-full max-w-xs bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-[#D4AF37]/40 shadow-xs flex flex-col gap-2.5 text-xs text-[#333333]"
      >
        <div className="flex items-center justify-center gap-2 font-semibold text-[#8B0000]">
          <Calendar size={14} className="text-[#D4AF37]" />
          <span>{weddingConfig.dateStr}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-600">
          <MapPin size={13} className="text-[#D4AF37] shrink-0" />
          <span className="truncate">{weddingConfig.events.resepsi.venue}</span>
        </div>
      </motion.div>
    </section>
  );
};
