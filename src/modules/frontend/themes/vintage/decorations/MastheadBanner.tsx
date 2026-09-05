import React from 'react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

interface MastheadBannerProps {
  className?: string;
  isCompact?: boolean;
}

export const MastheadBanner: React.FC<MastheadBannerProps> = ({
  className = '',
  isCompact = false,
}) => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <div className={`w-full text-center select-none font-serif text-[#1E1E1E] ${className}`}>
      {/* Top Editorial Metabar */}
      <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] uppercase tracking-[0.18em] text-[#4A4A4A] py-1 border-b border-[#1E1E1E]/40 font-mono">
        <span>VOL. I • NO. 01</span>
        <span className="font-semibold text-[#8B3A2B]">★ SPECIAL WEDDING ISSUE ★</span>
        <span>PRICE: ONE PRAYER</span>
      </div>

      {/* Main Title Masthead */}
      <div className={`${isCompact ? 'py-2.5' : 'py-4'}`}>
        <h1 className="font-heading font-black tracking-tight text-[#141414] leading-none uppercase text-3xl sm:text-4xl drop-shadow-xs">
          THE WEDDING GAZETTE
        </h1>
        <p className="italic text-[10px] sm:text-[11.5px] text-[#555555] tracking-wide mt-1.5 font-serif">
          "The Daily Chronicle of Eternal Love, Devotion &amp; Celebration"
        </p>
      </div>

      {/* Date & Location Rule Bar */}
      <div className="flex items-center justify-between text-[8px] sm:text-[9.5px] uppercase tracking-wider py-1 border-y-2 border-[#1E1E1E] text-[#1E1E1E] font-medium">
        <span>{weddingConfig.dateStr}</span>
        <span className="hidden sm:inline font-bold text-[#8B3A2B]">• FIRST EDITION •</span>
        <span>{weddingConfig.events.resepsi?.venue || 'KOTA PALEMBANG'}</span>
      </div>
    </div>
  );
};
