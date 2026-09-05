import React from 'react';
import { motion } from 'motion/react';
import { Crown } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-10 px-5 flex flex-col items-center text-center font-serif">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm bg-gradient-to-b from-[#FFFDF9]/95 to-[#FAF5EE]/95 rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-md relative overflow-hidden"
      >
        {/* Top Crown Accent */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-8 bg-[#D4AF37]" />
          <Crown size={16} className="text-[#D4AF37]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#854D0E]">
            TITAH MAKLUMAT RESMI
          </span>
          <Crown size={16} className="text-[#D4AF37]" />
          <div className="h-px w-8 bg-[#D4AF37]" />
        </div>

        {/* Bismillah */}
        <h3 className="text-xl font-bold text-[#854D0E] mb-3">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h3>

        <p className="text-xs text-[#555555] italic mb-3">
          Assalamu’alaikum Warahmatullahi Wabarakatuh
        </p>

        <p className="text-xs text-[#2C1810] leading-relaxed mb-4">
          Dengan memohon rahmat dan ridho Allah Yang Maha Kuasa, merupakan kehormatan istimewa bagi kami untuk menyampaikan maklumat bahagia penyatuan dua hati dalam ikatan suci pernikahan.
        </p>

        {/* Quran Verse */}
        <div className="pt-4 border-t border-[#D4AF37]/40 text-xs text-[#555555] italic leading-relaxed bg-[#F5E6CA]/30 p-3 rounded-2xl">
          <p>
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
          </p>
          <span className="block text-[10px] font-bold uppercase text-[#854D0E] mt-2 not-italic tracking-widest">
            — SURAH AR-RUM : 21 —
          </span>
        </div>
      </motion.div>
    </section>
  );
};
