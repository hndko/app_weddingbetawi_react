import React from 'react';
import { motion } from 'motion/react';

interface SoundwaveVisualizerProps {
  barCount?: number;
  height?: number;
  className?: string;
  color?: string;
}

export const SoundwaveVisualizer: React.FC<SoundwaveVisualizerProps> = ({
  barCount = 7,
  height = 28,
  className = '',
  color = '#1DB954',
}) => {
  const bars = Array.from({ length: barCount });

  return (
    <div className={`flex items-end justify-center gap-1.5 ${className}`} style={{ height: `${height}px` }}>
      {bars.map((_, i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full shadow-[0_0_6px_rgba(29,185,84,0.6)]"
          style={{ backgroundColor: color }}
          animate={{
            height: [
              `${Math.max(4, Math.round(height * (0.2 + ((i * 3) % 5) * 0.15)))}px`,
              `${Math.round(height * (0.6 + ((i * 4) % 4) * 0.12))}px`,
              `${Math.max(4, Math.round(height * (0.3 + ((i * 2) % 4) * 0.15)))}px`,
            ],
          }}
          transition={{
            duration: 0.8 + (i % 3) * 0.3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}
    </div>
  );
};
