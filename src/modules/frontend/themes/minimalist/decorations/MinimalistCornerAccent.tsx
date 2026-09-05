import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface MinimalistCornerAccentProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

export const MinimalistCornerAccent: React.FC<MinimalistCornerAccentProps> = ({
  className,
  position = 'top-left',
  size = 64,
  primaryColor = '#2D3748',
  secondaryColor = '#9AA79C',
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
          rotate: [-0.8, 0.8, -0.8],
          scale: [1, 1.015, 1],
        }}
        transition={{
          duration: 8,
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
          {/* Outer Minimalist Right-Angle Border */}
          <path
            d="M 6 85 L 6 18 C 6 11, 11 6, 18 6 L 85 6"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Inner Parallel Dotted Accent */}
          <path
            d="M 12 70 L 12 20 C 12 15, 15 12, 20 12 L 70 12"
            stroke={secondaryColor}
            strokeWidth="0.8"
            strokeDasharray="2 3"
            opacity="0.75"
          />

          {/* Delicate Botanical Leaf Bud in Corner */}
          <path
            d="M 16 16 C 24 10, 32 14, 30 24 C 22 28, 14 24, 16 16 Z"
            fill={secondaryColor}
            stroke={primaryColor}
            strokeWidth="0.8"
            opacity="0.85"
          />
          <circle cx="16" cy="16" r="2.5" fill="#D4AF37" />
          <circle cx="34" cy="12" r="1.5" fill={primaryColor} opacity="0.6" />
          <circle cx="12" cy="34" r="1.5" fill={primaryColor} opacity="0.6" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
