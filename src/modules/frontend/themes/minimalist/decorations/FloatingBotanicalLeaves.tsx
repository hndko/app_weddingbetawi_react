import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../../../../utils/cn';

interface FloatingBotanicalLeavesProps {
  className?: string;
  count?: number;
}

export const FloatingBotanicalLeaves: React.FC<FloatingBotanicalLeavesProps> = ({ className }) => {
  // Modern Botanical Leaves & Soft Gold Spores
  const elements = [
    { type: 'eucalyptus', x: 8, y: 15, delay: 0, duration: 10, size: 1 },
    { type: 'olive', x: 88, y: 22, delay: 1.2, duration: 11.5, size: 0.9 },
    { type: 'goldSpore', x: 22, y: 45, delay: 0.7, duration: 8, size: 1.1 },
    { type: 'eucalyptus', x: 82, y: 58, delay: 2.1, duration: 10.5, size: 0.95 },
    { type: 'olive', x: 14, y: 72, delay: 1.5, duration: 9.5, size: 0.85 },
    { type: 'goldSpore', x: 90, y: 82, delay: 2.4, duration: 7.5, size: 1.2 },
    { type: 'eucalyptus', x: 50, y: 90, delay: 0.3, duration: 10, size: 0.9 },
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
            rotate: [0, (i % 2 === 0 ? 160 : -160), (i % 2 === 0 ? 320 : -320)],
            scale: [el.size, el.size * 1.12, el.size],
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: el.delay,
          }}
        >
          {el.type === 'eucalyptus' && (
            // Eucalyptus Rounded Leaf
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="drop-shadow-xs opacity-75">
              <path
                d="M12 2 C18 6, 21 15, 12 22 C3 15, 6 6, 12 2 Z"
                fill="#9AA79C"
                stroke="#2D3748"
                strokeWidth="0.7"
              />
              <line x1="12" y1="3" x2="12" y2="20" stroke="#718096" strokeWidth="0.6" opacity="0.6" />
            </svg>
          )}

          {el.type === 'olive' && (
            // Olive Elongated Leaf
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-xs opacity-70">
              <path
                d="M12 3 C16 8, 17 16, 12 21 C7 16, 8 8, 12 3 Z"
                fill="#8A998C"
                stroke="#2D3748"
                strokeWidth="0.7"
              />
              <line x1="12" y1="5" x2="12" y2="19" stroke="#BAC7BC" strokeWidth="0.6" />
            </svg>
          )}

          {el.type === 'goldSpore' && (
            // Soft Golden Botanical Stardust
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className="drop-shadow-xs">
              <polygon
                points="10,0 12.5,7.5 20,10 12.5,12.5 10,20 7.5,12.5 0,10 7.5,7.5"
                fill="#D4AF37"
                opacity="0.85"
              />
              <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
