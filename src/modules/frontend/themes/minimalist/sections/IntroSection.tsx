import React from 'react';
import { motion } from 'motion/react';
import { MinimalistArch } from '../decorations/MinimalistArch';
import { MinimalistCornerAccent } from '../decorations/MinimalistCornerAccent';
import { FloatingBotanicalLeaves } from '../decorations/FloatingBotanicalLeaves';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 text-center bg-[#F7FAFC] relative overflow-hidden flex flex-col items-center">
      {/* Floating Botanical Leaves */}
      <FloatingBotanicalLeaves className="opacity-40" />

      {/* Background Subtle Fine Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2D3748 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />

      <div className="max-w-md mx-auto relative z-10 w-full mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-7 sm:p-9 bg-white shadow-sm border border-[#E2E8F0] relative overflow-hidden"
        >
          {/* Contemporary Minimalist Corner Accents */}
          <MinimalistCornerAccent position="top-left" className="top-2 left-2" size={34} primaryColor="#2D3748" secondaryColor="#9AA79C" />
          <MinimalistCornerAccent position="top-right" className="top-2 right-2" size={34} primaryColor="#2D3748" secondaryColor="#9AA79C" />
          <MinimalistCornerAccent position="bottom-left" className="bottom-2 left-2" size={34} primaryColor="#2D3748" secondaryColor="#9AA79C" />
          <MinimalistCornerAccent position="bottom-right" className="bottom-2 right-2" size={34} primaryColor="#2D3748" secondaryColor="#9AA79C" />

          {/* Minimalist Intersecting Circles / Rings */}
          <div className="text-[#9AA79C] mb-4 relative z-10 flex justify-center">
            <svg width="42" height="28" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9AA79C] opacity-90">
              <circle cx="18" cy="16" r="11" stroke="#2D3748" strokeWidth="1.6" />
              <circle cx="30" cy="16" r="11" stroke="#9AA79C" strokeWidth="1.6" />
              <circle cx="18" cy="5" r="2" fill="#D4AF37" />
            </svg>
          </div>

          <span className="block text-[10px] tracking-[0.25em] text-[#718096] uppercase mb-2 font-sans font-medium">
            Bismillahir Rahmanir Rahim
          </span>

          <span className="block text-[11px] tracking-[0.2em] text-[#2D3748] uppercase font-sans font-semibold mb-3">
            Warmest Greetings
          </span>

          <h3 className="font-heading text-xl sm:text-2xl text-[#1A202C] mb-4 leading-relaxed font-normal">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h3>

          <p className="text-xs sm:text-[13px] text-[#4A5568] leading-relaxed mb-4 font-light">
            Tanpa mengurangi rasa hormat, dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada momen bahagia pernikahan kami:
          </p>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#9AA79C] to-transparent mx-auto mt-4" />
        </motion.div>
      </div>

      {/* Modern Minimalist Arch Gateway at Bottom */}
      <motion.div 
        className="relative w-full max-w-md mx-auto flex justify-center items-end z-10 mt-2 pointer-events-none"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <MinimalistArch 
          size={340} 
          primaryColor="#2D3748" 
          secondaryColor="#9AA79C" 
          accentColor="#D4AF37" 
          className="w-[90%] max-w-[340px] drop-shadow-xs" 
        />
      </motion.div>
    </section>
  );
};
