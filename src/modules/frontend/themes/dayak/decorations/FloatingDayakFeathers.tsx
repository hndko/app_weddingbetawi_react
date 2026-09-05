import { motion } from 'motion/react';

interface Particle {
  id: number;
  startX: number;
  delay: number;
  duration: number;
  scale: number;
  rotation: number;
  isFeather: boolean;
}

const PARTICLES: Particle[] = [
  { id: 1, startX: 10, delay: 0, duration: 14, scale: 0.9, rotation: 25, isFeather: true },
  { id: 2, startX: 85, delay: 3, duration: 16, scale: 1.1, rotation: -30, isFeather: true },
  { id: 3, startX: 30, delay: 6, duration: 18, scale: 0.75, rotation: 40, isFeather: true },
  { id: 4, startX: 70, delay: 2, duration: 15, scale: 1.0, rotation: -20, isFeather: true },
  { id: 5, startX: 45, delay: 8, duration: 17, scale: 0.85, rotation: 15, isFeather: true },
  { id: 6, startX: 20, delay: 1, duration: 12, scale: 0.6, rotation: 0, isFeather: false },
  { id: 7, startX: 60, delay: 5, duration: 13, scale: 0.8, rotation: 0, isFeather: false },
  { id: 8, startX: 90, delay: 7, duration: 11, scale: 0.5, rotation: 0, isFeather: false },
];

export function FloatingDayakFeathers() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
      {PARTICLES.map((p) => {
        if (p.isFeather) {
          return (
            <motion.div
              key={p.id}
              initial={{ y: '-10%', x: `${p.startX}%`, opacity: 0, rotate: p.rotation }}
              animate={{
                y: '110vh',
                x: [`${p.startX}%`, `${p.startX + (p.id % 2 === 0 ? 8 : -8)}%`, `${p.startX}%`],
                opacity: [0, 0.75, 0.75, 0],
                rotate: [p.rotation, p.rotation + 45, p.rotation - 20],
              }}
              transition={{
                repeat: Infinity,
                duration: p.duration,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              style={{ transform: `scale(${p.scale})` }}
              className="absolute pointer-events-none"
            >
              {/* Burung Enggang Hornbill Barred Feather */}
              <svg width="24" height="60" viewBox="0 0 24 60" className="drop-shadow-xs">
                {/* Feather vane white */}
                <path
                  d="M 12,0 C 4,15 2,40 12,58 C 22,40 20,15 12,0 Z"
                  fill="#FFFBF0"
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  opacity="0.9"
                />
                {/* Black horizontal tribal bar */}
                <path
                  d="M 5,22 C 8,24 16,24 19,22 L 18,34 C 15,36 9,36 6,34 Z"
                  fill="#1C0606"
                  opacity="0.85"
                />
                {/* Central feather quill */}
                <line x1="12" y1="0" x2="12" y2="60" stroke="#AA7C11" strokeWidth="1" />
              </svg>
            </motion.div>
          );
        }

        // Amber warm spark / gold stardust
        return (
          <motion.div
            key={p.id}
            initial={{ y: '105vh', x: `${p.startX}%`, opacity: 0, scale: 0.5 }}
            animate={{
              y: '-10%',
              x: [`${p.startX}%`, `${p.startX + (p.id % 2 === 0 ? -5 : 5)}%`, `${p.startX}%`],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0.4],
            }}
            transition={{
              repeat: Infinity,
              duration: p.duration,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            className="absolute pointer-events-none w-2 h-2 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] shadow-[0_0_8px_#F59E0B]"
          />
        );
      })}
    </div>
  );
}
