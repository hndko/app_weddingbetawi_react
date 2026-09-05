import React from 'react';

interface PrianganArchProps {
  size?: number;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const PrianganArch: React.FC<PrianganArchProps> = ({
  size = 320,
  primaryColor = '#4A6B5D',
  accentColor = '#D4AF37',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.42}
      viewBox="0 0 400 168"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="archGreen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2E4A3C" />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#2E4A3C" />
        </linearGradient>
        <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B38B22" />
          <stop offset="50%" stopColor={accentColor} />
          <stop offset="100%" stopColor="#B38B22" />
        </linearGradient>
      </defs>

      {/* Main Priangan Bamboo Curved Gateway Arch */}
      <path
        d="M 30 160 
           C 30 65, 120 20, 200 20 
           C 280 20, 370 65, 370 160"
        stroke="url(#archGold)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Inner Concentric Bamboo Arc */}
      <path
        d="M 45 160 
           C 45 78, 130 36, 200 36 
           C 270 36, 355 78, 355 160"
        stroke="url(#archGreen)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bamboo Node Ring Bindings (Tali Awi Priangan) */}
      {[
        { x: 58, y: 110, angle: -50 },
        { x: 95, y: 68, angle: -35 },
        { x: 145, y: 38, angle: -18 },
        { x: 200, y: 20, angle: 0 },
        { x: 255, y: 38, angle: 18 },
        { x: 305, y: 68, angle: 35 },
        { x: 342, y: 110, angle: 50 },
      ].map((pt, idx) => (
        <g key={idx} transform={`translate(${pt.x}, ${pt.y}) rotate(${pt.angle})`}>
          <rect x="-2" y="-12" width="4" height="24" rx="1.5" fill={accentColor} />
          <line x1="-3" y1="-8" x2="3" y2="-8" stroke="#FFFFFF" strokeWidth="0.8" />
          <line x1="-3" y1="8" x2="3" y2="8" stroke="#FFFFFF" strokeWidth="0.8" />
        </g>
      ))}

      {/* Top Center Floral Crown (Kuncup Melati Ronce & Daun Suci Parahyangan) */}
      <g transform="translate(200, 20)">
        {/* Central Crown Rosette */}
        <circle cx="0" cy="-6" r="6" fill={accentColor} />
        <circle cx="0" cy="-6" r="3" fill="#FFFFFF" />

        {/* Flanking Leaves */}
        <path d="M -6 -6 C -18 -12, -26 -2, -20 6 C -12 6, -6 -2, -6 -6 Z" fill={primaryColor} />
        <path d="M 6 -6 C 18 -12, 26 -2, 20 6 C 12 6, 6 -2, 6 -6 Z" fill={primaryColor} />
        
        {/* Jasmine Buds Hanging */}
        <circle cx="-12" cy="12" r="3.2" fill="#FFFFFF" stroke={accentColor} strokeWidth="0.8" />
        <circle cx="0" cy="16" r="3.8" fill="#FFFFFF" stroke={accentColor} strokeWidth="0.8" />
        <circle cx="12" cy="12" r="3.2" fill="#FFFFFF" stroke={accentColor} strokeWidth="0.8" />
      </g>

      {/* Hanging Jasmine Garlands (Ronce Melati Gelambir) */}
      <path
        d="M 70 95 C 100 120, 150 125, 200 115 C 250 125, 300 120, 330 95"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeDasharray="2 3"
        fill="none"
      />
      {[90, 120, 150, 180, 200, 220, 250, 280, 310].map((cx, i) => (
        <circle key={i} cx={cx} cy={110 + Math.sin(i * 0.7) * 4} r="2.5" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.6" />
      ))}
    </svg>
  );
};
