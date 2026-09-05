import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <footer className="py-20 px-6 relative overflow-hidden flex flex-col items-center text-center bg-gradient-to-b from-transparent via-[#8B0000]/5 to-[#8B0000]/15">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        {/* Sacred Heart / Talawang Monogram */}
        <div className="w-14 h-14 rounded-2xl bg-[#8B0000] text-[#FFF3C4] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg mb-6">
          <Heart size={24} className="fill-[#FFF3C4]" />
        </div>

        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#8B0000] mb-3">
          Terima Kasih
        </h3>

        <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed max-w-sm mb-6 font-sans">
          Ungkapan terima kasih yang tak terhingga atas doa restu, kehadiran, dan kehangatan yang Bapak/Ibu/Saudara/i berikan bagi lembaran baru hidup kami.
        </p>

        {/* Traditional Dayak Kenyah Exclamation */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#D4AF37]/50 shadow-xs mb-6">
          <span className="text-xs font-serif font-bold text-[#8B0000] tracking-widest uppercase">
            Arus, Arus, Arus! ✨
          </span>
        </div>

        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">
          Kami yang berbahagia,
        </p>

        <h4 className="font-heading text-2xl font-bold text-[#8B0000] mb-8">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </h4>

        {/* Minimal Footer Signature */}
        <div className="pt-6 border-t border-[#D4AF37]/30 w-full flex flex-col items-center gap-1 text-[11px] text-gray-400">
          <span>Dayak Kenyah Borneo Heritage Wedding</span>
          <span>© {new Date().getFullYear()} • All Rights Reserved</span>
        </div>
      </motion.div>
    </footer>
  );
};
