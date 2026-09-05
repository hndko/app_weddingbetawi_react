import React from 'react';

interface MahkotaSuntiangProps {
  size?: number;
  color?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  className?: string;
}

export const MahkotaSuntiang: React.FC<MahkotaSuntiangProps> = ({
  size = 80,
  color,
  primaryColor = '#D4AF37',
  secondaryColor = '#997A15',
  accentColor = '#FFF3C4',
  className = '',
}) => {
  const mainGold = color || primaryColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="suntiangGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accentColor} />
          <stop offset="45%" stopColor={mainGold} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <radialGradient id="suntiangCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={mainGold} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Central Radiating Glow */}
      <circle cx="60" cy="55" r="42" fill="url(#suntiangCenterGlow)" />

      {/* Outer Radiating Kembang Goyang Pins (Tier 1 - Outermost) */}
      <g stroke={mainGold} strokeWidth="1.5" strokeLinecap="round">
        <line x1="60" y1="20" x2="60" y2="12" />
        <line x1="45" y1="25" x2="40" y2="17" />
        <line x1="75" y1="25" x2="80" y2="17" />
        <line x1="32" y1="34" x2="25" y2="28" />
        <line x1="88" y1="34" x2="95" y2="28" />
        <line x1="22" y1="48" x2="14" y2="44" />
        <line x1="98" y1="48" x2="106" y2="44" />
        <line x1="16" y1="65" x2="8" y2="64" />
        <line x1="104" y1="65" x2="112" y2="64" />
      </g>

      {/* Kembang Goyang Buds / Pearls */}
      <circle cx="60" cy="11" r="3" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="39" cy="16" r="2.5" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="81" cy="16" r="2.5" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="24" cy="27" r="2.2" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="96" cy="27" r="2.2" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="13" cy="43" r="2" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="107" cy="43" r="2" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="7" cy="63" r="1.8" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />
      <circle cx="113" cy="63" r="1.8" fill={accentColor} stroke={secondaryColor} strokeWidth="0.8" />

      {/* Main Fan of Suntiang Plates (Tiered Layers) */}
      {/* Layer 3 (Outer Fan) */}
      <path
        d="M20,80 C26,45 40,28 60,22 C80,28 94,45 100,80 C88,72 75,68 60,68 C45,68 32,72 20,80 Z"
        fill="url(#suntiangGoldGrad)"
        stroke={secondaryColor}
        strokeWidth="1"
      />

      {/* Layer 2 (Middle Fan with Crimson filigree cutout) */}
      <path
        d="M28,82 C34,54 45,38 60,34 C75,38 86,54 92,82 C82,76 72,73 60,73 C48,73 38,76 28,82 Z"
        fill="#7B1122"
        stroke={mainGold}
        strokeWidth="1"
      />

      {/* Layer 1 (Inner Crown Fan) */}
      <path
        d="M36,84 C40,62 48,46 60,44 C72,46 80,62 84,84 C76,80 68,78 60,78 C52,78 44,80 36,84 Z"
        fill="url(#suntiangGoldGrad)"
        stroke={secondaryColor}
        strokeWidth="1"
      />

      {/* Central Gem / Ruby Rosette */}
      <circle cx="60" cy="56" r="4.5" fill="#7B1122" stroke={accentColor} strokeWidth="1" />
      <circle cx="60" cy="56" r="2" fill={accentColor} />

      {/* Base Tiara Band (Ikat Suntiang / Deta Emas) */}
      <rect x="25" y="83" width="70" height="9" rx="2" fill="url(#suntiangGoldGrad)" stroke={secondaryColor} strokeWidth="1" />
      {/* Decorative Dots on Tiara Band */}
      <g fill="#7B1122">
        <circle cx="33" cy="87.5" r="1.5" />
        <circle cx="42" cy="87.5" r="1.5" />
        <circle cx="51" cy="87.5" r="1.5" />
        <circle cx="60" cy="87.5" r="2" fill={accentColor} />
        <circle cx="69" cy="87.5" r="1.5" />
        <circle cx="78" cy="87.5" r="1.5" />
        <circle cx="87" cy="87.5" r="1.5" />
      </g>

      {/* Hanging Jurai Pendants (Kiri & Kanan) */}
      <path d="M26,93 L24,106 L27,108 L26,93 Z" fill={mainGold} />
      <circle cx="25.5" cy="110" r="2" fill={accentColor} stroke={secondaryColor} strokeWidth="0.5" />

      <path d="M94,93 L96,106 L93,108 L94,93 Z" fill={mainGold} />
      <circle cx="94.5" cy="110" r="2" fill={accentColor} stroke={secondaryColor} strokeWidth="0.5" />
    </svg>
  );
};
