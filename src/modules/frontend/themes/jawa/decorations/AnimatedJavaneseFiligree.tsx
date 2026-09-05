import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface AnimatedJavaneseFiligreeProps {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
}

export const AnimatedJavaneseFiligree: React.FC<AnimatedJavaneseFiligreeProps> = ({
  className,
  position = 'top-left',
  size = 72,
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
      className={cn("absolute pointer-events-none drop-shadow-sm z-20", className)}
      style={{ transform: getTransform(), transformOrigin: 'top left' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <motion.div
        animate={{
          rotate: [-1.2, 1.2, -1.2],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originX: 0, originY: 0 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Corner Frame Arc */}
          <path
            d="M 6 90 L 6 20 C 6 12, 12 6, 20 6 L 90 6"
            stroke="#C5A059"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Dotted Accent Guide */}
          <path
            d="M 12 75 L 12 24 C 12 18, 18 12, 24 12 L 75 12"
            stroke="#E5C158"
            strokeWidth="0.9"
            strokeDasharray="2 2"
          />

          {/* Javanese Lung-lungan (Royal Swirling Vines) */}
          <path
            d="M 18 18 C 30 18, 45 28, 48 42 C 50 54, 42 62, 32 60 C 22 58, 20 46, 28 38 C 34 32, 44 34, 48 40"
            stroke="#E5C158"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
          />

          {/* Secondary Leaf Tendril */}
          <path
            d="M 48 42 C 60 40, 72 48, 75 60 C 77 70, 70 76, 62 74 C 54 72, 52 62, 60 56"
            stroke="#C5A059"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Corner Rosette Flower (Bunga Ceplok Keraton) */}
          <circle cx="16" cy="16" r="4" fill="#E5C158" />
          <circle cx="16" cy="16" r="1.5" fill="#132A1C" />

          {/* Golden Prada Buds */}
          <circle cx="48" cy="40" r="2.5" fill="#E5C158" />
          <circle cx="60" cy="56" r="2" fill="#C5A059" />
          <circle cx="75" cy="12" r="2.5" fill="#E5C158" />
          <circle cx="12" cy="75" r="2.5" fill="#E5C158" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
