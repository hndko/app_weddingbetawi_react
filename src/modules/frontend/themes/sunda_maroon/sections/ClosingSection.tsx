import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { MahkotaSiger } from '../decorations/MahkotaSiger';
import { AnimatedSundaneseFiligree } from '../decorations/AnimatedSundaneseFiligree';
import { FloatingJasmineRonce } from '../decorations/FloatingJasmineRonce';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-24 px-6 text-center bg-gradient-to-b from-[#FAF5F5] via-[#F5ECEE] to-[#EBDDE0] overflow-hidden">
      {/* Floating Sacred Jasmine Animation */}
      <FloatingJasmineRonce className="opacity-45" />

      {/* Subtle Gold Corner Frames */}
      <AnimatedSundaneseFiligree position="top-left" className="top-3 left-3 opacity-60" size={40} color="#D4AF37" />
      <AnimatedSundaneseFiligree position="top-right" className="top-3 right-3 opacity-60" size={40} color="#D4AF37" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-sm mx-auto"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-serif text-[#7B1122] font-semibold block mb-3">
          Hatur Nuhun • Terima Kasih
        </span>

        <p className="text-xs sm:text-[13px] text-[#4A0E13]/80 leading-relaxed mb-6 font-light">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai. Atas kehadiran dan doa restunya, kami ucapkan terima kasih.
        </p>
        
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />

        <h3 className="font-heading text-lg sm:text-xl text-[#2D080C] mb-8 font-bold leading-relaxed">
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl text-[#2D080C] font-bold">{weddingConfig.groom.nickname}</h2>
          <span className="text-xl text-[#D4AF37] font-serif italic my-0.5">&</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#2D080C] font-bold">{weddingConfig.bride.nickname}</h2>
        </div>
        
        {/* Central Siger Crown Emblem at Bottom */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MahkotaSiger size={76} color="#D4AF37" accentColor="#7B1122" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
