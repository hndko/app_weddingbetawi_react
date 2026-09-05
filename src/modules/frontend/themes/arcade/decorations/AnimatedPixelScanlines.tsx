import React from 'react';

export const AnimatedPixelScanlines: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Subtle CRT horizontal scanlines */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* 8-Bit Pixelated Corner Filigrees */}
      {/* Top Left */}
      <div className="absolute top-2 left-2 flex flex-col gap-0.5 opacity-60">
        <div className="w-4 h-1 bg-[#22D3EE]" />
        <div className="w-1 h-3 bg-[#22D3EE]" />
      </div>

      {/* Top Right */}
      <div className="absolute top-2 right-2 flex flex-col items-end gap-0.5 opacity-60">
        <div className="w-4 h-1 bg-[#22D3EE]" />
        <div className="w-1 h-3 bg-[#22D3EE]" />
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-2 left-2 flex flex-col gap-0.5 opacity-60">
        <div className="w-1 h-3 bg-[#F43F5E]" />
        <div className="w-4 h-1 bg-[#F43F5E]" />
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-2 right-2 flex flex-col items-end gap-0.5 opacity-60">
        <div className="w-1 h-3 bg-[#F43F5E]" />
        <div className="w-4 h-1 bg-[#F43F5E]" />
      </div>
    </div>
  );
};
