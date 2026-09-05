import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Heart, Share2, MoreHorizontal, Shuffle, Calendar, MapPin } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { SoundwaveVisualizer } from '../decorations/SoundwaveVisualizer';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [liked, setLiked] = React.useState(true);

  return (
    <section className="relative px-5 pt-8 pb-10 flex flex-col items-center bg-gradient-to-b from-[#18261E] via-[#121212] to-[#121212] text-white">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-[#1DB954]/15 blur-[60px] pointer-events-none" />

      {/* Artist Badge */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#282828] mb-4 shadow-sm"
      >
        <CheckCircle2 size={13} className="text-[#1DB954]" />
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1DB954]">
          VERIFIED NEWLYWEDS
        </span>
      </motion.div>

      {/* Main Artist Photo / Artwork Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#282828] shadow-[0_12px_32px_rgba(0,0,0,0.8)] group mb-5"
      >
        <img
          src={weddingConfig.groom.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
          alt={`${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
          <SoundwaveVisualizer barCount={9} height={16} color="#1DB954" />
        </div>
      </motion.div>

      {/* Artist & Album Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center w-full max-w-sm"
      >
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h1>

        {/* Listeners & Followers Stats */}
        <p className="text-xs text-[#B3B3B3] font-medium tracking-wide flex items-center justify-center gap-2">
          <span className="text-[#1DB954] font-semibold">1,250 Monthly Guests</span>
          <span>•</span>
          <span>The Wedding Album</span>
        </p>
      </motion.div>

      {/* Spotify Interactive Control Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex items-center justify-center gap-4 mt-6 w-full max-w-xs"
      >
        {/* Shuffle Button */}
        <button
          type="button"
          aria-label="Mode Acak Musik"
          className="p-2.5 rounded-full text-[#B3B3B3] hover:text-[#1DB954] hover:bg-[#181818] transition-colors"
        >
          <Shuffle size={18} />
        </button>

        {/* Heart / Like Button */}
        <button
          type="button"
          aria-label="Sukai Lagu Pernikahan"
          onClick={() => setLiked(!liked)}
          className={`p-2.5 rounded-full transition-colors ${
            liked ? 'text-[#1DB954]' : 'text-[#B3B3B3] hover:text-white'
          }`}
        >
          <Heart size={20} fill={liked ? '#1DB954' : 'none'} />
        </button>

        {/* Center Big Play Indicator */}
        <div className="w-12 h-12 rounded-full bg-[#1DB954] text-black flex items-center justify-center shadow-[0_0_16px_rgba(29,185,84,0.5)]">
          <span className="w-3.5 h-3.5 bg-black rounded-sm" />
        </div>

        {/* Share Button */}
        <button
          type="button"
          aria-label="Bagikan Undangan"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
            }
          }}
          className="p-2.5 rounded-full text-[#B3B3B3] hover:text-white hover:bg-[#181818] transition-colors"
        >
          <Share2 size={18} />
        </button>

        {/* Ellipsis Button */}
        <button
          type="button"
          aria-label="Opsi Lainnya"
          className="p-2.5 rounded-full text-[#B3B3B3] hover:text-white hover:bg-[#181818] transition-colors"
        >
          <MoreHorizontal size={20} />
        </button>
      </motion.div>

      {/* Release Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-sm mt-7 p-4 rounded-xl bg-[#181818]/90 border border-[#282828] flex flex-col gap-2 text-left"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#B3B3B3]">Tanggal Rilis:</span>
          <span className="text-[#E5C158] font-semibold flex items-center gap-1">
            <Calendar size={13} />
            {weddingConfig.dateStr || '20 September 2026'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#B3B3B3]">Venue Konser:</span>
          <span className="text-white font-medium flex items-center gap-1">
            <MapPin size={13} className="text-[#1DB954]" />
            {weddingConfig.events.resepsi.venue || 'Gedung Smesco'}
          </span>
        </div>
      </motion.div>
    </section>
  );
};
