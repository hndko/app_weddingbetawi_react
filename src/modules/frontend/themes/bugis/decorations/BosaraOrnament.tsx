import React from 'react';

interface BosaraOrnamentProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export const BosaraOrnament: React.FC<BosaraOrnamentProps> = ({
  size = 90,
  className = '',
  primaryColor = '#D4AF37', // Royal Gold
  secondaryColor = '#8B1E1E', // Royal Maroon
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
        <radialGradient id="bosaraGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color={primaryColor} stop-opacity="0.3" />
          <stop offset="100%" stop-color={primaryColor} stop-opacity="0" />
        </radialGradient>
        <linearGradient id="bosaraGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color={accentColor} />
          <stop offset="50%" stop-color={primaryColor} />
          <stop offset="100%" stop-color="#997A15" />
        </linearGradient>
      </defs>

      {/* Subtle Glow Aura */}
      <circle cx="50" cy="50" r="45" fill="url(#bosaraGlow)" />

      {/* Bosara Base Pedestal */}
      <path
        d="M25 80 L35 88 L65 88 L75 80 Z"
        fill={secondaryColor}
        stroke="url(#bosaraGold)"
        strokeWidth="1.5"
      />
      <ellipse
        cx="50"
        cy="78"
        rx="38"
        ry="8"
        fill={secondaryColor}
        stroke="url(#bosaraGold)"
        strokeWidth="1.8"
      />
      <ellipse
        cx="50"
        cy="76"
        rx="32"
        ry="5"
        fill="url(#bosaraGold)"
        opacity="0.6"
      />

      {/* Bosara Dome Cover (Tudung Renda Segi Lima) */}
      <path
        d="M16 74 C16 42 34 24 50 20 C66 24 84 42 84 74 Z"
        fill={secondaryColor}
        stroke="url(#bosaraGold)"
        strokeWidth="2"
      />

      {/* Vertical Curved Ribs */}
      <path
        d="M50 20 L50 74"
        stroke="url(#bosaraGold)"
        strokeWidth="1.2"
        strokeDasharray="2 1.5"
      />
      <path
        d="M50 20 C42 34 32 52 28 74"
        stroke="url(#bosaraGold)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M50 20 C58 34 68 52 72 74"
        stroke="url(#bosaraGold)"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Horizontal Decorative Scallop Bands (Renda Renda Emas) */}
      <path
        d="M22 62 Q 35 68 50 68 Q 65 68 78 62"
        stroke="url(#bosaraGold)"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M28 48 Q 38 52 50 52 Q 62 52 72 48"
        stroke="url(#bosaraGold)"
        strokeWidth="1"
        fill="none"
      />

      {/* Golden Floral & Gem Accents */}
      <polygon points="50,42 54,48 50,54 46,48" fill={accentColor} />
      <circle cx="50" cy="48" r="2" fill={secondaryColor} />
      <circle cx="34" cy="62" r="2" fill={accentColor} />
      <circle cx="66" cy="62" r="2" fill={accentColor} />

      {/* Bosara Golden Crown Finial (Pucuk Emas) */}
      <circle cx="50" cy="18" r="4" fill="url(#bosaraGold)" />
      <path d="M50 10 L47 18 L53 18 Z" fill={accentColor} />
      <circle cx="50" cy="8" r="1.5" fill={accentColor} />
    </svg>
  );
};
