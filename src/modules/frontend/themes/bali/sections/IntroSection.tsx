import React from 'react';
import { motion } from 'motion/react';
import { BungaJepun } from '../decorations/BungaJepun';
import { FloatingJepun } from '../decorations/FloatingJepun';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-b from-[#FAF6F0] via-[#FCF9F5] to-[#F5ECE0] text-[#240C02] overflow-hidden">
      {/* Floating Frangipani Petals */}
      <FloatingJepun count={5} className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md mx-auto"
      >
        {/* Balinese Stone Carved Arch Card Container */}
        <div className="relative bg-[#FAF6F0] border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden">
          {/* Subtle Corner Stone Accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* Central Frangipani Flower */}
          <div className="flex justify-center mb-3">
            <BungaJepun size={44} />
          </div>

          <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-[#C5A059] font-bold block mb-1">
            OM SWASTYASTU
          </span>
          <span className="text-[11px] tracking-[0.2em] uppercase font-sans text-[#7C2D12] font-semibold block mb-4">
            PAWIWAHAN AGENG ADAT BALI
          </span>

          <h2 className="font-heading text-xl sm:text-2xl text-[#7C2D12] mb-4 font-bold leading-relaxed">
            Rahajeng Rahina Pawiwahan
          </h2>

          <p className="text-xs sm:text-[13px] text-[#451A03]/85 leading-relaxed mb-6 font-light">
            Atas Asung Kertha Wara Nugraha <span className="font-serif font-medium text-[#7C2D12]">Ida Sang Hyang Widhi Wasa</span> / Tuhan Yang Maha Esa, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir serta memberikan doa restu pada upacara sakral pernikahan putra-putri kami:
          </p>

          {/* Vedic Holy Wiwaha Verse Card (Rgveda X.85.42) */}
          <div className="bg-[#FFFDF9] border border-[#D4AF37]/40 rounded-xl p-4 sm:p-5 shadow-inner">
            <p className="font-serif italic text-xs sm:text-[12.5px] text-[#5A1A08]/90 leading-relaxed mb-2.5">
              "Ihaiva stam ma vi yaustam visvam ayur vyasnutam, kridantau putrair naptrbhih modamanau sve grhe."
            </p>
            <p className="text-[11px] text-[#7C2D12]/80 leading-normal mb-2">
              "Tetaplah kalian berdua di sini, jangan pernah terpisahkan, nikmatilah kehidupan sepenuhnya dengan anak dan cucumu dalam suasana riang gembira di rumahmu sendiri."
            </p>
            <span className="text-[10px] font-sans font-semibold tracking-wider text-[#C5A059] block">
              — RGVEDA X. 85. 42 (MANTRA WIWAHA) —
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
