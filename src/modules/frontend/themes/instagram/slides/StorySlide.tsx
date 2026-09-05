import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, BookOpen } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const StorySlide: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const stories = weddingConfig.loveStory || [];

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none bg-gradient-to-b from-[#1C0A15] via-[#121212] to-[#0A0A0A] overflow-y-auto no-scrollbar">
      {/* Top Header Tag */}
      <div className="relative z-10 pt-10 text-center">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#FFD600] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          HIGHLIGHTS • KISAH KAMI
        </span>
      </div>

      {/* Story Timeline Cards */}
      <div className="relative z-10 my-auto flex flex-col gap-3 max-w-[320px] mx-auto w-full py-3">
        {stories.slice(0, 3).map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-3.5 shadow-xl relative"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF0069] text-white">
                {item.year}
              </span>
              <Heart size={12} className="text-[#FF0069] fill-[#FF0069]" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
            <p className="text-[11px] text-white/80 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <span className="text-[10px] text-white/60">
          Ketuk kanan untuk melihat jadwal acara
        </span>
      </div>
    </div>
  );
};
