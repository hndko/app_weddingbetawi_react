import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const CoupleProfile: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { groom, bride } = weddingConfig;

  return (
    <section className="py-16 px-6 relative overflow-hidden flex flex-col items-center">
      <div className="text-center mb-10 flex flex-col items-center">
        <span className="text-[11px] font-bold text-[#8B0000] tracking-widest uppercase mb-1">
          Kedua Mempelai
        </span>
        <h2 className="font-heading text-3xl font-bold text-[#2A0808]">
          Pengantin Bahagia
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 opacity-70">
          <span className="w-8 h-[1px] bg-[#D4AF37]" />
          <span className="text-xs text-[#D4AF37]">✦</span>
          <span className="w-8 h-[1px] bg-[#D4AF37]" />
        </div>
      </div>

      <div className="max-w-md w-full flex flex-col gap-10">
        {/* GROOM CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#D4AF37]/40 shadow-md flex flex-col items-center text-center relative"
        >
          {/* Photo Frame with Talawang Diamond Trim */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-md p-1 bg-[#2A0808]">
              <img
                src={groom.image || '/assets/groom.jpg'}
                alt={groom.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Corner Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#8B0000] text-[#FFF3C4] border border-[#D4AF37] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Mempelai Pria
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold text-[#8B0000] mb-0.5">
            {groom.fullName}
          </h3>
          <p className="text-xs text-[#AA7C11] font-semibold mb-2">
            ({groom.nickname})
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mb-4 max-w-xs">
            Putra tercinta dari: <br />
            <strong className="text-gray-800">{groom.parents}</strong>
          </p>

          {groom.instagram && (
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B0000]/10 hover:bg-[#8B0000]/20 text-[#8B0000] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Instagram size={13} />
              <span>@{groom.instagram.replace('@', '')}</span>
            </a>
          )}
        </motion.div>

        {/* CULTURAL INTERLUDE AMPERSAND */}
        <div className="flex items-center justify-center -my-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-[#8B0000] text-[#FFF3C4] border-2 border-[#D4AF37] flex items-center justify-center font-serif text-xl font-bold shadow-lg">
            &amp;
          </div>
        </div>

        {/* BRIDE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border border-[#D4AF37]/40 shadow-md flex flex-col items-center text-center relative"
        >
          {/* Photo Frame */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-md p-1 bg-[#2A0808]">
              <img
                src={bride.image || '/assets/bride.jpg'}
                alt={bride.fullName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Corner Badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#8B0000] text-[#FFF3C4] border border-[#D4AF37] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Mempelai Wanita
            </div>
          </div>

          <h3 className="font-heading text-xl font-bold text-[#8B0000] mb-0.5">
            {bride.fullName}
          </h3>
          <p className="text-xs text-[#AA7C11] font-semibold mb-2">
            ({bride.nickname})
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mb-4 max-w-xs">
            Putri tercinta dari: <br />
            <strong className="text-gray-800">{bride.parents}</strong>
          </p>

          {bride.instagram && (
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B0000]/10 hover:bg-[#8B0000]/20 text-[#8B0000] text-xs font-semibold transition-colors cursor-pointer"
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
