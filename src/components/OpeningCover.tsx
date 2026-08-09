import { motion } from 'motion/react';
import { MailOpen } from 'lucide-react';
import { config } from '../data/config';
import { useGuestName } from '../hooks/useGuestName';
import { OndelFloralDecoration } from './decorations/OndelFloralDecoration';
import { RumahKebaya } from './decorations/RumahKebaya';
import { OndelOndel } from './decorations/OndelOndel';

import React from 'react';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const guestName = useGuestName();

  return (
    <motion.div 
      className="absolute inset-0 z-50 flex flex-col items-center justify-between text-center px-4 md:px-6 overflow-y-auto no-scrollbar pt-8 md:pt-12 pb-0"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="z-20 flex flex-col items-center w-full flex-grow mt-4 md:mt-6 shrink-0 min-h-max"
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

        <div className="bg-white/70 backdrop-blur-md px-6 py-6 rounded-3xl border border-white/50 shadow-sm w-full max-w-[320px] mb-8 relative z-20">
          <p className="text-xs text-text-dark/70 mb-2 tracking-wide">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="font-heading text-2xl text-text-dark mb-4">{guestName}</p>
          
          <button 
            onClick={onOpen}
            className="w-full bg-sage text-white py-3.5 px-6 rounded-full flex items-center justify-center gap-3 hover:bg-sage-dark transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            <MailOpen size={18} />
            <span className="text-sm font-medium tracking-wide">Buka Undangan</span>
          </button>
        </div>
      </motion.div>

      {/* Rumah Kebaya & Ondel-ondel Scene at bottom */}
      <motion.div 
        className="relative w-full max-w-sm mx-auto h-[120px] md:h-[160px] flex justify-center items-end z-0 opacity-90 pointer-events-none shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <RumahKebaya className="w-[85%] max-w-[300px] absolute bottom-0 z-10 drop-shadow-sm" />
        
        {/* Ondel-ondel Male on Left */}
        <div className="absolute left-0 bottom-2 z-20">
           <OndelOndel type="male" variant="static" className="w-16 h-auto drop-shadow-md" />
        </div>
        
        {/* Ondel-ondel Female on Right */}
        <div className="absolute right-0 bottom-2 z-20">
           <OndelOndel type="female" variant="static" className="w-16 h-auto drop-shadow-md" />
        </div>
      </motion.div>
    </motion.div>
  );
}
