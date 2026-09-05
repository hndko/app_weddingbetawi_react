import React from 'react';
import { motion } from 'motion/react';

interface AnimatedSimbarLimasProps {
  className?: string;
  color?: string;
}

export const AnimatedSimbarLimas: React.FC<AnimatedSimbarLimasProps> = ({
  className = '',
  color = '#D4AF37',
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 z-20 overflow-hidden ${className}`}>
      {/* Top Left Simbar Carving */}
      <motion.div
        className="absolute top-2 left-2 origin-top-left"
        animate={{
          rotate: [0, 1.5, -1, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Horn Curve (Simbar Tanduk Kambing) */}
          <path
            d="M4 4 L64 4 C50 14 38 28 32 50 C26 36 16 26 4 22 Z"
            fill="#50020D"
            stroke={color}
            strokeWidth="1.6"
            opacity="0.88"
          />
          {/* Inner Golden Vines */}
          <path
            d="M10 10 C32 12 46 26 46 48"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M6 26 C26 26 36 36 36 62"
            stroke={color}
            strokeWidth="1"
            fill="none"
          />
          <circle cx="16" cy="16" r="3" fill="#FFE082" />
          <circle cx="36" cy="36" r="2.5" fill={color} />
        </svg>
      </motion.div>

      {/* Top Right Simbar Carving */}
      <motion.div
        className="absolute top-2 right-2 origin-top-right"
        animate={{
          rotate: [0, -1.5, 1, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <svg width="72" height="72" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-100">
          <path
            d="M4 4 L64 4 C50 14 38 28 32 50 C26 36 16 26 4 22 Z"
            fill="#50020D"
            stroke={color}
            strokeWidth="1.6"
            opacity="0.88"
          />
          <path
            d="M10 10 C32 12 46 26 46 48"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M6 26 C26 26 36 36 36 62"
            stroke={color}
            strokeWidth="1"
            fill="none"
          />
          <circle cx="16" cy="16" r="3" fill="#FFE082" />
          <circle cx="36" cy="36" r="2.5" fill={color} />
        </svg>
      </motion.div>
    </div>
  );
};
