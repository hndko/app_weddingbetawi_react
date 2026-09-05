import React from 'react';
import { motion } from 'motion/react';

interface AnimatedBatakFiligreeProps {
  className?: string;
  color?: string;
}

export const AnimatedBatakFiligree: React.FC<AnimatedBatakFiligreeProps> = ({
  className = '',
  color = '#D4AF37',
}) => {
  return (
    <div className={`pointer-events-none ${className}`}>
      {/* Top Left Corner */}
      <motion.div
        className="absolute top-2 left-2 z-20"
        animate={{ opacity: [0.75, 1, 0.75], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {/* Batak Gorga Corner Curves */}
          <path
            d="M3,3 L3,26 C3,18 8,12 16,10 C20,9 24,11 28,6 C24,3 16,3 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M3,3 L26,3 C18,3 12,8 10,16 C9,20 11,24 6,28 C3,24 3,16 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          {/* Red Accent Dot */}
          <circle cx="8" cy="8" r="3" fill="#7A1B1E" stroke={color} strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" fill="#FFF3C4" />
        </svg>
      </motion.div>

      {/* Top Right Corner */}
      <motion.div
        className="absolute top-2 right-2 z-20"
        animate={{ opacity: [0.75, 1, 0.75], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="rotate-90">
          <path
            d="M3,3 L3,26 C3,18 8,12 16,10 C20,9 24,11 28,6 C24,3 16,3 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M3,3 L26,3 C18,3 12,8 10,16 C9,20 11,24 6,28 C3,24 3,16 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <circle cx="8" cy="8" r="3" fill="#7A1B1E" stroke={color} strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" fill="#FFF3C4" />
        </svg>
      </motion.div>

      {/* Bottom Left Corner */}
      <motion.div
        className="absolute bottom-2 left-2 z-20"
        animate={{ opacity: [0.75, 1, 0.75], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="-rotate-90">
          <path
            d="M3,3 L3,26 C3,18 8,12 16,10 C20,9 24,11 28,6 C24,3 16,3 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M3,3 L26,3 C18,3 12,8 10,16 C9,20 11,24 6,28 C3,24 3,16 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <circle cx="8" cy="8" r="3" fill="#7A1B1E" stroke={color} strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" fill="#FFF3C4" />
        </svg>
      </motion.div>

      {/* Bottom Right Corner */}
      <motion.div
        className="absolute bottom-2 right-2 z-20"
        animate={{ opacity: [0.75, 1, 0.75], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="rotate-180">
          <path
            d="M3,3 L3,26 C3,18 8,12 16,10 C20,9 24,11 28,6 C24,3 16,3 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <path
            d="M3,3 L26,3 C18,3 12,8 10,16 C9,20 11,24 6,28 C3,24 3,16 3,3 Z"
            fill={color}
            opacity="0.9"
          />
          <circle cx="8" cy="8" r="3" fill="#7A1B1E" stroke={color} strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" fill="#FFF3C4" />
        </svg>
      </motion.div>
    </div>
  );
};
