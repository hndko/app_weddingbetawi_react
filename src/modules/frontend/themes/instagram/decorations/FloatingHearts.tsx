import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface FloatingHeartsProps {
  count?: number;
  className?: string;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  count = 6,
  className = '',
}) => {
  const hearts = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 8) % 92}%`,
    bottom: `${(i * 12 + 5) % 30}%`,
    size: 14 + (i % 3) * 6,
    delay: i * 0.8,
    duration: 5 + (i % 3) * 2,
    color: i % 2 === 0 ? '#FF0069' : '#D300C5',
  }));

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{
            left: h.left,
            bottom: h.bottom,
            color: h.color,
          }}
          animate={{
            y: [-20, -180, -320],
            x: [-8, 12, -8],
            scale: [0.6, 1.2, 0.8],
            opacity: [0, 0.7, 0],
            rotate: [-15, 15, -10],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: 'easeOut',
          }}
        >
          <Heart size={h.size} fill={h.color} />
        </motion.div>
      ))}
    </div>
  );
};
