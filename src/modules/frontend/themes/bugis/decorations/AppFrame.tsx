import React from 'react';
import { AnimatedBarugaCarving } from './AnimatedBarugaCarving';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Royal Maroon & Sengkang Gold Outer Lines */}
      <div className="absolute inset-2 border border-[#D4AF37]/50 rounded-[26px]" />
      <div className="absolute inset-3.5 border border-[#8B1E1E]/30 rounded-[22px] border-dashed" />

      {/* Animated Baruga Wood Carvings at Corners */}
      <AnimatedBarugaCarving color="#D4AF37" />
    </div>
  );
};
