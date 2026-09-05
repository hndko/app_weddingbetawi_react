import React from 'react';
import { AnimatedJavaneseFiligree } from './AnimatedJavaneseFiligree';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Subtle Gold Outer Lines */}
      <div className="absolute inset-2 border border-[#C5A059]/40 rounded-[28px]" />
      <div className="absolute inset-3.5 border border-[#C5A059]/20 rounded-[24px]" />

      {/* Animated Royal Javanese Filigree Woodcarvings at Corners */}
      <AnimatedJavaneseFiligree position="top-left" className="top-2.5 left-2.5" size={68} />
      <AnimatedJavaneseFiligree position="top-right" className="top-2.5 right-2.5" size={68} />
      <AnimatedJavaneseFiligree position="bottom-left" className="bottom-2.5 left-2.5" size={54} />
      <AnimatedJavaneseFiligree position="bottom-right" className="bottom-2.5 right-2.5" size={54} />


    </div>
  );
};
