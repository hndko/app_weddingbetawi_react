import { motion } from 'motion/react';
import { cn } from '../../../../utils/cn';

interface Props {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function AnimatedFloralVines({ className, position = 'top-left' }: Props) {
  const getTransform = () => {
    switch(position) {
      case 'top-left': return 'scale(1, 1)';
      case 'top-right': return 'scale(-1, 1)';
      case 'bottom-left': return 'scale(1, -1)';
      case 'bottom-right': return 'scale(-1, -1)';
      default: return 'scale(1, 1)';
    }
  };

  return (
    <motion.div 
      className={cn("absolute z-10 pointer-events-none drop-shadow-sm", className)}
      style={{ transform: getTransform(), transformOrigin: 'center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <motion.div
         animate={{ rotate: [-1.5, 1.5, -1.5] }}
         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
         style={{ originX: 0, originY: 0 }}
         className="w-[180px] h-[280px] md:w-[220px] md:h-[320px] opacity-80"
      >
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
          {/* Main Stem - Batik style curves */}
          <path d="M -10 -10 C 30 40, 0 100, 60 160 C 100 200, 70 260, 100 320" stroke="var(--color-sage-dark)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Branch 1 */}
          <path d="M 20 40 C 60 40, 80 60, 120 70" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Branch 2 */}
          <path d="M 30 130 C 10 150, 0 180, -20 200" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Branch 3 */}
          <path d="M 85 220 C 130 210, 140 250, 160 270" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Kembang Kelapa (Coconut Flower) Spikes */}
          <g strokeWidth="1" strokeLinecap="round" opacity="0.9">
            {/* Cluster 1 */}
            <path d="M 50 100 L 70 80" stroke="var(--color-gold)" />
            <circle cx="70" cy="80" r="2.5" fill="var(--color-betawi-red)" />
            <path d="M 55 105 L 80 100" stroke="var(--color-sage)" />
            <circle cx="80" cy="100" r="2.5" fill="var(--color-gold)" />
            <path d="M 50 110 L 65 125" stroke="var(--color-betawi-red)" />
            <circle cx="65" cy="125" r="2.5" fill="var(--color-sage)" />

            {/* Cluster 2 */}
            <path d="M 80 200 L 105 185" stroke="var(--color-gold)" />
            <circle cx="105" cy="185" r="2.5" fill="var(--color-betawi-red)" />
            <path d="M 85 205 L 115 205" stroke="var(--color-sage)" />
            <circle cx="115" cy="205" r="2.5" fill="var(--color-gold)" />
            <path d="M 75 210 L 95 235" stroke="var(--color-betawi-red)" />
            <circle cx="95" cy="235" r="2.5" fill="var(--color-sage)" />
          </g>

          {/* Leaves - Batik style */}
          <g fill="var(--color-sage)" opacity="0.85">
            <path d="M 20 40 C 40 20, 50 30, 45 45 C 30 55, 10 50, 20 40 Z" />
            <path d="M 120 70 C 135 50, 150 60, 140 80 C 125 100, 105 90, 120 70 Z" />
            <path d="M 30 130 C 15 110, 0 115, 15 135 C 30 155, 45 150, 30 130 Z" />
            <path d="M 160 270 C 175 250, 190 260, 175 280 C 160 300, 145 290, 160 270 Z" />
          </g>

          {/* Tapak Dara Flowers (Betawi Traditional) */}
          <g>
            {/* Flower 1 */}
            <g transform="translate(120, 70) scale(1)">
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(0)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(72)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(144)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(216)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(288)" />
              <circle cx="0" cy="0" r="3" fill="var(--color-gold)" />
            </g>
            
            {/* Flower 2 */}
            <g transform="translate(-20, 200) scale(0.8)">
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(0)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(72)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(144)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(216)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(288)" />
              <circle cx="0" cy="0" r="3" fill="var(--color-gold)" />
            </g>

            {/* Flower 3 */}
            <g transform="translate(160, 270) scale(1.1)">
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(0)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(72)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(144)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(216)" />
              <path d="M 0 0 C 10 -15, 15 -10, 0 -5 C -15 -10, -10 -15, 0 0 Z" fill="var(--color-betawi-red)" transform="rotate(288)" />
              <circle cx="0" cy="0" r="3" fill="var(--color-gold)" />
            </g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
