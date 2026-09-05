import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { WayangGunungan } from '../decorations/WayangGunungan';
import { JavaneseFiligree } from '../decorations/JavaneseFiligree';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-24 px-6 text-center bg-gradient-to-b from-[#FAF8F2] via-[#FAF6EC] to-[#F3EEDC] overflow-hidden">
      {/* Subtle Gold Corner Frames */}
      <JavaneseFiligree position="top-left" className="absolute top-3 left-3 opacity-60" size={40} color="#C5A059" />
      <JavaneseFiligree position="top-right" className="absolute top-3 right-3 opacity-60" size={40} color="#C5A059" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-sm mx-auto"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-serif text-[#C5A059] font-semibold block mb-3">
          Sembah Nuwun
        </span>

        <p className="text-xs sm:text-[13px] text-[#2C3E35]/80 leading-relaxed mb-6 font-light">
          Matur nuwun sanget awit saking sih kawigatosan, karawuhan, saha berkah pangestu panjenengan sedaya. Mugi Gusti Ingkang Maha Agung tansah paring berkah, karaharjan, saha katentreman kagem kita sedaya.
        </p>
        
        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mb-6" />

        <h3 className="font-heading text-lg sm:text-xl text-[#1B3B2B] mb-8 font-bold leading-relaxed">
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>
        
        {/* Couple Names */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="font-heading text-3xl sm:text-4xl text-[#1B3B2B] font-bold">{weddingConfig.groom.nickname}</h2>
          <span className="text-xl text-[#C5A059] font-serif italic my-0.5">&</span>
          <h2 className="font-heading text-3xl sm:text-4xl text-[#1B3B2B] font-bold">{weddingConfig.bride.nickname}</h2>
        </div>
        
        {/* Central Sacred Wayang Gunungan Mas at Bottom (Zero Ondel-ondel) */}
        <div className="flex justify-center mt-2">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <WayangGunungan size={72} color="#C5A059" accentColor="#132A1C" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
