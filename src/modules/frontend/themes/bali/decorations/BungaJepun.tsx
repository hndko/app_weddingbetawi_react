import React from 'react';

interface BungaJepunProps {
  size?: number;
  className?: string;
  petalColor?: string;
  coreColor?: string;
}

export const BungaJepun: React.FC<BungaJepunProps> = ({
  size = 48,
  className = '',
  petalColor = '#FFFBEB',
  coreColor = '#F59E0B',
}) => {
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
        <linearGradient id="jepunYellowGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FEF08A" />
          <stop offset="60%" stop-color={coreColor} />
          <stop offset="100%" stop-color="#B45309" />
        </linearGradient>
        <radialGradient id="jepunCenterRadial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FDE047" />
          <stop offset="50%" stop-color={coreColor} />
          <stop offset="100%" stop-color="transparent" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(50, 50)">
        {/* 5 Petals of Balinese Frangipani (Kamboja / Jepun) */}
        {/* Petal 1 (0 deg) */}
        <g transform="rotate(0)">
          <path
            d="M0,0 C-14,-16 -12,-38 0,-44 C12,-38 14,-16 0,0 Z"
            fill={petalColor}
            stroke="#E2E8F0"
            strokeWidth="0.8"
          />
          <path d="M0,0 C-6,-8 -4,-22 0,-28 C4,-22 6,-8 0,0 Z" fill="url(#jepunYellowGradient)" opacity="0.85" />
        </g>
        {/* Petal 2 (72 deg) */}
        <g transform="rotate(72)">
          <path
            d="M0,0 C-14,-16 -12,-38 0,-44 C12,-38 14,-16 0,0 Z"
            fill={petalColor}
            stroke="#E2E8F0"
            strokeWidth="0.8"
          />
          <path d="M0,0 C-6,-8 -4,-22 0,-28 C4,-22 6,-8 0,0 Z" fill="url(#jepunYellowGradient)" opacity="0.85" />
        </g>
        {/* Petal 3 (144 deg) */}
        <g transform="rotate(144)">
          <path
            d="M0,0 C-14,-16 -12,-38 0,-44 C12,-38 14,-16 0,0 Z"
            fill={petalColor}
            stroke="#E2E8F0"
            strokeWidth="0.8"
          />
          <path d="M0,0 C-6,-8 -4,-22 0,-28 C4,-22 6,-8 0,0 Z" fill="url(#jepunYellowGradient)" opacity="0.85" />
        </g>
        {/* Petal 4 (216 deg) */}
        <g transform="rotate(216)">
          <path
            d="M0,0 C-14,-16 -12,-38 0,-44 C12,-38 14,-16 0,0 Z"
            fill={petalColor}
            stroke="#E2E8F0"
            strokeWidth="0.8"
          />
          <path d="M0,0 C-6,-8 -4,-22 0,-28 C4,-22 6,-8 0,0 Z" fill="url(#jepunYellowGradient)" opacity="0.85" />
        </g>
        {/* Petal 5 (288 deg) */}
        <g transform="rotate(288)">
          <path
            d="M0,0 C-14,-16 -12,-38 0,-44 C12,-38 14,-16 0,0 Z"
            fill={petalColor}
            stroke="#E2E8F0"
            strokeWidth="0.8"
          />
          <path d="M0,0 C-6,-8 -4,-22 0,-28 C4,-22 6,-8 0,0 Z" fill="url(#jepunYellowGradient)" opacity="0.85" />
        </g>

        {/* Central Core Glow */}
        <circle cx="0" cy="0" r="12" fill="url(#jepunCenterRadial)" />
        <circle cx="0" cy="0" r="4" fill="#D97706" />
      </g>
    </svg>
  );
};
