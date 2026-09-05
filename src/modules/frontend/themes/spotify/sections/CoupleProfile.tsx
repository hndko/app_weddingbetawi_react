import React from 'react';
import { motion } from 'motion/react';
import { Instagram, CheckCircle2, Music2 } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative px-5 py-12 flex flex-col items-center bg-[#121212] text-white">
      {/* Section Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#282828] mb-2">
          <Music2 size={12} className="text-[#1DB954]" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#1DB954] uppercase">
            FEATURED ARTISTS
          </span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Dua Hati, Satu Melodi
        </h2>
        <p className="text-xs text-[#B3B3B3] max-w-xs mt-1.5">
          Kedua mempelai yang dipersatukan dalam ikatan suci pernikahan
        </p>
      </div>

      {/* Couple Profiles: Strictly Vertical Stack (flex-col) for 430px Mobile Container */}
      <div className="flex flex-col items-center gap-8 w-full max-w-sm">
        {/* Groom Card (Mempelai Pria) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="w-full rounded-2xl bg-[#181818] border border-[#282828] p-5 shadow-xl flex flex-col items-center text-center group hover:border-[#1DB954]/50 transition-colors"
        >
          {/* Circular Artist Photo */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-[#282828] group-hover:border-[#1DB954] transition-colors shadow-lg mb-4">
            <img
              src={weddingConfig.groom.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={weddingConfig.groom.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#1DB954]" />
            </div>
          </div>

          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#1DB954] mb-1">
            LEAD VOCAL / MEMPELAI PRIA
          </span>
          <h3 className="font-heading text-xl font-bold text-white mb-1.5">
            {weddingConfig.groom.fullName}
          </h3>
          <p className="text-xs text-[#B3B3B3] leading-relaxed mb-4">
            {weddingConfig.groom.parents}
          </p>

          {weddingConfig.groom.instagram && (
            <a
              href={`https://instagram.com/${weddingConfig.groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#242424] hover:bg-[#1DB954] text-[#B3B3B3] hover:text-black transition-all text-xs font-semibold"
            >
              <Instagram size={13} />
              <span>{weddingConfig.groom.instagram}</span>
            </a>
          )}
        </motion.div>

        {/* Centered Harmony Divider */}
        <div className="flex items-center gap-3 w-full max-w-xs justify-center text-[#B3B3B3]">
          <div className="h-[1px] flex-1 bg-[#282828]" />
          <div className="w-8 h-8 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center font-heading text-sm text-[#1DB954] font-bold">
            &amp;
          </div>
          <div className="h-[1px] flex-1 bg-[#282828]" />
        </div>

        {/* Bride Card (Mempelai Wanita) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="w-full rounded-2xl bg-[#181818] border border-[#282828] p-5 shadow-xl flex flex-col items-center text-center group hover:border-[#1DB954]/50 transition-colors"
        >
          {/* Circular Artist Photo */}
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-2 border-[#282828] group-hover:border-[#1DB954] transition-colors shadow-lg mb-4">
            <img
              src={weddingConfig.bride.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
              alt={weddingConfig.bride.fullName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#181818] border border-[#282828] flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#1DB954]" />
            </div>
          </div>

          <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#1DB954] mb-1">
            SWEET HARMONY / MEMPELAI WANITA
          </span>
          <h3 className="font-heading text-xl font-bold text-white mb-1.5">
            {weddingConfig.bride.fullName}
          </h3>
          <p className="text-xs text-[#B3B3B3] leading-relaxed mb-4">
            {weddingConfig.bride.parents}
          </p>

          {weddingConfig.bride.instagram && (
            <a
              href={`https://instagram.com/${weddingConfig.bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#242424] hover:bg-[#1DB954] text-[#B3B3B3] hover:text-black transition-all text-xs font-semibold"
            >
              <Instagram size={13} />
              <span>{weddingConfig.bride.instagram}</span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};
