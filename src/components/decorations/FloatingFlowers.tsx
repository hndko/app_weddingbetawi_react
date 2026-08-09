import { motion } from 'motion/react';
import { cn } from '../../utils/cn';

interface FloatingFlowersProps {
  className?: string;
}

export function FloatingFlowers({ className }: FloatingFlowersProps) {
  const flowers = [
    { x: 10, y: 20, color: 'var(--color-betawi-red)', delay: 0, size: 1.2 },
    { x: 80, y: 40, color: 'var(--color-gold)', delay: 1, size: 0.8 },
    { x: 30, y: 70, color: 'var(--color-sage-soft)', delay: 2, size: 1 },
    { x: 70, y: 80, color: 'var(--color-blue-accent)', delay: 0.5, size: 0.9 },
    { x: 50, y: 15, color: 'var(--color-betawi-red)', delay: 1.5, size: 0.7 },
  ];

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      {flowers.map((f, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [f.size, f.size * 1.2, f.size]
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "linear",
            delay: f.delay
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
            <path d="M12 2C12 2 15 8 12 11C9 8 12 2 12 2Z" fill={f.color} opacity="0.8"/>
            <path d="M12 22C12 22 9 16 12 13C15 16 12 22 12 22Z" fill={f.color} opacity="0.8"/>
            <path d="M22 12C22 12 16 9 13 12C16 15 22 12 22 12Z" fill={f.color} opacity="0.8"/>
            <path d="M2 12C2 12 8 15 11 12C8 9 2 12 2 12Z" fill={f.color} opacity="0.8"/>
            <circle cx="12" cy="12" r="3" fill="var(--color-gold)"/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
