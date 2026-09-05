import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface FloatingSongketPetalsProps {
  className?: string;
  count?: number;
}

export const FloatingSongketPetals: React.FC<FloatingSongketPetalsProps> = ({ className }) => {
  // Traditional Minang Golden Songket Spangles & Cempaka Floral Petals
  const elements = [
    { type: 'goldSpangle', x: 12, y: 14, delay: 0, duration: 9.5, size: 1.1 },
    { type: 'cempakaPetal', x: 84, y: 18, delay: 1.2, duration: 11, size: 0.95 },
    { type: 'sparkle', x: 18, y: 42, delay: 0.6, duration: 7.2, size: 1 },
    { type: 'goldSpangle', x: 86, y: 55, delay: 2.1, duration: 10.2, size: 0.9 },
    { type: 'cempakaPetal', x: 15, y: 74, delay: 1.8, duration: 9.2, size: 0.85 },
    { type: 'sparkle', x: 88, y: 82, delay: 2.5, duration: 6.8, size: 1.2 },
    { type: 'goldSpangle', x: 50, y: 88, delay: 0.5, duration: 9.6, size: 1.0 },
  ];

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden z-10", className)}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${el.x}%`, top: `${el.y}%` }}
          animate={{
            y: [0, -22, 0],
            x: [0, (i % 2 === 0 ? 9 : -9), 0],
            rotate: [0, (i % 2 === 0 ? 180 : -180), (i % 2 === 0 ? 360 : -360)],
            scale: [el.size, el.size * 1.18, el.size],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === 'goldSpangle' && (
            // Golden Songket Diamond Payet Spangle
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-90">
              <polygon
                points="12,2 22,12 12,22 2,12"
                fill="#D4AF37"
                stroke="#FFF3C4"
                strokeWidth="1"
              />
              <polygon
                points="12,6 18,12 12,18 6,12"
                fill="#7B1122"
              />
              <circle cx="12" cy="12" r="2" fill="#FFF3C4" />
            </svg>
          )}

          {el.type === 'cempakaPetal' && (
            // Silky Ivory Cempaka Petal
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-80">
              <path
                d="M12,2 C17,6 20,13 17,19 C14,23 10,23 7,19 C4,13 7,6 12,2 Z"
                fill="#FFF9F0"
                stroke="#D4AF37"
                strokeWidth="0.8"
              />
              <path d="M12,6 L12,18" stroke="#D4AF37" strokeWidth="0.6" opacity="0.6" />
            </svg>
          )}

          {el.type === 'sparkle' && (
            // Golden Radiant Sparkle
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="opacity-75">
              <path
                d="M8,0 L9.5,6.5 L16,8 L9.5,9.5 L8,16 L6.5,9.5 L0,8 L6.5,6.5 Z"
                fill="#FFF3C4"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
