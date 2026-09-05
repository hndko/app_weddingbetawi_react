import React from 'react';
import { MinimalistCornerAccent } from './MinimalistCornerAccent';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Subtle Slate & Sage Outer Minimalist Lines */}
      <div className="absolute inset-2 border border-[#2D3748]/25 rounded-[24px]" />
      <div className="absolute inset-3.5 border border-[#9AA79C]/30 rounded-[20px]" />

      {/* Modern Minimalist Corner Accents (Symmetrically Positioned) */}
      <MinimalistCornerAccent position="top-left" className="top-2.5 left-2.5" size={60} />
      <MinimalistCornerAccent position="top-right" className="top-2.5 right-2.5" size={60} />
      <MinimalistCornerAccent position="bottom-left" className="bottom-2.5 left-2.5" size={50} />
      <MinimalistCornerAccent position="bottom-right" className="bottom-2.5 right-2.5" size={50} />
    </div>
  );
};
