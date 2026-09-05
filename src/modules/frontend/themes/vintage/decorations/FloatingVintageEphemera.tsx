import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FloatingVintageEphemeraProps {
  className?: string;
  count?: number;
}

interface EphemeraParticle {
  id: number;
  type: 'stamp' | 'paper' | 'star';
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotateStart: number;
  rotateEnd: number;
  sway: number;
}

export const FloatingVintageEphemera: React.FC<FloatingVintageEphemeraProps> = ({
  className = '',
  count = 14,
}) => {
  const particles = useMemo<EphemeraParticle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      type: i % 3 === 0 ? 'stamp' : i % 3 === 1 ? 'paper' : 'star',
      x: Math.random() * 100,
      size: i % 3 === 0 ? Math.random() * 6 + 16 : Math.random() * 6 + 10,
      duration: Math.random() * 6 + 10, // 10-16s float down
      delay: Math.random() * 5,
      rotateStart: Math.random() * 360,
      rotateEnd: Math.random() * 360 + 180,
      sway: (Math.random() - 0.5) * 45,
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
            opacity: [0, 0.75, 0.75, 0],
            rotate: [p.rotateStart, p.rotateEnd],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {p.type === 'stamp' ? (
            // Vintage Perforated Postage Stamp
            <svg
              width={p.size}
              height={p.size * 1.25}
              viewBox="0 0 20 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xs opacity-70"
            >
              <rect x="1" y="1" width="18" height="23" fill="#FAF4E8" stroke="#8B3A2B" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <rect x="3" y="3" width="14" height="19" fill="#F4EBD9" stroke="#1E1E1E" strokeWidth="0.5" />
              <circle cx="10" cy="11" r="4" fill="#8B3A2B" opacity="0.3" />
              <path d="M10 9 C9 7.5 7 7.5 7 9 C7 11 10 13 10 13 C10 13 13 11 13 9 C13 7.5 11 7.5 10 9 Z" fill="#8B3A2B" />
            </svg>
          ) : p.type === 'paper' ? (
            // Torn Newsprint Scrap
            <svg
              width={p.size}
              height={p.size * 0.8}
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xs opacity-60"
            >
              <polygon points="1,2 15,1 14,11 2,10" fill="#EAE0CE" stroke="#1E1E1E" strokeWidth="0.6" />
              <line x1="3" y1="4" x2="13" y2="3.5" stroke="#1E1E1E" strokeWidth="0.5" opacity="0.5" />
              <line x1="3" y1="7" x2="12" y2="6.5" stroke="#1E1E1E" strokeWidth="0.5" opacity="0.5" />
            </svg>
          ) : (
            // Vintage Print Star Asterisk
            <span className="text-[#8B3A2B]/60 font-serif text-sm select-none">
              ★
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};
