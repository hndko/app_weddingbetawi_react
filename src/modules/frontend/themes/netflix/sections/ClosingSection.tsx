import React from 'react';
import { motion } from 'motion/react';
import { Film, Clapperboard, Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative px-6 py-14 flex flex-col items-center text-center bg-gradient-to-b from-[#141414] to-[#0A0A0A] text-white overflow-hidden">
      {/* Ambient Red Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#E50914]/10 blur-[60px] pointer-events-none" />

      {/* Clapperboard Icon */}
      <motion.div
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="w-14 h-14 rounded-2xl bg-[#1C1C1C] border border-[#2E2E2E] flex items-center justify-center shadow-xl mb-4"
      >
        <Clapperboard size={26} className="text-[#E50914]" />
      </motion.div>

      <span className="text-[10px] font-bold tracking-[0.25em] text-[#E50914] uppercase mb-2">
        CLOSING CREDITS &amp; SPECIAL THANKS
      </span>

      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
        Terima Kasih Telah Menyaksikan Awal Kisah Kami
      </h2>

      <p className="text-xs sm:text-sm text-[#AAAAAA] leading-relaxed max-w-sm mb-6">
        Kehadiran, doa restu, serta kehangatan hati Anda merupakan bagian tak ternilai dalam naskah terindah kehidupan kami.
        Kiranya kebahagiaan senantiasa menyertai langkah kita bersama.
      </p>

      {/* Production Card */}
      <div className="w-full max-w-xs p-4 rounded-xl bg-[#161616] border border-[#262626] flex flex-col items-center gap-2 mb-6 shadow-md">
        <div className="flex items-center gap-2 text-[#E50914] text-xs font-bold uppercase tracking-widest">
          <Film size={14} />
          <span>DIRECTED WITH LOVE</span>
        </div>
        <span className="font-heading text-lg font-bold text-white">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </span>
        <span className="text-[10px] text-[#777777] uppercase tracking-wider flex items-center gap-1 mt-0.5">
          <span>Starring</span>
          <Heart size={10} className="text-[#E50914]" fill="#E50914" />
          <span>Our Beloved Family &amp; Friends</span>
        </span>
      </div>

      <div className="text-[10px] text-[#444444] tracking-widest uppercase">
        © 2026 A NETFLIX ORIGINAL WEDDING • ALL RIGHTS RESERVED
      </div>
    </section>
  );
};
