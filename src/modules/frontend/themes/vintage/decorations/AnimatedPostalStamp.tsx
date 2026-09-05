import React from 'react';
import { motion } from 'motion/react';

interface AnimatedPostalStampProps {
  className?: string;
  size?: number;
  color?: string;
  text?: string;
}

export const AnimatedPostalStamp: React.FC<AnimatedPostalStampProps> = ({
  className = '',
  size = 80,
  color = '#8B3A2B',
  text = 'SPECIAL EDITION',
}) => {
  return (
    <motion.div
      className={`pointer-events-none select-none inline-flex items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80 drop-shadow-xs"
      >
        {/* Outer Serrated / Dashed Stamp Circle */}
        <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="1" />

        {/* Center Star & Text */}
        <path
          id="stampTextCircle"
          d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0"
          fill="none"
        />
        <text font-family="'Times New Roman', serif" font-size="8.5" font-weight="bold" fill={color} letter-spacing="2.5">
          <textPath href="#stampTextCircle" startOffset="0%">
            • {text} • WEDDING POST •
          </textPath>
        </text>

        <circle cx="50" cy="50" r="16" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1" />
        <text x="50" y="54" text-anchor="middle" font-family="'Times New Roman', serif" font-size="14" font-weight="bold" fill={color}>
          ★
        </text>
      </svg>
    </motion.div>
  );
};
