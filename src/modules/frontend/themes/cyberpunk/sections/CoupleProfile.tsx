import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Zap, Shield, Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <section className="py-16 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="text-center mb-10 flex flex-col items-center">
        <span className="text-[11px] font-mono font-bold text-[#00F0FF] tracking-widest uppercase mb-1">
          // CHARACTER MATRIX
        </span>
        <h2 className="font-heading text-3xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]">
          KEDUA MEMPELAI
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-10 h-[1px] bg-[#00F0FF]" />
          <span className="text-xs text-[#FFE600] font-mono">100% SYNC</span>
          <span className="w-10 h-[1px] bg-[#FF007F]" />
        </div>
      </div>

      <div className="max-w-md w-full flex flex-col gap-10">
        {/* GROOM CARD (PLAYER 1 - NETRUNNER) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-[#0F1020]/90 backdrop-blur-md rounded-3xl p-6 border border-[#00F0FF]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col items-center text-center relative"
        >
          {/* Photo Frame with Cyber Cyan Glow */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.5)] p-1 bg-black">
              <img
                src={groom.image || '/assets/groom.jpg'}
                alt={groom.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* HUD Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#00F0FF] text-black text-[10px] font-mono font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              PLAYER 1 // GROOM
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold text-[#00F0FF] mb-0.5">
            {groom.fullName}
          </h3>
          <p className="text-xs text-[#FFE600] font-mono font-semibold mb-2">
            ({groom.nickname})
          </p>
          <p className="text-xs text-gray-300 leading-relaxed mb-4 max-w-xs font-sans">
            Putra tercinta dari: <br />
            <strong className="text-white font-mono">{groom.parents}</strong>
          </p>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 border border-[#00F0FF]/30 text-[#00F0FF] text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Instagram size={13} />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>

        {/* NEON QUANTUM CONNECTOR */}
        <div className="flex items-center justify-center -my-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-black text-[#FFE600] border-2 border-[#FF007F] flex items-center justify-center font-mono text-base font-black shadow-[0_0_15px_rgba(255,0,127,0.5)]">
            <Heart size={18} className="fill-[#FF007F] text-[#FF007F]" />
          </div>
        </div>

        {/* BRIDE CARD (PLAYER 2 - CYBER-DOC) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-[#0F1020]/90 backdrop-blur-md rounded-3xl p-6 border border-[#FF007F]/40 shadow-[0_0_20px_rgba(255,0,127,0.15)] flex flex-col items-center text-center relative"
        >
          {/* Photo Frame with Cyber Pink Glow */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#FF007F] shadow-[0_0_15px_rgba(255,0,127,0.5)] p-1 bg-black">
              <img
                src={bride.image || '/assets/bride.jpg'}
                alt={bride.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* HUD Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#FF007F] text-white text-[10px] font-mono font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
              PLAYER 2 // BRIDE
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold text-[#FF007F] mb-0.5">
            {bride.fullName}
          </h3>
          <p className="text-xs text-[#FFE600] font-mono font-semibold mb-2">
            ({bride.nickname})
          </p>
          <p className="text-xs text-gray-300 leading-relaxed mb-4 max-w-xs font-sans">
            Putri tercinta dari: <br />
            <strong className="text-white font-mono">{bride.parents}</strong>
          </p>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF007F]/15 hover:bg-[#FF007F]/25 border border-[#FF007F]/30 text-[#FF007F] text-xs font-mono font-semibold transition-colors cursor-pointer"
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
