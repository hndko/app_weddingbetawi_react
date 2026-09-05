import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { PersonInfo } from '../../../../../types';
import { BosaraOrnament } from '../decorations/BosaraOrnament';
import { FloatingBentePandan } from '../decorations/FloatingBentePandan';

function ProfileCard({ data, delay, index }: { data: PersonInfo; delay: number; index: number }) {
  const isGroom = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center text-center relative z-10 w-full max-w-[300px]"
    >
      <div className="relative w-48 h-64 sm:w-52 sm:h-72 mb-5 p-[3px] rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-[#D4AF37] via-[#8B1E1E]/60 to-transparent shadow-md">
        {/* Outer Gold Accent Ring */}
        <div className="absolute inset-1 rounded-t-full rounded-b-[1.75rem] border border-[#FFE082]/40 pointer-events-none" />

        <div className="w-full h-full rounded-t-full rounded-b-[1.85rem] overflow-hidden bg-[#8B1E1E]/10 relative">
          <img
            src={data.image}
            alt={data.fullName}
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[#8B1E1E]/10 mix-blend-overlay"></div>
        </div>
      </div>

      <span className="text-[11px] tracking-widest uppercase font-serif text-[#D4AF37] font-semibold mb-1">
        {isGroom ? "Ana' Burane (Mempelai Pria)" : "Ana' Makkunrai (Mempelai Wanita)"}
      </span>
      <h3 className="font-heading text-2xl sm:text-3xl text-[#28050B] mb-2 font-bold">{data.fullName}</h3>
      <p className="text-[11px] text-[#3A0810]/80 leading-relaxed mb-4 px-4 max-w-[280px]">
        {data.parents}
      </p>

      {data.instagram && (
        <a
          href={`https://instagram.com/${data.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4AF37]/50 bg-[#FAF6F0] text-[11px] text-[#8B1E1E] font-medium hover:bg-[#8B1E1E] hover:text-[#FAF6F0] transition-colors"
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
    <section className="relative py-20 px-6 bg-gradient-to-b from-[#F7EFE6] via-[#FAF6F0] to-[#F7EFE6] text-[#28050B] overflow-hidden">
      <FloatingBentePandan className="opacity-35" />

      <div className="max-w-md mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-2">
            <BosaraOrnament size={56} primaryColor="#D4AF37" secondaryColor="#8B1E1E" accentColor="#FFE082" />
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase font-serif text-[#D4AF37] font-bold block mb-1">
            SITINRO' TEPPU
          </span>
          <h2 className="font-heading text-3xl text-[#8B1E1E] font-bold">Kedua Mempelai</h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
        </motion.div>

        <div className="flex flex-col items-center gap-14 w-full">
          <ProfileCard data={weddingConfig.groom} delay={0.1} index={0} />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-10 h-10 rounded-full bg-[#8B1E1E] text-[#FAF6F0] border-2 border-[#D4AF37] flex items-center justify-center font-serif italic text-lg shadow-sm"
          >
            &amp;
          </motion.div>

          <ProfileCard data={weddingConfig.bride} delay={0.2} index={1} />
        </div>
      </div>
    </section>
  );
};
