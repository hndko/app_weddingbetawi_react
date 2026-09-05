import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { MahkotaSuntiang } from '../decorations/MahkotaSuntiang';
import { FloatingSongketPetals } from '../decorations/FloatingSongketPetals';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-24 px-6 text-center bg-gradient-to-b from-[#FAF5F0] via-[#FDFBF7] to-[#F3ECD8] overflow-hidden">
      {/* Floating Songket Petals & Gold Dust */}
      <FloatingSongketPetals className="opacity-50" />

      {/* Subtle Corner Filigree Accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-sm mx-auto"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-serif text-[#D4AF37] font-bold block mb-3">
          Tarimo Kasih Banyak
        </span>

        <p className="text-xs sm:text-[13px] text-[#4A0713]/85 leading-relaxed mb-6 font-light">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Dunsanak sekalian berkenan hadir serta melantunkan doa restu untuk kedua mempelai. Atas kehadiran dan untaian doa tulus yang dipanjatkan, kami ucapkan terima kasih yang sedalam-dalamnya.
        </p>
        
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />

        <h3 className="font-heading text-lg sm:text-xl text-[#7B1122] mb-8 font-bold leading-relaxed">
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl text-[#7B1122] font-bold tracking-tight">
            {weddingConfig.groom.nickname}
          </h2>
          <span className="text-xl text-[#D4AF37] font-serif italic my-0.5">&amp;</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#7B1122] font-bold tracking-tight">
            {weddingConfig.bride.nickname}
          </h2>
        </div>
        
        {/* Central Suntiang Emblem */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MahkotaSuntiang size={76} primaryColor="#D4AF37" secondaryColor="#997A15" accentColor="#FFF3C4" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
