import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface FloatingJasmineRonceProps {
  className?: string;
  count?: number;
}

export const FloatingJasmineRonce: React.FC<FloatingJasmineRonceProps> = ({ className }) => {
  // Sacred Sundanese Melati Ronce & Gold Petals
  const elements = [
    { type: 'melati', x: 10, y: 12, delay: 0, duration: 9.5, size: 1.1 },
    { type: 'sigerGold', x: 86, y: 18, delay: 1.2, duration: 11, size: 0.9 },
    { type: 'leafPetal', x: 20, y: 42, delay: 0.6, duration: 8, size: 1 },
    { type: 'melati', x: 82, y: 55, delay: 2.2, duration: 10.5, size: 0.95 },
    { type: 'sigerGold', x: 14, y: 72, delay: 1.8, duration: 9, size: 0.85 },
    { type: 'sparkle', x: 90, y: 80, delay: 2.7, duration: 7, size: 1.2 },
    { type: 'leafPetal', x: 48, y: 88, delay: 0.4, duration: 9.8, size: 0.9 },
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
          {el.type === 'melati' && (
            // Melati Ronce Putih Khas Sunda (5 kelopak putih bersih bermahkota emas)
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-90">
              <path
                d="M12 2 C13.5 5, 14 7.5, 12 10 C10 7.5, 10.5 5, 12 2 Z"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="0.7"
              />
              <path
                d="M21 9 C18 10, 16 11, 14 11.5 C16 9.5, 18 8, 21 9 Z"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="0.7"
              />
              <path
                d="M18 20 C15.5 18, 14 16.5, 13 14 C15.5 14.5, 17.5 17, 18 20 Z"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="0.7"
              />
              <path
                d="M6 20 C6.5 17, 8.5 14.5, 11 14 C10 16.5, 8.5 18, 6 20 Z"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="0.7"
              />
              <path
                d="M3 9 C6 8, 8 9.5, 10 11.5 C8 11, 6 10, 3 9 Z"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="0.7"
              />
              <circle cx="12" cy="12" r="2.2" fill="#D4AF37" />
              <circle cx="12" cy="12" r="1" fill="#FFF9E0" />
            </svg>
          )}

          {el.type === 'sigerGold' && (
            // Kelopak Bunga Emas Berkilau
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="drop-shadow-xs opacity-85">
              <circle cx="10" cy="10" r="3" fill="#D4AF37" />
              <circle cx="10" cy="10" r="1.5" fill="#FFF9E0" />
              <path d="M10 2 C11 5, 11 7, 10 9 C9 7, 9 5, 10 2 Z" fill="#D4AF37" opacity="0.8" />
              <path d="M18 10 C15 11, 13 11, 11 10 C13 9, 15 9, 18 10 Z" fill="#D4AF37" opacity="0.8" />
              <path d="M10 18 C9 15, 9 13, 10 11 C11 13, 11 15, 10 18 Z" fill="#D4AF37" opacity="0.8" />
              <path d="M2 10 C5 9, 7 9, 9 10 C7 11, 5 11, 2 10 Z" fill="#D4AF37" opacity="0.8" />
            </svg>
          )}

          {el.type === 'leafPetal' && (
            // Kelopak Melati Tunggal Jatuh Melayang
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="drop-shadow-xs opacity-75">
              <path
                d="M8 1 C11 4, 13 8, 8 15 C3 8, 5 4, 8 1 Z"
                fill="#FFFFFF"
                stroke="#E6D5B8"
                strokeWidth="0.8"
              />
            </svg>
          )}

          {el.type === 'sparkle' && (
            // Kilau Cahaya Keemasan
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="drop-shadow-xs opacity-80">
              <path
                d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z"
                fill="#D4AF37"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
