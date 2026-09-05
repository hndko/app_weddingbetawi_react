import React from 'react';
import { motion } from 'motion/react';
import { PrianganArch } from '../decorations/PrianganArch';
import { AnimatedSundaneseFiligree } from '../decorations/AnimatedSundaneseFiligree';
import { FloatingJasmineRonce } from '../decorations/FloatingJasmineRonce';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 text-center bg-[#F4F7F4] relative overflow-hidden flex flex-col items-center">
      {/* Floating Sacred Jasmine & Gold Dust */}
      <FloatingJasmineRonce className="opacity-40" />

      {/* Background Subtle Priangan Dots */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#4A6B5D 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="max-w-md mx-auto relative z-10 w-full mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-7 sm:p-9 bg-white/95 backdrop-blur-md shadow-lg border border-[#D4AF37]/35 relative overflow-hidden"
        >
          {/* Authentic Sundanese Filigree Gold Corners */}
          <AnimatedSundaneseFiligree position="top-left" className="top-2 left-2" size={36} color="#D4AF37" />
          <AnimatedSundaneseFiligree position="top-right" className="top-2 right-2" size={36} color="#D4AF37" />
          <AnimatedSundaneseFiligree position="bottom-left" className="bottom-2 left-2" size={36} color="#D4AF37" />
          <AnimatedSundaneseFiligree position="bottom-right" className="bottom-2 right-2" size={36} color="#D4AF37" />

          {/* Golden Rings / Love Emblem */}
          <div className="text-[#4A6B5D] mb-4 relative z-10 flex justify-center">
            <svg width="46" height="30" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4A6B5D] opacity-90 drop-shadow-xs">
              <circle cx="16" cy="16" r="12" stroke="#4A6B5D" strokeWidth="2.2" />
              <circle cx="32" cy="16" r="12" stroke="#D4AF37" strokeWidth="2.2" />
              <path d="M16 2 L18 6 L16 8 L14 6 Z" fill="#D4AF37" />
            </svg>
          </div>

          <span className="block text-[11px] tracking-[0.25em] text-[#4A6B5D] uppercase mb-2 font-serif font-semibold">
            Bismillahir Rahmanir Rahim
          </span>

          <span className="block text-[12px] tracking-[0.2em] text-[#D4AF37] uppercase font-serif font-bold mb-3">
            Sampurasun
          </span>

          <h3 className="font-heading text-xl sm:text-2xl text-[#1F3329] mb-4 leading-relaxed font-bold">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h3>

          <p className="text-xs sm:text-[13px] text-[#2D4537]/85 leading-relaxed mb-4 font-light">
            Kersaning Gusti Nu Maha Suci, kalayan widi sareng pangestu ti para sepuh sadayana, simkuring saparakanca seja ngahaturanan uninga mugi kepareng rawuh dina acara sukuran jatukrami putra-putri simkuring:
          </p>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Majestic Priangan Bamboo Arch at Bottom */}
      <motion.div 
        className="relative w-full max-w-md mx-auto flex justify-center items-end z-10 mt-2 pointer-events-none"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <PrianganArch 
          size={340} 
          primaryColor="#4A6B5D" 
          accentColor="#D4AF37" 
          className="w-[90%] max-w-[340px] drop-shadow-md" 
        />
      </motion.div>
    </section>
  );
};
