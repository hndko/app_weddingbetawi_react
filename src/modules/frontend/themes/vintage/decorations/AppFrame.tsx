import React from 'react';
import { AnimatedPostalStamp } from './AnimatedPostalStamp';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Newspaper Broadsheet Double Frame */}
      <div className="absolute inset-2 border-2 border-[#1E1E1E]/80 rounded-[20px]" />
      <div className="absolute inset-3.5 border border-[#1E1E1E]/30 rounded-[16px]" />

      {/* Corner Typographic Marks */}
      <div className="absolute top-4 left-4 text-[#1E1E1E]/40 font-serif text-xs select-none">§</div>
      <div className="absolute top-4 right-4 text-[#1E1E1E]/40 font-serif text-xs select-none">§</div>

      {/* Rotating Rubber Stamp Watermark in Corner */}
      <div className="absolute top-12 right-2 opacity-25">
        <AnimatedPostalStamp size={68} color="#8B3A2B" text="ARCHIVE" />
      </div>
    </div>
  );
};
