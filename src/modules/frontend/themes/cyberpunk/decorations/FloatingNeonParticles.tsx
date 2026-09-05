import { motion } from 'motion/react';

interface CyberParticle {
  id: number;
  startX: number;
  delay: number;
  duration: number;
  scale: number;
  type: 'hex' | 'bit' | 'cross';
  color: string;
}

const PARTICLES: CyberParticle[] = [
  { id: 1, startX: 12, delay: 0, duration: 10, scale: 0.9, type: 'hex', color: '#00F0FF' },
  { id: 2, startX: 82, delay: 2, duration: 12, scale: 1.1, type: 'hex', color: '#FF007F' },
  { id: 3, startX: 25, delay: 5, duration: 9, scale: 0.8, type: 'bit', color: '#00F0FF' },
  { id: 4, startX: 72, delay: 3, duration: 11, scale: 0.9, type: 'cross', color: '#FFE600' },
  { id: 5, startX: 45, delay: 7, duration: 13, scale: 1.0, type: 'hex', color: '#00F0FF' },
  { id: 6, startX: 60, delay: 1, duration: 8, scale: 0.7, type: 'bit', color: '#FF007F' },
  { id: 7, startX: 90, delay: 4, duration: 10, scale: 0.85, type: 'cross', color: '#00F0FF' },
  { id: 8, startX: 35, delay: 6, duration: 12, scale: 0.75, type: 'bit', color: '#FFE600' },
];

export function FloatingNeonParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '105vh', x: `${p.startX}%`, opacity: 0, scale: 0.4 }}
          animate={{
            y: '-10%',
            x: [`${p.startX}%`, `${p.startX + (p.id % 2 === 0 ? 6 : -6)}%`, `${p.startX}%`],
            opacity: [0, 0.75, 0.75, 0],
            scale: [0.4, p.scale, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
          }}
          className="absolute pointer-events-none"
        >
          {p.type === 'hex' && (
            <svg width="18" height="18" viewBox="0 0 24 24" className="drop-shadow-[0_0_8px_currentColor]">
              <polygon
                points="12,2 22,7.5 22,18.5 12,24 2,18.5 2,7.5"
                fill="none"
                stroke={p.color}
                strokeWidth="1.5"
              />
            </svg>
          )}

          {p.type === 'bit' && (
            <span
              className="font-mono text-[10px] font-bold select-none drop-shadow-[0_0_6px_currentColor]"
              style={{ color: p.color }}
            >
              {p.id % 2 === 0 ? '01' : '10'}
            </span>
          )}

          {p.type === 'cross' && (
            <svg width="14" height="14" viewBox="0 0 14 14" className="drop-shadow-[0_0_6px_currentColor]">
              <line x1="7" y1="1" x2="7" y2="13" stroke={p.color} strokeWidth="1.5" />
              <line x1="1" y1="7" x2="13" y2="7" stroke={p.color} strokeWidth="1.5" />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}
