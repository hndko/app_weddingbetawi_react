import { motion } from 'motion/react';

interface AnimatedAsoFiligreeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function AnimatedAsoFiligree({
  position = 'top-left',
  className = '',
}: AnimatedAsoFiligreeProps) {
  const isTop = position.includes('top');
  const isLeft = position.includes('left');

  const transformStyle = `${isTop ? '' : 'scale-y-[-1]'} ${isLeft ? '' : 'scale-x-[-1]'}`.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.85 }}
      transition={{ duration: 1.2 }}
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
          rotate: isLeft ? [0, 1.5, -1, 0] : [0, -1.5, 1, 0],
          scale: [1, 1.02, 0.99, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: 'easeInOut',
        }}
        width="110"
        height="110"
        viewBox="0 0 110 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transform origin-top-left ${transformStyle} drop-shadow-sm`}
      >
        <defs>
          <linearGradient id="asoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#8B0000" />
          </linearGradient>
        </defs>

        {/* Outer Corner Frame Border */}
        <path d="M 0,0 L 70,0 C 50,20 20,50 0,70 Z" fill="url(#asoGoldGrad)" opacity="0.2" />
        <path d="M 0,0 L 95,0 C 70,25 25,70 0,95 L 0,0" stroke="url(#asoGoldGrad)" strokeWidth="1.5" />

        {/* Dayak Kenyah Aso Dragon Spiral Vines */}
        <path
          d="M 5,5 C 25,5 45,15 55,30 C 65,45 60,65 45,70 C 30,75 15,60 20,45 C 25,30 40,35 40,45"
          stroke="url(#asoGoldGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Secondary Tendril */}
        <path
          d="M 5,45 C 10,65 30,80 50,75 C 65,70 70,55 60,45"
          stroke="#D4AF37"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Little Leaf/Flower Accent (Manik Kenyah) */}
        <circle cx="5" cy="5" r="4" fill="#8B0000" stroke="#FFF3C4" strokeWidth="1" />
        <circle cx="55" cy="30" r="2.5" fill="#D4AF37" />
        <circle cx="45" cy="70" r="2.5" fill="#D4AF37" />
      </motion.svg>
    </motion.div>
  );
}
