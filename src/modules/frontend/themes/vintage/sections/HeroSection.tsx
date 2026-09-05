import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { MastheadBanner } from '../decorations/MastheadBanner';
import { FloatingVintageEphemera } from '../decorations/FloatingVintageEphemera';
import { AnimatedPostalStamp } from '../decorations/AnimatedPostalStamp';

export const HeroSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative min-h-[620px] flex flex-col items-center justify-between text-center px-5 py-8 bg-[#F4EBD9] text-[#1E1E1E] overflow-hidden">
      {/* Background Halftone Print Dot Texture */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1E1E1E 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Floating Vintage Stamps & Paper Scraps */}
      <FloatingVintageEphemera className="opacity-70" />

      {/* Masthead Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative z-10"
      >
        <MastheadBanner />
      </motion.div>

      {/* Big Broadsheet Lead Headline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-10 my-4 flex flex-col items-center w-full max-w-sm"
      >
        <span className="text-[10px] tracking-[0.25em] text-[#8B3A2B] font-mono font-bold uppercase mb-1">
          ★ FRONT PAGE EXCLUSIVE ★
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#141414] leading-tight uppercase tracking-tight">
          TWO SOULS JOINED IN LIFELONG DEVOTION
        </h2>
        
        {/* Couple Big Callout */}
        <div className="flex items-center justify-center gap-2.5 my-3 text-2xl sm:text-3xl font-serif font-bold text-[#141414]">
          <span className="underline decoration-[#8B3A2B] decoration-2 underline-offset-4">
            {weddingConfig.groom.nickname}
          </span>
          <span className="italic font-serif text-[#8B3A2B] text-xl font-normal">&amp;</span>
          <span className="underline decoration-[#8B3A2B] decoration-2 underline-offset-4">
            {weddingConfig.bride.nickname}
          </span>
        </div>

        <p className="text-[11px] sm:text-xs text-[#444444] font-serif italic leading-relaxed px-4">
          "A celebrated union marked by joy, laughter, and timeless devotion as two families become one."
        </p>
      </motion.div>

      {/* Hero Newspaper Photo Frame */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8 }}
        className="relative z-10 w-full max-w-xs my-2"
      >
        <div className="p-2 bg-[#FAF5EE] border-2 border-[#1E1E1E] shadow-sm relative">
          <div className="aspect-[4/3] w-full overflow-hidden bg-[#E2D6C0] border border-[#1E1E1E]/40 relative">
            <img
              src={weddingConfig.gallery[0] || weddingConfig.groom.image}
              alt="The Happy Couple"
              className="w-full h-full object-cover grayscale contrast-115 sepia-[0.35]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#8B3A2B]/5 mix-blend-multiply pointer-events-none" />
          </div>

          <div className="pt-2 text-left flex items-center justify-between border-t border-[#1E1E1E]/30 mt-2 text-[9px] font-mono uppercase text-[#555555]">
            <span>FIG. 01 — THE NEWLYWEDS</span>
            <span>PHOTO: ARCHIVE</span>
          </div>

          {/* Postal Rubber Stamp Accent */}
          <div className="absolute -bottom-5 -right-4 z-20">
            <AnimatedPostalStamp size={64} color="#8B3A2B" text="APPROVED" />
          </div>
        </div>
      </motion.div>

      {/* Date & Venue Dispatch Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 w-full max-w-xs mt-3 pt-3 border-t-2 border-[#1E1E1E] flex items-center justify-between text-[11px] font-serif text-[#1E1E1E]"
      >
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar size={13} className="text-[#8B3A2B] shrink-0" />
          <span>{weddingConfig.dateStr}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <MapPin size={13} className="text-[#8B3A2B] shrink-0" />
          <span className="truncate max-w-[140px]">{weddingConfig.events.resepsi?.venue || 'The Grand Ballroom'}</span>
        </div>
      </motion.div>
    </section>
  );
};
