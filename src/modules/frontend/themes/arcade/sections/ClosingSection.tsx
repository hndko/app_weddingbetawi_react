import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Award } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-12 px-5 flex flex-col items-center text-center font-mono">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-[#1E293B] rounded-2xl p-6 border-2 border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.25)] relative"
      >
        <div className="w-12 h-12 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B] flex items-center justify-center mx-auto mb-3">
          <Trophy size={24} />
        </div>

        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#F59E0B] block mb-1">
          STAGE 1 COMPLETED • CO-OP FOREVER
        </span>

        <h3 className="text-xl sm:text-2xl font-black text-[#F8FAFC] mb-3">
          THANK YOU FOR PLAYING!
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian adalah power-up terbesar bagi kami untuk menempuh petualangan baru kehidupan berumah tangga.
        </p>

        <div className="p-3 bg-[#0F172A] rounded-xl border border-slate-700 text-xs text-[#22D3EE] font-bold">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
          <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
            [SAVE POINT: RECORDED &amp; SEALED WITH LOVE]
          </span>
        </div>
      </motion.div>
    </section>
  );
};
