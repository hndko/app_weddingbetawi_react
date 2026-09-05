import React from 'react';
import { FloatingTorajaMotifs } from './FloatingTorajaMotifs';
import { AnimatedKandaureFiligree } from './AnimatedKandaureFiligree';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Floating Toraja Motifs */}
      <FloatingTorajaMotifs count={10} />

      {/* Corner Kandaure Filigree */}
      <AnimatedKandaureFiligree position="top-left" />
      <AnimatedKandaureFiligree position="top-right" />

      {/* Toraja Edge Filigree Line */}
      <div className="absolute inset-2.5 border border-[#E5A93C]/30 rounded-[28px]" />
    </div>
  );
};
