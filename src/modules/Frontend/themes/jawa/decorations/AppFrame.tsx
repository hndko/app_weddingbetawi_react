import React from 'react';

export const AppFrame: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* Subtle Gold Outer Line */}
      <div className="absolute inset-2 border border-[#C5A059]/40 rounded-[28px]" />
      <div className="absolute inset-3.5 border border-[#C5A059]/20 rounded-[24px]" />

      {/* Top Left Javanese Ornament Corner */}
      <svg
        className="absolute top-2 left-2 w-8 h-8 text-[#C5A059] opacity-80"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 36 L4 8 C4 5.8 5.8 4 8 4 L36 4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8 L24 8 M8 8 L8 24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="8" cy="8" r="3" fill="currentColor" />
        <path d="M12 12 C18 12 20 18 20 20" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Top Right Javanese Ornament Corner */}
      <svg
        className="absolute top-2 right-2 w-8 h-8 text-[#C5A059] opacity-80"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M36 36 L36 8 C36 5.8 34.2 4 32 4 L4 4" stroke="currentColor" strokeWidth="2" />
        <path d="M32 8 L16 8 M32 8 L32 24" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="32" cy="8" r="3" fill="currentColor" />
        <path d="M28 12 C22 12 20 18 20 20" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Bottom Left Javanese Ornament Corner */}
      <svg
        className="absolute bottom-2 left-2 w-8 h-8 text-[#C5A059] opacity-80"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 4 L4 32 C4 34.2 5.8 36 8 36 L36 36" stroke="currentColor" strokeWidth="2" />
        <path d="M8 32 L24 32 M8 32 L8 16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="8" cy="32" r="3" fill="currentColor" />
        <path d="M12 28 C18 28 20 22 20 20" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Bottom Right Javanese Ornament Corner */}
      <svg
        className="absolute bottom-2 right-2 w-8 h-8 text-[#C5A059] opacity-80"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M36 4 L36 32 C36 34.2 34.2 36 32 36 L4 36" stroke="currentColor" strokeWidth="2" />
        <path d="M32 32 L16 32 M32 32 L32 16" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
        <path d="M28 28 C22 28 20 22 20 20" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
