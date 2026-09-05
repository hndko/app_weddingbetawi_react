import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Play, Camera, Star } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { playStoryPop, playCameraSnap } from './utils/instagramAudio';
import { FloatingHearts } from './decorations/FloatingHearts';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();
  const { groom, bride, dateStr } = weddingConfig;

  const handleOpen = () => {
    playStoryPop();
    onOpen();
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-between items-center text-white px-5 pt-10 pb-6 select-none bg-gradient-to-b from-[#181818] via-[#0E0E0E] to-[#000000] overflow-hidden"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Floating Instagram Hearts */}
      <FloatingHearts count={6} />

      {/* Top Header Tag */}
      <div className="relative z-10 w-full flex flex-col items-center mt-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-extrabold uppercase tracking-widest text-[#FF0069] shadow-sm">
          <Sparkles size={11} className="text-[#FFD600]" />
          <span>INSTAGRAM WEDDING STORY</span>
        </div>
      </div>

      {/* Center: Story Ring Avatar & Guest Notification */}
      <div className="relative z-10 w-full max-w-[320px] flex flex-col items-center gap-4 my-auto">
        {/* Story Avatar Ring (Gradient Border) */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full p-[4px] bg-gradient-to-tr from-[#FFD600] via-[#FF0069] to-[#7638FA] cursor-pointer shadow-[0_0_30px_rgba(255,0,105,0.4)] flex items-center justify-center group"
        >
          {/* Inner dark gap */}
          <div className="w-full h-full rounded-full p-[3px] bg-[#121212] overflow-hidden">
            <img
              src={
                groom.image ||
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
              }
              alt="Couple Story"
              className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Close Friends / Verified Star Badge */}
          <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#00E676] border-2 border-[#121212] flex items-center justify-center text-black shadow-md">
            <Star size={14} className="fill-black" />
          </div>
        </motion.div>

        {/* Title */}
        <div className="text-center space-y-0.5">
          <h2 className="text-2xl font-bold font-sans tracking-tight">
            {groom.nickname} <span className="text-[#FF0069]">&amp;</span> {bride.nickname}
          </h2>
          <p className="text-xs text-white/70 font-medium">
            {dateStr || '20 September 2026'}
          </p>
        </div>

        {/* Guest Story Notification Card */}
        <div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl p-3.5 border border-white/15 shadow-lg text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E676]">
              CLOSE FRIENDS STORY
            </span>
            <span className="text-[9px] text-white/50 font-medium">Baru Saja</span>
          </div>
          <p className="text-xs font-bold text-white leading-tight">
            Katur Dhumateng: {guestName || 'Tamu Undangan'}
          </p>
          <p className="text-[11px] text-white/70 leading-snug mt-0.5">
            Anda ditambahkan ke Close Friends pernikahan kami. Ketuk di bawah untuk menonton story!
          </p>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="relative z-10 w-full max-w-[320px]">
        <motion.button
          onClick={handleOpen}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#FF7A00] via-[#FF0069] to-[#D300C5] text-white font-bold text-sm shadow-[0_8px_25px_rgba(255,0,105,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Play size={16} className="fill-white" />
          <span>Tonton Story Undangan</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
