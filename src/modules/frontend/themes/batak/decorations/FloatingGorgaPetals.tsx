import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingGorgaPetalsProps {
  className?: string;
  count?: number;
}

interface PetalItem {
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
  variant: 'gold_thread' | 'sirih_leaf' | 'ruby_spark';
}

export const FloatingGorgaPetals: React.FC<FloatingGorgaPetalsProps> = ({
  className = '',
  count = 10,
}) => {
  const petals = useMemo<PetalItem[]>(() => {
    const variants: Array<'gold_thread' | 'sirih_leaf' | 'ruby_spark'> = [
      'gold_thread',
      'sirih_leaf',
      'ruby_spark',
    ];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.round(((i * 13 + 5) % 92) + 4),
      initialY: Math.round(-30 - (i * 40) % 140),
      size: 16 + (i % 3) * 6, // 16px to 28px
      duration: 12 + (i % 4) * 3, // 12s to 21s
      delay: (i * 1.5) % 8,
      rotateFrom: (i * 40) % 360,
      rotateTo: ((i * 40) % 360) + 360,
      swayX: (i % 2 === 0 ? 1 : -1) * (14 + (i % 3) * 8),
      opacity: 0.5 + (i % 3) * 0.15,
      variant: variants[i % variants.length],
    }));
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-10 ${className}`}>
      {petals.map((item) => (
        <motion.div
          key={item.id}
          className="absolute will-change-transform"
          style={{
            left: `${item.left}%`,
            top: `${item.initialY}px`,
            opacity: item.opacity,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, item.swayX, -item.swayX * 0.7, 0],
            rotate: [item.rotateFrom, item.rotateTo],
          }}
          transition={{
            y: {
              duration: item.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: item.delay,
            },
            x: {
              duration: item.duration * 0.6,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: item.delay,
            },
            rotate: {
              duration: item.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: item.delay,
            },
          }}
        >
          {item.variant === 'gold_thread' ? (
            /* Golden Ulos Diamond Thread */
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none">
              <path
                d="M12,2 L22,12 L12,22 L2,12 Z"
                fill="#D4AF37"
                stroke="#FFF3C4"
                strokeWidth="1"
                opacity="0.85"
              />
              <circle cx="12" cy="12" r="2.5" fill="#7A1B1E" />
            </svg>
          ) : item.variant === 'sirih_leaf' ? (
            /* Traditional Batak Demban / Sirih Leaf */
            <svg width={item.size} height={item.size} viewBox="0 0 24 24" fill="none">
              <path
                d="M12,2 C18,6 22,12 18,18 C14,24 6,20 4,14 C2,8 8,4 12,2 Z"
                fill="#4A6B5D"
                stroke="#D4AF37"
                strokeWidth="0.8"
                opacity="0.8"
              />
              <line x1="12" y1="4" x2="12" y2="18" stroke="#D4AF37" strokeWidth="0.6" />
            </svg>
          ) : (
            /* Crimson Ruby Sparkle */
            <svg width={item.size * 0.8} height={item.size * 0.8} viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="6" fill="#7A1B1E" stroke="#D4AF37" strokeWidth="1.2" />
              <circle cx="10" cy="10" r="2.5" fill="#FFF3C4" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
