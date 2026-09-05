import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface AnimatedSundaneseFiligreeProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  color?: string;
}

export const AnimatedSundaneseFiligree: React.FC<AnimatedSundaneseFiligreeProps> = ({
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
          {/* Outer Border L-Curve Frame */}
          <path
            d="M 6 88 L 6 22 C 6 13, 13 6, 22 6 L 88 6"
            stroke={color}
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Dotted Inner Parallel Arc */}
          <path
            d="M 12 72 L 12 24 C 12 17, 17 12, 24 12 L 72 12"
            stroke="#4A6B5D"
            strokeWidth="0.9"
            strokeDasharray="2.5 2.5"
          />

          {/* Sundanese Priangan Floral Tendril (Sulur Bunga Kembang Tanjung) */}
          <path
            d="M 18 18 
               C 28 16, 42 22, 46 34 
               C 50 46, 42 54, 32 52 
               C 22 50, 22 38, 30 32 
               C 36 26, 46 30, 48 38"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Secondary Delicate Branch with Hanjuang Leaf */}
          <path
            d="M 46 34 C 58 32, 68 40, 70 52 C 72 62, 64 68, 56 66 C 48 64, 48 54, 56 48"
            stroke="#4A6B5D"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Jasmine Blossom Bud at Corner (Kembang Malati Kasundaan) */}
          <circle cx="16" cy="16" r="4" fill="#FFFFFF" stroke={color} strokeWidth="1.2" />
          <circle cx="16" cy="16" r="1.8" fill={color} />

          {/* Jasmine Floral Droplets */}
          <circle cx="48" cy="38" r="2.2" fill="#FFFFFF" stroke="#4A6B5D" strokeWidth="0.8" />
          <circle cx="56" cy="48" r="2" fill="#FFFFFF" stroke={color} strokeWidth="0.8" />
          <circle cx="72" cy="12" r="2" fill={color} />
          <circle cx="12" cy="72" r="2" fill={color} />
        </svg>
      </motion.div>
    </motion.div>
  );
};
