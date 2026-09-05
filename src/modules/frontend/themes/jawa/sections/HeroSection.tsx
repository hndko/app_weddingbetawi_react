import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { WayangGunungan } from '../decorations/WayangGunungan';
import { FloatingMelati } from '../decorations/FloatingMelati';
import { Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden bg-gradient-to-b from-[#183424] via-[#1F412E] to-[#132A1C] text-[#FAF8F2]">
      {/* Floating Sacred Jasmine & Gold Petals */}
      <FloatingMelati className="opacity-50" />

      {/* Subtle Batik Parang Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#E5C158 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Atmospheric Gold Glows */}
      <div className="absolute top-10 left-10 w-28 h-28 bg-[#E5C158]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-36 h-36 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Central Sacred Faint Gunungan Wayang Background (Zero Monas) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="opacity-[0.12] scale-150 translate-y-6">
          <WayangGunungan size={360} color="#E5C158" accentColor="#132A1C" />
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
        <div className="flex items-center gap-2 text-[10.5px] tracking-[0.3em] text-[#E5C158] uppercase mb-6 font-medium">
          <Sparkles size={11} className="text-[#E5C158]" />
          <span>PAWIWAHAN AGENG</span>
          <Sparkles size={11} className="text-[#E5C158]" />
        </div>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h2 className="font-heading text-5xl md:text-6xl text-[#FAF8F2] tracking-wide drop-shadow-md">
            {weddingConfig.groom.nickname}
          </h2>
          <span className="text-2xl md:text-3xl text-[#E5C158] font-serif italic my-1">kaliyan</span>
          <h2 className="font-heading text-5xl md:text-6xl text-[#FAF8F2] tracking-wide drop-shadow-md">
            {weddingConfig.bride.nickname}
          </h2>
        </div>
        
        {/* Date line with gold filigree bars */}
        <div className="flex items-center gap-3 text-[#E5C158]/90 tracking-widest text-xs uppercase mb-12">
          <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#E5C158]"></span>
          <span className="font-medium">{weddingConfig.dateStr}</span>
          <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#E5C158]"></span>
        </div>

        {/* Ceremonial Twin Gunungan Wayang Mas at Bottom (Zero Ondel-Ondel) */}
        <div className="flex items-end justify-center gap-6 sm:gap-10 mt-2">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <WayangGunungan size={80} color="#E5C158" accentColor="#132A1C" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <WayangGunungan size={80} color="#E5C158" accentColor="#132A1C" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
