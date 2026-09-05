import React from 'react';
import { motion } from 'motion/react';

interface AnimatedSpotifyCornerProps {
  color?: string;
  className?: string;
}

export const AnimatedSpotifyCorner: React.FC<AnimatedSpotifyCornerProps> = ({
  color = '#1DB954',
  className = '',
}) => {
  return (
    <div className={`pointer-events-none z-20 select-none ${className}`}>
      {/* Top Left Neon Soundwave Corner */}
      <motion.div
        className="absolute top-2 left-2 w-16 h-16 pointer-events-none"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]">
          <path d="M4 30 C4 15.64 15.64 4 30 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 42 C4 21.01 21.01 4 42 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M4 54 C4 26.38 26.38 4 54 4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <circle cx="4" cy="4" r="2.5" fill={color} />
        </svg>
      </motion.div>

      {/* Top Right Neon Soundwave Corner */}
      <motion.div
        className="absolute top-2 right-2 w-16 h-16 pointer-events-none rotate-90"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]">
          <path d="M4 30 C4 15.64 15.64 4 30 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 42 C4 21.01 21.01 4 42 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M4 54 C4 26.38 26.38 4 54 4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <circle cx="4" cy="4" r="2.5" fill={color} />
        </svg>
      </motion.div>

      {/* Bottom Left Neon Soundwave Corner */}
      <motion.div
        className="absolute bottom-2 left-2 w-16 h-16 pointer-events-none -rotate-90"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]">
          <path d="M4 30 C4 15.64 15.64 4 30 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 42 C4 21.01 21.01 4 42 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M4 54 C4 26.38 26.38 4 54 4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <circle cx="4" cy="4" r="2.5" fill={color} />
        </svg>
      </motion.div>

      {/* Bottom Right Neon Soundwave Corner */}
      <motion.div
        className="absolute bottom-2 right-2 w-16 h-16 pointer-events-none rotate-180"
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2.4 }}
      >
        <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(29,185,84,0.5)]">
          <path d="M4 30 C4 15.64 15.64 4 30 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d="M4 42 C4 21.01 21.01 4 42 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <path d="M4 54 C4 26.38 26.38 4 54 4" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <circle cx="4" cy="4" r="2.5" fill={color} />
        </svg>
      </motion.div>
    </div>
  );
};
