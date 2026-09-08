import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { ArabesqueArch } from '../decorations/ArabesqueArch';
import { AnimatedArabesqueFiligree } from '../decorations/AnimatedArabesqueFiligree';
import { FloatingArabianPetals } from '../decorations/FloatingArabianPetals';

export const IntroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const salutation = weddingConfig.greeting?.salutation || "Assalamu'alaikum Warahmatullahi Wabarakatuh";
  const introText = weddingConfig.greeting?.introText || "Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri dan memberikan doa restu pada acara pernikahan putra-putri kami:";
  const quote = weddingConfig.quote;

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

      <div className="max-w-md mx-auto relative z-10 w-full mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-6 sm:p-8 bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(15,76,92,0.06)] border border-[#C5A059]/30 relative overflow-hidden"
        >
          {/* Ornate Gold Border Filigree In Corners */}
          <AnimatedArabesqueFiligree className="opacity-70" />

          {/* Golden Arabesque Ring Duo Icon */}
          <div className="text-[#C5A059] mb-4 relative z-10 flex justify-center">
            <svg width="44" height="28" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C5A059] opacity-90 drop-shadow-xs">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="32" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
              <path d="M16 2 L18 6 L16 8 L14 6 Z" fill="currentColor" />
            </svg>
          </div>

          <span className="block text-[11px] tracking-[0.25em] text-[#C5A059] uppercase mb-1 font-serif font-semibold">
            Bismillahir Rahmanir Rahim
          </span>

          <span className="block text-[11px] tracking-[0.2em] text-[#0F4C5C] uppercase font-serif font-bold mb-3">
            Syar'i &amp; Sakral
          </span>

          <h3 className="font-heading text-xl sm:text-2xl text-[#072129] mb-4 leading-relaxed font-bold">
            {salutation}
          </h3>

          <p className="text-xs sm:text-[13px] text-[#1E3A34]/85 leading-relaxed mb-4 font-light">
            {introText}
          </p>

          {/* Quranic / Sacred Verse Callout */}
          {quote?.enabled !== false && (quote?.text || quote?.arabic) && (
            <div className="bg-[#FAF6EE] p-4 rounded-xl border border-[#C5A059]/25 my-4">
              {quote.arabic && (
                <p className="font-serif text-sm sm:text-base text-[#072129] mb-2 leading-loose text-center font-medium" dir="rtl">
                  {quote.arabic}
                </p>
              )}
              {quote.text && (
                <p className="text-xs italic text-[#37474F]/90 leading-relaxed font-serif">
                  &ldquo;{quote.text}&rdquo;
                </p>
              )}
              {quote.source && (
                <span className="block text-[10px] tracking-widest text-[#0F4C5C] font-semibold mt-2 uppercase">
                  — {quote.source} —
                </span>
              )}
            </div>
          )}

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
