import { cn } from '../../../../../utils/cn';

export function AppFrame({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 z-0 pointer-events-none rounded-[inherit] overflow-hidden opacity-50", className)}>
      {/* 2 Corners Kembang Kelapa Motif (Top Only) */}
      {[
        { className: "top-2 left-2" },
        { className: "top-2 right-2 scale-x-[-1]" }
      ].map((corner, i) => (
        <div key={i} className={cn("absolute w-28 h-28 opacity-100 drop-shadow-lg", corner.className)}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Elegant Corner Filigree */}
            <path d="M0 0 L100 0 C100 0 100 100 0 100 Z" fill="var(--color-sage)" opacity="0.2"/>
            <path d="M0 0 L75 0 C75 0 75 75 0 75 Z" fill="var(--color-gold)" opacity="0.3"/>
            
            {/* Swirls / Batik Pucuk Rebung Inspired */}
            <path d="M0 55 Q 55 55 55 0" stroke="var(--color-gold)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M0 70 Q 70 70 70 0" stroke="var(--color-sage-dark)" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
            <path d="M0 85 Q 85 85 85 0" stroke="var(--color-betawi-red)" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
            
            {/* Kembang Kelapa Spikes */}
            <path d="M20 20 L60 25" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="60" cy="25" r="4.5" fill="var(--color-betawi-red)"/>
            
            <path d="M20 20 L70 45" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="70" cy="45" r="4.5" fill="var(--color-sage-dark)"/>
            
            <path d="M20 20 L45 70" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="45" cy="70" r="4.5" fill="var(--color-gold)"/>
            
            <path d="M20 20 L25 60" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="25" cy="60" r="4.5" fill="var(--color-betawi-red)"/>

            {/* Corner Flower */}
            <path d="M12 12 C 40 5, 45 35, 25 50 C 5 35, 5 5, 12 12 Z" fill="var(--color-warm-white)" />
            <path d="M12 12 C 40 5, 45 35, 25 50 C 5 35, 5 5, 12 12 Z" fill="var(--color-betawi-red)" opacity="0.9"/>
            <circle cx="22" cy="22" r="7" fill="var(--color-gold)"/>
            <circle cx="22" cy="22" r="3" fill="var(--color-warm-white)"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
