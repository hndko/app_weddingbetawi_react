import React from 'react';

interface JavaneseFiligreeProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  className?: string;
  size?: number;
  color?: string;
}

export const JavaneseFiligree: React.FC<JavaneseFiligreeProps> = ({
  position = 'top-left',
  className = '',
  size = 48,
  color = '#C5A059',
}) => {
  const getRotationClass = () => {
    switch (position) {
      case 'top-right':
        return 'rotate-90 origin-center';
      case 'bottom-right':
        return 'rotate-180 origin-center';
      case 'bottom-left':
        return '-rotate-90 origin-center';
      default:
        return '';
    }
  };

  return (
    <div className={`pointer-events-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={getRotationClass()}
      >
        {/* Outer Corner L-Frame with Carved Beads */}
        <path
          d="M4 56 L4 12 C4 7.58 7.58 4 12 4 L56 4"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M9 48 L9 15 C9 11.68 11.68 9 15 9 L48 9"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.7"
        />

        {/* Central Lung-lungan Spiral (Sulur Kencana) */}
        <path
          d="M4 4 C14 4 24 14 24 24 C24 30 18 34 14 30 C10 26 14 18 20 20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Secondary Delicate Foliate Tendril */}
        <path
          d="M4 28 C8 24 16 26 16 32 C16 38 8 40 6 34"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M28 4 C24 8 26 16 32 16 C38 16 40 8 34 6"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
        />

        {/* Sacred Golden Diamond Gem in Corner */}
        <path
          d="M12 12 L16 8 L20 12 L16 16 Z"
          fill={color}
          opacity="0.9"
        />
        <circle cx="16" cy="12" r="1.5" fill="#FFE27A" />

        {/* Tip Finial Drops */}
        <circle cx="54" cy="4" r="2" fill={color} />
        <circle cx="4" cy="54" r="2" fill={color} />
      </svg>
    </div>
  );
};
