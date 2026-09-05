import React from 'react';
import { motion } from 'motion/react';
import { Play, Plus, Check, ThumbsUp, Share2, Info, Star } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [inList, setInList] = React.useState(false);
  const [liked, setLiked] = React.useState(true);

  return (
    <section className="relative px-5 pt-4 pb-10 flex flex-col items-center bg-gradient-to-b from-[#1C0506] via-[#141414] to-[#141414] text-white">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#E50914]/15 blur-[65px] pointer-events-none" />

      {/* Cinematic Poster Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-sm h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#282828] shadow-[0_16px_36px_rgba(0,0,0,0.9)] group mb-5"
      >
        <img
          src={weddingConfig.groom.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={`${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent flex flex-col justify-between p-4">
          {/* Top Brand Pill */}
          <div className="flex items-center gap-1.5 self-start px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
            <span className="text-[#E50914] font-black text-xs">N</span>
            <span className="text-[9px] font-bold tracking-[0.2em] text-white uppercase">SERIES</span>
          </div>

          {/* Bottom Billboard Title */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-1.5 py-0.5 rounded bg-[#E50914] text-[9px] font-black text-white uppercase tracking-wider">
                TOP 1
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                IN MOVIES TODAY
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide drop-shadow-md">
              {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Metadata Row (Netflix Signature Badges) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center flex-wrap gap-2 text-xs font-semibold text-[#B3B3B3] mb-4 w-full max-w-sm"
      >
        <span className="text-[#46D369] font-bold">99% Match</span>
        <span>•</span>
        <span>2026</span>
        <span>•</span>
        <span className="px-1.5 py-0.2 rounded border border-[#666666] text-[10px] text-white">SU</span>
        <span>•</span>
        <span className="px-1.5 py-0.2 rounded border border-[#666666] text-[10px] text-white">4K ULTRA HD</span>
        <span>•</span>
        <span className="text-[#E5C158] flex items-center gap-0.5">
          <Star size={11} fill="#E5C158" /> 5.0
        </span>
      </motion.div>

      {/* Movie Synopsis */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-xs sm:text-sm text-[#CCCCCC] leading-relaxed text-center max-w-sm mb-6 px-2"
      >
        Sebuah kisah nyata perjalanan cinta dua insan yang dipertemukan oleh takdir, dirajut dalam komitmen suci, dan kini melangkah bersama menuju babak baru kehidupan berkeluarga.
      </motion.p>

      {/* Main Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        {/* Play / Explore Button */}
        <a
          href="#acara"
          className="w-full py-3 px-6 rounded-md bg-white hover:bg-white/90 text-black font-extrabold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
        >
          <Play fill="currentColor" size={16} />
          <span>LIHAT RANGKAIAN EPISODE</span>
        </a>

        {/* Action Pills Row */}
        <div className="flex items-center justify-around py-2 border-t border-b border-[#282828] text-xs text-[#B3B3B3]">
          {/* My List */}
          <button
            type="button"
            onClick={() => setInList(!inList)}
            className="flex flex-col items-center gap-1 hover:text-white transition-colors"
          >
            {inList ? <Check size={18} className="text-[#E50914]" /> : <Plus size={18} />}
            <span className="text-[10px]">Daftar Saya</span>
          </button>

          {/* Rate / Liked */}
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className="flex flex-col items-center gap-1 hover:text-white transition-colors"
          >
            <ThumbsUp size={18} className={liked ? 'text-[#E50914]' : ''} />
            <span className="text-[10px]">Beri Nilai</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
              }
            }}
            className="flex flex-col items-center gap-1 hover:text-white transition-colors"
          >
            <Share2 size={18} />
            <span className="text-[10px]">Bagikan</span>
          </button>

          {/* Info */}
          <a href="#mempelai" className="flex flex-col items-center gap-1 hover:text-white transition-colors">
            <Info size={18} />
            <span className="text-[10px]">Pemeran</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};
