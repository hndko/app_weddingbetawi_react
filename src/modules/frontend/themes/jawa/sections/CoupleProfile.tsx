import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { Instagram } from 'lucide-react';
import { JavaneseFiligree } from '../decorations/JavaneseFiligree';
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
      <div className="relative w-48 h-64 sm:w-52 sm:h-72 mb-5 p-[3px] rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-[#C5A059] via-[#E5C158]/50 to-transparent shadow-md">
        {/* Authentic Javanese Filigree Gold Corner Accents (Zero Betawi Floral) */}
        <div className="absolute z-30 pointer-events-none inset-0">
          <JavaneseFiligree 
            position={isEven ? "top-left" : "top-right"} 
            size={34}
            color="#E5C158"
            className={`absolute ${isEven ? '-top-3 -left-3' : '-top-3 -right-3'}`}
          />
          <JavaneseFiligree 
            position={isEven ? "bottom-right" : "bottom-left"} 
            size={34}
            color="#C5A059"
            className={`absolute ${isEven ? '-bottom-3 -right-3' : '-bottom-3 -left-3'}`}
          />
        </div>

        <div className="w-full h-full rounded-t-full rounded-b-[1.85rem] overflow-hidden bg-[#1B3B2B]/10 relative">
          <img 
            src={data.image} 
            alt={data.fullName} 
            className="w-full h-full object-cover object-center" 
            loading="lazy" 
            decoding="async" 
          />
          <div className="absolute inset-0 bg-[#1B3B2B]/10 mix-blend-overlay"></div>
        </div>
      </div>
      
      <span className="text-[11px] tracking-widest uppercase font-serif text-[#C5A059] font-medium mb-1">
        {isEven ? 'Panganten Kakung' : 'Panganten Putri'}
      </span>
      <h3 className="font-heading text-2xl sm:text-3xl text-[#1B3B2B] mb-2 font-bold">{data.fullName}</h3>
      <p className="text-[11px] text-[#2C3E35]/75 leading-relaxed mb-4 px-4 max-w-[280px]">
        {data.parents}
      </p>
      
      {data.instagram && (
        <a 
          href={`https://instagram.com/${data.instagram.replace('@', '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 text-[10px] tracking-wide text-[#1B3B2B] hover:text-[#C5A059] transition-colors bg-[#FAF8F2] py-1.5 px-4 rounded-full border border-[#C5A059]/40 shadow-xs"
        >
          <Instagram size={12} className="text-[#C5A059]" />
          <span>{data.instagram}</span>
        </a>
      )}
    </motion.div>
  );
}

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  
  return (
    <section className="py-20 px-6 bg-[#FAF8F2] relative overflow-hidden flex flex-col items-center">
      {/* Decorative Gold Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <span className="text-[11px] tracking-[0.25em] text-[#C5A059] uppercase font-serif font-semibold">
          Penganten Kekalih
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#1B3B2B] mt-1 font-bold">
          Mempelai Pengantin
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent mx-auto mt-3" />
      </motion.div>

      {/* Cards Container */}
      <div className="flex flex-col items-center gap-16 w-full max-w-sm">
        <ProfileCard data={weddingConfig.groom} delay={0.2} index={0} />
        
        <div className="flex items-center justify-center -my-6 z-20">
          <div className="w-10 h-10 rounded-full bg-[#1B3B2B] text-[#E5C158] flex items-center justify-center font-serif text-lg italic shadow-md border border-[#E5C158]/50">
            &
          </div>
        </div>

        <ProfileCard data={weddingConfig.bride} delay={0.4} index={1} />
      </div>
    </section>
  );
};
