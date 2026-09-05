import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Crown } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <section className="relative py-12 px-5 flex flex-col items-center font-serif">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#854D0E] block mb-1">
          MEMPELAI KERAJAAN
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2C1810]">
          Sang Pangeran &amp; Sang Putri
        </h2>
        <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2" />
      </motion.div>

      <div className="flex flex-col gap-8 w-full max-w-sm">
        {/* Groom Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xs rounded-3xl p-5 border-2 border-[#D4AF37]/60 shadow-md flex flex-col items-center text-center relative overflow-hidden"
        >
          <span className="text-[9px] uppercase tracking-widest text-[#854D0E] font-bold bg-[#D4AF37]/20 px-3 py-0.5 rounded-full mb-3 flex items-center gap-1">
            <Crown size={11} className="text-[#D4AF37]" />
            SANG PANGERAN • MEMPELAI PRIA
          </span>

          {/* Oval Arch Photo */}
          <div className="relative w-32 h-44 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#D4AF37] shadow-md mb-3">
            <img
              src={groom.image}
              alt={groom.fullName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="text-xl font-bold text-[#2C1810]">
            {groom.fullName}
          </h3>
          <p className="text-xs text-[#666666] mt-1 italic">
            Putra dari {groom.parents}
          </p>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#854D0E] font-medium hover:underline bg-[#F5E6CA] px-3.5 py-1 rounded-full border border-[#D4AF37]/40 not-italic"
            >
              <Instagram size={13} className="text-[#D4AF37]" />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>

        {/* Center Golden Crown Ampersand */}
        <div className="flex items-center justify-center -my-3 z-10">
          <div className="w-10 h-10 rounded-full bg-[#2C1810] text-[#D4AF37] border-2 border-[#D4AF37] flex items-center justify-center text-lg font-bold shadow-md">
            &amp;
          </div>
        </div>

        {/* Bride Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-xs rounded-3xl p-5 border-2 border-[#D4AF37]/60 shadow-md flex flex-col items-center text-center relative overflow-hidden"
        >
          <span className="text-[9px] uppercase tracking-widest text-[#854D0E] font-bold bg-[#D4AF37]/20 px-3 py-0.5 rounded-full mb-3 flex items-center gap-1">
            <Crown size={11} className="text-[#D4AF37]" />
            SANG PUTRI • MEMPELAI WANITA
          </span>

          {/* Oval Arch Photo */}
          <div className="relative w-32 h-44 rounded-t-full rounded-b-2xl overflow-hidden border-2 border-[#D4AF37] shadow-md mb-3">
            <img
              src={bride.image}
              alt={bride.fullName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="text-xl font-bold text-[#2C1810]">
            {bride.fullName}
          </h3>
          <p className="text-xs text-[#666666] mt-1 italic">
            Putri dari {bride.parents}
          </p>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#854D0E] font-medium hover:underline bg-[#F5E6CA] px-3.5 py-1 rounded-full border border-[#D4AF37]/40 not-italic"
            >
              <Instagram size={13} className="text-[#D4AF37]" />
              <span>@{bride.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};
