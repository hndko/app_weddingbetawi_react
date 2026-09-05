import React from 'react';
import { FloatingGoldenStardust } from './FloatingGoldenStardust';
import { AnimatedRoyalFiligree } from './AnimatedRoyalFiligree';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Floating Stardust */}
      <FloatingGoldenStardust count={12} />

      {/* Baroque Corner Filigrees */}
      <AnimatedRoyalFiligree position="top-left" />
      <AnimatedRoyalFiligree position="top-right" />

      {/* Royal Gold Filigree Border */}
      <div className="absolute inset-2 border border-[#D4AF37]/40 rounded-[24px]" />
      <div className="absolute inset-3 border border-[#D4AF37]/20 rounded-[20px]" />
    </div>
  );
};
