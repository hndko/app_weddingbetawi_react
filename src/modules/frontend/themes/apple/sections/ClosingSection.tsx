import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <div className="w-full px-4 pt-2 pb-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 sm:p-8 text-center flex flex-col items-center"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007AFF]/20 to-[#5856D6]/20 flex items-center justify-center text-[#007AFF] mb-3">
          <Heart size={22} className="fill-[#007AFF]" />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-sans tracking-tight">
          Terima Kasih
        </h3>

        <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-xs mt-2 leading-relaxed">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
        </p>

        <div className="my-4 flex items-center gap-2">
          <span className="w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
          <Sparkles size={12} className="text-[#D4AF37]" />
          <span className="w-8 h-[1px] bg-neutral-300 dark:bg-neutral-700" />
        </div>

        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
          Kami yang berbahagia,
        </p>
        <p className="text-lg font-black text-[#007AFF] mt-0.5 tracking-wide">
          {groom.nickname} &amp; {bride.nickname}
        </p>
        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
          Beserta segenap keluarga besar kedua mempelai
        </p>

        {/* Apple subtle footer tagline */}
        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 w-full text-center">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-500 tracking-wider uppercase font-medium">
            Designed with Love in Jakarta • Apple iOS Bento Grid
          </p>
        </div>
      </motion.div>
    </div>
  );
};
