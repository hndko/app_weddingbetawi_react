import { motion } from 'motion/react';

interface AnimatedCircuitFiligreeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function AnimatedCircuitFiligree({
  position = 'top-left',
  className = '',
}: AnimatedCircuitFiligreeProps) {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');

  const transformStyle = `${isTop ? '' : 'scale-y-[-1]'} ${isLeft ? '' : 'scale-x-[-1]'}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      transition={{ duration: 1 }}
      className={`pointer-events-none absolute z-30 ${className}`}
      style={{
        top: isTop ? 0 : 'auto',
        bottom: !isTop ? 0 : 'auto',
        left: isLeft ? 0 : 'auto',
        right: !isLeft ? 0 : 'auto',
      }}
    >
      <motion.svg
        animate={{
          opacity: [0.75, 1, 0.75],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: 'easeInOut',
        }}
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transform origin-top-left ${transformStyle} drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]`}
      >
        <defs>
          <linearGradient id="circuitCyanPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#FF007F" />
          </linearGradient>
        </defs>

        {/* Outer Tech Corner Chamfer */}
        <path d="M 0,0 L 40,0 L 60,20 L 0,80 Z" fill="#00F0FF" opacity="0.05" />
        <path d="M 0,0 L 70,0 L 85,15 L 15,85 L 0,70 Z" stroke="url(#circuitCyanPink)" strokeWidth="1.2" opacity="0.6" />

        {/* Primary PCB Traces */}
        <path d="M 10,0 L 10,35 L 35,60 L 60,60" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="60" cy="60" r="2.5" fill="#00F0FF" />

        <path d="M 0,10 L 35,10 L 60,35 L 85,35" stroke="#FF007F" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="85" cy="35" r="2" fill="#FF007F" />

        {/* Diagonal Corner Reticle Cross */}
        <path d="M 4,4 L 14,4 L 14,14 L 4,14 Z" fill="none" stroke="#FFE600" strokeWidth="1.2" />
        <circle cx="9" cy="9" r="1.5" fill="#FFE600" />
      </motion.svg>
    </motion.div>
  );
}
