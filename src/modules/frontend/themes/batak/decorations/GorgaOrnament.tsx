import React from 'react';

interface GorgaOrnamentProps {
  className?: string;
  width?: number | string;
  variant?: 'divider' | 'medallion' | 'corner';
}

export const GorgaOrnament: React.FC<GorgaOrnamentProps> = ({
  className = '',
  width = 240,
  variant = 'divider',
}) => {
  if (variant === 'medallion') {
    return (
      <svg
        width={width}
        height={width}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none drop-shadow-sm ${className}`}
      >
        <defs>
          <linearGradient id="gorgaMedGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997A15" />
          </linearGradient>
        </defs>
        {/* Concentric Sacred Rings */}
        <circle cx="40" cy="40" r="38" fill="#1C1917" stroke="url(#gorgaMedGold)" strokeWidth="2" />
        <circle cx="40" cy="40" r="34" fill="#7A1B1E" stroke="url(#gorgaMedGold)" strokeWidth="1" />
        <circle cx="40" cy="40" r="28" fill="#1C1917" stroke="url(#gorgaMedGold)" strokeWidth="1" />
        
        {/* Quad Spiral Gorga Simeol-meol */}
        <path
          d="M40,20 C46,20 50,24 50,30 C50,34 46,38 40,38 C34,38 30,34 30,30 C30,24 34,20 40,20 Z"
          stroke="url(#gorgaMedGold)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M40,60 C46,60 50,56 50,50 C50,46 46,42 40,42 C34,42 30,46 30,50 C30,56 34,60 40,60 Z"
          stroke="url(#gorgaMedGold)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M20,40 C20,46 24,50 30,50 C34,50 38,46 38,40 C38,34 34,30 30,30 C24,30 20,34 20,40 Z"
          stroke="url(#gorgaMedGold)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M60,40 C60,46 56,50 50,50 C46,50 42,46 42,40 C42,34 46,30 50,30 C56,30 60,34 60,40 Z"
          stroke="url(#gorgaMedGold)"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="40" cy="40" r="4" fill="url(#gorgaMedGold)" />
      </svg>
    );
  }

  // Default: Horizontal Section Divider
  return (
    <div className={`flex items-center justify-center pointer-events-none ${className}`}>
      <svg
        width={width}
        height="32"
        viewBox="0 0 240 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-xs w-full"
      >
        <defs>
          <linearGradient id="gorgaDivGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#997A15" stopOpacity="0" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#FFF3C4" />
            <stop offset="70%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997A15" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Flanking Lines */}
        <line x1="0" y1="16" x2="80" y2="16" stroke="url(#gorgaDivGold)" strokeWidth="1.2" />
        <line x1="160" y1="16" x2="240" y2="16" stroke="url(#gorgaDivGold)" strokeWidth="1.2" />

        {/* Center Gorga Simeol-meol Intertwined Motifs */}
        <g transform="translate(120, 16)">
          {/* Left Wing S-Scroll */}
          <path
            d="M-30,0 C-24,-8 -16,-8 -12,0 C-8,8 -16,8 -20,0"
            fill="none"
            stroke="url(#gorgaDivGold)"
            strokeWidth="1.5"
          />
          {/* Right Wing S-Scroll */}
          <path
            d="M30,0 C24,-8 16,-8 12,0 C8,8 16,8 20,0"
            fill="none"
            stroke="url(#gorgaDivGold)"
            strokeWidth="1.5"
          />
          {/* Center Diamond & Petals */}
          <path
            d="M0,-8 L8,0 L0,8 L-8,0 Z"
            fill="#7A1B1E"
            stroke="url(#gorgaDivGold)"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="0" r="2.5" fill="#FFF3C4" />
        </g>
      </svg>
    </div>
  );
};
