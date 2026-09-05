import { FloatingDayakFeathers } from './FloatingDayakFeathers';
import { AnimatedAsoFiligree } from './AnimatedAsoFiligree';

export function AppFrame() {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Floating Burung Enggang Feathers & Amber Sparks Suite */}
      <FloatingDayakFeathers />

      {/* Swaying Dayak Aso Corner Filigrees Suite */}
      <AnimatedAsoFiligree position="top-left" />
      <AnimatedAsoFiligree position="top-right" />
      <AnimatedAsoFiligree position="bottom-left" />
      <AnimatedAsoFiligree position="bottom-right" />

      {/* Outer Dayak Geometric Border Inset */}
      <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/35 rounded-2xl pointer-events-none" />
      <div className="absolute inset-3.5 sm:inset-4 border border-[#8B0000]/25 rounded-xl pointer-events-none" />

      {/* Top & Bottom Center Talawang Motifs */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-70">
        <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <span className="text-[10px] text-[#D4AF37]">✦</span>
        <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#8B0000]" />
        <span className="text-[10px] text-[#D4AF37]">✦</span>
        <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 opacity-70">
        <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
        <span className="text-[10px] text-[#D4AF37]">✦</span>
        <div className="w-2.5 h-2.5 rotate-45 border border-[#D4AF37] bg-[#8B0000]" />
        <span className="text-[10px] text-[#D4AF37]">✦</span>
        <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
      </div>
    </div>
  );
}
