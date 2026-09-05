import React from 'react';
import { motion } from 'motion/react';
import { FloatingCempakaMelati } from '../decorations/FloatingCempakaMelati';
import { RumahLimasArch } from '../decorations/RumahLimasArch';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-b from-[#FAF5EE] via-[#FDFBF7] to-[#F5ECE0] text-[#240106] overflow-hidden">
      {/* Floating Petals */}
      <FloatingCempakaMelati className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md mx-auto"
      >
        <div className="relative p-6 sm:p-8 bg-white/75 border border-[#D4AF37]/50 rounded-2xl shadow-sm backdrop-blur-xs">
          {/* Rumah Limas Roof Arch */}
          <div className="flex justify-center -mt-2 mb-3">
            <RumahLimasArch width={180} height={45} primaryColor="#50020D" goldColor="#D4AF37" />
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-[#D4AF37] font-bold block mb-1">
            BISMILLAHIR RAHMANIR RAHIM
          </span>
          <span className="text-[11px] tracking-[0.2em] uppercase font-sans text-[#780016] font-semibold block mb-4">
            PROSESI MUNGGAH • TEPUNG TAWAR
          </span>

          <h2 className="font-heading text-xl sm:text-2xl text-[#780016] mb-4 font-bold leading-relaxed">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h2>

          <p className="text-xs sm:text-[13px] text-[#3A020B]/85 leading-relaxed mb-6 font-light">
            <span className="italic font-serif font-medium text-[#780016]">"Elok nian kain songket Lepus, dipakai megah di hari pernikahan."</span> Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami bermaksud mengundang Bapak/Ibu/Saudara/i serta kerabat sekalian untuk hadir serta memberikan untaian doa restu pada perhelatan pernikahan adat Palembang Sriwijaya putra-putri kami:
          </p>

          {/* Holy Quran Verse Card */}
          <div className="bg-[#FAF5EE] border border-[#D4AF37]/40 rounded-xl p-4 sm:p-5 shadow-inner">
            <p className="font-serif italic text-xs sm:text-[13px] text-[#3A020B]/90 leading-relaxed mb-2">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <span className="text-[10px] font-sans font-semibold tracking-wider text-[#D4AF37] block">
              — QS. AR-RUM: 21 —
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
