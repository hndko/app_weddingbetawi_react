import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { MahkotaSiger } from '../decorations/MahkotaSiger';
import { FloatingJasmineRonce } from '../decorations/FloatingJasmineRonce';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden bg-gradient-to-b from-[#1C3127] via-[#2A4B3C] to-[#192E24] text-[#FAF9F5]">
      {/* Floating Sacred Jasmine & Gold Petals */}
      <FloatingJasmineRonce className="opacity-50" />

      {/* Subtle Priangan Wave Background Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#D4AF37 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Atmospheric Soft Light Glows */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-[#4A6B5D]/25 rounded-full blur-3xl pointer-events-none" />
      
      {/* Central Faint Watermark Mahkota Siger */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="opacity-[0.08] scale-150 translate-y-6">
          <MahkotaSiger size={320} color="#D4AF37" accentColor="#4A6B5D" />
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
        <div className="flex items-center gap-2 text-[10.5px] tracking-[0.3em] text-[#E6D5B8] uppercase mb-4 font-medium">
          <Sparkles size={11} className="text-[#D4AF37]" />
          <span>PAWIWAHAN SUNDA PARAHYANGAN</span>
          <Sparkles size={11} className="text-[#D4AF37]" />
        </div>

        {/* Top Floating Mahkota Siger */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 drop-shadow-md"
        >
          <MahkotaSiger size={90} color="#D4AF37" accentColor="#4A6B5D" />
        </motion.div>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h2 className="font-heading text-5xl md:text-6xl text-[#FAF9F5] tracking-wide drop-shadow-md">
            {weddingConfig.groom.nickname}
          </h2>
          <span className="text-2xl md:text-3xl text-[#E6D5B8] font-serif italic my-1">
            sareng
          </span>
          <h2 className="font-heading text-5xl md:text-6xl text-[#FAF9F5] tracking-wide drop-shadow-md">
            {weddingConfig.bride.nickname}
          </h2>
        </div>
        
        {/* Date line with gold filigree bars */}
        <div className="flex items-center gap-3 text-[#E6D5B8]/95 tracking-widest text-xs uppercase mb-8">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
          <span className="font-medium">{weddingConfig.dateStr}</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
        </div>

        {/* Traditional Blessing Tagline */}
        <p className="text-[11px] tracking-widest uppercase font-serif text-[#D4AF37]/90 font-light max-w-[280px]">
          Mugia Ginulur Rahayu Bagja Waluya
        </p>
      </motion.div>
    </section>
  );
};
