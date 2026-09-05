import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface FloatingJasmineRonceProps {
  className?: string;
  count?: number;
}

export const FloatingJasmineRonce: React.FC<FloatingJasmineRonceProps> = ({ className }) => {
  // Sacred Sundanese Melati Ronce & Parahyangan Flora Petals
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
            </svg>
          )}

          {el.type === 'sigerGold' && (
            // Siger Gold Fleck / Kilau Mahkota
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-80">
              <polygon
                points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
                fill="url(#sigerGoldGrad)"
              />
              <defs>
                <linearGradient id="sigerGoldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5E6A3" />
                  <stop offset="50%" stopColor="#D4AF37" />
                  <stop offset="100%" stopColor="#8C6D1B" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {el.type === 'leafPetal' && (
            // Kelopak Daun Suci Parahyangan (Sage Green Leaf)
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm opacity-75">
              <path
                d="M12 2 C17 6, 19 14, 12 22 C5 14, 7 6, 12 2 Z"
                fill="#4A6B5D"
                stroke="#D4AF37"
                strokeWidth="0.6"
              />
              <line x1="12" y1="4" x2="12" y2="20" stroke="#FAF8F2" strokeWidth="0.6" opacity="0.6" />
            </svg>
          )}

          {el.type === 'sparkle' && (
            // Soft Sparkling Starlight
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="drop-shadow-sm">
              <polygon
                points="10,0 12.5,7.5 20,10 12.5,12.5 10,20 7.5,12.5 0,10 7.5,7.5"
                fill="#D4AF37"
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
