import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Users, Sparkles, Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const BentoCoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <div className="w-full px-4 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#5856D6]/10 flex items-center justify-center text-[#5856D6]">
            <Users size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            PEOPLE &amp; MEMORIES
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#5856D6]">Kedua Mempelai</span>
      </div>

      {/* Bento Grid: Groom & Bride Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Groom Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
        >
          <div>
            {/* Top Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF] bg-[#007AFF]/10 px-2.5 py-0.5 rounded-full">
                MEMPELAI PRIA
              </span>
              <Heart size={14} className="text-[#007AFF]" />
            </div>

            {/* Photo & Identity Row */}
            <div className="flex items-center gap-3.5 mb-3">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-[22px] overflow-hidden border-2 border-white dark:border-neutral-700 shadow-sm shrink-0">
                <img
                  src={groom.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
                  alt={groom.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                  {groom.fullName}
                </h3>
                <p className="text-xs text-[#007AFF] font-medium">
                  @{groom.nickname}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-tight">
                  {groom.parents}
                </p>
              </div>
            </div>
          </div>

          {/* Action Link: Instagram */}
          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2 px-3 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Instagram size={14} className="text-[#E1306C]" />
              <span>{groom.instagram.startsWith('@') ? groom.instagram : `@${groom.instagram}`}</span>
            </a>
          )}
        </motion.div>

        {/* Bride Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
        >
          <div>
            {/* Top Tag */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2D55] bg-[#FF2D55]/10 px-2.5 py-0.5 rounded-full">
                MEMPELAI WANITA
              </span>
              <Heart size={14} className="text-[#FF2D55]" />
            </div>

            {/* Photo & Identity Row */}
            <div className="flex items-center gap-3.5 mb-3">
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-[22px] overflow-hidden border-2 border-white dark:border-neutral-700 shadow-sm shrink-0">
                <img
                  src={bride.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'}
                  alt={bride.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                  {bride.fullName}
                </h3>
                <p className="text-xs text-[#FF2D55] font-medium">
                  @{bride.nickname}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-tight">
                  {bride.parents}
                </p>
              </div>
            </div>
          </div>

          {/* Action Link: Instagram */}
          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2 px-3 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Instagram size={14} className="text-[#E1306C]" />
              <span>{bride.instagram.startsWith('@') ? bride.instagram : `@${bride.instagram}`}</span>
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
};
