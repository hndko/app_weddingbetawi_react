import React from 'react';
import { motion } from 'motion/react';

interface ArcadeMarqueeHeaderProps {
  className?: string;
}

export const ArcadeMarqueeHeader: React.FC<ArcadeMarqueeHeaderProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center w-full px-4 ${className}`}>
      {/* Top Arcade Marquee Sign */}
      <div className="w-full max-w-sm bg-[#1E1B4B] border-4 border-[#22D3EE] rounded-xl p-3 shadow-[0_0_15px_rgba(34,211,238,0.4)] flex flex-col items-center relative overflow-hidden">
        {/* Neon scanline accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#22D3EE]/10 to-transparent pointer-events-none" />

        {/* Top Status Bar */}
        <div className="flex items-center justify-between w-full text-[9px] font-mono text-[#F59E0B] font-bold tracking-widest uppercase mb-1">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-[#10B981] animate-ping rounded-full" />
            1P &amp; 2P ONLINE
          </span>
          <span>STAGE: WEDDING</span>
          <span>SCORE: 999,999</span>
        </div>

        {/* Main Pixel Title */}
        <motion.h2
          animate={{
            textShadow: [
              '0 0 4px #22D3EE, 0 0 10px #22D3EE',
              '0 0 2px #22D3EE, 0 0 5px #22D3EE',
              '0 0 4px #22D3EE, 0 0 10px #22D3EE',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-mono text-xl sm:text-2xl font-black text-[#22D3EE] tracking-wider uppercase text-center my-0.5"
        >
          THE WEDDING ARCADE
        </motion.h2>

        <p className="font-mono text-[9px] text-[#FDA4AF] tracking-widest uppercase">
          ★ LEVEL 1 CLEARED: MARRIED FOREVER ★
        </p>
      </div>
    </div>
  );
};
