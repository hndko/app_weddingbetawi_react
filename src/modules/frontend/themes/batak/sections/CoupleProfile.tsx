import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { Instagram } from 'lucide-react';
import { GorgaOrnament } from '../decorations/GorgaOrnament';
import { FloatingGorgaPetals } from '../decorations/FloatingGorgaPetals';
import { PersonInfo } from '../../../../../types';

function ProfileCard({ data, delay, index }: { data: PersonInfo; delay: number; index: number }) {
  const isGroom = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center text-center relative z-10 w-full max-w-[300px]"
    >
      {/* Arch Photo Container with Batak Ulos & Gold Gorga Border */}
      <div className="relative w-48 h-64 sm:w-52 sm:h-72 mb-5 p-[3px] rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-[#D4AF37] via-[#7A1B1E] to-[#1C1917] shadow-xl">
        {/* Corner Ulos Diamond Markers */}
        <div className="absolute -top-1.5 -left-1.5 z-30 pointer-events-none w-5 h-5 rounded-full bg-[#7A1B1E] border border-[#D4AF37] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF3C4]" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 z-30 pointer-events-none w-5 h-5 rounded-full bg-[#7A1B1E] border border-[#D4AF37] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FFF3C4]" />
        </div>

        <div className="w-full h-full rounded-t-full rounded-b-[1.85rem] overflow-hidden bg-[#1C1917]/10 relative">
          <img
            src={data.image}
            alt={data.fullName}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[#7A1B1E]/10 mix-blend-overlay" />
        </div>
      </div>

      <span className="text-[11px] tracking-widest uppercase font-serif text-[#7A1B1E] font-bold mb-1">
        {isGroom ? 'Pangoli (Mempelai Pria)' : 'Oroan (Mempelai Wanita)'}
      </span>
      <h3 className="font-heading text-2xl sm:text-3xl text-[#1C1917] mb-2 font-bold">{data.fullName}</h3>
      <p className="text-[11px] text-[#2D2A26]/85 leading-relaxed mb-4 px-4 max-w-[280px]">
        {data.parents}
      </p>

      {data.instagram && (
        <a
          href={`https://instagram.com/${data.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#D4AF37]/60 text-xs text-[#7A1B1E] hover:bg-[#7A1B1E] hover:text-[#FAF6F0] transition-colors duration-300 shadow-xs"
        >
          <Instagram size={13} className="text-[#D4AF37]" />
          <span className="font-medium">@{data.instagram.replace('@', '')}</span>
        </a>
      )}
    </motion.div>
  );
}

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5ECE0] via-[#FAF6F0] to-[#FAF6F0] text-[#1C1917] overflow-hidden flex flex-col items-center">
      {/* Floating Gold & Sirih Petals */}
      <FloatingGorgaPetals count={6} className="opacity-45" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="flex justify-center mb-2">
          <GorgaOrnament variant="medallion" width={48} />
        </div>
        <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-[#7A1B1E] font-bold block mb-1">
          SANG MEMPELAI
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl text-[#7A1B1E] font-bold">
          Rongkap Ni Tondi
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3" />
      </motion.div>

      {/* Couple Profiles Grid */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 w-full max-w-2xl relative z-10">
        <ProfileCard data={weddingConfig.groom} delay={0.2} index={0} />

        <div className="text-2xl sm:text-3xl font-serif italic text-[#D4AF37] -my-4 md:my-0 flex items-center justify-center">
          <span className="w-8 h-[1px] bg-[#D4AF37]/50 md:hidden mr-2" />
          &amp;
          <span className="w-8 h-[1px] bg-[#D4AF37]/50 md:hidden ml-2" />
        </div>

        <ProfileCard data={weddingConfig.bride} delay={0.4} index={1} />
      </div>
    </section>
  );
};
