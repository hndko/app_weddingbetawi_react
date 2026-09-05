import React from 'react';
import { AnimatedArabesqueFiligree } from './AnimatedArabesqueFiligree';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Subtle Gold and Teal Outer Lines */}
      <div className="absolute inset-2 border border-[#C5A059]/35 rounded-[26px]" />
      <div className="absolute inset-3.5 border border-[#0F4C5C]/30 rounded-[22px]" />

      {/* Animated Arabesque Moorish Filigree at Corners */}
      <AnimatedArabesqueFiligree position="top-left" className="top-2.5 left-2.5" size={64} />
      <AnimatedArabesqueFiligree position="top-right" className="top-2.5 right-2.5" size={64} />
      <AnimatedArabesqueFiligree position="bottom-left" className="bottom-2.5 left-2.5" size={52} />
      <AnimatedArabesqueFiligree position="bottom-right" className="bottom-2.5 right-2.5" size={52} />
    </div>
  );
};
