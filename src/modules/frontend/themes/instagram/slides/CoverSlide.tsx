import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { CountdownSticker, MusicSticker } from '../components/InteractiveStickers';

export const CoverSlide: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride, dateStr, dateISO } = weddingConfig;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none">
      {/* Background Full-Bleed Image with Instagram Story Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={
            groom.image ||
            'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
          }
          alt="Wedding Story Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
      </div>

      {/* Top Floating Music Sticker */}
      <div className="relative z-10 pt-10 flex justify-center">
        <MusicSticker title={`${groom.nickname} & ${bride.nickname}`} artist="Wedding Celebration" />
      </div>

      {/* Center Big Couple Title & Date */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center my-auto flex flex-col items-center"
      >
        <span className="text-[10px] tracking-[0.3em] font-extrabold uppercase text-[#FFD600] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md mb-2 border border-white/10">
          THE WEDDING OF
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-lg font-sans">
          {groom.nickname} <span className="text-[#FF0069]">&amp;</span> {bride.nickname}
        </h1>
        <p className="text-xs font-semibold text-white/90 mt-1 tracking-wider">
          {dateStr || '20 September 2026'}
        </p>
      </motion.div>

      {/* Bottom Live Countdown Sticker */}
      <div className="relative z-10 pb-8 flex flex-col items-center gap-3">
        <CountdownSticker targetDateISO={dateISO} />
        <span className="text-[10px] text-white/70 italic">
          Ketuk kanan untuk lanjut • Tahan untuk jeda
        </span>
      </div>
    </div>
  );
};
