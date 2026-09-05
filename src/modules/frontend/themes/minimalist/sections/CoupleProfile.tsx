import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { Instagram } from 'lucide-react';
import { MinimalistCornerAccent } from '../decorations/MinimalistCornerAccent';
import { FloatingBotanicalLeaves } from '../decorations/FloatingBotanicalLeaves';
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
      <div className="relative w-48 h-64 sm:w-52 sm:h-72 mb-5 p-[2px] rounded-t-[3.5rem] rounded-b-2xl bg-gradient-to-b from-[#2D3748]/40 via-[#9AA79C]/30 to-transparent shadow-xs">
        {/* Modern Minimalist Corner Accents */}
        <div className="absolute z-30 pointer-events-none inset-0">
          <MinimalistCornerAccent 
            position={isEven ? "top-left" : "top-right"} 
            size={32}
            primaryColor="#2D3748"
            secondaryColor="#9AA79C"
            className={`absolute ${isEven ? '-top-2.5 -left-2.5' : '-top-2.5 -right-2.5'}`}
          />
          <MinimalistCornerAccent 
            position={isEven ? "bottom-right" : "bottom-left"} 
            size={32}
            primaryColor="#2D3748"
            secondaryColor="#9AA79C"
            className={`absolute ${isEven ? '-bottom-2.5 -right-2.5' : '-bottom-2.5 -left-2.5'}`}
          />
        </div>

        <div className="w-full h-full rounded-t-[3.4rem] rounded-b-[0.9rem] overflow-hidden bg-[#EDF2F7] relative">
          <img 
            src={data.image} 
            alt={data.fullName} 
            className="w-full h-full object-cover object-center" 
            loading="lazy" 
            decoding="async" 
          />
        </div>
      </div>
      
      <span className="text-[10px] tracking-[0.25em] uppercase font-sans text-[#718096] font-medium mb-1">
        {isEven ? 'The Groom' : 'The Bride'}
      </span>
      <h3 className="font-heading text-2xl sm:text-3xl text-[#1A202C] mb-2 font-normal">{data.fullName}</h3>
      <p className="text-[11px] text-[#4A5568] leading-relaxed mb-4 px-4 max-w-[280px] font-light">
        {data.parents}
      </p>
      
      {data.instagram && (
        <a 
          href={`https://instagram.com/${data.instagram.replace('@', '')}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1.5 text-[10px] tracking-wide text-[#2D3748] hover:text-[#9AA79C] transition-colors bg-white py-1.5 px-4 rounded-full border border-[#E2E8F0] shadow-2xs"
        >
          <Instagram size={12} className="text-[#718096]" />
          <span>{data.instagram}</span>
        </a>
      )}
    </motion.div>
  );
}

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  
  return (
    <section className="py-20 px-6 bg-[#F7FAFC] relative overflow-hidden flex flex-col items-center">
      {/* Floating Botanical Leaves Animation */}
      <FloatingBotanicalLeaves className="opacity-35" />

      {/* Editorial Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-14"
      >
        <span className="text-[10px] tracking-[0.25em] text-[#718096] uppercase font-sans font-medium">
          The Happy Couple
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#1A202C] mt-1 font-normal">
          Bride &amp; Groom
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#9AA79C] to-transparent mx-auto mt-3" />
      </motion.div>

      {/* Cards Container */}
      <div className="flex flex-col items-center gap-16 w-full max-w-sm">
        <ProfileCard data={weddingConfig.groom} delay={0.2} index={0} />
        
        <div className="flex items-center justify-center -my-6 z-20">
          <div className="w-10 h-10 rounded-full bg-white text-[#2D3748] flex items-center justify-center font-serif text-lg italic shadow-xs border border-[#E2E8F0]">
            &amp;
          </div>
        </div>

        <ProfileCard data={weddingConfig.bride} delay={0.4} index={1} />
      </div>
    </section>
  );
};
