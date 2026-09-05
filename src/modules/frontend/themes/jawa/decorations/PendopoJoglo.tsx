import React from 'react';

interface PendopoJogloProps {
  className?: string;
  size?: number;
  primaryColor?: string;
  accentColor?: string;
}

export const PendopoJoglo: React.FC<PendopoJogloProps> = ({
  className = '',
  size = 320,
  primaryColor = '#C5A059',
  accentColor = '#132A1C',
}) => {
  return (
    <svg
      width={size}
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="jogloGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FAF0CA" />
          <stop offset="50%" stopColor={primaryColor} />
          <stop offset="100%" stopColor="#9A7B38" />
        </linearGradient>

        <linearGradient id="jogloDarkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A4B3A" />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>

      {/* Top Mustaka / Molo (Crown of Joglo Roof) */}
      <g>
        <path
          d="M200 12 L204 22 L208 26 L204 32 L200 36 L196 32 L192 26 L196 22 Z"
          fill="url(#jogloGoldGrad)"
        />
        <circle cx="200" cy="10" r="3" fill="#FFE27A" />
      </g>

      {/* Upper Tajug Pyramid (Atap Brunjung Utama) */}
      <path
        d="M200 34 L245 88 L155 88 Z"
        fill="url(#jogloDarkGrad)"
        stroke={primaryColor}
        strokeWidth="2.5"
      />
      {/* Roof ridge ornaments */}
      <path d="M200 34 L200 88" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M190 56 L210 56 M180 74 L220 74" stroke={primaryColor} strokeWidth="1" opacity="0.6" />

      {/* Middle Overhang (Atap Penanggap) */}
      <path
        d="M152 88 L248 88 L290 128 L110 128 Z"
        fill="url(#jogloDarkGrad)"
        stroke={primaryColor}
        strokeWidth="2.5"
      />
      {/* Gentle roof curve detailing */}
      <path d="M110 128 Q200 122 290 128" stroke="url(#jogloGoldGrad)" strokeWidth="3" />
      <path d="M130 108 Q200 104 270 108" stroke={primaryColor} strokeWidth="1" opacity="0.4" />

      {/* Lower Eaves Overhang (Atap Emper / Pengeret) */}
      <path
        d="M106 128 L294 128 L345 162 L55 162 Z"
        fill="url(#jogloDarkGrad)"
        stroke={primaryColor}
        strokeWidth="2.5"
      />
      {/* Lower roof curved rim */}
      <path d="M55 162 Q200 156 345 162" stroke="url(#jogloGoldGrad)" strokeWidth="3.5" />
      {/* Eaves end upturns (Lisplang Emas) */}
      <path d="M55 162 Q50 158 48 152" stroke={primaryColor} strokeWidth="2.5" fill="none" />
      <path d="M345 162 Q350 158 352 152" stroke={primaryColor} strokeWidth="2.5" fill="none" />

      {/* Carved Wooden Frieze / Gebyok Pelataran */}
      <rect x="75" y="162" width="250" height="8" fill={primaryColor} opacity="0.85" />
      <circle cx="100" cy="166" r="2" fill={accentColor} />
      <circle cx="140" cy="166" r="2" fill={accentColor} />
      <circle cx="200" cy="166" r="2.5" fill={accentColor} />
      <circle cx="260" cy="166" r="2" fill={accentColor} />
      <circle cx="300" cy="166" r="2" fill={accentColor} />

      {/* Soko Guru Pillars (Main Inner Pillars) */}
      <g stroke={primaryColor} strokeWidth="4" strokeLinecap="round">
        <line x1="145" y1="170" x2="145" y2="218" />
        <line x1="175" y1="170" x2="175" y2="218" />
        <line x1="225" y1="170" x2="225" y2="218" />
        <line x1="255" y1="170" x2="255" y2="218" />
      </g>

      {/* Outer Eaves Pillars (Soko Rawa / Emper) */}
      <g stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round">
        <line x1="85" y1="170" x2="85" y2="218" />
        <line x1="115" y1="170" x2="115" y2="218" />
        <line x1="285" y1="170" x2="285" y2="218" />
        <line x1="315" y1="170" x2="315" y2="218" />
      </g>

      {/* Central Gebyok Arch / Pendopo Backdrop */}
      <path
        d="M175 185 Q200 178 225 185 L225 218 L175 218 Z"
        fill={accentColor}
        stroke={primaryColor}
        strokeWidth="1.5"
        opacity="0.9"
      />
      {/* Wayang Silhouette in Center of Pendopo */}
      <path
        d="M200 188 C203 194 208 198 209 205 C210 209 206 212 200 212 C194 212 190 209 191 205 C192 198 197 194 200 188 Z"
        fill="url(#jogloGoldGrad)"
        opacity="0.8"
      />

      {/* Umpak (Carved Stone Pillar Bases) */}
      <g fill="url(#jogloGoldGrad)">
        <rect x="80" y="218" width="10" height="6" rx="1" />
        <rect x="110" y="218" width="10" height="6" rx="1" />
        <rect x="140" y="218" width="10" height="6" rx="1" />
        <rect x="170" y="218" width="10" height="6" rx="1" />
        <rect x="220" y="218" width="10" height="6" rx="1" />
        <rect x="250" y="218" width="10" height="6" rx="1" />
        <rect x="280" y="218" width="10" height="6" rx="1" />
        <rect x="310" y="218" width="10" height="6" rx="1" />
      </g>

      {/* Floor / Umbul Pelataran Pendopo */}
      <rect x="40" y="224" width="320" height="5" rx="2" fill="url(#jogloGoldGrad)" opacity="0.9" />
      <rect x="55" y="229" width="290" height="4" rx="2" fill={primaryColor} opacity="0.6" />
      <rect x="70" y="233" width="260" height="3" rx="1" fill={primaryColor} opacity="0.4" />
    </svg>
  );
};
