import React from 'react';

interface IslamicStarCrescentProps {
  size?: number;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const IslamicStarCrescent: React.FC<IslamicStarCrescentProps> = ({
  size = 80,
  color,
  primaryColor = '#E5C158',
  secondaryColor = '#C5A059',
  accentColor,
  className = '',
}) => {
  const mainColor = color || primaryColor;
  const detailColor = accentColor || secondaryColor;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="islamicGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF1B0" />
          <stop offset="50%" stopColor={mainColor} />
          <stop offset="100%" stopColor={detailColor} />
        </linearGradient>
      </defs>

      {/* Slender Royal Crescent Moon (Hilal) */}
      <path
        d="M 52 16 
           C 72 16, 86 32, 86 50 
           C 86 68, 72 84, 52 84 
           C 66 73, 72 63, 72 50 
           C 72 37, 66 27, 52 16 
           Z"
        fill="url(#islamicGoldGrad)"
        stroke="#A47E28"
        strokeWidth="1"
      />

      {/* Sacred 8-Pointed Islamic Star (Rub el Hizb) */}
      <g transform="translate(38, 50) scale(0.9)">
        {/* Square 1 */}
        <rect
          x="-14"
          y="-14"
          width="28"
          height="28"
          rx="1.5"
          fill="url(#islamicGoldGrad)"
          stroke="#A47E28"
          strokeWidth="1"
        />
        {/* Square 2 (Rotated 45 degrees) */}
        <rect
          x="-14"
          y="-14"
          width="28"
          height="28"
          rx="1.5"
          transform="rotate(45)"
          fill="url(#islamicGoldGrad)"
          stroke="#A47E28"
          strokeWidth="1"
        />
        {/* Inner Rosette / Center Pearl */}
        <circle cx="0" cy="0" r="4.5" fill="#0F4C5C" stroke="#FFF1B0" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="2" fill="#FFF1B0" />
      </g>

      {/* Star Radiant Spores */}
      <circle cx="20" cy="30" r="1.5" fill={mainColor} opacity="0.8" />
      <circle cx="68" cy="14" r="1.2" fill={mainColor} opacity="0.8" />
      <circle cx="82" cy="72" r="1.2" fill={mainColor} opacity="0.8" />
      <circle cx="30" cy="74" r="1.5" fill={mainColor} opacity="0.8" />
    </svg>
  );
};
