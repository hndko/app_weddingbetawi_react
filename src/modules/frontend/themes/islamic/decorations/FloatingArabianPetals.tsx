import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface FloatingArabianPetalsProps {
  className?: string;
  count?: number;
}

export const FloatingArabianPetals: React.FC<FloatingArabianPetalsProps> = ({ className }) => {
  // Sacred Arabian Garden Golden Stars & Silky Jasmine/Rose Petals
  const elements = [
    { type: 'goldStar', x: 10, y: 12, delay: 0, duration: 9.5, size: 1.1 },
    { type: 'petal', x: 86, y: 18, delay: 1.2, duration: 11, size: 0.9 },
    { type: 'sparkle', x: 20, y: 44, delay: 0.6, duration: 7.5, size: 1 },
    { type: 'goldStar', x: 82, y: 56, delay: 2.2, duration: 10, size: 0.95 },
    { type: 'petal', x: 14, y: 72, delay: 1.8, duration: 9, size: 0.85 },
    { type: 'sparkle', x: 90, y: 80, delay: 2.7, duration: 6.8, size: 1.2 },
    { type: 'goldStar', x: 48, y: 88, delay: 0.4, duration: 9.8, size: 0.9 },
  ];

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden z-10", className)}>
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${el.x}%`, top: `${el.y}%` }}
          animate={{
            y: [0, -20, 0],
            x: [0, (i % 2 === 0 ? 8 : -8), 0],
            rotate: [0, (i % 2 === 0 ? 180 : -180), (i % 2 === 0 ? 360 : -360)],
            scale: [el.size, el.size * 1.15, el.size],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === 'goldStar' && (
            // Sacred 8-Pointed Islamic Star (Rub el Hizb)
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-85">
              <g transform="translate(12, 12) scale(0.65)">
                <rect x="-8" y="-8" width="16" height="16" fill="#E5C158" stroke="#A47E28" strokeWidth="0.8" />
                <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" fill="#E5C158" stroke="#A47E28" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="2.5" fill="#FAF6EE" />
              </g>
            </svg>
          )}

          {el.type === 'petal' && (
            // Silky Jasmine / White Rose Petal
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-xs opacity-75">
              <path
                d="M12 2 C17 7, 18 15, 12 21 C6 15, 7 7, 12 2 Z"
                fill="#FFFDF7"
                stroke="#C5A059"
                strokeWidth="0.7"
              />
              <line x1="12" y1="4" x2="12" y2="19" stroke="#E5C158" strokeWidth="0.5" opacity="0.6" />
            </svg>
          )}

          {el.type === 'sparkle' && (
            // Starlight Sparkle Spore
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="drop-shadow-sm">
              <polygon
                points="10,0 12.5,7.5 20,10 12.5,12.5 10,20 7.5,12.5 0,10 7.5,7.5"
                fill="#E5C158"
                opacity="0.9"
              />
              <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
