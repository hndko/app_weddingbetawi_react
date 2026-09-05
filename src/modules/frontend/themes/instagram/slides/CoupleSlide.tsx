import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleSlide: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none bg-gradient-to-b from-[#181818] via-[#121212] to-[#0A0A0A] overflow-y-auto no-scrollbar">
      {/* Top Header Tag */}
      <div className="relative z-10 pt-10 text-center">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#FF0069] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          CLOSE FRIENDS • KEDUA MEMPELAI
        </span>
      </div>

      {/* Center Cards: Groom & Bride */}
      <div className="relative z-10 my-auto flex flex-col gap-3 max-w-[320px] mx-auto w-full py-3">
        {/* Groom Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-3.5 flex items-center gap-3.5 shadow-xl"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/30 shrink-0">
            <img
              src={groom.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'}
              alt={groom.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{groom.fullName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            </div>
            <p className="text-[10px] text-[#00E676] font-semibold">@{groom.nickname}</p>
            <p className="text-[10px] text-white/70 line-clamp-2 mt-0.5 leading-snug">
              {groom.parents}
            </p>
          </div>
        </motion.div>

        {/* Bride Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-3.5 flex items-center gap-3.5 shadow-xl"
        >
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/30 shrink-0">
            <img
              src={bride.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'}
              alt={bride.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">{bride.fullName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0069]" />
            </div>
            <p className="text-[10px] text-[#FF0069] font-semibold">@{bride.nickname}</p>
            <p className="text-[10px] text-white/70 line-clamp-2 mt-0.5 leading-snug">
              {bride.parents}
            </p>
          </div>
        </motion.div>

        {/* Romantic Blessing Text Box */}
        <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
          <p className="text-[11px] text-white/90 italic leading-relaxed">
            "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu merasa tenteram."
          </p>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <span className="text-[10px] text-white/60">
          Ketuk kanan untuk melihat cerita cinta
        </span>
      </div>
    </div>
  );
};
