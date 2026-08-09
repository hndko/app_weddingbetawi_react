import { cn } from "../../utils/cn";

export function OndelFloralDecoration({ className, position }: { className?: string, position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-center' | 'center' }) {
  return (
    <svg 
      className={cn(
        "absolute pointer-events-none w-48 h-48",
        position === 'top-left' && "-top-8 -left-8",
        position === 'top-right' && "-top-8 -right-8",
        position === 'bottom-left' && "-bottom-8 -left-8",
        position === 'bottom-right' && "-bottom-8 -right-8",
        position === 'bottom-center' && "-bottom-12 left-1/2 -translate-x-1/2",
        position === 'top-center' && "-top-12 left-1/2 -translate-x-1/2",
        position === 'center' && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
      viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      {/* Subtle Sunburst / Background Glow */}
      <circle cx="100" cy="100" r="70" fill="var(--color-gold-soft)" opacity="0.15" />

      {/* Flowers */}
      <path d="M165 135 C180 120, 200 140, 185 155 C200 170, 180 190, 165 175 C150 190, 130 170, 145 155 C130 140, 150 120, 165 135 Z" fill="var(--color-betawi-red)" opacity="0.9"/>
      <circle cx="165" cy="155" r="6" fill="var(--color-gold)"/>
      
      <path d="M35 55 C45 40, 65 55, 50 70 C65 85, 45 100, 35 85 C20 100, 0 85, 15 70 C0 55, 20 40, 35 55 Z" fill="var(--color-gold)" opacity="0.9"/>
      <circle cx="35" cy="70" r="5" fill="var(--color-blue-accent)"/>

      <path d="M160 45 C172 33, 187 45, 175 57 C187 69, 172 81, 160 69 C148 81, 133 69, 145 57 C133 45, 148 33, 160 45 Z" fill="var(--color-sage-soft)" opacity="0.9"/>
      <circle cx="160" cy="57" r="4" fill="var(--color-betawi-red)"/>

      <path d="M40 145 C50 135, 65 145, 55 155 C65 165, 50 175, 40 165 C30 175, 15 165, 25 155 C15 145, 30 135, 40 145 Z" fill="var(--color-sage-dark)" opacity="0.7"/>
      <circle cx="40" cy="155" r="4" fill="var(--color-gold-soft)"/>

      {/* Stylized Ondel-Ondel */}
      <g transform="translate(0, 10)">
        {/* Kembang Kelapa */}
        <path d="M100 70 L100 20" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M100 70 L65 35" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M100 70 L135 35" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M100 70 L45 65" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M100 70 L155 65" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinecap="round"/>
        
        <circle cx="100" cy="15" r="5" fill="var(--color-betawi-red)"/>
        <circle cx="60" cy="30" r="5" fill="var(--color-sage-dark)"/>
        <circle cx="140" cy="30" r="5" fill="var(--color-blue-accent)"/>
        <circle cx="40" cy="63" r="5" fill="var(--color-betawi-red)"/>
        <circle cx="160" cy="63" r="5" fill="var(--color-sage-dark)"/>

        <circle cx="85" cy="45" r="3.5" fill="var(--color-blue-accent)"/>
        <circle cx="115" cy="45" r="3.5" fill="var(--color-gold)"/>
        
        {/* Head/Crown */}
        <path d="M75 75 Q100 55 125 75 L125 110 Q100 135 75 110 Z" fill="var(--color-sage-soft)" stroke="var(--color-sage-dark)" strokeWidth="2.5"/>
        {/* Crown Details */}
        <path d="M75 75 Q100 55 125 75" fill="none" stroke="var(--color-gold)" strokeWidth="6"/>
        <path d="M85 68 L90 85 L100 75 L110 85 L115 68" fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinejoin="round"/>
        
        {/* Minimalist Face */}
        <path d="M88 92 Q93 88 98 92" stroke="var(--color-sage-dark)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M102 92 Q107 88 112 92" stroke="var(--color-sage-dark)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M92 110 Q100 115 108 110" stroke="var(--color-betawi-red)" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </g>

      {/* Leaves */}
      <path d="M135 155 Q125 175 140 185 Q155 175 135 155 Z" fill="var(--color-sage)"/>
      <path d="M145 115 Q125 105 120 125 Q135 140 145 115 Z" fill="var(--color-sage-soft)"/>
      <path d="M55 85 Q40 100 60 115 Q75 100 55 85 Z" fill="var(--color-sage)"/>
      <path d="M35 105 Q30 120 45 125 Q55 115 35 105 Z" fill="var(--color-sage-soft)"/>
      <path d="M65 145 Q50 160 70 175 Q85 160 65 145 Z" fill="var(--color-sage-soft)"/>
    </svg>
  )
}
