import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';
import { OndelOndel } from '../decorations/OndelOndel';
import { MonasSilhouette } from '../decorations/MonasSilhouette';

export function HeroSection() {
  const { weddingConfig } = useWeddingConfig();
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center overflow-hidden">
      <div className="absolute top-10 left-10 w-24 h-24 bg-sage/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
      
      {/* Faint Monas Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <MonasSilhouette className="w-[80vw] max-w-[400px] text-sage opacity-[0.25] scale-150 translate-y-10" />
      </div>

      <OndelFloralDecoration position="bottom-left" className="opacity-60" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full flex flex-col items-center"
      >
        <span className="text-xs md:text-sm tracking-[0.3em] text-sage-dark uppercase mb-8">The Wedding Of</span>
        
        <div className="flex flex-col items-center gap-2 mb-10">
          <h2 className="font-heading text-5xl md:text-6xl text-text-dark tracking-wide">{weddingConfig.groom.nickname}</h2>
          <span className="text-4xl text-sage font-body italic my-2">&</span>
          <h2 className="font-heading text-5xl md:text-6xl text-text-dark tracking-wide">{weddingConfig.bride.nickname}</h2>
        </div>
        
        <div className="flex items-center gap-4 text-text-dark/80 tracking-widest text-sm mb-12">
          <span className="w-8 h-[1px] bg-gold-soft"></span>
          <span>{weddingConfig.dateStr}</span>
          <span className="w-8 h-[1px] bg-gold-soft"></span>
        </div>

        <div className="flex items-end justify-center gap-6 mt-4">
          <OndelOndel type="male" variant="float" className="w-28 h-44" />
          <OndelOndel type="female" variant="float-delayed" className="w-28 h-44" />
        </div>
      </motion.div>
    </section>
  );
}
