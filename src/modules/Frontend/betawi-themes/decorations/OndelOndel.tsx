import { cn } from '../../../../utils/cn';

interface OndelOndelProps {
  className?: string;
  type?: 'male' | 'female';
  variant?: 'float' | 'float-delayed' | 'static';
}

export function OndelOndel({ className, type = 'male', variant = 'float' }: OndelOndelProps) {
  const isMale = type === 'male';

  const spikes = Array.from({ length: 19 }).map((_, i) => {
    const angle = -75 + (i * 150 / 18);
    const color = i % 2 === 0 ? "#A8D984" : "#73C2FB";
    return { angle, color };
  });

  return (
    <div 
      className={cn(
        "relative pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]", 
        variant === 'float' ? "animate-float" : "animate-float-delayed",
        className
      )}
    >
      <svg viewBox="0 0 200 310" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
        {/* KEMBANG KELAPA */}
        <g transform="translate(100, 95)">
          {spikes.map((s, i) => (
            <g key={`spike-${i}`} transform={`rotate(${s.angle})`}>
              <line x1="0" y1="-35" x2="0" y2="-90" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" />
              {/* Leaves */}
              {[45, 55, 65, 75, 85].map((y) => (
                <g key={y}>
                  <line x1="0" y1={-y} x2="-8" y2={-y - 6} stroke={s.color} strokeWidth="2" strokeLinecap="round" />
                  <line x1="0" y1={-y} x2="8" y2={-y - 6} stroke={s.color} strokeWidth="2" strokeLinecap="round" />
                </g>
              ))}
            </g>
          ))}
        </g>

        {isMale ? (
          // MALE BODY
          <g>
            {/* Hands */}
            <circle cx="45" cy="200" r="6" fill="#F1C40F" />
            <circle cx="155" cy="200" r="6" fill="#F1C40F" />
            
            {/* Shirt */}
            <path d="M 65 120 C 55 120 40 140 40 205 L 160 205 C 160 140 145 120 135 120 Z" fill="#1C1C1C" />
            <path d="M 100 120 L 100 205" stroke="#333" strokeWidth="1" /> {/* Center line */}

            {/* Green Scarves */}
            <rect x="55" y="120" width="22" height="75" fill="#4CAF50" />
            <rect x="123" y="120" width="22" height="75" fill="#4CAF50" />

            {/* Belt */}
            <rect x="42" y="195" width="116" height="20" rx="3" fill="#6D4C41" />
            
            {/* Skirt */}
            <g clipPath="url(#male-skirt-clip)">
               <path d="M 45 215 L 35 300 Q 100 305 165 300 L 155 215 Z" fill="#D35400" />
               <g opacity="0.6">
                 {/* Batik Lines */}
                 {Array.from({ length: 15 }).map((_, i) => (
                    <path key={i} d={`M ${10 + i * 15} 215 L ${-20 + i * 15} 305`} stroke="#7B241C" strokeWidth="4" />
                 ))}
                 {Array.from({ length: 15 }).map((_, i) => (
                    <circle key={`d${i}`} cx={25 + i * 15} cy="235" r="2" fill="#7B241C" />
                 ))}
                 {Array.from({ length: 15 }).map((_, i) => (
                    <circle key={`d2${i}`} cx={20 + i * 15} cy="265" r="2" fill="#7B241C" />
                 ))}
                 {Array.from({ length: 15 }).map((_, i) => (
                    <circle key={`d3${i}`} cx={15 + i * 15} cy="295" r="2" fill="#7B241C" />
                 ))}
               </g>
            </g>
            <defs>
              <clipPath id="male-skirt-clip">
                <path d="M 45 215 L 35 300 Q 100 305 165 300 L 155 215 Z" />
              </clipPath>
            </defs>
          </g>
        ) : (
          // FEMALE BODY
          <g>
            {/* Hands */}
            <circle cx="45" cy="205" r="6" fill="#F1C40F" />
            <circle cx="155" cy="205" r="6" fill="#F1C40F" />
            
            {/* Shirt */}
            <path d="M 65 120 C 55 120 40 140 40 210 L 160 210 C 160 140 145 120 135 120 Z" fill="#F07178" />
            <path d="M 100 120 L 100 210" stroke="#E05B63" strokeWidth="2" /> {/* Center line */}

            {/* Sash */}
            <path d="M 50 125 L 75 120 L 155 195 L 130 215 Z" fill="#F4D03F" />
            {/* Sash Fringes */}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <line key={i} x1={130 + i * 4} y1={215 - i * 3.5} x2={127 + i * 4} y2={220 - i * 3.5} stroke="#D4AC0D" strokeWidth="2" />
            ))}

            {/* Skirt */}
            <g clipPath="url(#female-skirt-clip)">
               <path d="M 45 210 L 35 300 Q 100 305 165 300 L 155 210 Z" fill="#1ABC9C" />
               <path d="M 88 210 L 83 303 L 117 303 L 112 210 Z" fill="#F4D03F" />
               
               {/* Diamonds in stripe */}
               <polygon points="100,225 90,240 100,255 110,240" fill="#1ABC9C" />
               <polygon points="100,265 88,280 100,295 112,280" fill="#1ABC9C" />
               
               {/* Side lines */}
               <path d="M 80 210 L 75 302" stroke="#F4D03F" strokeWidth="1.5" />
               <path d="M 120 210 L 125 302" stroke="#F4D03F" strokeWidth="1.5" />
            </g>
            <defs>
              <clipPath id="female-skirt-clip">
                <path d="M 45 210 L 35 300 Q 100 305 165 300 L 155 210 Z" />
              </clipPath>
            </defs>
          </g>
        )}

        {/* HEAD */}
        <g>
          {/* Female Hair Buns */}
          {!isMale && (
            <>
              <circle cx="62" cy="120" r="14" fill="#2C2C2C" />
              <circle cx="138" cy="120" r="14" fill="#2C2C2C" />
            </>
          )}

          {/* Ears */}
          <circle cx="55" cy="95" r="8" fill={isMale ? "#A93226" : "#F4F6F6"} />
          <circle cx="145" cy="95" r="8" fill={isMale ? "#A93226" : "#F4F6F6"} />
          
          {/* Earrings */}
          {!isMale && (
            <>
              <circle cx="53" cy="103" r="3" fill="#F1C40F" />
              <circle cx="147" cy="103" r="3" fill="#F1C40F" />
            </>
          )}

          {/* Face */}
          <circle cx="100" cy="90" r="42" fill={isMale ? "#CB4335" : "#FFFFFF"} />

          {/* CROWN */}
          <path d="M 58 85 C 58 40 142 40 142 85 Z" fill="#F4D03F" />
          {/* Crown Rim */}
          <path d="M 55 85 C 80 75 120 75 145 85 L 143 90 C 120 80 80 80 57 90 Z" fill="#F39C12" />
          {/* Crown Triangle */}
          <path d="M 75 80 L 100 52 L 125 80 Z" fill="#F39C12" />
          <path d="M 85 78 L 100 62 L 115 78 Z" fill="#F4D03F" />
          <circle cx="100" cy="67" r="2.5" fill="#E67E22" />
          <circle cx="94" cy="75" r="2.5" fill="#E67E22" />
          <circle cx="106" cy="75" r="2.5" fill="#E67E22" />

          {/* FACE DETAILS */}
          {/* Eyes */}
          <circle cx="75" cy="95" r="6" fill="#2C2C2C" />
          <circle cx="125" cy="95" r="6" fill="#2C2C2C" />
          {/* Highlights */}
          <circle cx="77" cy="93" r="2.5" fill="#FFFFFF" />
          <circle cx="127" cy="93" r="2.5" fill="#FFFFFF" />
          
          {/* Eyebrows */}
          {isMale ? (
            <>
              <path d="M 68 85 Q 75 80 82 85" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 118 85 Q 125 80 132 85" fill="none" stroke="#2C2C2C" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M 68 85 Q 75 80 82 85" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 118 85 Q 125 80 132 85" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" />
              {/* Eyelashes */}
              <path d="M 65 92 L 62 88" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 135 92 L 138 88" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}

          {/* Cheeks */}
          <circle cx="68" cy="108" r="5" fill={isMale ? "#7B241C" : "#F5B7B1"} opacity={isMale ? "0.6" : "0.8"} />
          <circle cx="132" cy="108" r="5" fill={isMale ? "#7B241C" : "#F5B7B1"} opacity={isMale ? "0.6" : "0.8"} />

          {/* Mouth & Mustache */}
          {isMale ? (
            <>
               <path d="M 95 110 C 95 116 105 116 105 110 Z" fill="#FFFFFF" />
               <path d="M 100 105 C 93 98 80 102 80 108 C 87 105 95 105 100 108 C 105 105 113 105 120 108 C 120 102 107 98 100 105 Z" fill="#2C2C2C" />
            </>
          ) : (
            <path d="M 92 108 C 92 114 108 114 108 108 C 108 105 92 105 92 108 Z" fill="#E74C3C" />
          )}

        </g>
      </svg>
    </div>
  )
}
