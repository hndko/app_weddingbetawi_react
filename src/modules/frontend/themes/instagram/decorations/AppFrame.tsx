import React from 'react';
import { FloatingHearts } from './FloatingHearts';

export const AppFrame: React.FC = () => {
  return (
    <>
      {/* Floating Instagram Hearts */}
      <FloatingHearts count={6} />

      {/* Subtle Viewfinder / Story Top Glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFD600] via-[#FF0069] to-[#7638FA] z-[95] pointer-events-none opacity-80" />
    </>
  );
};
