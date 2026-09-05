import React from 'react';

interface MahkotaSigerProps {
  size?: number;
  color?: string;
  accentColor?: string;
  className?: string;
}

export const MahkotaSiger: React.FC<MahkotaSigerProps> = ({
  size = 80,
  color = '#D4AF37',
  accentColor = '#7B1122',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 120 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sigerMaroonGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6A3" />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="#B38B22" />
        </linearGradient>
        <linearGradient id="sigerMaroonShine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9E0" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>

      {/* Main Siger Crown Peaks Silhouette (7 Pucuk Kembang Tanjung Sunda) */}
      <path
        d="M 12 58 
           C 18 52, 22 42, 22 34 
           C 25 38, 28 44, 32 46 
           C 34 38, 38 24, 40 18 
           C 43 25, 47 34, 50 38 
           C 54 28, 57 12, 60 4 
           C 63 12, 66 28, 70 38 
           C 73 34, 77 25, 80 18 
           C 82 24, 86 38, 88 46 
           C 92 44, 95 38, 98 34 
           C 98 42, 102 52, 108 58 
           L 104 64 
           C 92 61, 78 59, 60 59 
           C 42 59, 28 61, 16 64 
           Z"
        fill="url(#sigerMaroonGold)"
        stroke="#8C6D1B"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Inner Intricate Cutouts / Floral Engravings */}
      <path
        d="M 60 14 C 58 24, 57 33, 55 42 C 58 41, 62 41, 65 42 C 63 33, 62 24, 60 14 Z"
        fill="#FFF9E0"
        opacity="0.75"
      />
      <path
        d="M 40 26 C 38 33, 37 39, 36 45 C 38 45, 41 45, 43 45 C 42 39, 41 33, 40 26 Z"
        fill="#FFF9E0"
        opacity="0.7"
      />
      <path
        d="M 80 26 C 79 33, 78 39, 77 45 C 79 45, 82 45, 84 45 C 83 39, 82 33, 80 26 Z"
        fill="#FFF9E0"
        opacity="0.7"
      />

      {/* Crown Headband Diadem (Pelipis Mahkota) */}
      <path
        d="M 14 62 C 34 58, 86 58, 106 62 C 103 68, 82 72, 60 72 C 38 72, 17 68, 14 62 Z"
        fill="url(#sigerMaroonShine)"
        stroke="#8C6D1B"
        strokeWidth="1"
      />

      {/* Royal Ruby Stone Accents (Permata Delima Maroon Sunda) */}
      <circle cx="60" cy="48" r="3.2" fill={accentColor} stroke="#F5E6A3" strokeWidth="1" />
      <circle cx="44" cy="50" r="2.2" fill={accentColor} stroke="#F5E6A3" strokeWidth="0.8" />
      <circle cx="76" cy="50" r="2.2" fill={accentColor} stroke="#F5E6A3" strokeWidth="0.8" />
      <circle cx="30" cy="52" r="1.8" fill={accentColor} stroke="#F5E6A3" strokeWidth="0.7" />
      <circle cx="90" cy="52" r="1.8" fill={accentColor} stroke="#F5E6A3" strokeWidth="0.7" />

      {/* Diadem Pearl Trim */}
      <circle cx="60" cy="65" r="2" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.6" />
      <circle cx="50" cy="65.5" r="1.7" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.5" />
      <circle cx="70" cy="65.5" r="1.7" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.5" />
      <circle cx="40" cy="66" r="1.5" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.5" />
      <circle cx="80" cy="66" r="1.5" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.5" />
      <circle cx="30" cy="66.5" r="1.3" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.5" />
      <circle cx="90" cy="66.5" r="1.3" fill="#FFFFFF" stroke="#B38B22" strokeWidth="0.5" />

      {/* Seven Top Peak Pearls */}
      <circle cx="60" cy="3.5" r="2.5" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.8" />
      <circle cx="50" cy="37" r="1.8" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.6" />
      <circle cx="70" cy="37" r="1.8" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.6" />
      <circle cx="40" cy="17" r="2" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.7" />
      <circle cx="80" cy="17" r="2" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.7" />
      <circle cx="22" cy="33" r="1.8" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.6" />
      <circle cx="98" cy="33" r="1.8" fill="#FFFFFF" stroke="#8C6D1B" strokeWidth="0.6" />
    </svg>
  );
};
