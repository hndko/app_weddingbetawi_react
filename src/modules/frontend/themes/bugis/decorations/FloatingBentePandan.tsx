import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingBentePandanProps {
  className?: string;
  count?: number;
}

interface Particle {
  id: number;
  type: 'pandan' | 'bente';
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  rotateEnd: number;
  sway: number;
}

export const FloatingBentePandan: React.FC<FloatingBentePandanProps> = ({
  className = '',
  count = 16,
}) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: i % 2 === 0 ? 'pandan' : 'bente',
      x: Math.random() * 100, // percentage across screen width
      size: i % 2 === 0 ? Math.random() * 8 + 12 : Math.random() * 4 + 5,
      duration: Math.random() * 6 + 9, // 9-15s gentle float down
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
          {p.type === 'pandan' ? (
            // Sliced Pandan Leaf Strip (Irisan Daun Pandan Wangi)
            <svg
              width={p.size}
              height={p.size * 1.8}
              viewBox="0 0 16 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm opacity-80"
            >
              <path
                d="M8 2 C13 8 15 18 12 26 C9 24 5 18 4 10 C3 6 5 3 8 2 Z"
                fill="#22C55E"
                stroke="#15803D"
                strokeWidth="0.8"
              />
              <path
                d="M8 4 L8 24"
                stroke="#166534"
                strokeWidth="0.6"
                strokeDasharray="1 1"
              />
            </svg>
          ) : (
            // Bente' (Golden Roasted Rice Grain / Beras Sangrai Sepuh Emas)
            <svg
              width={p.size}
              height={p.size * 1.6}
              viewBox="0 0 10 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm opacity-90"
            >
              <ellipse
                cx="5"
                cy="8"
                rx="3.5"
                ry="7"
                fill="#F59E0B"
                stroke="#D4AF37"
                strokeWidth="1"
              />
              <path
                d="M5 3 L5 13"
                stroke="#FFE082"
                strokeWidth="0.7"
              />
              <circle cx="5" cy="8" r="1.5" fill="#FFFDF0" opacity="0.8" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
};
