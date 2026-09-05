import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Heart, Zap } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { ArcadeMarqueeHeader } from '../decorations/ArcadeMarqueeHeader';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative pt-10 pb-8 px-5 flex flex-col items-center text-center overflow-hidden">
      {/* Top Arcade Marquee */}
      <ArcadeMarqueeHeader className="mb-4" />

      {/* 2-Player Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-sm bg-[#1E293B]/90 border-2 border-[#22D3EE] rounded-2xl p-4 shadow-lg my-2 flex flex-col items-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#F59E0B] font-bold">
          ★ CO-OP MODE INITIALIZED ★
        </span>

        {/* Players Headline */}
        <div className="flex items-center justify-center gap-3 my-2 font-mono font-black text-2xl sm:text-3xl text-[#22D3EE]">
          <span>{weddingConfig.groom.nickname}</span>
          <span className="text-[#F43F5E] text-xl animate-pulse">&amp;</span>
          <span>{weddingConfig.bride.nickname}</span>
        </div>

        {/* HP & LOVE Stats Bars */}
        <div className="w-full flex flex-col gap-2 mt-2 pt-2 border-t border-slate-700 text-left font-mono text-[10px]">
          <div>
            <div className="flex justify-between text-[#F43F5E] mb-0.5">
              <span className="flex items-center gap-1 font-bold">
                <Heart size={10} className="fill-[#F43F5E]" /> HP / LOVE GAUGE
              </span>
              <span>100% / MAX</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-xs overflow-hidden border border-slate-600">
              <div className="h-full bg-gradient-to-r from-[#F43F5E] to-[#FB7185] w-full" />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#22D3EE] mb-0.5">
              <span className="flex items-center gap-1 font-bold">
                <Zap size={10} className="fill-[#22D3EE]" /> MP / COMMITMENT
              </span>
              <span>999 / 999</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-xs overflow-hidden border border-slate-600">
              <div className="h-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] w-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quest Date & Venue coordinates */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 w-full max-w-xs bg-[#0F172A] border border-[#F59E0B]/50 rounded-xl p-3 shadow-md font-mono text-xs text-slate-300 flex flex-col gap-2"
      >
        <div className="flex items-center justify-center gap-2 text-[#FDE68A] font-bold">
          <Calendar size={13} className="text-[#F59E0B]" />
          <span>QUEST DATE: {weddingConfig.dateStr}</span>
        </div>
        <div className="h-px bg-slate-800 w-full" />
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <MapPin size={12} className="text-[#F43F5E] shrink-0" />
          <span className="line-clamp-1">{weddingConfig.events.resepsi.venue}</span>
        </div>
      </motion.div>
    </section>
  );
};
