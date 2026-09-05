import React from 'react';

interface ArabesqueArchProps {
  size?: number;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const ArabesqueArch: React.FC<ArabesqueArchProps> = ({
  size = 320,
  primaryColor = '#0F4C5C',
  accentColor = '#C5A059',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.52}
      viewBox="0 0 400 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="archGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A47E28" />
          <stop offset="50%" stopColor="#E5C158" />
          <stop offset="100%" stopColor="#A47E28" />
        </linearGradient>
      </defs>

      {/* Main Moorish Horseshoe Pointed Arch (Kubah Arabesque Andalusia) */}
      <path
        d="M 40 200 
           L 40 120 
           C 40 50, 110 32, 200 12 
           C 290 32, 360 50, 360 120 
           L 360 200"
        stroke="url(#archGoldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner Concentric Fine Arch */}
      <path
        d="M 55 200 
           L 55 125 
           C 55 65, 120 46, 200 28 
           C 280 46, 345 65, 345 125 
           L 345 200"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* Inner Scalloped Folia / Andalusian Cusps */}
      <path
        d="M 70 195 
           C 70 160, 95 140, 120 140 
           C 145 140, 165 110, 200 65 
           C 235 110, 255 140, 280 140 
           C 305 140, 330 160, 330 195"
        stroke={primaryColor}
        strokeWidth="1.2"
        fill="none"
        opacity="0.75"
      />

      {/* Top Center Dome Finial & 8-Pointed Star (Kubah & Bintang) */}
      <g transform="translate(200, 12)">
        {/* Dome Spire */}
        <line x1="0" y1="0" x2="0" y2="-12" stroke="url(#archGoldGrad)" strokeWidth="1.8" />
        <circle cx="0" cy="-14" r="2.5" fill="#E5C158" />
        <circle cx="0" cy="-20" r="1.5" fill="#E5C158" />

        {/* Hanging Lantern Cord & Small Islamic Star */}
        <line x1="0" y1="16" x2="0" y2="46" stroke={accentColor} strokeWidth="0.8" strokeDasharray="2 2" />
        <g transform="translate(0, 52) scale(0.6)">
          <rect x="-8" y="-8" width="16" height="16" fill="#E5C158" />
          <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" fill="#E5C158" />
          <circle cx="0" cy="0" r="3" fill="#0F4C5C" />
        </g>
      </g>

      {/* Geometric Capital Pillar Accents */}
      <rect x="35" y="118" width="10" height="4" rx="1" fill={accentColor} />
      <rect x="355" y="118" width="10" height="4" rx="1" fill={accentColor} />
    </svg>
  );
};
