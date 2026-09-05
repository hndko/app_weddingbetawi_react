import React from 'react';
import { motion } from 'motion/react';

interface RoyalScrollHeaderProps {
  className?: string;
}

export const RoyalScrollHeader: React.FC<RoyalScrollHeaderProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center w-full px-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center"
      >
        {/* Golden Royal Crown */}
        <svg viewBox="0 0 60 40" className="w-14 h-10 drop-shadow-md">
          <defs>
            <linearGradient id="goldCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF3C4" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#854D0E" />
            </linearGradient>
          </defs>
          <path
            d="M 5,30 L 7,8 L 18,18 L 30,2 L 42,18 L 53,8 L 55,30 Z"
            fill="url(#goldCrownGrad)"
            stroke="#996515"
            strokeWidth="1"
          />
          <circle cx="30" cy="2" r="3.5" fill="#FFF3C4" />
          <circle cx="7" cy="8" r="2.5" fill="#FFF3C4" />
          <circle cx="53" cy="8" r="2.5" fill="#FFF3C4" />
          <rect x="3" y="30" width="54" height="6" rx="2" fill="#854D0E" />
          <circle cx="15" cy="33" r="1.5" fill="#DC2626" />
          <circle cx="30" cy="33" r="1.8" fill="#FFF3C4" />
          <circle cx="45" cy="33" r="1.5" fill="#DC2626" />
        </svg>

        {/* Proclamation Ribbon Banner */}
        <div className="mt-1 flex items-center justify-center gap-2">
          <div className="h-px w-6 bg-[#D4AF37]" />
          <span className="font-serif text-[10px] font-black uppercase tracking-[0.3em] text-[#854D0E]">
            BY ROYAL DECREE
          </span>
          <div className="h-px w-6 bg-[#D4AF37]" />
        </div>
      </motion.div>
    </div>
  );
};
