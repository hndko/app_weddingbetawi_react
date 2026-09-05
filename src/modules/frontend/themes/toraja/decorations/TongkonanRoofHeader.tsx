import React from 'react';
import { motion } from 'motion/react';

interface TongkonanRoofHeaderProps {
  className?: string;
  goldColor?: string;
  woodColor?: string;
}

export const TongkonanRoofHeader: React.FC<TongkonanRoofHeaderProps> = ({
  className = '',
  goldColor = '#E5A93C',
  woodColor = '#8B1E19',
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center w-full overflow-hidden ${className}`}>
      <motion.svg
        initial={{ scaleY: 0.9, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        viewBox="0 0 400 120"
        className="w-full max-w-sm h-auto drop-shadow-md"
      >
        <defs>
          <linearGradient id="goldGradientTongkonan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="50%" stopColor={goldColor} />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
          <linearGradient id="roofShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={woodColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1A1A1A" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Outer Dramatic Saddle Roof Line */}
        <path
          d="M 15,10 C 100,85 160,105 200,105 C 240,105 300,85 385,10 C 330,70 270,90 200,90 C 130,90 70,70 15,10 Z"
          fill="url(#roofShadow)"
          stroke="url(#goldGradientTongkonan)"
          strokeWidth="2"
        />

        {/* Top Decorative Ridge Beam (Katik) */}
        <path
          d="M 10,8 C 100,83 160,103 200,103 C 240,103 300,83 390,8"
          fill="none"
          stroke="#FFF2B2"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Center Tulak Somba (Front Pillar Column) */}
        <g transform="translate(200, 48)">
          <rect x="-4" y="0" width="8" height="50" fill="#1A1A1A" stroke={goldColor} strokeWidth="1" />
          
          {/* Stacked Buffalo Horns (Pa'tedong) */}
          <path d="M -24,8 C -12,18 0,18 0,18 C 0,18 12,18 24,8 C 14,14 0,14 0,14 C 0,14 -14,14 -24,8 Z" fill="url(#goldGradientTongkonan)" />
          <path d="M -28,18 C -14,28 0,28 0,28 C 0,28 14,28 28,18 C 18,24 0,24 0,24 C 0,24 -18,24 -28,18 Z" fill="url(#goldGradientTongkonan)" />
          <path d="M -32,28 C -16,38 0,38 0,38 C 0,38 16,38 32,28 C 20,34 0,34 0,34 C 0,34 -20,34 -32,28 Z" fill="url(#goldGradientTongkonan)" />

          {/* Sacred Sun (Pa'barre Allo) */}
          <circle cx="0" cy="-20" r="10" fill="none" stroke="url(#goldGradientTongkonan)" strokeWidth="1.8" />
          <circle cx="0" cy="-20" r="4.5" fill={goldColor} />
          <line x1="0" y1="-33" x2="0" y2="-29" stroke="#FFF2B2" strokeWidth="1.5" />
          <line x1="0" y1="-11" x2="0" y2="-7" stroke="#FFF2B2" strokeWidth="1.5" />
          <line x1="-13" y1="-20" x2="-9" y2="-20" stroke="#FFF2B2" strokeWidth="1.5" />
          <line x1="9" y1="-20" x2="13" y2="-20" stroke="#FFF2B2" strokeWidth="1.5" />
        </g>
      </motion.svg>
    </div>
  );
};
