import React from 'react';
import { motion } from 'motion/react';

interface FloatingAppleParticlesProps {
  count?: number;
  className?: string;
}

export const FloatingAppleParticles: React.FC<FloatingAppleParticlesProps> = ({
  count = 6,
  className = '',
}) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 18 + 7) % 95}%`,
    top: `${(i * 22 + 10) % 90}%`,
    size: 6 + (i % 4) * 3,
    delay: i * 0.7,
    duration: 7 + (i % 3) * 3,
    color: i % 2 === 0 ? 'rgba(0, 122, 255, 0.25)' : 'rgba(212, 175, 55, 0.3)',
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full backdrop-blur-xs blur-[0.5px]"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [-15, 20, -15],
            x: [-10, 12, -10],
            scale: [0.9, 1.25, 0.9],
            opacity: [0.25, 0.65, 0.25],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};
