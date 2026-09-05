import React from 'react';
import { motion } from 'motion/react';
import { Cpu, Terminal } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section className="py-12 px-6 flex flex-col items-center text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-[#0F1020]/85 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#00F0FF]/30 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative"
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#00F0FF]/20 font-mono text-[10px] text-[#00F0FF]">
          <div className="flex items-center gap-1.5">
            <Terminal size={12} className="text-[#FF007F]" />
            <span>CORE_ROMANCE.SYS</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF007F]" />
            <span className="w-2 h-2 rounded-full bg-[#FFE600]" />
            <span className="w-2 h-2 rounded-full bg-[#00F0FF]" />
          </div>
        </div>

        {/* Quantum Love Proclamation */}
        <h3 className="font-mono text-sm sm:text-base font-bold text-[#00F0FF] mb-2 leading-relaxed tracking-wide">
          "Di antara jutaan frekuensi di belantara Night City, sinyal hati kami menyatu dalam satu harmoni abadi."
        </h3>

        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#FF007F] uppercase tracking-wider mb-4">
          <Cpu size={12} />
          <span>Neural Synchrony: Two Souls, One Eternal Matrix</span>
        </div>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mx-auto mb-4" />

        <p className="text-xs text-gray-300 leading-relaxed font-sans">
          Dengan penuh rasa syukur kepada Tuhan Yang Maha Esa, kami mengundang Anda untuk menjadi saksi pengikatan janji suci pernikahan kami. 
          Sebuah perayaan cinta berteknologi tinggi di mana kehangatan doa keluarga dan sahabat menjadi energi terbesar perjalanan baru kami.
        </p>
      </motion.div>
    </section>
  );
};
