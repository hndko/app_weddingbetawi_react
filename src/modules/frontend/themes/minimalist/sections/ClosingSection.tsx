import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { BotanicalEucalyptus } from '../decorations/BotanicalEucalyptus';
import { MinimalistCornerAccent } from '../decorations/MinimalistCornerAccent';
import { FloatingBotanicalLeaves } from '../decorations/FloatingBotanicalLeaves';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-24 px-6 text-center bg-gradient-to-b from-[#F7FAFC] via-[#EDF2F7] to-[#E2E8F0] overflow-hidden">
      {/* Floating Botanical Leaves */}
      <FloatingBotanicalLeaves className="opacity-40" />

      {/* Subtle Corner Accents */}
      <MinimalistCornerAccent position="top-left" className="top-3 left-3 opacity-60" size={38} primaryColor="#2D3748" secondaryColor="#9AA79C" />
      <MinimalistCornerAccent position="top-right" className="top-3 right-3 opacity-60" size={38} primaryColor="#2D3748" secondaryColor="#9AA79C" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-sm mx-auto"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-[#718096] font-medium block mb-3">
          With Love &amp; Gratitude
        </span>

        <p className="text-xs sm:text-[13px] text-[#4A5568] leading-relaxed mb-6 font-light">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami. Atas kehadiran dan doa restunya, kami ucapkan terima kasih yang tulus.
        </p>
        
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#9AA79C] to-transparent mx-auto mb-6" />

        <h3 className="font-heading text-lg sm:text-xl text-[#1A202C] mb-8 font-normal leading-relaxed">
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl text-[#1A202C] font-normal">{weddingConfig.groom.nickname}</h2>
          <span className="text-xl text-[#9AA79C] font-serif italic my-0.5">&amp;</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#1A202C] font-normal">{weddingConfig.bride.nickname}</h2>
        </div>
        
        {/* Central Botanical Branch at Bottom */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BotanicalEucalyptus size={74} primaryColor="#2D3748" secondaryColor="#9AA79C" accentColor="#D4AF37" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
