import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export const IntroSection: React.FC = () => {
  return (
    <section className="relative py-10 px-5 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm bg-gradient-to-b from-white/90 to-[#FAF7F2] rounded-3xl p-6 border border-[#E5A93C]/40 shadow-sm relative overflow-hidden"
      >
        {/* Top Gold Ornament Bar */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8 bg-[#E5A93C]" />
          <Sparkles size={14} className="text-[#E5A93C]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B1E19]">
            SALAM SAKRAL ADAT TORAJA
          </span>
          <Sparkles size={14} className="text-[#E5A93C]" />
          <div className="h-px w-8 bg-[#E5A93C]" />
        </div>

        {/* Bismillah */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#8B1E19] mb-3">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </h3>

        <p className="text-xs text-[#555555] leading-relaxed mb-4">
          Assalamu’alaikum Warahmatullahi Wabarakatuh
        </p>

        <p className="text-xs text-[#444444] leading-relaxed mb-4">
          Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, serta restu dari tetua dan keluarga besar kami, dengan penuh rasa syukur kami bermaksud menyelenggarakan syukuran pernikahan putra-putri kami.
        </p>

        {/* Pepatah Adat Toraja (Kada Tominaa) */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#8B1E19]/5 border border-[#8B1E19]/20 text-[#8B1E19]">
          <p className="font-serif italic text-xs font-semibold mb-1">
            "Misa' kada dipotuo, pantan kada dipomate."
          </p>
          <p className="text-[10px] text-[#666666]">
            (Bersatu kita teguh, bercerai kita runtuh — Filosofi kerukunan hidup berumah tangga masyarakat Tana Toraja)
          </p>
        </div>

        {/* Quran Verse */}
        <div className="pt-3 border-t border-[#E5A93C]/30 text-xs text-[#555555] italic leading-relaxed">
          <p>
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
          </p>
          <span className="block text-[10px] font-bold uppercase text-[#8B1E19] mt-2 not-italic tracking-wider">
            — SURAH AR-RUM : 21 —
          </span>
        </div>
      </motion.div>
    </section>
  );
};
