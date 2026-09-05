import React from 'react';
import { motion } from 'motion/react';
import { RumahGadangArch } from '../decorations/RumahGadangArch';
import { FloatingSongketPetals } from '../decorations/FloatingSongketPetals';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-b from-[#FAF5F0] via-[#FDFBF7] to-[#F7EFE6] text-[#2D030A] overflow-hidden">
      {/* Floating Petals and Gold Dust */}
      <FloatingSongketPetals className="opacity-45" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md mx-auto"
      >
        <RumahGadangArch>
          {/* Central Interlocking Golden Wedding Rings */}
          <div className="flex justify-center mb-4">
            <svg width="40" height="30" viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="12" stroke="#D4AF37" strokeWidth="2.5" />
              <circle cx="30" cy="18" r="12" stroke="#7B1122" strokeWidth="2.5" />
              <circle cx="18" cy="8" r="2" fill="#FFF3C4" />
            </svg>
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-[#D4AF37] font-bold block mb-1">
            BISMILLAHIR RAHMANIR RAHIM
          </span>
          <span className="text-[11px] tracking-[0.2em] uppercase font-sans text-[#7B1122] font-semibold block mb-4">
            BARALEK GADANG
          </span>

          <h2 className="font-heading text-xl sm:text-2xl text-[#7B1122] mb-4 font-bold leading-relaxed">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h2>

          <p className="text-xs sm:text-[13px] text-[#4A0713]/85 leading-relaxed mb-6 font-light">
            <span className="italic font-serif font-medium text-[#7B1122]">"Barek samo dipikua, ringan samo dijinjiang."</span> Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Dunsanak/Sahabat sekalian untuk hadir serta memberikan doa restu pada perhelatan pernikahan adat Minangkabau putra-putri kami:
          </p>

          {/* Holy Quran Verse Card */}
          <div className="bg-[#FAF5F0] border border-[#D4AF37]/40 rounded-xl p-4 sm:p-5 shadow-inner">
            <p className="font-serif italic text-xs sm:text-[13px] text-[#4A0713]/90 leading-relaxed mb-2">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <span className="text-[10px] font-sans font-semibold tracking-wider text-[#D4AF37] block">
              — QS. AR-RUM: 21 —
            </span>
          </div>
        </RumahGadangArch>
      </motion.div>
    </section>
  );
};
