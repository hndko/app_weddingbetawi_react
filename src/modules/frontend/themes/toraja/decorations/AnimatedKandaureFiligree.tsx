import React from 'react';
import { motion } from 'motion/react';

interface AnimatedKandaureFiligreeProps {
  position?: 'top-left' | 'top-right';
  className?: string;
}

export const AnimatedKandaureFiligree: React.FC<AnimatedKandaureFiligreeProps> = ({
  position = 'top-left',
  className = '',
}) => {
  const isRight = position === 'top-right';

  return (
    <div
      className={`absolute top-0 ${isRight ? 'right-0 -scale-x-100' : 'left-0'} pointer-events-none z-30 ${className}`}
    >
      <motion.svg
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        animate={{
          rotate: [0, 1.5, 0, -1.5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="origin-top-left drop-shadow-md"
      >
        <defs>
          <linearGradient id="kandaureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor="#E5A93C" />
            <stop offset="100%" stopColor="#8B1E19" />
          </linearGradient>
        </defs>

        {/* Top corner frame line */}
        <path d="M 0,0 L 90,0 C 70,25 40,55 0,80 Z" fill="#8B1E19" opacity="0.35" />
        <path d="M 0,4 L 80,4 C 55,25 25,55 4,80" stroke="url(#kandaureGrad)" strokeWidth="2" />
        <path d="M 0,10 L 65,10 C 45,28 20,48 10,65" stroke="#F5F0EB" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,2" />

        {/* Hanging Kandaure beads strands */}
        <g stroke="url(#kandaureGrad)" strokeWidth="1.2">
          {/* Strand 1 */}
          <line x1="20" y1="4" x2="20" y2="45" strokeDasharray="1,3" />
          <circle cx="20" cy="48" r="3.5" fill="#E5A93C" />

          {/* Strand 2 (Longer) */}
          <line x1="38" y1="4" x2="38" y2="65" strokeDasharray="1,3" />
          <circle cx="38" cy="68" r="4.5" fill="#FFF2B2" stroke="#8B1E19" strokeWidth="1" />

          {/* Strand 3 */}
          <line x1="56" y1="4" x2="56" y2="40" strokeDasharray="1,3" />
          <circle cx="56" cy="43" r="3" fill="#E5A93C" />
        </g>

        {/* Small Buffalo Horn Crest at Corner */}
        <path
          d="M 4,4 C 12,12 18,12 18,12 C 18,12 24,12 32,4 C 24,8 18,8 18,8 C 18,8 12,8 4,4 Z"
          fill="url(#kandaureGrad)"
        />
      </motion.svg>
    </div>
  );
};
