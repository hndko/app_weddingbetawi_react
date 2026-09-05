import React from 'react';
import { motion } from 'motion/react';

interface FloatingMusicNotesProps {
  count?: number;
  className?: string;
}

const NOTE_SYMBOLS = ['♪', '♫', '♬', '♩', '✦'];

export const FloatingMusicNotes: React.FC<FloatingMusicNotesProps> = ({ count = 9, className = '' }) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: NOTE_SYMBOLS[i % NOTE_SYMBOLS.length],
      left: `${(i * 11 + 7) % 92}%`,
      startY: 10 + (i * 10) % 80,
      duration: 5 + (i % 4) * 2,
      delay: (i * 0.7) % 3,
      size: 14 + (i % 3) * 6,
      color: i % 2 === 0 ? '#1DB954' : i % 3 === 0 ? '#1ED760' : '#E5C158',
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 select-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute font-serif drop-shadow-[0_0_8px_rgba(29,185,84,0.4)]"
          style={{
            left: p.left,
            top: `${p.startY}%`,
            fontSize: `${p.size}px`,
            color: p.color,
          }}
          animate={{
            y: [-25, 25, -25],
            x: [-12, 12, -12],
            rotate: [-15, 20, -15],
            opacity: [0.3, 0.85, 0.3],
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  );
};
