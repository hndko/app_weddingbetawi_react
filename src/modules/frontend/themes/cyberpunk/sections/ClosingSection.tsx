import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <footer className="py-20 px-6 relative overflow-hidden flex flex-col items-center text-center bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-[#05050A]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Holographic Glowing Seal */}
        <div className="w-14 h-14 rounded-2xl bg-black text-[#00F0FF] border-2 border-[#00F0FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)] mb-6">
          <Heart size={24} className="fill-[#FF007F] text-[#FF007F]" />
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-black text-[#00F0FF] mb-3 tracking-tight uppercase drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
          TERIMA KASIH
        </h3>

        <p className="text-xs sm:text-[13px] text-gray-300 leading-relaxed max-w-sm mb-6 font-sans">
          Ungkapan terima kasih yang tak terhingga atas setiap doa restu, kehadiran, dan cinta yang telah melengkapi simfoni hari bahagia kami di Night City.
        </p>

        {/* Terminal Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-[#FF007F]/50 shadow-[0_0_10px_rgba(255,0,127,0.25)] mb-6">
          <Terminal size={12} className="text-[#FF007F]" />
          <span className="text-xs font-mono font-bold text-[#FFE600] tracking-widest uppercase">
            STATUS: HAPPILY_EVER_AFTER // LOCKED ✨
          </span>
        </div>

        <p className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-1">
          KAMI YANG BERBAHAGIA,
        </p>

        <h4 className="font-heading text-2xl font-black text-white mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h4>

        {/* Minimal Footer Signature */}
        <div className="pt-6 border-t border-[#00F0FF]/20 w-full flex flex-col items-center gap-1 font-mono text-[10px] text-gray-500">
          <span>NEO-JAKARTA CYBER MATRIMONY // 2077</span>
          <span>SYSTEM ENCRYPTED • ALL RIGHTS RESERVED</span>
        </div>
      </motion.div>
    </footer>
  );
};
