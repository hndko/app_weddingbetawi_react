import React from 'react';
import { motion } from 'motion/react';
import { ArabesqueArch } from '../decorations/ArabesqueArch';
import { AnimatedArabesqueFiligree } from '../decorations/AnimatedArabesqueFiligree';
import { FloatingArabianPetals } from '../decorations/FloatingArabianPetals';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 text-center bg-[#FDFBF7] relative overflow-hidden flex flex-col items-center">
      {/* Floating Sacred Golden Stars & Petals */}
      <FloatingArabianPetals className="opacity-40" />

      {/* Background Subtle Arabesque Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#0F4C5C 1.5px, transparent 1.5px)`,
          backgroundSize: '22px 22px'
        }}
      />

      <div className="max-w-md mx-auto relative z-10 w-full mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-7 sm:p-9 bg-white/95 backdrop-blur-md shadow-lg border border-[#C5A059]/35 relative overflow-hidden"
        >
          {/* Authentic Moorish Filigree Gold Corners */}
          <AnimatedArabesqueFiligree position="top-left" className="top-2 left-2" size={36} color="#C5A059" />
          <AnimatedArabesqueFiligree position="top-right" className="top-2 right-2" size={36} color="#C5A059" />
          <AnimatedArabesqueFiligree position="bottom-left" className="bottom-2 left-2" size={36} color="#C5A059" />
          <AnimatedArabesqueFiligree position="bottom-right" className="bottom-2 right-2" size={36} color="#C5A059" />

          {/* Central Sacred Emblem */}
          <div className="text-[#C5A059] mb-4 relative z-10 flex justify-center">
            <svg width="44" height="30" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C5A059] opacity-90 drop-shadow-xs">
              <circle cx="18" cy="16" r="11" stroke="#0F4C5C" strokeWidth="2.2" />
              <circle cx="30" cy="16" r="11" stroke="#C5A059" strokeWidth="2.2" />
              <path d="M18 5 L20 9 L24 9 L21 12 L22 16 L18 13 L14 16 L15 12 L12 9 L16 9 Z" fill="#C5A059" />
            </svg>
          </div>

          <span className="block text-[11px] tracking-[0.25em] text-[#C5A059] uppercase mb-1 font-serif font-semibold">
            Bismillahir Rahmanir Rahim
          </span>

          <span className="block text-[11px] tracking-[0.2em] text-[#0F4C5C] uppercase font-serif font-bold mb-3">
            Syar'i &amp; Sakral
          </span>

          <h3 className="font-heading text-xl sm:text-2xl text-[#072129] mb-4 leading-relaxed font-bold">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h3>

          <p className="text-xs sm:text-[13px] text-[#1E3A34]/85 leading-relaxed mb-4 font-light">
            Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan memberikan doa restu pada acara pernikahan putra-putri kami:
          </p>

          {/* Quranic Verse Callout */}
          <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#C5A059]/25 my-4">
            <p className="text-xs italic text-[#37474F]/90 leading-relaxed font-serif">
              "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
            </p>
            <span className="block text-[10px] tracking-widest text-[#0F4C5C] font-semibold mt-2 uppercase">
              — QS. Ar-Rum: 21 —
            </span>
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Majestic Moorish Arch Gateway at Bottom */}
      <motion.div 
        className="relative w-full max-w-md mx-auto flex justify-center items-end z-10 mt-2 pointer-events-none"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <ArabesqueArch 
          size={340} 
          primaryColor="#0F4C5C" 
          accentColor="#C5A059" 
          className="w-[90%] max-w-[340px] drop-shadow-md" 
        />
      </motion.div>
    </section>
  );
};
