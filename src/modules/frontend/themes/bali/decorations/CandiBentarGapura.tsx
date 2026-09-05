import React from 'react';

interface CandiBentarGapuraProps {
  size?: number;
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  showTedung?: boolean;
}

export const CandiBentarGapura: React.FC<CandiBentarGapuraProps> = ({
  size = 180,
  className = '',
  primaryColor = '#D4AF37',
  accentColor = '#FEF08A',
  showTedung = true,
}) => {
  return (
    <svg
      width={size}
      height={size * 0.75}
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="candiGoldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={accentColor} />
          <stop offset="60%" stop-color={primaryColor} />
          <stop offset="100%" stop-color="#997A15" />
        </linearGradient>
        <linearGradient id="candiStoneDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#5A1A08" />
          <stop offset="100%" stop-color="#2D0D04" />
        </linearGradient>
      </defs>

      {/* Base Pedestal (Bebaturan Candi) */}
      <rect x="30" y="160" width="180" height="12" rx="2" fill="url(#candiGoldGrad)" />
      <rect x="40" y="152" width="160" height="8" fill="#7C2D12" opacity="0.6" />

      {/* Left Wing of Candi Bentar */}
      <g id="left-candi-wing">
        {/* Main Carved Tower Silhouettes */}
        <path
          d="M108,152 L60,152 L60,135 L68,132 L62,118 L72,115 L66,100 L76,96 L70,78 L80,74 L74,54 L84,48 L78,25 L90,20 L84,-2 L108,-12 Z"
          fill="url(#candiGoldGrad)"
        />
        {/* Inner Stone Relief Inset */}
        <path
          d="M104,146 L68,146 L68,136 L74,133 L70,121 L78,118 L73,103 L81,100 L76,82 L84,78 L80,58 L88,52 L83,29 L93,24 L88,4 L104,-5 Z"
          fill="url(#candiStoneDark)"
          opacity="0.35"
        />
        {/* Carved Ridge Horizontal Stripes */}
        <line x1="68" y1="135" x2="108" y2="135" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="72" y1="117" x2="108" y2="117" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="76" y1="98" x2="108" y2="98" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="80" y1="76" x2="108" y2="76" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="84" y1="51" x2="108" y2="51" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="90" y1="23" x2="108" y2="23" stroke={accentColor} strokeWidth="1" opacity="0.7" />
      </g>

      {/* Right Wing of Candi Bentar (Mirrored) */}
      <g id="right-candi-wing">
        <path
          d="M132,152 L180,152 L180,135 L172,132 L178,118 L168,115 L174,100 L164,96 L170,78 L160,74 L166,54 L156,48 L162,25 L150,20 L156,-2 L132,-12 Z"
          fill="url(#candiGoldGrad)"
        />
        <path
          d="M136,146 L172,146 L172,136 L166,133 L170,121 L162,118 L167,103 L159,100 L164,82 L156,78 L160,58 L152,52 L157,29 L147,24 L152,4 L136,-5 Z"
          fill="url(#candiStoneDark)"
          opacity="0.35"
        />
        {/* Carved Ridge Horizontal Stripes */}
        <line x1="132" y1="135" x2="172" y2="135" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="132" y1="117" x2="168" y2="117" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="132" y1="98" x2="164" y2="98" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="132" y1="76" x2="160" y2="76" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="132" y1="51" x2="156" y2="51" stroke={accentColor} strokeWidth="1" opacity="0.7" />
        <line x1="132" y1="23" x2="150" y2="23" stroke={accentColor} strokeWidth="1" opacity="0.7" />
      </g>

      {/* Optional Royal Tedung Agung Parasols at the flanks */}
      {showTedung && (
        <>
          {/* Left Tedung */}
          <g transform="translate(32, 70) scale(0.65)">
            <line x1="0" y1="140" x2="0" y2="0" stroke="url(#candiGoldGrad)" strokeWidth="3" />
            <path d="M-30,0 C-26,-30 -14,-45 0,-50 C14,-45 26,-30 30,0 Z" fill="url(#candiGoldGrad)" />
            {/* Golden Rumbing (Fringes) */}
            <path
              d="M-30,0 Q-22,8 -15,0 Q-7,8 0,0 Q7,8 15,0 Q22,8 30,0"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            />
            <circle cx="0" cy="-53" r="3.5" fill={accentColor} />
          </g>

          {/* Right Tedung */}
          <g transform="translate(208, 70) scale(0.65)">
            <line x1="0" y1="140" x2="0" y2="0" stroke="url(#candiGoldGrad)" strokeWidth="3" />
            <path d="M-30,0 C-26,-30 -14,-45 0,-50 C14,-45 26,-30 30,0 Z" fill="url(#candiGoldGrad)" />
            <path
              d="M-30,0 Q-22,8 -15,0 Q-7,8 0,0 Q7,8 15,0 Q22,8 30,0"
              fill="none"
              stroke={accentColor}
              strokeWidth="2"
            />
            <circle cx="0" cy="-53" r="3.5" fill={accentColor} />
          </g>
        </>
      )}
    </svg>
  );
};
