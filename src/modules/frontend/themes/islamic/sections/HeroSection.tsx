import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { IslamicStarCrescent } from '../decorations/IslamicStarCrescent';
import { FloatingArabianPetals } from '../decorations/FloatingArabianPetals';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden bg-gradient-to-b from-[#072129] via-[#0E3D4A] to-[#092932] text-[#FAF6EE]">
      {/* Floating Sacred Golden Stars & Petals */}
      <FloatingArabianPetals className="opacity-50" />

      {/* Subtle Geometric Arabesque Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C5A059 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Atmospheric Soft Light Glows */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-[#0F4C5C]/35 rounded-full blur-3xl pointer-events-none" />
      
      {/* Central Watermark Crescent & Star */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="opacity-[0.08] scale-150 translate-y-6">
          <IslamicStarCrescent size={320} color="#E5C158" secondaryColor="#C5A059" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="z-10 w-full flex flex-col items-center"
      >
        {/* Cultural Subtitle */}
        <div className="flex items-center gap-2 text-[10.5px] tracking-[0.3em] text-[#E5C158] uppercase mb-4 font-medium">
          <Sparkles size={11} className="text-[#E5C158]" />
          <span>WALIMATUL 'URS</span>
          <Sparkles size={11} className="text-[#E5C158]" />
        </div>

        {/* Top Floating Crescent & Star Emblem */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 drop-shadow-md"
        >
          <IslamicStarCrescent size={88} color="#E5C158" secondaryColor="#C5A059" />
        </motion.div>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h2 className="font-heading text-5xl md:text-6xl text-[#FAF6EE] tracking-wide drop-shadow-md">
            {weddingConfig.groom.nickname}
          </h2>
          <span className="text-2xl md:text-3xl text-[#E5C158] font-serif italic my-1 font-light">
            wa
          </span>
          <h2 className="font-heading text-5xl md:text-6xl text-[#FAF6EE] tracking-wide drop-shadow-md">
            {weddingConfig.bride.nickname}
          </h2>
        </div>
        
        {/* Date line with gold borders */}
        <div className="flex items-center gap-3 text-[#E5C158]/95 tracking-widest text-xs uppercase mb-8">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E5C158]"></span>
          <span className="font-medium tracking-[0.2em]">{weddingConfig.dateStr}</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E5C158]"></span>
        </div>

        {/* Sacred Sunnah Prayer */}
        <p className="text-[11px] tracking-widest uppercase font-serif text-[#C5A059] font-light max-w-[300px] leading-relaxed">
          Barakallahu Laka wa Baraka 'Alaika wa Jama'a Bainakuma fii Khair
        </p>
      </motion.div>
    </section>
  );
};
