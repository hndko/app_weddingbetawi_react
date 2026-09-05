import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

export function CountdownSection() {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(weddingConfig.dateISO).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingConfig.dateISO]);

  const timeBlocks = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section 
      className="py-20 px-6 relative text-center transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={cn(
          "max-w-[340px] mx-auto backdrop-blur-md rounded-[28px] p-8 relative overflow-hidden transition-all duration-300",
          isDark ? "shadow-2xl shadow-black/60" : "shadow-sm"
        )}
        style={{
          backgroundColor: tokens.cardBg,
          border: `1px solid ${tokens.cardBorder}`,
        }}
      >
        <div 
          className="absolute top-0 right-0 w-28 h-28 rounded-bl-[100px] pointer-events-none opacity-10"
          style={{ backgroundColor: tokens.accent }}
        />
        <div 
          className="absolute bottom-0 left-0 w-28 h-28 rounded-tr-[100px] pointer-events-none opacity-10"
          style={{ backgroundColor: tokens.primary }}
        />

        <h3 
          className="font-heading text-2xl mb-8 relative z-10 font-bold"
          style={{ color: tokens.textPrimary }}
        >
          Menuju Hari Bahagia
        </h3>
        
        <div className="flex justify-center gap-3 md:gap-4 relative z-10">
          {timeBlocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <div 
                className="w-[52px] h-[60px] md:w-16 md:h-[68px] flex items-center justify-center rounded-2xl mb-2 shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: tokens.inputBg,
                  border: `1px solid ${tokens.cardBorder}`,
                }}
              >
                <span 
                  className="font-heading text-2xl md:text-3xl font-black tracking-tight"
                  style={{ color: tokens.accent }}
                >
                  {String(block.value).padStart(2, '0')}
                </span>
              </div>
              <span 
                className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-semibold"
                style={{ color: tokens.textMuted }}
              >
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
