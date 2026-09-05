import React from 'react';
import { motion } from 'motion/react';

interface AnimatedNetflixCornerProps {
  color?: string;
  className?: string;
}

export const AnimatedNetflixCorner: React.FC<AnimatedNetflixCornerProps> = ({
  color = '#E50914',
  className = '',
}) => {
  return (
    <div className={`pointer-events-none z-20 select-none ${className}`}>
      {/* Top Left Viewfinder Corner */}
      <motion.div
        className="absolute top-2 left-2 w-12 h-12 pointer-events-none"
        animate={{ opacity: [0.4, 0.95, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]">
          <path d="M2 18 L2 2 L18 2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="#E5C158" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <circle cx="2" cy="2" r="2" fill={color} />
        </svg>
      </motion.div>

      {/* Top Right Viewfinder Corner */}
      <motion.div
        className="absolute top-2 right-2 w-12 h-12 pointer-events-none rotate-90"
        animate={{ opacity: [0.4, 0.95, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]">
          <path d="M2 18 L2 2 L18 2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="#E5C158" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <circle cx="2" cy="2" r="2" fill={color} />
        </svg>
      </motion.div>

      {/* Bottom Left Viewfinder Corner */}
      <motion.div
        className="absolute bottom-2 left-2 w-12 h-12 pointer-events-none -rotate-90"
        animate={{ opacity: [0.4, 0.95, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]">
          <path d="M2 18 L2 2 L18 2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="#E5C158" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <circle cx="2" cy="2" r="2" fill={color} />
        </svg>
      </motion.div>

      {/* Bottom Right Viewfinder Corner */}
      <motion.div
        className="absolute bottom-2 right-2 w-12 h-12 pointer-events-none rotate-180"
        animate={{ opacity: [0.4, 0.95, 0.4] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_6px_rgba(229,9,20,0.6)]">
          <path d="M2 18 L2 2 L18 2" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="16" y2="8" stroke="#E5C158" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
          <circle cx="2" cy="2" r="2" fill={color} />
        </svg>
      </motion.div>
    </div>
  );
};
