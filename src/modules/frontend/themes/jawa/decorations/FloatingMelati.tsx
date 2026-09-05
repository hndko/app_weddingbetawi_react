import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface FloatingMelatiProps {
  className?: string;
  count?: number;
}

export const FloatingMelati: React.FC<FloatingMelatiProps> = ({ className }) => {
  // Sacred Javanese Ronce Melati & Golden Prada Petals
  const elements = [
    { type: 'melati', x: 8, y: 15, delay: 0, duration: 9, size: 1.1 },
    { type: 'goldPetal', x: 88, y: 22, delay: 1.5, duration: 11, size: 0.9 },
    { type: 'sparkle', x: 22, y: 45, delay: 0.8, duration: 7, size: 1 },
    { type: 'melati', x: 80, y: 60, delay: 2, duration: 10, size: 1 },
    { type: 'goldPetal', x: 12, y: 75, delay: 1, duration: 8.5, size: 0.8 },
    { type: 'sparkle', x: 92, y: 82, delay: 2.5, duration: 6.5, size: 1.2 },
    { type: 'melati', x: 50, y: 90, delay: 0.3, duration: 9.5, size: 0.85 },
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
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
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
          {el.type === 'melati' && (
            // Melati Ronce Kuncup (White Jasmine Flower with gold core)
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-85">
              <path
                d="M12 2 C12 2, 14 7, 12 10 C10 7, 12 2, 12 2 Z"
                fill="#FAF8F2"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <path
                d="M12 22 C12 22, 10 17, 12 14 C14 17, 12 22, 12 22 Z"
                fill="#FAF8F2"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <path
                d="M22 12 C22 12, 17 10, 14 12 C17 14, 22 12, 22 12 Z"
                fill="#FAF8F2"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <path
                d="M2 12 C2 12, 7 14, 10 12 C7 10, 2 12, 2 12 Z"
                fill="#FAF8F2"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <circle cx="12" cy="12" r="2.5" fill="#E5C158" />
            </svg>
          )}

          {el.type === 'goldPetal' && (
            // Golden Kantil / Cempaka Kencana Petal
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-75">
              <path
                d="M12 3 C16 7, 18 14, 12 21 C6 14, 8 7, 12 3 Z"
                fill="url(#goldGrad)"
                stroke="#C5A059"
                strokeWidth="0.8"
              />
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E5C158" />
                  <stop offset="100%" stopColor="#A88236" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {el.type === 'sparkle' && (
            // Royal Prada Golden Sparkle Star
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
              <polygon
                points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
                fill="#E5C158"
                opacity="0.9"
              />
              <circle cx="12" cy="12" r="2" fill="#FAF8F2" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
