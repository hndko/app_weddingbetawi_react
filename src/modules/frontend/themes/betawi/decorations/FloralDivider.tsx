import { cn } from '../../../../../utils/cn';

export function FloralDivider({ className }: { className?: string }) {
  return (
    <svg 
      width="200" 
      height="24" 
      viewBox="0 0 200 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-gold", className)}
    >
      <path d="M20 12 L180 12" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      {/* Center flower */}
      <g transform="translate(100, 12) scale(0.9)">
        <circle cx="0" cy="-6" r="6" fill="var(--color-betawi-red)" opacity="0.95" />
        <circle cx="6" cy="0" r="6" fill="var(--color-betawi-red)" opacity="0.95" />
        <circle cx="0" cy="6" r="6" fill="var(--color-betawi-red)" opacity="0.95" />
        <circle cx="-6" cy="0" r="6" fill="var(--color-betawi-red)" opacity="0.95" />
        <circle cx="0" cy="0" r="4" fill="var(--color-gold)" />
      </g>
      {/* Left flower */}
      <g transform="translate(60, 12) scale(0.6)">
        <circle cx="0" cy="-6" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="6" cy="0" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="0" cy="6" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="-6" cy="0" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="0" cy="0" r="3" fill="var(--color-betawi-red)" />
      </g>
      {/* Right flower */}
      <g transform="translate(140, 12) scale(0.6)">
        <circle cx="0" cy="-6" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="6" cy="0" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="0" cy="6" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="-6" cy="0" r="6" fill="var(--color-gold)" opacity="0.9" />
        <circle cx="0" cy="0" r="3" fill="var(--color-betawi-red)" />
      </g>
      {/* Accents */}
      <circle cx="30" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="40" cy="12" r="2" fill="var(--color-sage)" opacity="0.8" />
      <circle cx="160" cy="12" r="2" fill="var(--color-sage)" opacity="0.8" />
      <circle cx="170" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
