import React from 'react';
import { motion } from 'motion/react';
import { Heart, Disc, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { SoundwaveVisualizer } from '../decorations/SoundwaveVisualizer';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative px-6 py-14 flex flex-col items-center text-center bg-gradient-to-b from-[#121212] to-[#0A0A0A] text-white overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#1DB954]/10 blur-[50px] pointer-events-none" />

      {/* Decorative Rotating Vinyl Mini */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 rounded-full bg-[#181818] border-2 border-[#1DB954] flex items-center justify-center shadow-lg mb-4"
      >
        <Disc size={24} className="text-[#1DB954]" />
      </motion.div>

      {/* Badge: Liner Notes */}
      <span className="text-[10px] font-bold tracking-[0.25em] text-[#1DB954] uppercase mb-2">
        ALBUM LINER NOTES
      </span>

      <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
        Terima Kasih Telah Menjadi Bagian dari Harmoni Kami
      </h2>

      <p className="text-xs sm:text-sm text-[#B3B3B3] leading-relaxed max-w-sm mb-6">
        Kehadiran dan untaian doa restu Anda adalah nada-nada terindah yang menyempurnakan simfoni kebahagiaan kami.
        Semoga berkah dan kebaikan senantiasa melimpah bagi kita semua.
      </p>

      {/* Production Credits Card */}
      <div className="w-full max-w-xs p-4 rounded-xl bg-[#141414] border border-[#242424] flex flex-col items-center gap-2 mb-6">
        <SoundwaveVisualizer barCount={7} height={14} color="#1DB954" />
        <span className="font-heading text-lg font-bold text-white mt-1">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </span>
        <span className="text-[10px] text-[#777777] uppercase tracking-wider flex items-center gap-1">
          <span>Produced with Love</span>
          <Heart size={10} className="text-[#1DB954]" fill="#1DB954" />
          <span>Family &amp; Friends</span>
        </span>
      </div>

      <div className="text-[10px] text-[#555555] tracking-widest uppercase">
        © 2026 THE WEDDING OF {weddingConfig.groom.nickname?.toUpperCase()} &amp; {weddingConfig.bride.nickname?.toUpperCase()} • ALL RIGHTS RESERVED
      </div>
    </section>
  );
};
