import React from 'react';
import { FloatingPixelHearts } from './FloatingPixelHearts';
import { AnimatedPixelScanlines } from './AnimatedPixelScanlines';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Floating Pixel Particles */}
      <FloatingPixelHearts count={10} />

      {/* Scanlines & Pixel Corners */}
      <AnimatedPixelScanlines />

      {/* Arcade Neon Border */}
      <div className="absolute inset-2 border border-[#22D3EE]/30 rounded-[24px]" />
    </div>
  );
};
