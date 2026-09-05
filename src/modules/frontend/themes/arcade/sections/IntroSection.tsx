import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2 } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-8 px-5 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm bg-[#1E293B] rounded-2xl p-5 border-2 border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.25)] relative text-left font-mono"
      >
        {/* RPG Dialogue Box Header */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
          <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold uppercase">
            <Gamepad2 size={16} />
            <span>MAIN QUEST: SACRED VOWS</span>
          </div>
          <span className="text-[10px] text-[#F59E0B] font-bold">CHAPTER 1</span>
        </div>

        {/* Bismillah in pixel frame */}
        <div className="text-center my-2">
          <p className="font-serif text-base font-bold text-[#FDE68A]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-[10px] text-slate-400 mt-1 italic">
            "Assalamu’alaikum Warahmatullahi Wabarakatuh"
          </p>
        </div>

        {/* Story Text Box */}
        <p className="text-xs text-slate-300 leading-relaxed my-3 bg-[#0F172A] p-3 rounded-lg border border-slate-700">
          ▶ A wild love story appeared! Dengan memohon rahmat dan berkah dari Allah SWT, dua insan yang telah menyelesaikan stage perkenalan kini resmi memulai perjalanan co-op hidup selamanya.
        </p>

        {/* Quran Surah Ar-Rum: 21 */}
        <div className="pt-2 border-t border-slate-700 text-[11px] text-slate-400 leading-relaxed italic">
          <p>
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya..."
          </p>
          <span className="block text-[10px] font-bold text-[#22D3EE] mt-1.5 not-italic tracking-wider uppercase">
            [SURAH AR-RUM : 21]
          </span>
        </div>

        {/* Blinking Dialogue Arrow */}
        <div className="flex justify-end mt-2">
          <span className="text-xs text-[#10B981] animate-bounce">▼ PRESS A</span>
        </div>
      </motion.div>
    </section>
  );
};
