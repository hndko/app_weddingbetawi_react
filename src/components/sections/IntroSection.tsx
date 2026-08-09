import { motion } from 'motion/react';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';
import { FloatingFlowers } from '../decorations/FloatingFlowers';
import { GigiBalangDivider } from '../decorations/GigiBalangDivider';
import { MonasSilhouette } from '../decorations/MonasSilhouette';
import { RumahKebaya } from '../decorations/RumahKebaya';
import { OndelOndel } from '../decorations/OndelOndel';
import { Heart } from 'lucide-react';

export function IntroSection() {
  return (
    <section className="py-24 px-4 md:px-8 text-center bg-white/40 relative overflow-hidden flex flex-col items-center">
      <FloatingFlowers className="opacity-40" />
      <OndelFloralDecoration position="center" className="opacity-[0.04] scale-150" />
      
      {/* Faint Monas Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <MonasSilhouette className="w-[120vw] md:w-[80vw] max-w-[500px] text-sage opacity-[0.25] scale-125 -translate-y-10" />
      </div>

      <div className="max-w-md mx-auto relative z-10 w-full mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="rounded-3xl p-8 md:p-10 bg-warm-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] relative overflow-hidden"
        >
          {/* Ornate Beautiful SVG Frame Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="376" height="376" rx="20" stroke="var(--color-gold)" strokeWidth="2" opacity="0.6"/>
            <rect x="18" y="18" width="364" height="364" rx="14" stroke="var(--color-sage)" strokeWidth="1" strokeDasharray="4 4" opacity="0.8"/>
            
            {/* Top Left Corner */}
            <path d="M12 60 C 30 60, 60 30, 60 12" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M12 40 C 25 40, 40 25, 40 12" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="26" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M26 10 C 26 18, 34 26, 42 26 C 34 26, 26 34, 26 42 C 26 34, 18 26, 10 26 C 18 26, 26 18, 26 10 Z" fill="var(--color-gold)" opacity="0.7"/>

            {/* Top Right Corner */}
            <path d="M388 60 C 370 60, 340 30, 340 12" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M388 40 C 375 40, 360 25, 360 12" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="374" cy="26" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M374 10 C 374 18, 366 26, 358 26 C 366 26, 374 34, 374 42 C 374 34, 382 26, 390 26 C 382 26, 374 18, 374 10 Z" fill="var(--color-gold)" opacity="0.7"/>

            {/* Bottom Left Corner */}
            <path d="M12 340 C 30 340, 60 370, 60 388" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M12 360 C 25 360, 40 375, 40 388" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="374" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M26 390 C 26 382, 34 374, 42 374 C 34 374, 26 366, 26 358 C 26 366, 18 374, 10 374 C 18 374, 26 382, 26 390 Z" fill="var(--color-gold)" opacity="0.7"/>

            {/* Bottom Right Corner */}
            <path d="M388 340 C 370 340, 340 370, 340 388" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M388 360 C 375 360, 360 375, 360 388" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="374" cy="374" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M374 390 C 374 382, 366 374, 358 374 C 366 374, 374 366, 374 358 C 374 366, 382 374, 390 374 C 382 374, 374 382, 374 390 Z" fill="var(--color-gold)" opacity="0.7"/>
          </svg>

          <div className="text-gold mb-6 relative z-10 flex justify-center">
            <Heart size={32} className="text-gold" fill="currentColor" strokeWidth={1} opacity="0.8" />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl text-text-dark mb-6 leading-relaxed">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h3>
          <p className="text-sm text-text-dark/80 leading-loose">
            Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada acara resepsi pernikahan kami.
          </p>
          <div className="mt-8 flex justify-center">
             <GigiBalangDivider />
          </div>
        </motion.div>
      </div>

      {/* Rumah Kebaya & Ondel-ondel Scene */}
      <motion.div 
        className="relative w-full max-w-lg mx-auto h-[200px] sm:h-[240px] flex justify-center items-end z-10 mt-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <RumahKebaya className="w-[85%] sm:w-[90%] max-w-[400px] absolute bottom-0 z-10 drop-shadow-md" />
        
        {/* Ondel-ondel Male on Left */}
        <div className="absolute left-0 sm:left-4 bottom-2 z-20">
           <OndelOndel type="male" variant="float" className="w-20 sm:w-24 h-auto drop-shadow-lg" />
        </div>
        
        {/* Ondel-ondel Female on Right */}
        <div className="absolute right-0 sm:right-4 bottom-2 z-20">
           <OndelOndel type="female" variant="float-delayed" className="w-20 sm:w-24 h-auto drop-shadow-lg" />
        </div>
      </motion.div>
    </section>
  );
}
