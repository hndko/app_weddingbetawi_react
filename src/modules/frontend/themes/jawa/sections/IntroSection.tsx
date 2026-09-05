import React from 'react';
import { motion } from 'motion/react';
import { PendopoJoglo } from '../decorations/PendopoJoglo';
import { JavaneseFiligree } from '../decorations/JavaneseFiligree';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 text-center bg-[#FAF8F2] relative overflow-hidden flex flex-col items-center">
      {/* Background Subtle Gold Dots */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C5A059 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="max-w-md mx-auto relative z-10 w-full mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-7 sm:p-9 bg-white/90 backdrop-blur-md shadow-lg border border-[#C5A059]/30 relative overflow-hidden"
        >
          {/* Authentic Javanese Filigree Gold Corners */}
          <JavaneseFiligree position="top-left" className="absolute top-2 left-2" size={36} color="#C5A059" />
          <JavaneseFiligree position="top-right" className="absolute top-2 right-2" size={36} color="#C5A059" />
          <JavaneseFiligree position="bottom-left" className="absolute bottom-2 left-2" size={36} color="#C5A059" />
          <JavaneseFiligree position="bottom-right" className="absolute bottom-2 right-2" size={36} color="#C5A059" />

          {/* Golden Rings / Cultural Icon */}
          <div className="text-[#C5A059] mb-5 relative z-10 flex justify-center">
            <svg width="46" height="30" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#C5A059] opacity-90 drop-shadow-sm">
              <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
              <circle cx="32" cy="16" r="12" stroke="currentColor" strokeWidth="2.5" />
              <path d="M16 2 L18 6 L16 8 L14 6 Z" fill="currentColor" />
            </svg>
          </div>

          <span className="block text-[11px] tracking-[0.25em] text-[#C5A059] uppercase mb-2 font-serif font-semibold">
            Bismillahir Rahmanir Rahim
          </span>

          <h3 className="font-heading text-xl sm:text-2xl text-[#1B3B2B] mb-5 leading-relaxed font-bold">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h3>

          <p className="text-xs sm:text-[13px] text-[#2C3E35]/85 leading-relaxed mb-4 font-light">
            Katur dhumateng para rawuh ingkang kinurmatan, lumantar serat ulem punika, kanthi hangajab berkahing Gusti Ingkang Maha Agung, mugi kepareng rawuh hangestreni saha paring berkah pangestu dhumateng pawiwahan dhauping putra-putri kawula:
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Majestic Pendopo Joglo Keraton Scene at Bottom (Zero Rumah Kebaya, Zero Ondel-ondel) */}
      <motion.div 
        className="relative w-full max-w-md mx-auto flex justify-center items-end z-10 mt-2 pointer-events-none"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <PendopoJoglo 
          size={340} 
          primaryColor="#C5A059" 
          accentColor="#132A1C" 
          className="w-[90%] max-w-[340px] drop-shadow-md" 
        />
      </motion.div>
    </section>
  );
};
