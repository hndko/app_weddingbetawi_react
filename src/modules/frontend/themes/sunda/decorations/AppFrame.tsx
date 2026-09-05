import React from 'react';
import { AnimatedSundaneseFiligree } from './AnimatedSundaneseFiligree';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Subtle Gold and Sage Outer Lines */}
      <div className="absolute inset-2 border border-[#D4AF37]/35 rounded-[28px]" />
      <div className="absolute inset-3.5 border border-[#4A6B5D]/25 rounded-[24px]" />

      {/* Animated Sundanese Priangan Filigree at Corners */}
      <AnimatedSundaneseFiligree position="top-left" className="top-2.5 left-2.5" size={64} />
      <AnimatedSundaneseFiligree position="top-right" className="top-2.5 right-2.5" size={64} />
      <AnimatedSundaneseFiligree position="bottom-left" className="bottom-2.5 left-2.5" size={52} />
      <AnimatedSundaneseFiligree position="bottom-right" className="bottom-2.5 right-2.5" size={52} />
    </div>
  );
};
