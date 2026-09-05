import React from 'react';

interface RumaBolonHeaderProps {
  className?: string;
  variant?: 'gold' | 'full';
  width?: number | string;
  height?: number | string;
}

export const RumaBolonHeader: React.FC<RumaBolonHeaderProps> = ({
  className = '',
  variant = 'gold',
  width = '100%',
  height = 'auto',
}) => {
  return (
    <div className={`flex justify-center items-center pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 400 130"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-md w-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="rumaGoldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#997A15" />
          </linearGradient>
          <linearGradient id="rumaRedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#5C1417" />
          </linearGradient>
        </defs>

        {/* Outer Saddleback Roof Arc (Atap Pelana Ruma Bolon) */}
        <path
          d="M30,35 C90,105 310,105 370,35 C345,55 260,75 200,75 C140,75 55,55 30,35 Z"
          fill="url(#rumaGoldGrad)"
          opacity="0.95"
        />

        {/* Inner Roof Shade */}
        <path
          d="M45,43 C100,100 300,100 355,43 C330,60 255,75 200,75 C145,75 70,60 45,43 Z"
          fill={variant === 'full' ? 'url(#rumaRedGrad)' : '#1C1917'}
          opacity="0.85"
        />

        {/* Left Horn / Simatutu Tanduk Kerbau */}
        <path
          d="M30,35 C38,-8 65,-22 85,2 C65,-2 48,12 30,35 Z"
          fill="url(#rumaGoldGrad)"
        />
        {/* Right Horn / Simatutu Tanduk Kerbau */}
        <path
          d="M370,35 C362,-8 335,-22 315,2 C335,-2 352,12 370,35 Z"
          fill="url(#rumaGoldGrad)"
        />

        {/* Gable Center Apex Spike */}
        <path
          d="M200,45 L200,8 L204,18 L200,24 L196,18 Z"
          fill="url(#rumaGoldGrad)"
        />

        {/* Central Triangle Facade (Dorpi Ruma Bolon) */}
        <path
          d="M150,75 L250,75 L235,115 L165,115 Z"
          fill="#1C1917"
          stroke="url(#rumaGoldGrad)"
          strokeWidth="1.8"
        />

        {/* Gorga Carvings on Gable Facade */}
        {/* Gorga Boraspati (Sacred Blessing Symbol) */}
        <line x1="200" y1="80" x2="200" y2="110" stroke="url(#rumaGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="190" y1="88" x2="210" y2="88" stroke="url(#rumaGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="188" y1="102" x2="212" y2="102" stroke="url(#rumaGoldGrad)" strokeWidth="1.5" strokeLinecap="round" />

        {/* Left & Right Gorga Simeol-meol Spirals */}
        <path
          d="M178,92 C172,92 170,96 174,100 C178,104 182,100 180,96"
          fill="none"
          stroke="url(#rumaGoldGrad)"
          strokeWidth="1.2"
        />
        <path
          d="M222,92 C228,92 230,96 226,100 C222,104 218,100 220,96"
          fill="none"
          stroke="url(#rumaGoldGrad)"
          strokeWidth="1.2"
        />

        {/* Stilt Pillars Beneath Facade */}
        <line x1="172" y1="115" x2="172" y2="128" stroke="url(#rumaGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="190" y1="115" x2="190" y2="128" stroke="url(#rumaGoldGrad)" strokeWidth="2" strokeLinecap="round" />
        <line x1="210" y1="115" x2="210" y2="128" stroke="url(#rumaGoldGrad)" strokeWidth="2" strokeLinecap="round" />
        <line x1="228" y1="115" x2="228" y2="128" stroke="url(#rumaGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="160" y1="128" x2="240" y2="128" stroke="url(#rumaGoldGrad)" strokeWidth="2" strokeLinecap="round" />

        {/* Ulos Decorative Fringes (Rambu Ulos) */}
        <g opacity="0.8">
          <circle cx="95" cy="80" r="2.5" fill="#E5C158" />
          <circle cx="115" cy="85" r="2.5" fill="#7A1B1E" />
          <circle cx="135" cy="88" r="2.5" fill="#E5C158" />
          <circle cx="265" cy="88" r="2.5" fill="#E5C158" />
          <circle cx="285" cy="85" r="2.5" fill="#7A1B1E" />
          <circle cx="305" cy="80" r="2.5" fill="#E5C158" />
        </g>
      </svg>
    </div>
  );
};
