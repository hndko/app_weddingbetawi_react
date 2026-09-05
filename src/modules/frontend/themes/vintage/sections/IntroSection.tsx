import React from 'react';
import { motion } from 'motion/react';
import { FloatingVintageEphemera } from '../decorations/FloatingVintageEphemera';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-16 px-6 bg-[#F8F2E6] text-[#1E1E1E] overflow-hidden border-t-2 border-[#1E1E1E]">
      <FloatingVintageEphemera className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md mx-auto"
      >
        {/* Column Header */}
        <div className="text-center mb-6 pb-3 border-b border-[#1E1E1E]/40">
          <span className="text-[10px] tracking-[0.25em] uppercase font-mono font-bold text-[#8B3A2B] block mb-1">
            EDITORIAL COLUMN • SALAM REDAKSI
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#141414]">
            BISMILLAHIR RAHMANIR RAHIM
          </h2>
          <span className="text-[11px] font-serif italic text-[#666666] block mt-1">
            "Assalamu'alaikum Warahmatullahi Wabarakatuh"
          </span>
        </div>

        {/* Editorial Body with Drop Cap */}
        <div className="bg-[#FAF5EE] p-5 sm:p-6 border border-[#1E1E1E] shadow-xs relative">
          <p className="font-serif text-xs sm:text-[13px] text-[#2B2B2B] leading-relaxed text-justify mb-4">
            <span className="float-left text-4xl font-heading font-black pr-2 pt-1 text-[#8B3A2B] leading-none">
              D
            </span>
            engan penuh rasa syukur dan memohon rahmat Allah Subhanahu Wa Ta'ala, merupakan kehormatan istimewa bagi kami untuk menyampaikan lembaran kabar bahagia ini kepada Bapak/Ibu/Saudara/i serta sahabat sekalian. Kami mengundang kehadiran serta untaian doa restu tulus dalam rangka mengikat janji suci pernikahan putra-putri tercinta kami.
          </p>

          <div className="w-16 h-0.5 bg-[#1E1E1E]/30 mx-auto my-4" />

          {/* Holy Scripture Feature Box */}
          <div className="border-y border-[#1E1E1E]/40 py-3 text-center bg-[#F4EBD9]/60 px-3">
            <p className="font-serif italic text-xs sm:text-[12.5px] text-[#333333] leading-relaxed mb-2">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <span className="text-[9.5px] font-mono uppercase font-bold text-[#8B3A2B] tracking-widest block">
              — SURAH AR-RUM : 21 —
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
