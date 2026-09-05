import React from 'react';

interface WayangGununganProps {
  className?: string;
  size?: number;
  color?: string;
  accentColor?: string;
}

export const WayangGunungan: React.FC<WayangGununganProps> = ({
  className = '',
  size = 120,
  color = '#C5A059',
  accentColor = '#1B3B2B',
}) => {
  return (
    <svg
      width={size}
      height={size * 1.5}
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Gunungan Silhouette / Outer Boundary */}
      <path
        d="M100 10 
           C115 50 145 90 170 140 
           C185 170 190 200 185 240 
           C180 260 160 270 100 270 
           C40 270 20 260 15 240 
           C10 200 15 170 30 140 
           C55 90 85 50 100 10 Z"
        fill={accentColor}
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Inner Decorative Border */}
      <path
        d="M100 25 
           C112 60 138 95 160 140 
           C172 165 176 190 172 225 
           C168 245 150 255 100 255 
           C50 255 32 245 28 225 
           C24 190 28 165 40 140 
           C62 95 88 60 100 25 Z"
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.85"
      />

      {/* Gunungan Stem / Gagang Tangkai Bawah */}
      <path
        d="M96 270 L96 295 C96 298 104 298 104 295 L104 270 Z"
        fill={color}
      />

      {/* Tree of Life (Pohon Hayat) Trunk & Center Pillar */}
      <path
        d="M100 45 L100 240"
        stroke={color}
        strokeWidth="2"
      />

      {/* Gate / Gapura Rumah (Bale Pasowanan) at base */}
      <rect
        x="78"
        y="190"
        width="44"
        height="50"
        rx="4"
        fill={accentColor}
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M78 205 L122 205 M100 205 L100 240"
        stroke={color}
        strokeWidth="1"
      />
      {/* Gapura Roof */}
      <path
        d="M72 190 L100 170 L128 190 Z"
        fill={color}
        opacity="0.9"
      />

      {/* Symmetrical Branches (Cabang Ranting Hayat & Floral Ornaments) */}
      {/* Tier 1 (Top) */}
      <path
        d="M100 70 C85 65 75 75 70 85 M100 70 C115 65 125 75 130 85"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="70" cy="85" r="3" fill={color} />
      <circle cx="130" cy="85" r="3" fill={color} />

      {/* Tier 2 (Middle) */}
      <path
        d="M100 105 C75 95 60 110 52 125 M100 105 C125 95 140 110 148 125"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="52" cy="125" r="3.5" fill={color} />
      <circle cx="148" cy="125" r="3.5" fill={color} />

      {/* Tier 3 (Lower branches with leaf curl) */}
      <path
        d="M100 140 C70 130 50 150 42 175 M100 140 C130 130 150 150 158 175"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="42" cy="175" r="4" fill={color} />
      <circle cx="158" cy="175" r="4" fill={color} />

      {/* Winged Garuda Motif / Sayap Lar */}
      <path
        d="M100 160 C80 150 65 160 55 175 C70 178 85 170 100 165 C115 170 130 178 145 175 C135 160 120 150 100 160 Z"
        fill={color}
        opacity="0.75"
      />

      {/* Top Flame finial (Puncak Makutha) */}
      <path
        d="M100 5 C96 15 97 22 100 25 C103 22 104 15 100 5 Z"
        fill={color}
      />
    </svg>
  );
};
