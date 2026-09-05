import React from 'react';
import { motion } from 'motion/react';
import { Users, Instagram, Award } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CastAndCrew: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative px-5 py-12 flex flex-col items-center bg-[#141414] text-white">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1F1F1F] border border-[#2E2E2E] mb-2">
          <Users size={12} className="text-[#E50914]" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#E50914] uppercase">
            CAST &amp; CREW
          </span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Bintang Utama &amp; Produser
        </h2>
        <p className="text-xs text-[#888888] max-w-xs mt-1">
          Sosok-sosok terpenting di balik layar kebahagiaan kami
        </p>
      </div>

      {/* Main Cast: Strictly Vertical Stack (flex-col) for 430px Mobile Container */}
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Lead Actor: Groom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-2xl bg-[#181818] border border-[#282828] p-5 shadow-xl flex flex-col items-center text-center group hover:border-[#E50914]/50 transition-colors"
        >
          {/* Portrait Photo */}
          <div className="relative w-36 h-48 rounded-xl overflow-hidden border border-[#333333] group-hover:border-[#E50914] transition-colors shadow-lg mb-4">
            <img
              src={weddingConfig.groom.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={weddingConfig.groom.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-[#E50914] uppercase tracking-wider">
              LEAD ACTOR
            </div>
          </div>

          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#E50914] mb-1">
            MEMPELAI PRIA
          </span>
          <h3 className="font-heading text-xl font-bold text-white mb-1.5">
            {weddingConfig.groom.fullName}
          </h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4">
            {weddingConfig.groom.parents}
          </p>

          {weddingConfig.groom.instagram && (
            <a
              href={`https://instagram.com/${weddingConfig.groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#242424] hover:bg-[#E50914] text-[#CCCCCC] hover:text-white transition-all text-xs font-semibold"
            >
              <Instagram size={13} />
              <span>{weddingConfig.groom.instagram}</span>
            </a>
          )}
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs justify-center text-[#555555]">
          <div className="h-[1px] flex-1 bg-[#282828]" />
          <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center font-heading text-sm text-[#E50914] font-bold">
            &amp;
          </div>
          <div className="h-[1px] flex-1 bg-[#282828]" />
        </div>

        {/* Lead Actress: Bride */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full rounded-2xl bg-[#181818] border border-[#282828] p-5 shadow-xl flex flex-col items-center text-center group hover:border-[#E50914]/50 transition-colors"
        >
          {/* Portrait Photo */}
          <div className="relative w-36 h-48 rounded-xl overflow-hidden border border-[#333333] group-hover:border-[#E50914] transition-colors shadow-lg mb-4">
            <img
              src={weddingConfig.bride.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={weddingConfig.bride.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[9px] font-bold text-[#E50914] uppercase tracking-wider">
              LEAD ACTRESS
            </div>
          </div>

          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#E50914] mb-1">
            MEMPELAI WANITA
          </span>
          <h3 className="font-heading text-xl font-bold text-white mb-1.5">
            {weddingConfig.bride.fullName}
          </h3>
          <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4">
            {weddingConfig.bride.parents}
          </p>

          {weddingConfig.bride.instagram && (
            <a
              href={`https://instagram.com/${weddingConfig.bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#242424] hover:bg-[#E50914] text-[#CCCCCC] hover:text-white transition-all text-xs font-semibold"
            >
              <Instagram size={13} />
              <span>{weddingConfig.bride.instagram}</span>
            </a>
          )}
        </motion.div>

        {/* Executive Producers Card (Keluarga Besar) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="w-full rounded-xl bg-[#121212] border border-[#242424] p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#1F1F1F] text-[#E5C158] flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#E50914]">
              EXECUTIVE PRODUCERS
            </span>
            <p className="text-xs text-[#CCCCCC] mt-0.5">
              Kedua Keluarga Besar Mempelai Pria &amp; Wanita
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
