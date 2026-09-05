import React from 'react';

interface MahkotaAesanGedeProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  goldColor?: string;
  accentColor?: string;
}

export const MahkotaAesanGede: React.FC<MahkotaAesanGedeProps> = ({
  size = 90,
  className = '',
  primaryColor = '#780016', // Royal Crimson
  goldColor = '#D4AF37', // Sriwijaya Pure Gold
  accentColor = '#FFE082', // Bright Gold Highlight
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
        <radialGradient id="aesanGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={goldColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={goldColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aesanGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="40%" stopColor={accentColor} />
          <stop offset="70%" stopColor={goldColor} />
          <stop offset="100%" stopColor="#997A15" />
        </linearGradient>
      </defs>

      {/* Glow Aura */}
      <circle cx="50" cy="50" r="46" fill="url(#aesanGlow)" />

      {/* Teratai Dada Collar at bottom (Hiasan Dada Berbiku-biku) */}
      <path
        d="M20 78 Q 50 94 80 78 Q 65 68 50 72 Q 35 68 20 78 Z"
        fill={primaryColor}
        stroke="url(#aesanGold)"
        strokeWidth="1.6"
      />
      <circle cx="50" cy="80" r="3" fill={accentColor} />
      <circle cx="35" cy="76" r="2.2" fill={accentColor} />
      <circle cx="65" cy="76" r="2.2" fill={accentColor} />
      <polygon points="50,85 47,92 53,92" fill="url(#aesanGold)" />

      {/* Mahkota Kesuhun Base Forehead Band */}
      <path
        d="M22 62 C34 57 66 57 78 62 L74 52 C62 48 38 48 26 52 Z"
        fill="url(#aesanGold)"
        stroke="#FFE082"
        strokeWidth="1.2"
      />

      {/* Central Tier 1 Petal (Kelopak Emas Utama) */}
      <path
        d="M32 50 C36 28 50 18 50 18 C50 18 64 28 68 50 Z"
        fill={primaryColor}
        stroke="url(#aesanGold)"
        strokeWidth="1.8"
      />
      <circle cx="50" cy="36" r="3" fill={accentColor} />
      <ellipse cx="50" cy="56" rx="3.5" ry="5" fill="#50020D" stroke={accentColor} strokeWidth="0.8" />

      {/* Side Petals (Sayap Kelopak Kiri & Kanan) */}
      <path
        d="M26 54 C24 38 34 32 34 32 C34 32 36 44 34 52 Z"
        fill="url(#aesanGold)"
      />
      <path
        d="M74 54 C76 38 66 32 66 32 C66 32 64 44 66 52 Z"
        fill="url(#aesanGold)"
      />

      {/* Kembang Goyang Flowers Menjulang */}
      {/* Left Stems & Flowers */}
      <line x1="28" y1="46" x2="16" y2="28" stroke="url(#aesanGold)" strokeWidth="1.2" />
      <circle cx="16" cy="28" r="3" fill={accentColor} />
      <line x1="36" y1="38" x2="28" y2="18" stroke="url(#aesanGold)" strokeWidth="1.2" />
      <circle cx="28" cy="18" r="3" fill={accentColor} />

      {/* Right Stems & Flowers */}
      <line x1="72" y1="46" x2="84" y2="28" stroke="url(#aesanGold)" strokeWidth="1.2" />
      <circle cx="84" cy="28" r="3" fill={accentColor} />
      <line x1="64" y1="38" x2="72" y2="18" stroke="url(#aesanGold)" strokeWidth="1.2" />
      <circle cx="72" cy="18" r="3" fill={accentColor} />

      {/* Top Pinnacle Sunburst */}
      <circle cx="50" cy="16" r="3.5" fill="url(#aesanGold)" />
      <polygon points="50,8 47,16 53,16" fill={accentColor} />
      <circle cx="50" cy="7" r="1.5" fill={accentColor} />
    </svg>
  );
};
