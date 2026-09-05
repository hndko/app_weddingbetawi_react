import React from 'react';
import { motion } from 'motion/react';
import { Instagram, ShieldCheck, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <section className="relative py-10 px-5 flex flex-col items-center">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-6 font-mono"
      >
        <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#22D3EE] block mb-1">
          CHARACTER SELECT • PARTY MEMBERS
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#F8FAFC]">
          PLAYER 1 &amp; PLAYER 2
        </h2>
        <div className="w-16 h-1 bg-[#F43F5E] mx-auto mt-2" />
      </motion.div>

      <div className="flex flex-col gap-6 w-full max-w-sm">
        {/* Player 1: Groom */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#1E293B] rounded-2xl p-5 border-2 border-[#22D3EE] shadow-[0_0_12px_rgba(34,211,238,0.2)] font-mono flex flex-col items-center text-center relative"
        >
          <div className="flex items-center justify-between w-full text-[9px] text-[#22D3EE] font-bold mb-2">
            <span>[1P] GROOM</span>
            <span>LVL 99</span>
          </div>

          <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-[#22D3EE] mb-3 relative">
            <img
              src={groom.image}
              alt={groom.fullName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="text-base font-bold text-[#F8FAFC]">
            {groom.fullName}
          </h3>
          <span className="text-[11px] text-[#38BDF8] font-semibold mt-0.5">
            CLASS: GENTLEMAN &amp; PROTECTOR
          </span>

          <p className="text-[11px] text-slate-400 mt-1">
            Putra dari {groom.parents}
          </p>

          <div className="w-full bg-[#0F172A] p-2 rounded-lg border border-slate-700 text-[10px] text-left text-slate-300 mt-2.5 flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#10B981] shrink-0" />
            <span>SPECIAL: Unconditional Devotion</span>
          </div>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#22D3EE] font-medium hover:underline bg-[#0F172A] px-3 py-1 rounded-lg border border-[#22D3EE]/40"
            >
              <Instagram size={13} />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>

        {/* Player 2: Bride */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#1E293B] rounded-2xl p-5 border-2 border-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.2)] font-mono flex flex-col items-center text-center relative"
        >
          <div className="flex items-center justify-between w-full text-[9px] text-[#F43F5E] font-bold mb-2">
            <span>[2P] BRIDE</span>
            <span>LVL 99</span>
          </div>

          <div className="w-28 h-32 rounded-xl overflow-hidden border-2 border-[#F43F5E] mb-3 relative">
            <img
              src={bride.image}
              alt={bride.fullName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <h3 className="text-base font-bold text-[#F8FAFC]">
            {bride.fullName}
          </h3>
          <span className="text-[11px] text-[#FB7185] font-semibold mt-0.5">
            CLASS: GRACE &amp; SOULMATE
          </span>

          <p className="text-[11px] text-slate-400 mt-1">
            Putri dari {bride.parents}
          </p>

          <div className="w-full bg-[#0F172A] p-2 rounded-lg border border-slate-700 text-[10px] text-left text-slate-300 mt-2.5 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#F59E0B] shrink-0" />
            <span>SPECIAL: Endless Compassion</span>
          </div>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#F43F5E] font-medium hover:underline bg-[#0F172A] px-3 py-1 rounded-lg border border-[#F43F5E]/40"
            >
              <Instagram size={13} />
              <span>@{bride.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
};
