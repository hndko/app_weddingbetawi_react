import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { Instagram } from 'lucide-react';
import { AnimatedMinangFiligree } from '../decorations/AnimatedMinangFiligree';
import { FloatingSongketPetals } from '../decorations/FloatingSongketPetals';
import { MahkotaSuntiang } from '../decorations/MahkotaSuntiang';
import { PersonInfo } from '../../../../../types';

function ProfileCard({ data, delay, index }: { data: PersonInfo; delay: number; index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center text-center relative z-10 w-full max-w-[300px]"
    >
      <div className="relative w-48 h-64 sm:w-52 sm:h-72 mb-5 p-[3px] rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-[#D4AF37] via-[#7B1122]/60 to-transparent shadow-md">
        {/* Minang Filigree Corner Accents */}
        <div className="absolute z-30 pointer-events-none inset-0">
          <AnimatedMinangFiligree 
            position={isEven ? "top-left" : "top-right"} 
            size={34}
            color="#D4AF37"
            className={`absolute ${isEven ? '-top-3 -left-3' : '-top-3 -right-3'}`}
          />
          <AnimatedMinangFiligree 
            position={isEven ? "bottom-right" : "bottom-left"} 
            size={34}
            color="#7B1122"
            className={`absolute ${isEven ? '-bottom-3 -right-3' : '-bottom-3 -left-3'}`}
          />
        </div>

        <div className="w-full h-full rounded-t-full rounded-b-[1.85rem] overflow-hidden bg-[#7B1122]/10 relative">
          <img 
            src={data.image} 
            alt={data.fullName} 
            className="w-full h-full object-cover object-center" 
            loading="lazy" 
            decoding="async" 
          />
          <div className="absolute inset-0 bg-[#7B1122]/10 mix-blend-overlay"></div>
        </div>
      </div>
      
      <span className="text-[11px] tracking-widest uppercase font-serif text-[#D4AF37] font-semibold mb-1">
        {isEven ? 'Mempelai Pria (Marapulai)' : 'Mempelai Wanita (Anak Daro)'}
      </span>
      <h3 className="font-heading text-2xl sm:text-3xl text-[#2D030A] mb-2 font-bold">{data.fullName}</h3>
      <p className="text-[11px] text-[#4A0713]/80 leading-relaxed mb-4 px-4 max-w-[280px]">
        {data.parents}
      </p>
      
      {data.instagram && (
        <a 
          href={`https://instagram.com/${data.instagram.replace('@', '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 text-[10px] tracking-wide text-[#2D030A] hover:text-[#7B1122] transition-colors bg-[#FAF5F0] py-1.5 px-4 rounded-full border border-[#D4AF37]/50 shadow-xs"
        >
          <Instagram size={12} className="text-[#D4AF37]" />
          <span>{data.instagram}</span>
        </a>
      )}
    </motion.div>
  );
}

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  
  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-[#F7EFE6] via-[#FAF5F0] to-[#FDFBF7] text-[#2D030A] overflow-hidden">
      {/* Floating Petals */}
      <FloatingSongketPetals className="opacity-50" />

      {/* Decorative Corner Filigree on Section */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/40 pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10"
      >
        <span className="text-[10px] sm:text-[11px] tracking-[0.3em] uppercase font-serif text-[#D4AF37] font-bold block mb-2">
          MARAPULAI &amp; ANAK DARO
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#7B1122] font-bold">Mempelai Pengantin</h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
      </motion.div>

      {/* Cards Container */}
      <div className="flex flex-col items-center gap-14 w-full max-w-sm mx-auto">
        <ProfileCard data={weddingConfig.groom} delay={0.2} index={0} />
        
        {/* Central 'jo' Divider Ornament */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center -my-6 z-20"
        >
          <div className="w-11 h-11 rounded-full bg-[#7B1122] text-[#D4AF37] flex items-center justify-center font-serif text-lg italic shadow-md border border-[#D4AF37]/60">
            jo
          </div>
        </motion.div>

        <ProfileCard data={weddingConfig.bride} delay={0.4} index={1} />
      </div>

      {/* Subtle Suntiang Watermark at Bottom */}
      <div className="flex justify-center mt-12 opacity-30 pointer-events-none">
        <MahkotaSuntiang size={50} primaryColor="#D4AF37" secondaryColor="#7B1122" />
      </div>
    </section>
  );
};
