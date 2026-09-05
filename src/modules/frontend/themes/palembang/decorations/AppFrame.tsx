import React from 'react';
import { AnimatedSimbarLimas } from './AnimatedSimbarLimas';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Royal Crimson & Sriwijaya Gold Outer Lines */}
      <div className="absolute inset-2 border border-[#D4AF37]/50 rounded-[26px]" />
      <div className="absolute inset-3.5 border border-[#780016]/35 rounded-[22px] border-dashed" />

      {/* Animated Simbar Limas Wood Carvings at Corners */}
      <AnimatedSimbarLimas color="#D4AF37" />
    </div>
  );
};
