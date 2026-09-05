import React from 'react';
import { motion } from 'motion/react';
import { Crown, Heart } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-14 px-5 flex flex-col items-center text-center font-serif">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm bg-gradient-to-b from-white/95 to-[#FAF5EE]/95 rounded-3xl p-6 border-2 border-[#D4AF37]/50 shadow-md relative overflow-hidden"
      >
        <Crown size={24} className="mx-auto text-[#D4AF37] mb-2" />

        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#854D0E] block mb-2">
          TITAH RESTU &amp; PENGHORMATAN
        </span>

        <h3 className="text-xl sm:text-2xl font-bold text-[#2C1810] mb-3">
          Untaian Doa &amp; Terima Kasih
        </h3>

        <p className="text-xs text-[#555555] leading-relaxed mb-6 italic">
          Kehadiran serta doa restu yang tulus dari Yang Mulia Bapak/Ibu/Saudara/i sekalian merupakan anugerah yang amat berharga bagi kedua mempelai dalam mengawali mahligai rumah tangga yang abadi.
        </p>

        <div className="flex items-center justify-center gap-2 text-[#854D0E] mb-3">
          <Heart size={15} className="text-[#D4AF37] fill-[#D4AF37]" />
          <span className="text-xs font-semibold">
            Keluarga Besar Kerajaan
          </span>
          <Heart size={15} className="text-[#D4AF37] fill-[#D4AF37]" />
        </div>

        <div className="text-xl font-bold text-[#2C1810]">
          {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
        </div>
      </motion.div>
    </section>
  );
};
