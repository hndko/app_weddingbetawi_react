import React from 'react';
import { motion } from 'motion/react';

interface AnimatedBarugaCarvingProps {
  className?: string;
  color?: string;
}

export const AnimatedBarugaCarving: React.FC<AnimatedBarugaCarvingProps> = ({
  className = '',
  color = '#D4AF37',
}) => {
  return (
    <div className={`pointer-events-none absolute inset-0 z-20 overflow-hidden ${className}`}>
      {/* Top Left Baruga Carving */}
      <motion.div
        className="absolute top-2 left-2 origin-top-left"
        animate={{
          rotate: [0, 1.5, -1, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width="70" height="70" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 5 L60 5 C45 15 35 25 30 45 C25 35 15 25 5 20 Z"
            fill="#5A0C16"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.85"
          />
          <path
            d="M10 10 C30 10 45 25 45 45"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M5 25 C25 25 35 35 35 60"
            stroke={color}
            strokeWidth="1"
            fill="none"
          />
          <circle cx="15" cy="15" r="3" fill="#FFE082" />
          <circle cx="35" cy="35" r="2.5" fill={color} />
        </svg>
      </motion.div>

      {/* Top Right Baruga Carving */}
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
        <svg width="70" height="70" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="-scale-x-100">
          <path
            d="M5 5 L60 5 C45 15 35 25 30 45 C25 35 15 25 5 20 Z"
            fill="#5A0C16"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.85"
          />
          <path
            d="M10 10 C30 10 45 25 45 45"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M5 25 C25 25 35 35 35 60"
            stroke={color}
            strokeWidth="1"
            fill="none"
          />
          <circle cx="15" cy="15" r="3" fill="#FFE082" />
          <circle cx="35" cy="35" r="2.5" fill={color} />
        </svg>
      </motion.div>
    </div>
  );
};
