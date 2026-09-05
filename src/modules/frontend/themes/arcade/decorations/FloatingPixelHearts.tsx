import React, { useId } from 'react';
import { motion } from 'motion/react';

interface FloatingPixelHeartsProps {
  count?: number;
  className?: string;
}

export const FloatingPixelHearts: React.FC<FloatingPixelHeartsProps> = ({
  count = 12,
  className = '',
}) => {
  const baseId = useId();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const isHeart = index % 2 === 0;
      const left = (index * 8.3 + 3) % 94;
      const delay = (index * 0.9) % 5;
      const duration = 10 + ((index * 2.3) % 8);
      const size = isHeart ? 16 + (index % 8) : 14 + (index % 6);
      const rotateDir = index % 2 === 0 ? 360 : -360;

      return {
        id: `${baseId}-${index}`,
        isHeart,
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
            bottom: '-30px',
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -1100],
            x: [0, (p.left % 2 === 0 ? 20 : -20), 0],
            rotate: [0, p.rotateDir],
            opacity: [0, 0.8, 0.9, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.isHeart ? (
            /* 8-Bit Pixel Heart */
            <svg viewBox="0 0 16 16" className="w-full h-full drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]">
              <rect x="2" y="2" width="3" height="2" fill="#F43F5E" />
              <rect x="5" y="2" width="2" height="2" fill="#F43F5E" />
              <rect x="9" y="2" width="2" height="2" fill="#F43F5E" />
              <rect x="11" y="2" width="3" height="2" fill="#F43F5E" />
              <rect x="1" y="4" width="14" height="4" fill="#F43F5E" />
              <rect x="3" y="4" width="2" height="2" fill="#FDA4AF" />
              <rect x="2" y="8" width="12" height="2" fill="#E11D48" />
              <rect x="4" y="10" width="8" height="2" fill="#BE123C" />
              <rect x="6" y="12" width="4" height="2" fill="#9F1239" />
              <rect x="7" y="14" width="2" height="1" fill="#881337" />
            </svg>
          ) : (
            /* 8-Bit Gold Coin */
            <div className="w-full h-full rounded-sm bg-[#F59E0B] border border-[#FDE68A] shadow-[0_0_6px_rgba(245,158,11,0.5)] flex items-center justify-center text-[8px] font-mono font-bold text-[#78350F]">
              ★
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
