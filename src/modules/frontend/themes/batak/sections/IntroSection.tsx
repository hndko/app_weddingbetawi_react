import React from 'react';
import { motion } from 'motion/react';
import { GorgaOrnament } from '../decorations/GorgaOrnament';
import { FloatingGorgaPetals } from '../decorations/FloatingGorgaPetals';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-20 px-6 text-center bg-gradient-to-b from-[#FAF6F0] via-[#FCF9F5] to-[#F5ECE0] text-[#1C1917] overflow-hidden">
      {/* Floating Gold & Sirih Petals */}
      <FloatingGorgaPetals count={5} className="opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md mx-auto"
      >
        {/* Batak Traditional Carved Frame Container */}
        <div className="relative bg-[#FAF6F0] border-2 border-[#7A1B1E]/60 rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden">
          {/* Subtle Corner Gold Gorga Accents */}
          <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#D4AF37]" />
          <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#D4AF37]" />
          <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#D4AF37]" />

          {/* Central Gorga Medallion */}
          <div className="flex justify-center mb-3">
            <GorgaOrnament variant="medallion" width={56} />
          </div>

          <span className="text-[11px] tracking-[0.3em] uppercase font-serif text-[#7A1B1E] font-bold block mb-1">
            HORAS JALA GABE
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase font-sans text-[#D4AF37] font-semibold block mb-4">
            UNJUK ADAT BOLON BATAK TOBA
          </span>

          <h2 className="font-heading text-xl sm:text-2xl text-[#7A1B1E] mb-4 font-bold leading-relaxed">
            Salam Sejahtera &amp; Doa Berkat
          </h2>

          <p className="text-xs sm:text-[13px] text-[#2D2A26] leading-relaxed mb-6 font-normal">
            Atas kasih dan kemurahan <span className="font-serif font-bold text-[#7A1B1E]">Tuhan Yang Maha Esa</span>, kami bermaksud mengundang Bapak/Ibu/Saudara/i serta segenap keluarga terhormat untuk menghadiri dan memberikan doa restu pada pernikahan putra-putri kami:
          </p>

          {/* Umpasa & Falsafah Luhur Batak Toba Card */}
          <div className="bg-[#FFFDF9] border border-[#D4AF37]/50 rounded-2xl p-4 sm:p-5 shadow-inner">
            <p className="font-serif italic text-xs sm:text-[12.5px] text-[#7A1B1E] font-semibold leading-relaxed mb-2.5">
              &ldquo;Aek godang tu aek laut, Dos ni roha sibaen na saut. Denggan basa ni Tuhan i, dipasupasu ma parsaripeon on gabe ripe na marhasonangan.&rdquo;
            </p>
            <p className="text-[11px] text-[#1C1917]/80 leading-normal mb-3 font-light">
              &ldquo;Air mengalir menyatu ke lautan luas, Kesatuan hati mewujudkan cita dan bahagia. Kiranya berkat Tuhan melimpah atas ikatan suci ini menjadi keluarga yang berbahagia.&rdquo;
            </p>
            <div className="pt-2 border-t border-[#D4AF37]/30">
              <span className="text-[10px] font-sans font-bold tracking-wider text-[#997A15] block">
                — UMPASA ADAT PARSARIPEON BATAK TOBA —
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
