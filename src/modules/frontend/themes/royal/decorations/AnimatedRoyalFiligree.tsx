import React from 'react';
import { motion } from 'motion/react';

interface AnimatedRoyalFiligreeProps {
  position?: 'top-left' | 'top-right';
  className?: string;
}

export const AnimatedRoyalFiligree: React.FC<AnimatedRoyalFiligreeProps> = ({
  position = 'top-left',
  className = '',
}) => {
  const isRight = position === 'top-right';

  return (
    <div
      className={`absolute top-0 ${isRight ? 'right-0 -scale-x-100' : 'left-0'} pointer-events-none z-30 ${className}`}
    >
      <motion.svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.85, 1, 0.85],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="origin-top-left drop-shadow-sm"
      >
        <defs>
          <linearGradient id="baroqueGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
        </defs>

        {/* Outer Corner Arc */}
        <path
          d="M 4,4 L 75,4 C 50,15 15,50 4,75 Z"
          fill="#D4AF37"
          opacity="0.15"
        />
        <path
          d="M 0,2 L 80,2 C 55,18 18,55 2,80"
          stroke="url(#baroqueGold)"
          strokeWidth="1.8"
        />
        <path
          d="M 0,8 L 65,8 C 45,22 22,45 8,65"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeDasharray="2,2"
          opacity="0.6"
        />

        {/* Fleur-de-lis Mini Ornament */}
        <g transform="translate(18, 18) scale(0.6)">
          <path
            d="M 0,-15 C 4,-7 6,-1 0,8 C -6,-1 -4,-7 0,-15 Z"
            fill="url(#baroqueGold)"
          />
          <path
            d="M 0,1 C -9,0 -15,-7 -11,-13 C -7,-9 -4,-1 0,1 Z"
            fill="url(#baroqueGold)"
          />
          <path
            d="M 0,1 C 9,0 15,-7 11,-13 C 7,-9 4,-1 0,1 Z"
            fill="url(#baroqueGold)"
          />
        </g>
      </motion.svg>
    </div>
  );
};
