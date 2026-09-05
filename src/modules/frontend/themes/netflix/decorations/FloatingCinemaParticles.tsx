import React from 'react';
import { motion } from 'motion/react';

interface FloatingCinemaParticlesProps {
  count?: number;
  className?: string;
}

const CINEMA_SYMBOLS = ['★', '✦', '✧', '♦', '✦'];

export const FloatingCinemaParticles: React.FC<FloatingCinemaParticlesProps> = ({
  count = 9,
  className = '',
}) => {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: CINEMA_SYMBOLS[i % CINEMA_SYMBOLS.length],
      left: `${(i * 12 + 6) % 94}%`,
      startY: 12 + (i * 9) % 78,
      duration: 5.5 + (i % 4) * 2,
      delay: (i * 0.8) % 3,
      size: 13 + (i % 3) * 5,
      color: i % 2 === 0 ? '#E50914' : '#E5C158',
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-10 select-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute font-serif drop-shadow-[0_0_8px_rgba(229,9,20,0.5)]"
          style={{
            left: p.left,
            top: `${p.startY}%`,
            fontSize: `${p.size}px`,
            color: p.color,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [-20, 25, -20],
            opacity: [0.25, 0.85, 0.25],
            scale: [0.85, 1.2, 0.85],
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
