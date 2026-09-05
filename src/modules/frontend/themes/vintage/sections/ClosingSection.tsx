import React from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { AnimatedPostalStamp } from '../decorations/AnimatedPostalStamp';
import { FloatingVintageEphemera } from '../decorations/FloatingVintageEphemera';

export const ClosingSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();

  return (
    <section className="relative py-20 px-6 text-center bg-[#EFE4D0] text-[#1E1E1E] overflow-hidden border-t-2 border-[#1E1E1E]">
      <FloatingVintageEphemera className="opacity-45" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-sm mx-auto bg-[#FAF5EE] p-6 border-2 border-[#1E1E1E] shadow-sm"
      >
        <span className="text-[9.5px] tracking-[0.25em] font-mono font-bold uppercase text-[#8B3A2B] block mb-2">
          COLOPHON • FINAL ACKNOWLEDGEMENT
        </span>

        <p className="font-serif text-xs sm:text-[12.5px] text-[#333333] leading-relaxed mb-6">
          Kehadiran serta doa restu tulus dari Bapak/Ibu/Saudara/i sekalian merupakan anugerah yang tak ternilai harganya bagi langkah awal perjalanan hidup kami berdua. Dari lubuk hati yang terdalam, kami haturkan terima kasih sebesar-besarnya.
        </p>

        <div className="w-16 h-0.5 bg-[#1E1E1E]/40 mx-auto mb-6" />

        <h3 className="font-heading text-lg sm:text-xl font-bold uppercase text-[#141414] mb-6">
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>

        {/* Editorial Sign-off */}
        <div className="flex flex-col items-center gap-1 mb-6">
          <span className="text-[10px] font-mono uppercase text-[#666666]">SINCERELY YOURS,</span>
          <div className="flex items-center gap-2 font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E]">
            <span>{weddingConfig.groom.nickname}</span>
            <span className="font-serif italic font-normal text-[#8B3A2B] text-xl">&amp;</span>
            <span>{weddingConfig.bride.nickname}</span>
          </div>
        </div>

        {/* Official Dispatch Postal Stamp */}
        <div className="flex justify-center mt-3">
          <AnimatedPostalStamp size={72} color="#8B3A2B" text="OFFICIAL EDITION" />
        </div>
      </motion.div>
    </section>
  );
};
