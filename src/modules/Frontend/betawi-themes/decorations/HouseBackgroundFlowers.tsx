import { cn } from '../../../../utils/cn';

export function HouseBackgroundFlowers({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 500 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none", className)}
    >
      <defs>
        <filter id="glow-bg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-sage)" />
          <stop offset="100%" stopColor="var(--color-sage-dark)" />
        </linearGradient>
      </defs>

      {/* Dense Background Foliage Arch (Left & Right) */}
      <g opacity="0.9">
        {/* Left Side Dense Leaves */}
        <path d="M50 400 C30 300 0 200 40 100 C60 50 100 20 150 10 C130 50 80 120 100 200 C110 250 150 300 130 400 Z" fill="url(#leafGrad)" />
        <path d="M0 350 C-20 250 10 150 50 80 C80 30 140 0 200 0 C160 30 110 80 120 160 C130 220 170 300 140 400 Z" fill="var(--color-sage-soft)" />
        <path d="M80 400 C70 320 20 220 70 140 C100 90 160 50 220 40 C180 80 140 140 160 220 C170 280 200 350 170 400 Z" fill="var(--color-sage-dark)" opacity="0.8" />
        
        {/* Right Side Dense Leaves */}
        <path d="M450 400 C470 300 500 200 460 100 C440 50 400 20 350 10 C370 50 420 120 400 200 C390 250 350 300 370 400 Z" fill="url(#leafGrad)" />
        <path d="M500 350 C520 250 490 150 450 80 C420 30 360 0 300 0 C340 30 390 80 380 160 C370 220 330 300 360 400 Z" fill="var(--color-sage-soft)" />
        <path d="M420 400 C430 320 480 220 430 140 C400 90 340 50 280 40 C320 80 360 140 340 220 C330 280 300 350 330 400 Z" fill="var(--color-sage-dark)" opacity="0.8" />
      </g>

      {/* Big Botanical Leaves (Monstera / Palm vibes) */}
      <g fill="var(--color-sage-dark)" opacity="0.95">
         <path d="M20 180 Q60 120 120 160 Q80 180 60 220 Z" />
         <path d="M10 250 Q50 200 100 260 Q60 290 30 300 Z" />
         <path d="M90 80 Q140 50 180 90 Q140 120 100 130 Z" />
         
         <path d="M480 180 Q440 120 380 160 Q420 180 440 220 Z" />
         <path d="M490 250 Q450 200 400 260 Q440 290 470 300 Z" />
         <path d="M410 80 Q360 50 320 90 Q360 120 400 130 Z" />
      </g>

      {/* Flower Clusters */}
      <g stroke="var(--color-gold)" strokeWidth="1">
         {/* Left Flowers */}
         <g transform="translate(60, 220) scale(2.2)">
            <path d="M0 -10 C10 -15 10 15 0 10 C-10 15 -10 -15 0 -10 Z" fill="var(--color-betawi-red)" />
            <path d="M-10 0 C-15 -10 15 -10 10 0 C15 10 -15 10 -10 0 Z" fill="var(--color-betawi-red)" />
            <circle cx="0" cy="0" r="4" fill="var(--color-gold)" />
         </g>
         <g transform="translate(100, 120) scale(1.8)">
            <path d="M0 -10 C10 -15 10 15 0 10 C-10 15 -10 -15 0 -10 Z" fill="var(--color-gold-soft)" />
            <path d="M-10 0 C-15 -10 15 -10 10 0 C15 10 -15 10 -10 0 Z" fill="var(--color-gold-soft)" />
            <circle cx="0" cy="0" r="4" fill="var(--color-betawi-red)" />
         </g>
         <g transform="translate(160, 60) scale(1.5)">
            <path d="M0 -10 C10 -15 10 15 0 10 C-10 15 -10 -15 0 -10 Z" fill="var(--color-betawi-red)" />
            <path d="M-10 0 C-15 -10 15 -10 10 0 C15 10 -15 10 -10 0 Z" fill="var(--color-betawi-red)" />
            <circle cx="0" cy="0" r="4" fill="var(--color-gold)" />
         </g>

         {/* Right Flowers */}
         <g transform="translate(440, 220) scale(2.2)">
            <path d="M0 -10 C10 -15 10 15 0 10 C-10 15 -10 -15 0 -10 Z" fill="var(--color-betawi-red)" />
            <path d="M-10 0 C-15 -10 15 -10 10 0 C15 10 -15 10 -10 0 Z" fill="var(--color-betawi-red)" />
            <circle cx="0" cy="0" r="4" fill="var(--color-gold)" />
         </g>
         <g transform="translate(400, 120) scale(1.8)">
            <path d="M0 -10 C10 -15 10 15 0 10 C-10 15 -10 -15 0 -10 Z" fill="var(--color-gold-soft)" />
            <path d="M-10 0 C-15 -10 15 -10 10 0 C15 10 -15 10 -10 0 Z" fill="var(--color-gold-soft)" />
            <circle cx="0" cy="0" r="4" fill="var(--color-betawi-red)" />
         </g>
         <g transform="translate(340, 60) scale(1.5)">
            <path d="M0 -10 C10 -15 10 15 0 10 C-10 15 -10 -15 0 -10 Z" fill="var(--color-betawi-red)" />
            <path d="M-10 0 C-15 -10 15 -10 10 0 C15 10 -15 10 -10 0 Z" fill="var(--color-betawi-red)" />
            <circle cx="0" cy="0" r="4" fill="var(--color-gold)" />
         </g>
      </g>
      
      {/* Tiny scattered accents */}
      <g fill="var(--color-gold)">
         <circle cx="130" cy="200" r="3" />
         <circle cx="160" cy="180" r="2" />
         <circle cx="200" cy="110" r="3" />
         <circle cx="370" cy="200" r="3" />
         <circle cx="340" cy="180" r="2" />
         <circle cx="300" cy="110" r="3" />
      </g>
    </svg>
  );
}
