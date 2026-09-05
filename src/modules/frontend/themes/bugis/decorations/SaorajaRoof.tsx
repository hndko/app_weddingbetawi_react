import React from 'react';

interface SaorajaRoofProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  primaryColor?: string;
  goldColor?: string;
}

export const SaorajaRoof: React.FC<SaorajaRoofProps> = ({
  className = '',
  width = '100%',
  height = 80,
  primaryColor = '#5A0C16',
  goldColor = '#D4AF37',
}) => {
  return (
    <svg
      viewBox="0 0 320 80"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="saorajaRoofGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor={goldColor} />
          <stop offset="100%" stopColor="#997A15" />
        </linearGradient>
      </defs>

      {/* Main Triangular Gable (Gable Wall) */}
      <polygon
        points="160,18 40,70 280,70"
        fill={primaryColor}
        stroke="url(#saorajaRoofGold)"
        strokeWidth="1.8"
      />

      {/* Overhanging Roof Eaves */}
      <line x1="25" y1="72" x2="295" y2="72" stroke="url(#saorajaRoofGold)" strokeWidth="3" strokeLinecap="round" />
      <line x1="15" y1="76" x2="305" y2="76" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />

      {/* Timpa Laja (5-Tiered nobility gables / anak tangga kemuliaan bangsawan) */}
      <line x1="70" y1="62" x2="250" y2="62" stroke="url(#saorajaRoofGold)" strokeWidth="1.2" />
      <line x1="95" y1="52" x2="225" y2="52" stroke="url(#saorajaRoofGold)" strokeWidth="1.2" />
      <line x1="118" y1="42" x2="202" y2="42" stroke="url(#saorajaRoofGold)" strokeWidth="1.2" />
      <line x1="138" y1="32" x2="182" y2="32" stroke="url(#saorajaRoofGold)" strokeWidth="1.2" />
      <line x1="152" y1="24" x2="168" y2="24" stroke="url(#saorajaRoofGold)" strokeWidth="1.2" />

      {/* Central Diamond Emblem on Gable */}
      <polygon points="160,46 166,52 160,58 154,52" fill="url(#saorajaRoofGold)" />
      <circle cx="160" cy="52" r="1.5" fill="#FFE082" />

      {/* Anjong / Roof Finial Horns (Pucuk Ukiran Atap Saoraja) */}
      <path
        d="M160,18 C150,2 135,-4 130,2 C140,6 150,10 160,18 Z"
        fill="url(#saorajaRoofGold)"
      />
      <path
        d="M160,18 C170,2 185,-4 190,2 C180,6 170,10 160,18 Z"
        fill="url(#saorajaRoofGold)"
      />
      <circle cx="160" cy="18" r="3.5" fill="url(#saorajaRoofGold)" />
      <circle cx="160" cy="18" r="1.5" fill="#FFE082" />
    </svg>
  );
};
