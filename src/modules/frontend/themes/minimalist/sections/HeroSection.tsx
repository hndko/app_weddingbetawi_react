import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { BotanicalEucalyptus } from '../decorations/BotanicalEucalyptus';
import { FloatingBotanicalLeaves } from '../decorations/FloatingBotanicalLeaves';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden bg-gradient-to-b from-[#EDF2F7] via-[#F7FAFC] to-[#FFFFFF] text-[#2D3748]">
      {/* Floating Botanical Leaves Animation */}
      <FloatingBotanicalLeaves className="opacity-50" />

      {/* Subtle Fine Grid Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2D3748 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Atmospheric Soft Light Glows */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#9AA79C]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Central Watermark Botanical Sprig */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="opacity-[0.05] scale-150 translate-y-6">
          <BotanicalEucalyptus size={340} primaryColor="#2D3748" secondaryColor="#9AA79C" accentColor="#D4AF37" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="z-10 w-full flex flex-col items-center"
      >
        {/* Editorial Subtitle */}
        <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#718096] uppercase mb-4 font-medium">
          <Sparkles size={11} className="text-[#9AA79C]" />
          <span>THE WEDDING CELEBRATION OF</span>
          <Sparkles size={11} className="text-[#9AA79C]" />
        </div>

        {/* Top Floating Botanical Eucalyptus Sprig */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 drop-shadow-xs"
        >
          <BotanicalEucalyptus size={86} primaryColor="#2D3748" secondaryColor="#9AA79C" accentColor="#D4AF37" />
        </motion.div>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-1.5 mb-8">
          <h2 className="font-heading text-5xl md:text-6xl text-[#1A202C] tracking-tight font-normal">
            {weddingConfig.groom.nickname}
          </h2>
          <span className="text-2xl md:text-3xl text-[#9AA79C] font-serif italic my-1 font-light">
            &
          </span>
          <h2 className="font-heading text-5xl md:text-6xl text-[#1A202C] tracking-tight font-normal">
            {weddingConfig.bride.nickname}
          </h2>
        </div>
        
        {/* Date line with clean fine borders */}
        <div className="flex items-center gap-3 text-[#4A5568] tracking-widest text-xs uppercase mb-8">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#9AA79C]"></span>
          <span className="font-medium tracking-[0.2em]">{weddingConfig.dateStr}</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#9AA79C]"></span>
        </div>

        {/* Elegant Minimalist Tagline */}
        <p className="text-[11px] tracking-[0.2em] uppercase font-sans text-[#718096] font-light max-w-[280px]">
          We joyfully request the honour of your presence
        </p>
      </motion.div>
    </section>
  );
};
