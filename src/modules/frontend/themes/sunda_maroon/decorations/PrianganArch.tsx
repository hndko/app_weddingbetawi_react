import React from 'react';

interface PrianganArchProps {
  size?: number;
  primaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const PrianganArch: React.FC<PrianganArchProps> = ({
  size = 320,
  primaryColor = '#7B1122',
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
        <linearGradient id="archMaroon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3D0B0F" />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#3D0B0F" />
        </linearGradient>
        <linearGradient id="archMaroonGold" x1="0%" y1="0%" x2="100%" y2="0%">
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
        stroke="url(#archMaroonGold)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Inner Concentric Bamboo Arc */}
      <path
        d="M 45 160 
           C 45 78, 130 36, 200 36 
           C 270 36, 355 78, 355 160"
        stroke="url(#archMaroon)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bamboo Node Ring Bindings (Tali Awi Priangan) */}
      <circle cx="85" cy="80" r="3.5" fill="#D4AF37" />
      <circle cx="315" cy="80" r="3.5" fill="#D4AF37" />
      <circle cx="140" cy="42" r="3.5" fill="#D4AF37" />
      <circle cx="260" cy="42" r="3.5" fill="#D4AF37" />

      {/* Center Crown Crest Medallion at Arch Keystone */}
      <g transform="translate(200, 20)">
        <circle cx="0" cy="0" r="14" fill="#3D0B0F" stroke="#D4AF37" strokeWidth="1.8" />
        <circle cx="0" cy="0" r="10" fill="#7B1122" stroke="#FFF9E0" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="4.5" fill="#D4AF37" />
        <circle cx="0" cy="0" r="2" fill="#FFF9E0" />
        
        {/* Radiating 4-point Petals */}
        <path d="M 0 -10 L 2 -4 L -2 -4 Z" fill="#D4AF37" />
        <path d="M 0 10 L 2 4 L -2 4 Z" fill="#D4AF37" />
        <path d="M -10 0 L -4 2 L -4 -2 Z" fill="#D4AF37" />
        <path d="M 10 0 L 4 2 L 4 -2 Z" fill="#D4AF37" />
      </g>

      {/* Hanging Ronce Melati Floral Pendants on Left & Right Pillars */}
      <g stroke="#D4AF37" strokeWidth="0.8" fill="#FFF9E0">
        <line x1="85" y1="80" x2="85" y2="120" strokeDasharray="3,3" />
        <circle cx="85" cy="92" r="2.5" />
        <circle cx="85" cy="104" r="2" />
        <circle cx="85" cy="116" r="3" fill="#D4AF37" />

        <line x1="315" y1="80" x2="315" y2="120" strokeDasharray="3,3" />
        <circle cx="315" cy="92" r="2.5" />
        <circle cx="315" cy="104" r="2" />
        <circle cx="315" cy="116" r="3" fill="#D4AF37" />
      </g>
    </svg>
  );
};
