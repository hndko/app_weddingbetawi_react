import React from 'react';

interface RumahGadangArchProps {
  className?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  children?: React.ReactNode;
}

export const RumahGadangArch: React.FC<RumahGadangArchProps> = ({
  className = '',
  primaryColor = '#D4AF37',
  secondaryColor = '#7B1122',
  accentColor = '#FFF3C4',
  children,
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top Rumah Gadang Gonjong Crest SVG */}
      <div className="w-full flex justify-center -mb-2 pointer-events-none select-none">
        <svg
          viewBox="0 0 320 80"
          width="100%"
          height="80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-[320px]"
        >
          <defs>
            <linearGradient id="gonjongGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#997A15" />
            </linearGradient>
          </defs>

          {/* Majestic Gonjong Horns (5 Gonjong Peaks) */}
          {/* Main Central Gonjong */}
          <path
            d="M160,10 C160,28 152,48 140,65 L180,65 C168,48 160,28 160,10 Z"
            fill="url(#gonjongGold)"
          />
          <circle cx="160" cy="8" r="3" fill={accentColor} stroke="#997A15" strokeWidth="0.8" />

          {/* Left Mid Gonjong */}
          <path
            d="M85,25 C100,42 118,56 142,65 C120,62 102,48 85,25 Z"
            fill="url(#gonjongGold)"
          />
          <circle cx="84" cy="23" r="2.5" fill={accentColor} stroke="#997A15" strokeWidth="0.8" />

          {/* Right Mid Gonjong */}
          <path
            d="M235,25 C220,42 202,56 178,65 C200,62 218,48 235,25 Z"
            fill="url(#gonjongGold)"
          />
          <circle cx="236" cy="23" r="2.5" fill={accentColor} stroke="#997A15" strokeWidth="0.8" />

          {/* Left Far Gonjong */}
          <path
            d="M20,38 C42,54 75,64 105,68 C70,66 42,54 20,38 Z"
            fill="url(#gonjongGold)"
          />
          <circle cx="18" cy="36" r="2.2" fill={accentColor} stroke="#997A15" strokeWidth="0.8" />

          {/* Right Far Gonjong */}
          <path
            d="M300,38 C278,54 245,64 215,68 C250,66 278,54 300,38 Z"
            fill="url(#gonjongGold)"
          />
          <circle cx="302" cy="36" r="2.2" fill={accentColor} stroke="#997A15" strokeWidth="0.8" />

          {/* Arch Base Beam (Singok / Balai Balairung) */}
          <path
            d="M20,68 Q160,56 300,68"
            stroke="url(#gonjongGold)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M35,74 Q160,63 285,74"
            stroke={secondaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Frame Container */}
      <div className="relative border border-[#D4AF37]/50 rounded-2xl bg-[#FAF5F0]/95 backdrop-blur-xs shadow-md p-6 overflow-hidden">
        {/* Corner Songket Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />

        {children}
      </div>
    </div>
  );
};
