import React from 'react';
import { AnimatedMinangFiligree } from './AnimatedMinangFiligree';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Subtle Royal Maroon and Antique Songket Gold Outer Lines */}
      <div className="absolute inset-2 border border-[#D4AF37]/40 rounded-[26px]" />
      <div className="absolute inset-3.5 border border-[#7B1122]/35 rounded-[22px]" />

      {/* Animated Minang Pucuak Rebung & Kaluk Paku Filigree at Corners */}
      <AnimatedMinangFiligree position="top-left" className="top-2.5 left-2.5" size={64} />
      <AnimatedMinangFiligree position="top-right" className="top-2.5 right-2.5" size={64} />
      <AnimatedMinangFiligree position="bottom-left" className="bottom-2.5 left-2.5" size={52} />
      <AnimatedMinangFiligree position="bottom-right" className="bottom-2.5 right-2.5" size={52} />
    </div>
  );
};
