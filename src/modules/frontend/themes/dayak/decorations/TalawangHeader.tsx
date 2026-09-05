import { motion } from 'motion/react';

interface TalawangHeaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TalawangHeader({ className = '', size = 'md' }: TalawangHeaderProps) {
  const scale = size === 'sm' ? 0.75 : size === 'lg' ? 1.25 : 1;

  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative flex items-center justify-center"
        style={{ transform: `scale(${scale})` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 240 220"
          className="w-48 h-44 drop-shadow-[0_8px_20px_rgba(139,0,0,0.35)]"
        >
          <defs>
            <linearGradient id="talawangGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFF3C4" />
              <stop offset="50%" stop-color="#D4AF37" />
              <stop offset="100%" stop-color="#996515" />
            </linearGradient>
            <linearGradient id="shieldWood" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#380808" />
              <stop offset="50%" stop-color="#5E0E0E" />
              <stop offset="100%" stop-color="#240505" />
            </linearGradient>
          </defs>

          {/* Crossed Ceremonial Mandau Daggers */}
          <g opacity="0.85">
            {/* Left to Right Mandau Blade */}
            <path d="M 40,30 L 200,190" stroke="url(#talawangGold)" stroke-width="3" stroke-linecap="round" />
            <path d="M 38,28 L 52,36 L 46,46 Z" fill="url(#talawangGold)" />
            {/* Right to Left Mandau Blade */}
            <path d="M 200,30 L 40,190" stroke="url(#talawangGold)" stroke-width="3" stroke-linecap="round" />
            <path d="M 202,28 L 188,36 L 194,46 Z" fill="url(#talawangGold)" />
          </g>

          {/* Hornbill Feathers Fan (Top of Shield) */}
          <g transform="translate(120, 20)">
            {/* Center Main Hornbill Feather */}
            <path d="M 0,0 C -6,-18 0,-34 0,-36 C 0,-34 6,-18 0,0" fill="#FFF3C4" stroke="#1A1A1A" stroke-width="1.2" />
            <rect x="-1" y="-24" width="2" height="10" fill="#1A1A1A" />
            
            {/* Left Angled Feather */}
            <path d="M 0,0 C -14,-15 -22,-24 -24,-26 C -20,-22 -10,-12 0,0" fill="#FFF3C4" stroke="#1A1A1A" stroke-width="1.2" />
            {/* Right Angled Feather */}
            <path d="M 0,0 C 14,-15 22,-24 24,-26 C 20,-22 10,-12 0,0" fill="#FFF3C4" stroke="#1A1A1A" stroke-width="1.2" />
          </g>

          {/* Main Talawang Shield Body (Carved Diamond Hexagon) */}
          <g transform="translate(120, 110)">
            <path
              d="M 0,-75 L 42,-35 L 42,35 L 0,75 L -42,35 L -42,-35 Z"
              fill="url(#shieldWood)"
              stroke="url(#talawangGold)"
              stroke-width="3"
            />

            {/* Inner Border Inset */}
            <path
              d="M 0,-66 L 35,-30 L 35,30 L 0,66 L -35,30 L -35,-30 Z"
              fill="none"
              stroke="#D4AF37"
              stroke-width="1.5"
              stroke-dasharray="4,2"
              opacity="0.8"
            />

            {/* Sacred Aso Dragon Mask Carving (Kenyah Tribal Face) */}
            <circle cx="0" cy="0" r="15" fill="#1A0404" stroke="url(#talawangGold)" stroke-width="2" />
            {/* Dragon Eyes */}
            <circle cx="-6" cy="-2" r="3.5" fill="#FFF3C4" />
            <circle cx="6" cy="-2" r="3.5" fill="#FFF3C4" />
            <circle cx="-6" cy="-2" r="1.5" fill="#8B0000" />
            <circle cx="6" cy="-2" r="1.5" fill="#8B0000" />
            {/* Fangs & Mouth */}
            <path d="M -5,6 Q 0,10 5,6" fill="none" stroke="url(#talawangGold)" stroke-width="1.5" />

            {/* Sacred Spirals (Sulur Paku Kenyah) */}
            {/* Top Spirals */}
            <path d="M 0,-50 C 18,-42 26,-20 15,-5 C 8,5 0,-8 0,-18" fill="none" stroke="url(#talawangGold)" stroke-width="2.2" stroke-linecap="round" />
            <path d="M 0,-50 C -18,-42 -26,-20 -15,-5 C -8,5 0,-8 0,-18" fill="none" stroke="url(#talawangGold)" stroke-width="2.2" stroke-linecap="round" />

            {/* Bottom Spirals */}
            <path d="M 0,50 C 18,42 26,20 15,5 C 8,-5 0,8 0,18" fill="none" stroke="url(#talawangGold)" stroke-width="2.2" stroke-linecap="round" />
            <path d="M 0,50 C -18,42 -26,20 -15,5 C -8,-5 0,8 0,18" fill="none" stroke="url(#talawangGold)" stroke-width="2.2" stroke-linecap="round" />
          </g>
        </svg>
      </motion.div>

      {/* Decorative Gold & Red Divider */}
      <div className="flex items-center justify-center gap-2 mt-3 opacity-80">
        <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <span className="text-[#D4AF37] text-xs">✦</span>
        <span className="w-2 h-2 rounded-full bg-[#8B0000] border border-[#D4AF37]" />
        <span className="text-[#D4AF37] text-xs">✦</span>
        <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>
    </div>
  );
}
