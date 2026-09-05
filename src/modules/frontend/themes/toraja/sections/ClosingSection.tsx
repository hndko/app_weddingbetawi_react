import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-14 px-5 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm bg-gradient-to-b from-white/95 to-[#FAF7F2] rounded-3xl p-6 border border-[#E5A93C]/40 shadow-sm relative overflow-hidden"
      >
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8B1E19] block mb-2">
          KURRE SUMANGA' • UNTAIAN TERIMA KASIH
        </span>

        <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-3">
          Matur Suksma &amp; Kurre Sumanga'
        </h3>

        <p className="text-xs text-[#555555] leading-relaxed mb-6">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kedua mempelai dalam mengarungi bahtera rumah tangga yang sakinah, mawaddah, warahmah.
        </p>

        <div className="flex items-center justify-center gap-2 text-[#8B1E19] mb-4">
          <Heart size={16} className="text-[#E5A93C] fill-[#E5A93C]" />
          <span className="font-serif italic text-sm font-semibold">
            Kami yang berbahagia,
          </span>
          <Heart size={16} className="text-[#E5A93C] fill-[#E5A93C]" />
        </div>

        <div className="font-heading text-xl font-bold text-[#8B1E19]">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </div>

        <p className="text-[11px] text-[#777777] mt-1">
          Beserta Seluruh Keluarga Besar Kedua Mempelai
        </p>
      </motion.div>
    </section>
  );
};
