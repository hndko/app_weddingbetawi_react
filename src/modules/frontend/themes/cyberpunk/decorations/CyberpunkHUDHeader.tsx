import { motion } from 'motion/react';
import { Terminal, ShieldCheck, Zap } from 'lucide-react';

interface CyberpunkHUDHeaderProps {
  className?: string;
}

export function CyberpunkHUDHeader({ className = '' }: CyberpunkHUDHeaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center relative ${className}`}>
      {/* Sci-Fi Target Reticle & Digital Scanline Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 260 90"
          className="w-64 h-24 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          <defs>
            <linearGradient id="cyberNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#FF007F" />
              <stop offset="100%" stopColor="#FFE600" />
            </linearGradient>
          </defs>

          {/* Left Angle Cyber Bracket */}
          <path d="M 45,15 L 15,15 L 5,25 L 5,65 L 15,75 L 45,75" fill="none" stroke="#00F0FF" strokeWidth="2" />
          <line x1="5" y1="45" x2="25" y2="45" stroke="#00F0FF" strokeWidth="1" strokeDasharray="2,2" />

          {/* Right Angle Cyber Bracket */}
          <path d="M 215,15 L 245,15 L 255,25 L 255,65 L 245,75 L 215,75" fill="none" stroke="#00F0FF" strokeWidth="2" />
          <line x1="235" y1="45" x2="255" y2="45" stroke="#00F0FF" strokeWidth="1" strokeDasharray="2,2" />

          {/* Center HUD Hexagon Box */}
          <polygon
            points="70,20 190,20 205,45 190,70 70,70 55,45"
            fill="#05050A"
            stroke="url(#cyberNeonGrad)"
            strokeWidth="1.8"
          />

          {/* Holographic Glowing Neon Heart in Center */}
          <g transform="translate(130, 45)">
            <path
              d="M 0,-10 C -12,-25 -25,-6 0,20 C 25,-6 12,-25 0,-10 Z"
              fill="#FF007F"
              opacity="0.3"
            />
            <path
              d="M 0,-10 C -12,-25 -25,-6 0,20 C 25,-6 12,-25 0,-10 Z"
              fill="none"
              stroke="#FF007F"
              strokeWidth="2"
            />
            <circle cx="0" cy="3" r="3" fill="#00F0FF" />
          </g>

          {/* Top & Bottom Sub-data */}
          <text x="130" y="32" font-family="'Courier New', monospace" font-size="6" fill="#00F0FF" text-anchor="middle" letter-spacing="1">
            NEURAL.LINK // ACTIVE
          </text>
          <text x="130" y="62" font-family="'Courier New', monospace" font-size="6" fill="#FFE600" text-anchor="middle" letter-spacing="1">
            [106.8456° E, 6.2088° S]
          </text>
        </svg>
      </motion.div>

      {/* Terminal Status Ticker */}
      <div className="flex items-center gap-2 mt-1 font-mono text-[10px] text-[#00F0FF]">
        <Terminal size={11} className="text-[#FF007F]" />
        <span className="opacity-90">SYS://PROTOCOL_MATRIMONY_V2077</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
      </div>
    </div>
  );
}
