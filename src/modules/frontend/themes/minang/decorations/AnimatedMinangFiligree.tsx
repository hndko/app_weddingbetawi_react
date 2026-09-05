import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface AnimatedMinangFiligreeProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
}

export const AnimatedMinangFiligree: React.FC<AnimatedMinangFiligreeProps> = ({
  className,
  position = 'top-left',
  size = 68,
  color = '#D4AF37',
}) => {
  const getTransform = () => {
    switch (position) {
      case 'top-left': return 'scale(1, 1)';
      case 'top-right': return 'scale(-1, 1)';
      case 'bottom-left': return 'scale(1, -1)';
      case 'bottom-right': return 'scale(-1, -1)';
      default: return 'scale(1, 1)';
    }
  };

  return (
    <motion.div
      className={cn("absolute pointer-events-none drop-shadow-xs z-20", className)}
      style={{ transform: getTransform(), transformOrigin: 'center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          rotate: [-1, 1, -1],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Minang Songket Border Line */}
          <path
            d="M 6 88 L 6 20 C 6 12, 12 6, 20 6 L 88 6"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Dotted Inner Crimson Parallel Arc */}
          <path
            d="M 12 72 L 12 24 C 12 17, 17 12, 24 12 L 72 12"
            stroke="#7B1122"
            strokeWidth="1.2"
            strokeDasharray="2.5 2.5"
          />

          {/* Ukiran Minang: Kaluk Paku (Fern Tendril Scroll) */}
          <path
            d="M 18 18 
               C 26 15, 38 20, 42 30 
               C 46 40, 38 48, 28 46 
               C 18 44, 20 32, 28 28 
               C 34 24, 42 28, 44 34"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Ukiran Minang: Pucuak Rebung Triangle Spike */}
          <path
            d="M 28 12 L 36 28 L 20 28 Z"
            fill="#7B1122"
            stroke={color}
            strokeWidth="0.8"
          />
          <path
            d="M 12 28 L 28 36 L 28 20 Z"
            fill="#7B1122"
            stroke={color}
            strokeWidth="0.8"
          />

          {/* Motif Songket Itik Pulang Patang Wavelet */}
          <path
            d="M 44 14 C 52 14, 60 22, 66 32 C 72 42, 64 50, 56 46 C 48 42, 50 32, 58 30"
            stroke={color}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Central Golden Songket Rhombus / Diamond */}
          <polygon
            points="18,18 24,12 18,6 12,12"
            fill={color}
          />
          <circle cx="18" cy="12" r="1.5" fill="#FFF3C4" />

          {/* Decorative Finial Drops */}
          <circle cx="44" cy="34" r="2" fill={color} />
          <circle cx="58" cy="30" r="1.8" fill="#7B1122" />
          <circle cx="72" cy="12" r="2" fill={color} />
          <circle cx="12" cy="72" r="2" fill={color} />
        </svg>
      </motion.div>
    </motion.div>
  );
};
