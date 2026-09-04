import { cn } from '../../../../utils/cn';

export function MonasSilhouette({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 500" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      <g>
        {/* === FLAME (Lidah Api) === */}
        <path d="M 100 10 C 115 35, 115 60, 100 75 C 85 60, 85 35, 100 10 Z" fill="var(--color-gold)" opacity="0.9" />
        <path d="M 100 10 C 100 35, 100 60, 100 75 C 85 60, 85 35, 100 10 Z" fill="var(--color-gold)" opacity="0.7" />

        {/* === TOP DECK (Pelataran Puncak) === */}
        <rect x="85" y="75" width="30" height="4" fill="currentColor" />
        <polygon points="80,79 120,79 115,85 85,85" fill="currentColor" opacity="0.9" />
        
        {/* Add shading to the top deck */}
        <rect x="100" y="75" width="15" height="4" fill="var(--color-sage-dark)" opacity="0.3" />
        <polygon points="100,79 120,79 115,85 100,85" fill="var(--color-sage-dark)" opacity="0.3" />

        {/* === OBELISK (Pillar) === */}
        <polygon points="91,85 109,85 118,360 82,360" fill="currentColor" opacity="0.85" />
        <polygon points="100,85 109,85 118,360 100,360" fill="var(--color-sage-dark)" opacity="0.25" />

        {/* === GOBLET (Cawan) === */}
        {/* Base of Pillar / Top of Goblet */}
        <polygon points="75,360 125,360 125,365 75,365" fill="currentColor" opacity="0.9" />
        <polygon points="100,360 125,360 125,365 100,365" fill="var(--color-sage-dark)" opacity="0.3" />

        {/* Main Flared Body of Goblet */}
        <polygon points="25,365 175,365 145,415 55,415" fill="currentColor" opacity="0.85" />
        <polygon points="100,365 175,365 145,415 100,415" fill="var(--color-sage-dark)" opacity="0.25" />

        {/* Vertical Base of Goblet */}
        <rect x="55" y="415" width="90" height="30" fill="currentColor" opacity="0.9" />
        <rect x="100" y="415" width="45" height="30" fill="var(--color-sage-dark)" opacity="0.3" />

        {/* === BASE (Pelataran Bawah) === */}
        {/* Slanted part of base */}
        <polygon points="10,445 190,445 200,475 0,475" fill="currentColor" opacity="0.85" />
        <polygon points="100,445 190,445 200,475 100,475" fill="var(--color-sage-dark)" opacity="0.25" />
        
        {/* Vertical drop of base */}
        <rect x="0" y="475" width="200" height="15" fill="currentColor" opacity="0.9" />
        <rect x="100" y="475" width="100" height="15" fill="var(--color-sage-dark)" opacity="0.3" />
      </g>
    </svg>
  );
}
