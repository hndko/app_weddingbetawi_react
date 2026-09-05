import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { PersonInfo } from '../../../../../types';
import { FloatingVintageEphemera } from '../decorations/FloatingVintageEphemera';

function ProfileCard({ data, delay, role }: { data: PersonInfo; delay: number; role: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center text-center relative z-10 w-full max-w-[300px] bg-[#FAF5EE] p-4 border-2 border-[#1E1E1E] shadow-sm"
    >
      {/* Newspaper Cutout Photo */}
      <div className="relative w-48 h-60 mb-4 p-1.5 bg-[#FFFFFF] border border-[#1E1E1E] shadow-xs">
        <div className="w-full h-full overflow-hidden bg-[#E2D6C0] relative">
          <img
            src={data.image}
            alt={data.fullName}
            className="w-full h-full object-cover grayscale contrast-120 sepia-[0.3]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[#8B3A2B]/10 mix-blend-multiply pointer-events-none" />
        </div>
      </div>

      <span className="text-[9.5px] font-mono font-bold tracking-widest uppercase text-[#8B3A2B] mb-1">
        • {role} •
      </span>
      <h3 className="font-heading text-2xl font-bold text-[#141414] mb-2">{data.fullName}</h3>
      <p className="text-[11px] font-serif text-[#444444] leading-relaxed mb-4 px-2 max-w-[260px]">
        {data.parents}
      </p>

      {data.instagram && (
        <a
          href={`https://instagram.com/${data.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#1E1E1E] bg-[#F4EBD9] text-[10.5px] font-mono text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-[#FAF5EE] transition-colors"
        >
          <Instagram size={11} className="text-[#8B3A2B]" />
          <span>{data.instagram}</span>
        </a>
      )}
    </motion.div>
  );
}

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-16 px-6 bg-[#F2E8D5] text-[#1E1E1E] overflow-hidden border-t-2 border-[#1E1E1E]">
      <FloatingVintageEphemera className="opacity-35" />

      <div className="max-w-md mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 w-full border-b border-[#1E1E1E]/40 pb-3"
        >
          <span className="text-[9.5px] tracking-[0.25em] font-mono font-bold uppercase text-[#8B3A2B] block mb-1">
            FEATURED INTERVIEW • BIOGRAPHY
          </span>
          <h2 className="font-heading text-3xl font-black uppercase text-[#141414]">THE BRIDE &amp; GROOM</h2>
          <p className="text-[11px] font-serif italic text-[#555555] mt-1">
            "An intimate introduction to the leading figures of today's celebrated chronicle."
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-10 w-full">
          <ProfileCard data={weddingConfig.groom} delay={0.1} role="THE GROOM • MEMPELAI PRIA" />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="w-10 h-10 rounded-full bg-[#1E1E1E] text-[#FAF5EE] border-2 border-[#8B3A2B] flex items-center justify-center font-serif italic text-lg shadow-sm"
          >
            &amp;
          </motion.div>

          <ProfileCard data={weddingConfig.bride} delay={0.2} role="THE BRIDE • MEMPELAI WANITA" />
        </div>
      </div>
    </section>
  );
};
