import { cn } from '../../utils/cn';

const Flower = ({ x, y, scale = 1, color = 'var(--color-betawi-red)', center = 'var(--color-gold)' }: { x: number, y: number, scale?: number, color?: string, center?: string }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    <circle cx="10" cy="4" r="6" fill={color} opacity="0.9" />
    <circle cx="16" cy="10" r="6" fill={color} opacity="0.9" />
    <circle cx="10" cy="16" r="6" fill={color} opacity="0.9" />
    <circle cx="4" cy="10" r="6" fill={color} opacity="0.9" />
    <circle cx="10" cy="10" r="4" fill={center} />
  </g>
);

export function RumahKebaya({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 400 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-auto", className)}
    >
      {/* Base/Terrace */}
      <path d="M 40 180 L 360 180 L 380 190 L 20 190 Z" fill="var(--color-gold)" opacity="0.3" />
      <path d="M 40 180 L 360 180 L 380 190 L 20 190 Z" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* Stairs */}
      <path d="M 170 190 L 230 190 L 240 200 L 160 200 Z" fill="var(--color-sage)" opacity="0.4" />
      <path d="M 170 190 L 230 190 L 240 200 L 160 200 Z" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinejoin="round" />
      
      {/* Main Body */}
      <rect x="60" y="80" width="280" height="100" fill="var(--color-warm-white)" />
      <rect x="60" y="80" width="280" height="100" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      
      {/* Doors (Double door in middle) */}
      <rect x="165" y="100" width="70" height="80" fill="var(--color-sage)" opacity="0.2" />
      <rect x="165" y="100" width="35" height="80" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      <rect x="200" y="100" width="35" height="80" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      {/* Door details */}
      <rect x="170" y="110" width="25" height="30" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="var(--color-sage)" opacity="0.1"/>
      <rect x="170" y="145" width="25" height="30" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="var(--color-sage)" opacity="0.1"/>
      <rect x="205" y="110" width="25" height="30" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="var(--color-sage)" opacity="0.1"/>
      <rect x="205" y="145" width="25" height="30" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="var(--color-sage)" opacity="0.1"/>
      
      {/* Door Knobs */}
      <circle cx="192" cy="140" r="2.5" fill="var(--color-betawi-red)" />
      <circle cx="208" cy="140" r="2.5" fill="var(--color-betawi-red)" />

      {/* Windows */}
      <rect x="80" y="110" width="40" height="50" fill="var(--color-gold)" opacity="0.2" />
      <rect x="80" y="110" width="40" height="50" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      <line x1="80" y1="135" x2="120" y2="135" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      <line x1="100" y1="110" x2="100" y2="160" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      
      <rect x="280" y="110" width="40" height="50" fill="var(--color-gold)" opacity="0.2" />
      <rect x="280" y="110" width="40" height="50" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      <line x1="280" y1="135" x2="320" y2="135" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      <line x1="300" y1="110" x2="300" y2="160" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      
      {/* Pillars (Tiang) */}
      <rect x="50" y="70" width="10" height="110" fill="var(--color-sage-dark)" stroke="var(--color-sage-dark)" strokeWidth="1" />
      <rect x="140" y="70" width="10" height="110" fill="var(--color-sage-dark)" stroke="var(--color-sage-dark)" strokeWidth="1" />
      <rect x="250" y="70" width="10" height="110" fill="var(--color-sage-dark)" stroke="var(--color-sage-dark)" strokeWidth="1" />
      <rect x="340" y="70" width="10" height="110" fill="var(--color-sage-dark)" stroke="var(--color-sage-dark)" strokeWidth="1" />
      
      {/* Gigi Balang (Fascia/Langkan) */}
      <path d="M 40 70 L 360 70 L 360 80 L 40 80 Z" fill="var(--color-gold)" />
      <path d="M 40 70 L 360 70 L 360 80 L 40 80 Z" stroke="var(--color-sage-dark)" strokeWidth="1.5" />
      
      {/* Gigi Balang Triangle teeth */}
      <path d="M 45 80 L 50 90 L 55 80 L 65 80 L 70 90 L 75 80 L 85 80 L 90 90 L 95 80 L 105 80 L 110 90 L 115 80 L 125 80 L 130 90 L 135 80 L 145 80 L 150 90 L 155 80 L 165 80 L 170 90 L 175 80 L 185 80 L 190 90 L 195 80 L 205 80 L 210 90 L 215 80 L 225 80 L 230 90 L 235 80 L 245 80 L 250 90 L 255 80 L 265 80 L 270 90 L 275 80 L 285 80 L 290 90 L 295 80 L 305 80 L 310 90 L 315 80 L 325 80 L 330 90 L 335 80 L 345 80 L 350 90 L 355 80 Z" fill="var(--color-sage)" stroke="var(--color-sage-dark)" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Roof (Atap Pelana/Lipat Kajang) */}
      <path d="M 20 70 L 100 20 L 300 20 L 380 70 Z" fill="var(--color-sage)" opacity="0.9" />
      <path d="M 20 70 L 100 20 L 300 20 L 380 70 Z" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M 100 20 L 200 5 L 300 20" stroke="var(--color-sage-dark)" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      
      {/* Roof texture lines */}
      <line x1="60" y1="45" x2="60" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="80" y1="32" x2="80" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="120" y1="20" x2="120" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="160" y1="20" x2="160" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="240" y1="20" x2="240" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="280" y1="20" x2="280" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="320" y1="32" x2="320" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      <line x1="340" y1="45" x2="340" y2="70" stroke="var(--color-sage-dark)" strokeWidth="1" opacity="0.5" />
      
      {/* Manggar / Kembang Kelapa on Sides */}
      {/* Left */}
      <path d="M 25 180 Q 5 140, 5 110" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="none" />
      <circle cx="5" cy="110" r="4" fill="var(--color-betawi-red)" />
      <path d="M 25 180 Q 25 140, 35 115" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="none" />
      <circle cx="35" cy="115" r="4" fill="var(--color-gold)" />
      
      {/* Right */}
      <path d="M 375 180 Q 395 140, 395 110" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="none" />
      <circle cx="395" cy="110" r="4" fill="var(--color-betawi-red)" />
      <path d="M 375 180 Q 375 140, 365 115" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="none" />
      <circle cx="365" cy="115" r="4" fill="var(--color-gold)" />

      {/* Decorative Flowers */}
      <Flower x={15} y={175} scale={1.2} />
      <Flower x={35} y={180} scale={0.8} color="var(--color-gold)" center="var(--color-sage-dark)" />
      
      <Flower x={365} y={175} scale={1.2} />
      <Flower x={350} y={180} scale={0.8} color="var(--color-gold)" center="var(--color-sage-dark)" />

      <Flower x={140} y={185} scale={0.9} color="var(--color-sage-soft)" center="var(--color-betawi-red)" />
      <Flower x={240} y={185} scale={0.9} color="var(--color-sage-soft)" center="var(--color-betawi-red)" />
    </svg>
  );
}
