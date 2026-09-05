import React, { useId } from 'react';
import { motion } from 'motion/react';

interface FloatingGoldenStardustProps {
  count?: number;
  className?: string;
}

export const FloatingGoldenStardust: React.FC<FloatingGoldenStardustProps> = ({
  count = 14,
  className = '',
}) => {
  const baseId = useId();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const isSparkle = index % 2 === 0;
      const left = (index * 7.1 + 3) % 94;
      const delay = (index * 0.8) % 5;
      const duration = 11 + ((index * 2.1) % 7);
      const size = isSparkle ? 12 + (index % 6) : 6 + (index % 4);
      const rotateDir = index % 2 === 0 ? 180 : -180;

      return {
        id: `${baseId}-${index}`,
        isSparkle,
        left,
        delay,
        duration,
        size,
        rotateDir,
      };
    });
  }, [count, baseId]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            bottom: '-25px',
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -1100],
            x: [0, (p.left % 2 === 0 ? 15 : -15), 0],
            rotate: [0, p.rotateDir],
            opacity: [0, 0.75, 0.9, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.isSparkle ? (
            /* Golden 4-point Sparkle Star */
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_5px_rgba(212,175,55,0.7)]">
              <path
                d="M 12,2 L 14,9 L 21,12 L 14,15 L 12,22 L 10,15 L 3,12 L 10,9 Z"
                fill="#D4AF37"
              />
              <circle cx="12" cy="12" r="2" fill="#FFF3C4" />
            </svg>
          ) : (
            /* Golden Ember Glow Dot */
            <div className="w-full h-full rounded-full bg-gradient-to-r from-[#FFF3C4] to-[#D4AF37] shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
