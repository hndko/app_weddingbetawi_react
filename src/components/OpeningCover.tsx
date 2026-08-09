import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { config } from '../data/config';
import { useGuestName } from '../hooks/useGuestName';
import { RumahKebaya } from './decorations/RumahKebaya';
import { OndelOndel } from './decorations/OndelOndel';
import { FloatingFlowers } from './decorations/FloatingFlowers';
import { HouseBackgroundFlowers } from './decorations/HouseBackgroundFlowers';
import { FloralDivider } from './decorations/FloralDivider';
import { OndelFloralDecoration } from './decorations/OndelFloralDecoration';

import React from 'react';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
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
          {config.groom.nickname}
          <span className="block text-3xl text-sage my-1 font-body italic">&</span>
          {config.bride.nickname}
        </h1>
        
        <div className="w-16 h-[1px] bg-gold-soft mb-4"></div>
        <div className="text-sm tracking-widest text-sage-dark mb-6">
          {config.dateStr.toUpperCase()}
        </div>

        <div className="bg-white/70 backdrop-blur-md px-6 py-6 rounded-3xl border border-white/50 shadow-sm w-full max-w-[320px] mb-8 relative z-30 overflow-hidden">
          {/* Ornate Beautiful SVG Frame Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" preserveAspectRatio="none" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="376" height="376" rx="20" stroke="var(--color-gold)" strokeWidth="2" opacity="0.6"/>
            <rect x="18" y="18" width="364" height="364" rx="14" stroke="var(--color-sage)" strokeWidth="1" strokeDasharray="4 4" opacity="0.8"/>
            <path d="M12 60 C 30 60, 60 30, 60 12" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M12 40 C 25 40, 40 25, 40 12" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="26" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M388 60 C 370 60, 340 30, 340 12" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M388 40 C 375 40, 360 25, 360 12" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="374" cy="26" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M12 340 C 30 340, 60 370, 60 388" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M12 360 C 25 360, 40 375, 40 388" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="26" cy="374" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
            <path d="M388 340 C 370 340, 340 370, 340 388" stroke="var(--color-gold)" strokeWidth="2" fill="none" />
            <path d="M388 360 C 375 360, 360 375, 360 388" stroke="var(--color-sage)" strokeWidth="1.5" fill="none" />
            <circle cx="374" cy="374" r="4" fill="var(--color-betawi-red)" opacity="0.8"/>
          </svg>
          <p className="text-xs text-text-dark/70 mb-2 tracking-wide relative z-10">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="font-heading text-2xl text-text-dark mb-4 relative z-10">{guestName}</p>
          
          <div className="flex justify-center mb-6 relative z-10">
            <FloralDivider />
          </div>
          
          <button 
             onClick={onOpen}
            className="w-full bg-sage text-white py-3.5 px-6 rounded-full flex items-center justify-center gap-3 hover:bg-sage-dark transition-colors duration-300 shadow-sm hover:shadow-md cursor-pointer relative z-50"
          >
            <MailOpen size={18} />
            <span className="text-sm font-medium tracking-wide">Buka Undangan</span>
          </button>
        </div>
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
