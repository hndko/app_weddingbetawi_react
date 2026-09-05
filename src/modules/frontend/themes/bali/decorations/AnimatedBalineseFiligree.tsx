import React from 'react';
import { motion } from 'motion/react';

interface AnimatedBalineseFiligreeProps {
  className?: string;
  color?: string;
}

export const AnimatedBalineseFiligree: React.FC<AnimatedBalineseFiligreeProps> = ({
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
          <path
            d="M2,2 L2,24 C2,16 6,10 14,8 C18,7 22,9 26,4 C22,2 14,2 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <path
            d="M2,2 L24,2 C16,2 10,6 8,14 C7,18 9,22 4,26 C2,22 2,14 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <circle cx="6" cy="6" r="2.5" fill="#FEF08A" />
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
            d="M2,2 L2,24 C2,16 6,10 14,8 C18,7 22,9 26,4 C22,2 14,2 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <path
            d="M2,2 L24,2 C16,2 10,6 8,14 C7,18 9,22 4,26 C2,22 2,14 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <circle cx="6" cy="6" r="2.5" fill="#FEF08A" />
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
            d="M2,2 L2,24 C2,16 6,10 14,8 C18,7 22,9 26,4 C22,2 14,2 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <path
            d="M2,2 L24,2 C16,2 10,6 8,14 C7,18 9,22 4,26 C2,22 2,14 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <circle cx="6" cy="6" r="2.5" fill="#FEF08A" />
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
            d="M2,2 L2,24 C2,16 6,10 14,8 C18,7 22,9 26,4 C22,2 14,2 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <path
            d="M2,2 L24,2 C16,2 10,6 8,14 C7,18 9,22 4,26 C2,22 2,14 2,2 Z"
            fill={color}
            opacity="0.85"
          />
          <circle cx="6" cy="6" r="2.5" fill="#FEF08A" />
        </svg>
      </motion.div>
    </div>
  );
};
