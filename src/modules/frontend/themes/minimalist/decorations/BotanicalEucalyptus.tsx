import React from 'react';

interface BotanicalEucalyptusProps {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const BotanicalEucalyptus: React.FC<BotanicalEucalyptusProps> = ({
  size = 80,
  primaryColor = '#2D3748',
  secondaryColor = '#9AA79C',
  accentColor = '#D4AF37',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="eucalyptusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BAC7BC" />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>

      {/* Main Curved Botanical Stem */}
      <path
        d="M 15 75 C 35 60, 60 45, 105 20"
        stroke={primaryColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Eucalyptus Rounded Leaves */}
      {/* Leaf 1 - Left Bottom */}
      <path
        d="M 28 65 C 20 60, 16 48, 22 42 C 28 36, 36 44, 34 56 Z"
        fill="url(#eucalyptusGrad)"
        stroke={primaryColor}
        strokeWidth="0.9"
        opacity="0.9"
      />
      <line x1="28" y1="65" x2="23" y2="47" stroke={primaryColor} strokeWidth="0.6" opacity="0.6" />

      {/* Leaf 2 - Bottom Opposite */}
      <path
        d="M 38 60 C 44 68, 56 68, 58 60 C 60 52, 48 48, 42 53 Z"
        fill="url(#eucalyptusGrad)"
        stroke={primaryColor}
        strokeWidth="0.9"
        opacity="0.85"
      />

      {/* Leaf 3 - Mid Left */}
      <path
        d="M 50 50 C 42 42, 42 30, 50 26 C 58 22, 64 34, 58 44 Z"
        fill="url(#eucalyptusGrad)"
        stroke={primaryColor}
        strokeWidth="0.9"
        opacity="0.9"
      />
      <line x1="50" y1="50" x2="51" y2="33" stroke={primaryColor} strokeWidth="0.6" opacity="0.6" />

      {/* Leaf 4 - Mid Right */}
      <path
        d="M 64 43 C 72 49, 82 45, 84 38 C 86 31, 74 27, 68 34 Z"
        fill="url(#eucalyptusGrad)"
        stroke={primaryColor}
        strokeWidth="0.9"
        opacity="0.85"
      />

      {/* Leaf 5 - Near Tip */}
      <path
        d="M 78 33 C 74 24, 76 15, 84 14 C 92 13, 94 22, 88 29 Z"
        fill="url(#eucalyptusGrad)"
        stroke={primaryColor}
        strokeWidth="0.9"
        opacity="0.9"
      />
      <line x1="78" y1="33" x2="84" y2="20" stroke={primaryColor} strokeWidth="0.6" opacity="0.6" />

      {/* Leaf 6 - Tip Terminal Leaf */}
      <path
        d="M 95 24 C 103 21, 108 14, 106 8 C 104 2, 95 6, 92 14 Z"
        fill="url(#eucalyptusGrad)"
        stroke={primaryColor}
        strokeWidth="0.9"
        opacity="0.95"
      />

      {/* Soft Golden Botanical Seed Pods / Berries */}
      <circle cx="38" cy="54" r="2" fill={accentColor} />
      <circle cx="62" cy="38" r="2.2" fill={accentColor} />
      <circle cx="86" cy="22" r="1.8" fill={accentColor} />
      <circle cx="48" cy="32" r="1.5" fill={accentColor} />
    </svg>
  );
};
