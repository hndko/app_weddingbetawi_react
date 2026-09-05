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

          {/* Inner Dashed Delicate Arc Line */}
          <path
            d="M 14 78 L 14 26 C 14 19, 19 14, 26 14 L 78 14"
            stroke={color}
            strokeWidth="0.8"
            strokeDasharray="2,3"
            opacity="0.8"
          />

          {/* Corner Floral Rosette (Bunga Priangan 4-Kelopak) */}
          <g transform="translate(24, 24)">
            {/* Center Golden Core */}
            <circle cx="0" cy="0" r="3" fill={color} />
            <circle cx="0" cy="0" r="1.5" fill="#FFF9E0" />

            {/* Petals */}
            <path
              d="M 0 -8 C 2 -5, 2 -2, 0 0 C -2 -2, -2 -5, 0 -8 Z"
              fill={color}
              opacity="0.9"
            />
            <path
              d="M 8 0 C 5 2, 2 2, 0 0 C 2 -2, 5 -2, 8 0 Z"
              fill={color}
              opacity="0.9"
            />
            <path
              d="M 0 8 C -2 5, -2 2, 0 0 C 2 2, 2 5, 0 8 Z"
              fill={color}
              opacity="0.9"
            />
            <path
              d="M -8 0 C -5 -2, -2 -2, 0 0 C -2 2, -5 2, -8 0 Z"
              fill={color}
              opacity="0.9"
            />

            {/* Diagonal Petals */}
            <circle cx="5" cy="5" r="1.5" fill={color} />
            <circle cx="-5" cy="-5" r="1.5" fill={color} />
            <circle cx="-5" cy="5" r="1.5" fill={color} />
            <circle cx="5" cy="-5" r="1.5" fill={color} />
          </g>

          {/* Swirling Parahyangan Vine Sprouts */}
          <path
            d="M 28 6 C 45 4, 62 10, 72 16"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 6 28 C 4 45, 10 62, 16 72"
            stroke={color}
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Golden Droplet Tips */}
          <circle cx="74" cy="17" r="2.2" fill={color} />
          <circle cx="17" cy="74" r="2.2" fill={color} />
          <circle cx="86" cy="6" r="2.5" fill={color} />
          <circle cx="6" cy="86" r="2.5" fill={color} />
        </svg>
      </motion.div>
    </motion.div>
  );
};
