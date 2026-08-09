import { cn } from "../../utils/cn";

export function GigiBalangDivider({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex justify-center py-6", className)}>
      <svg width="240" height="20" viewBox="0 0 240 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
        <path d="M0 0 L15 20 L30 0 Z" fill="var(--color-sage-soft)" />
        <path d="M30 0 L45 20 L60 0 Z" fill="var(--color-sage-dark)" opacity="0.8" />
        <path d="M60 0 L75 20 L90 0 Z" fill="var(--color-gold-soft)" opacity="0.9" />
        <path d="M90 0 L105 20 L120 0 Z" fill="var(--color-sage-soft)" />
        <path d="M120 0 L135 20 L150 0 Z" fill="var(--color-betawi-red)" opacity="0.7" />
        <path d="M150 0 L165 20 L180 0 Z" fill="var(--color-sage-dark)" opacity="0.8" />
        <path d="M180 0 L195 20 L210 0 Z" fill="var(--color-gold-soft)" opacity="0.9" />
        <path d="M210 0 L225 20 L240 0 Z" fill="var(--color-sage-soft)" />
        
        {/* Bottom dots */}
        <circle cx="15" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="45" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="75" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="105" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="135" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="165" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="195" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
        <circle cx="225" cy="25" r="2" fill="var(--color-gold)" opacity="0.5"/>
      </svg>
    </div>
  );
}
