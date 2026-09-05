import React from 'react';

interface RumahLimasArchProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  primaryColor?: string;
  goldColor?: string;
}

export const RumahLimasArch: React.FC<RumahLimasArchProps> = ({
  className = '',
  width = '100%',
  height = 80,
  primaryColor = '#50020D',
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
        <linearGradient id="limasGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="50%" stopColor={goldColor} />
          <stop offset="100%" stopColor="#997A15" />
        </linearGradient>
      </defs>

      {/* Main Triangular Pediment of Rumah Limas */}
      <polygon
        points="160,18 45,68 275,68"
        fill={primaryColor}
        stroke="url(#limasGold)"
        strokeWidth="1.8"
      />

      {/* Tiered Wooden Lines */}
      <line x1="75" y1="60" x2="245" y2="60" stroke="url(#limasGold)" strokeWidth="1.2" />
      <line x1="105" y1="50" x2="215" y2="50" stroke="url(#limasGold)" strokeWidth="1.2" />
      <line x1="130" y1="38" x2="190" y2="38" stroke="url(#limasGold)" strokeWidth="1.2" />

      {/* Simbar Tanduk Kambing at Eaves Corners (Ornamen Khas Pucuk Atap Limas) */}
      <path
        d="M45,68 C30,55 25,40 32,32 C38,44 42,56 48,64 Z"
        fill="url(#limasGold)"
      />
      <path
        d="M275,68 C290,55 295,40 288,32 C282,44 278,56 272,64 Z"
        fill="url(#limasGold)"
      />

      {/* Overhanging Roof Beam */}
      <line x1="30" y1="70" x2="290" y2="70" stroke="url(#limasGold)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Center Pinnacle Simbar Crown */}
      <path
        d="M160,18 C150,4 138,0 142,6 C150,10 156,14 160,18 Z"
        fill="url(#limasGold)"
      />
      <path
        d="M160,18 C170,4 182,0 178,6 C170,10 164,14 160,18 Z"
        fill="url(#limasGold)"
      />
      <circle cx="160" cy="18" r="3.5" fill="url(#limasGold)" />
      <circle cx="160" cy="18" r="1.5" fill="#FFE082" />
    </svg>
  );
};
