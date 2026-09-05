import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BungaJepun } from './BungaJepun';

interface FloatingJepunProps {
  className?: string;
  count?: number;
}

interface JepunItem {
  id: number;
  left: number;
  initialY: number;
  size: number;
  duration: number;
  delay: number;
  rotateFrom: number;
  rotateTo: number;
  swayX: number;
  opacity: number;
}

export const FloatingJepun: React.FC<FloatingJepunProps> = ({
  className = '',
  count = 9,
}) => {
  const petals = useMemo<JepunItem[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.round(((i * 11 + 7) % 92) + 3),
      initialY: Math.round(-30 - (i * 45) % 150),
      size: 18 + (i % 4) * 6, // 18px to 36px
      duration: 12 + (i % 5) * 3, // 12s to 24s
      delay: (i * 1.6) % 9,
      rotateFrom: (i * 45) % 360,
      rotateTo: ((i * 45) % 360) + 360,
      swayX: (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 10),
      opacity: 0.55 + (i % 3) * 0.15,
    }));
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute will-change-transform"
          style={{
            left: `${petal.left}%`,
            top: `${petal.initialY}px`,
            opacity: petal.opacity,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.swayX, -petal.swayX * 0.6, 0],
            rotate: [petal.rotateFrom, petal.rotateTo],
          }}
          transition={{
            y: {
              duration: petal.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: petal.delay,
            },
            x: {
              duration: petal.duration * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: petal.delay,
            },
            rotate: {
              duration: petal.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: petal.delay,
            },
          }}
        >
          <BungaJepun size={petal.size} />
        </motion.div>
      ))}
    </div>
  );
};
