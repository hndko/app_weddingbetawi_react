import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { RumahKebaya } from './decorations/RumahKebaya';
import { OndelOndel } from './decorations/OndelOndel';
import { FloatingFlowers } from './decorations/FloatingFlowers';
import { HouseBackgroundFlowers } from './decorations/HouseBackgroundFlowers';
import { FloralDivider } from './decorations/FloralDivider';
import { OndelFloralDecoration } from './decorations/OndelFloralDecoration';
import { InteractiveEnvelopeCoverCard } from '../../shared/components/InteractiveEnvelopeCoverCard';

import React from 'react';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-6 overflow-y-auto overflow-x-hidden no-scrollbar pt-12 pb-0"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Background Decor */}
      <FloatingFlowers className="opacity-40" />
      <OndelFloralDecoration position="center" className="opacity-[0.04] scale-150" />


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full mt-6 shrink-0 min-h-max pb-8"
      >
        <span className="text-xs md:text-sm tracking-[0.25em] text-sage-dark uppercase mb-4">The Wedding Of</span>
        
        <h1 className="font-heading text-5xl md:text-6xl text-text-dark leading-tight mb-4">
          {weddingConfig.groom.nickname}
          <span className="block text-3xl text-sage my-1 font-body italic">&</span>
          {weddingConfig.bride.nickname}
        </h1>
        
        <div className="w-16 h-[1px] bg-gold-soft mb-4"></div>
        <div className="text-sm tracking-widest text-sage-dark mb-6">
          {weddingConfig.dateStr.toUpperCase()}
        </div>

        <InteractiveEnvelopeCoverCard
          onOpen={onOpen}
          guestName={guestName}
          recipientLabel="Kepada Yth. Bapak/Ibu/Saudara/i"
          buttonText="Buka Undangan"
          themeStyle={{
            envelopePocketBg: 'rgba(255, 255, 255, 0.88)',
            envelopeFlapBg: 'rgba(244, 248, 244, 0.96)',
            envelopeBorder: 'rgba(92, 131, 116, 0.35)',
            waxColor: '#991B1B',
            waxRingColor: '#D4AF37',
            waxTextColor: '#FFFDF9',
            letterBg: 'rgba(255, 255, 255, 0.95)',
            letterBorder: 'rgba(92, 131, 116, 0.25)',
            buttonBg: 'var(--color-sage, #5C8374)',
            buttonText: '#FFFFFF',
          }}
        >
          <div className="my-1 scale-90">
            <FloralDivider />
          </div>
        </InteractiveEnvelopeCoverCard>
      </motion.div>

      {/* Rumah Kebaya & Ondel-ondel Scene at bottom */}
      <motion.div 
        className="relative w-full max-w-sm mx-auto h-[160px] flex justify-center items-end z-10 opacity-90 mt-auto shrink-0 pb-2 pointer-events-none"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        {/* House background flowers bursting from behind the house */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[0px] -z-10 w-[90%] max-w-[320px]">
           <HouseBackgroundFlowers className="w-full h-auto opacity-100 drop-shadow-sm scale-[0.85] origin-bottom" />
        </div>

        <RumahKebaya className="w-[85%] max-w-[300px] relative z-20 drop-shadow-sm" />

        {/* Ondel-ondel Male on Left */}
        <div className="absolute left-2 sm:left-4 bottom-4 z-20"> 
           <OndelOndel type="male" variant="static" className="w-16 h-auto drop-shadow-md" />
           {/* Additional static flower accent */}
           <div className="absolute -left-3 bottom-6 sm:bottom-8 text-betawi-red animate-pulse">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 2 10 8 5 10C10 12 12 18 12 18C12 18 14 12 19 10C14 8 12 2 12 2Z" />
             </svg>
           </div>
        </div>
        
        {/* Ondel-ondel Female on Right */}
        <div className="absolute right-2 sm:right-4 bottom-4 z-20"> 
           <OndelOndel type="female" variant="static" className="w-16 h-auto drop-shadow-md" />
           {/* Additional static flower accent */}
           <div className="absolute -right-3 bottom-8 sm:bottom-10 text-gold animate-pulse" style={{ animationDelay: '0.5s' }}>
             <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C12 2 10 8 5 10C10 12 12 18 12 18C12 18 14 12 19 10C14 8 12 2 12 2Z" />
             </svg>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
