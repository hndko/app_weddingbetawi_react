import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';

export function CountdownSection() {
  const { weddingConfig } = useWeddingConfig();
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
    <section className="py-20 px-6 relative bg-ivory text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[340px] mx-auto bg-white/70 backdrop-blur-sm rounded-[24px] p-8 border border-gold-soft/30 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-sage/5 rounded-bl-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-betawi-red/5 rounded-tr-[100px] pointer-events-none"></div>

        <h3 className="font-heading text-2xl text-text-dark mb-8 relative z-10">Menuju Hari Bahagia</h3>
        
        <div className="flex justify-center gap-3 md:gap-4 relative z-10">
          {timeBlocks.map((block) => (
            <div key={block.label} className="flex flex-col items-center">
              <div className="w-[52px] h-[60px] md:w-16 md:h-[68px] flex items-center justify-center bg-sage-50/50 rounded-xl border border-sage/20 mb-2 shadow-sm">
                <span className="font-heading text-2xl md:text-3xl text-sage-dark">{String(block.value).padStart(2, '0')}</span>
              </div>
              <span className="text-[9px] md:text-[10px] text-text-dark/60 uppercase tracking-[0.15em]">{block.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
