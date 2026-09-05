import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <section className="relative py-12 px-5 flex flex-col items-center">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8B1E19] block mb-1">
          TO MUANE &amp; TO BAINE
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
          Kedua Mempelai
        </h2>
        <div className="w-12 h-0.5 bg-[#E5A93C] mx-auto mt-2" />
      </motion.div>

      <div className="flex flex-col gap-8 w-full max-w-sm">
        {/* Groom Card (To Muane) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 border border-[#E5A93C]/40 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Top Toraja Label */}
          <span className="text-[9px] uppercase tracking-widest text-[#8B1E19] font-bold bg-[#8B1E19]/10 px-3 py-0.5 rounded-full mb-3">
            MEMPELAI PRIA • TO MUANE
          </span>

          {/* Groom Photo with Toraja Arch */}
          <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#E5A93C] shadow-md mb-3">
            <img
              src={groom.image}
              alt={groom.fullName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="font-heading text-xl font-bold text-[#8B1E19]">
            {groom.fullName}
          </h3>
          <p className="text-xs text-[#666666] mt-1">
            Putra dari {groom.parents}
          </p>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#8B1E19] font-medium hover:underline bg-[#F7F2EB] px-3 py-1 rounded-full border border-[#E5A93C]/30"
            >
              <Instagram size={13} className="text-[#E5A93C]" />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>

        {/* Center Golden Ampersand */}
        <div className="flex items-center justify-center -my-3 z-10">
          <div className="w-10 h-10 rounded-full bg-[#8B1E19] text-[#E5A93C] border-2 border-[#E5A93C] flex items-center justify-center font-serif text-lg font-bold shadow-md">
            &amp;
          </div>
        </div>

        {/* Bride Card (To Baine) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 border border-[#E5A93C]/40 shadow-sm flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Top Toraja Label */}
          <span className="text-[9px] uppercase tracking-widest text-[#8B1E19] font-bold bg-[#8B1E19]/10 px-3 py-0.5 rounded-full mb-3">
            MEMPELAI WANITA • TO BAINE
          </span>

          {/* Bride Photo with Toraja Arch */}
          <div className="relative w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#E5A93C] shadow-md mb-3">
            <img
              src={bride.image}
              alt={bride.fullName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="font-heading text-xl font-bold text-[#8B1E19]">
            {bride.fullName}
          </h3>
          <p className="text-xs text-[#666666] mt-1">
            Putri dari {bride.parents}
          </p>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#8B1E19] font-medium hover:underline bg-[#F7F2EB] px-3 py-1 rounded-full border border-[#E5A93C]/30"
            >
              <Instagram size={13} className="text-[#E5A93C]" />
              <span>@{bride.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};
