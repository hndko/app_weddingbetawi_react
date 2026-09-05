import React from 'react';

interface MinimalistArchProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const MinimalistArch: React.FC<MinimalistArchProps> = ({
  size = 320,
  primaryColor = '#2D3748',
  secondaryColor = '#9AA79C',
  accentColor = '#D4AF37',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.45}
      viewBox="0 0 400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Clean Geometric Semi-Arched Line */}
      <path
        d="M 40 170 
           L 40 100 
           C 40 35, 120 18, 200 18 
           C 280 18, 360 35, 360 100 
           L 360 170"
        stroke={primaryColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />

      {/* Inner Concentric Fine Dashed Guide Line */}
      <path
        d="M 55 170 
           L 55 105 
           C 55 48, 125 32, 200 32 
           C 275 32, 345 48, 345 105 
           L 345 170"
        stroke={secondaryColor}
        strokeWidth="0.9"
        strokeDasharray="4 4"
        fill="none"
        opacity="0.75"
      />

      {/* Top Center Delicate Botanical Sprig */}
      <g transform="translate(200, 18)">
        {/* Central Olive/Eucalyptus Leaves */}
        <path
          d="M 0 0 C -15 -14, -30 -6, -24 6 C -18 6, -8 0, 0 0 Z"
          fill={secondaryColor}
          stroke={primaryColor}
          strokeWidth="0.7"
          opacity="0.85"
        />
        <path
          d="M 0 0 C 15 -14, 30 -6, 24 6 C 18 6, 8 0, 0 0 Z"
          fill={secondaryColor}
          stroke={primaryColor}
          strokeWidth="0.7"
          opacity="0.85"
        />

        {/* Delicate Golden Berry Accent */}
        <circle cx="0" cy="-6" r="2.5" fill={accentColor} />
        <circle cx="-14" cy="-4" r="1.8" fill={accentColor} />
        <circle cx="14" cy="-4" r="1.8" fill={accentColor} />
      </g>
    </svg>
  );
};
