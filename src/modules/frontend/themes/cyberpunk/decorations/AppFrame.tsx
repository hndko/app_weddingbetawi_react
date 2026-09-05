import { FloatingNeonParticles } from './FloatingNeonParticles';
import { AnimatedCircuitFiligree } from './AnimatedCircuitFiligree';

export function AppFrame() {
  return (
    <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      {/* Floating Neon Hex & Data Bits Suite */}
      <FloatingNeonParticles />

      {/* Swaying PCB Circuit Corner Filigrees Suite */}
      <AnimatedCircuitFiligree position="top-left" />
      <AnimatedCircuitFiligree position="top-right" />
      <AnimatedCircuitFiligree position="bottom-left" />
      <AnimatedCircuitFiligree position="bottom-right" />

      {/* Cyber Frame Inset Borders with Chamfered Corners */}
      <div className="absolute inset-2 sm:inset-3 border border-[#00F0FF]/30 rounded-2xl pointer-events-none" />
      <div className="absolute inset-3.5 sm:inset-4 border border-[#FF007F]/20 rounded-xl pointer-events-none" />

      {/* Top HUD Status Ticker */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-80 bg-black/70 px-3 py-0.5 rounded-full border border-[#00F0FF]/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
        <span className="font-mono text-[9px] text-[#00F0FF] tracking-widest uppercase">
          SECURE QUANTUM LINK // 100%
        </span>
      </div>

      {/* Bottom HUD Ticker */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-80 bg-black/70 px-3 py-0.5 rounded-full border border-[#FF007F]/40">
        <span className="font-mono text-[9px] text-[#FF007F] tracking-widest uppercase">
          NEO-JAKARTA // SECTOR 7
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF007F] animate-pulse" />
      </div>
    </div>
  );
}
