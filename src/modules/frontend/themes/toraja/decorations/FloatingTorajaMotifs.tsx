import React, { useId } from 'react';
import { motion } from 'motion/react';

interface FloatingTorajaMotifsProps {
  count?: number;
  className?: string;
}

export const FloatingTorajaMotifs: React.FC<FloatingTorajaMotifsProps> = ({
  count = 12,
  className = '',
}) => {
  const baseId = useId();

  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, index) => {
      const type = index % 3; // 0: Horn Spiral (Pa'tedong), 1: Sunburst (Pa'barre Allo), 2: Kandaure Bead
      const left = (index * 8.3 + 4) % 94;
      const delay = (index * 1.1) % 6;
      const duration = 12 + ((index * 2.7) % 8);
      const size = type === 2 ? 10 + (index % 5) : 18 + (index % 10);
      const initialY = 100 + ((index * 15) % 30);
      const rotateDir = index % 2 === 0 ? 360 : -360;

      return {
        id: `${baseId}-${index}`,
        type,
        left,
        delay,
        duration,
        size,
        initialY,
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
            bottom: '-40px',
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -1100],
            x: [0, (p.left % 2 === 0 ? 25 : -25), 0],
            rotate: [0, p.rotateDir],
            opacity: [0, 0.7, 0.8, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        >
          {p.type === 0 ? (
            /* Pa'tedong Curved Buffalo Horn Motif */
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
              <path
                d="M 2,8 C 7,16 12,16 12,16 C 12,16 17,16 22,8 C 17,12 12,12 12,12 C 12,12 7,12 2,8 Z"
                fill="#E5A93C"
                opacity="0.8"
              />
              <circle cx="12" cy="17" r="1.5" fill="#FFF2B2" />
            </svg>
          ) : p.type === 1 ? (
            /* Pa'barre Allo Sun Motif */
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm">
              <circle cx="12" cy="12" r="6" fill="none" stroke="#E5A93C" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="2.5" fill="#8B1E19" />
              <line x1="12" y1="2" x2="12" y2="5" stroke="#E5A93C" strokeWidth="1.2" />
              <line x1="12" y1="19" x2="12" y2="22" stroke="#E5A93C" strokeWidth="1.2" />
              <line x1="2" y1="12" x2="5" y2="12" stroke="#E5A93C" strokeWidth="1.2" />
              <line x1="19" y1="12" x2="22" y2="12" stroke="#E5A93C" strokeWidth="1.2" />
            </svg>
          ) : (
            /* Kandaure Golden Bead */
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FFF2B2] via-[#E5A93C] to-[#8B1E19] shadow-xs opacity-75" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
