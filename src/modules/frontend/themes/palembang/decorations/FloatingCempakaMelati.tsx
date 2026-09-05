import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingCempakaMelatiProps {
  className?: string;
  count?: number;
}

interface FlowerParticle {
  id: number;
  type: 'cempaka' | 'melati';
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  rotateEnd: number;
  sway: number;
}

export const FloatingCempakaMelati: React.FC<FloatingCempakaMelatiProps> = ({
  className = '',
  count = 16,
}) => {
  const particles = useMemo<FlowerParticle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: i % 2 === 0 ? 'cempaka' : 'melati',
      x: Math.random() * 100,
      size: i % 2 === 0 ? Math.random() * 8 + 14 : Math.random() * 6 + 10,
      duration: Math.random() * 6 + 9, // 9-15s gentle float
      delay: Math.random() * 5,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 180,
      sway: (Math.random() - 0.5) * 50,
    }));
  }, [count]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-30 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-[-40px]"
          style={{ left: `${p.x}%` }}
          initial={{ y: -40, opacity: 0, rotate: p.rotateStart }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, p.sway, -p.sway, 0],
            opacity: [0, 0.85, 0.85, 0],
            rotate: [p.rotateStart, p.rotateEnd],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.type === 'cempaka' ? (
            // Bunga Cempaka Emas Palembang (Golden Magnolia Petals)
            <svg
              width={p.size}
              height={p.size * 1.5}
              viewBox="0 0 16 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm opacity-85"
            >
              <path
                d="M8 2 C13 6 15 16 11 22 C8 21 4 16 3 9 C3 5 5 3 8 2 Z"
                fill="#FFE082"
                stroke="#D4AF37"
                strokeWidth="0.8"
              />
              <path
                d="M8 4 L8 20"
                stroke="#F59E0B"
                strokeWidth="0.6"
              />
              <circle cx="8" cy="8" r="1.5" fill="#FFFDF0" />
            </svg>
          ) : (
            // Bunga Melati Putih Sriwijaya (Jasmine Blossom)
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm opacity-90"
            >
              <circle cx="10" cy="10" r="2.5" fill="#F59E0B" />
              {/* 5 rounded white petals */}
              <ellipse cx="10" cy="5" rx="2.5" ry="4" fill="#FAF5EE" stroke="#E2D9CC" strokeWidth="0.5" />
              <ellipse cx="10" cy="15" rx="2.5" ry="4" fill="#FAF5EE" stroke="#E2D9CC" strokeWidth="0.5" />
              <ellipse cx="5" cy="10" rx="4" ry="2.5" fill="#FAF5EE" stroke="#E2D9CC" strokeWidth="0.5" />
              <ellipse cx="15" cy="10" rx="4" ry="2.5" fill="#FAF5EE" stroke="#E2D9CC" strokeWidth="0.5" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
