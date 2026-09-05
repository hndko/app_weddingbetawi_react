import React from 'react';
import { motion } from 'motion/react';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-12 px-6 flex flex-col items-center text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white/80 dark:bg-black/20 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-md relative"
      >
        {/* Cultural Motto Badge */}
        <div className="inline-block px-3 py-1 rounded-full bg-[#8B0000]/10 border border-[#8B0000]/25 text-[#8B0000] text-[10px] font-bold tracking-widest uppercase mb-4">
          Falsafah Luhur Dayak Kenyah
        </div>

        {/* Sacred Dayak Kenyah Blessing / Quote */}
        <h3 className="font-serif text-base sm:text-lg font-bold text-[#8B0000] mb-2 leading-snug">
          "Adil Ka' Talino, Bacuramin Ka' Saruga, Basengat Ka' Jubata."
        </h3>

        <p className="text-[11px] font-medium text-[#AA7C11] tracking-wider uppercase mb-4">
          — Adil kepada sesama, bercermin ke surga, bernapas karena Sang Pencipta —
        </p>

        <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mb-4 opacity-60" />

        <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed font-sans">
          Dengan penuh rasa syukur dan memohon limpahan rahmat serta berkat Yang Maha Kuasa, 
          kami bermaksud melangsungkan ikatan janji suci pernikahan putra-putri kami tercinta. 
          Sebuah persatuan dua jiwa, dua keluarga besar, yang dirajut dalam kehangatan adat budaya Dayak Kenyah.
        </p>
      </motion.div>
    </section>
  );
};
