import { motion } from 'motion/react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';
import { FloatingFlowers } from '../decorations/FloatingFlowers';
import { OndelOndel } from '../decorations/OndelOndel';

export function ClosingSection() {
  const { weddingConfig } = useWeddingConfig();
  return (
    <section className="relative py-28 px-8 text-center bg-ivory overflow-hidden">
      <FloatingFlowers className="opacity-40" />
      <OndelFloralDecoration position="bottom-left" className="opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
        <p className="text-[13px] text-text-dark/70 leading-loose mb-10 max-w-[280px] mx-auto">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        
        <h3 className="font-heading text-xl md:text-2xl text-text-dark mb-12">
          Terima kasih.
          <br /><br />
          Wassalamu'alaikum Warahmatullahi Wabarakatuh
        </h3>
        
        <div className="flex flex-col items-center gap-1 mb-8">
          <h2 className="font-heading text-4xl text-text-dark">{weddingConfig.groom.nickname}</h2>
          <span className="text-2xl text-sage font-body italic my-1">&</span>
          <h2 className="font-heading text-4xl text-text-dark">{weddingConfig.bride.nickname}</h2>
        </div>
        
        <div className="flex justify-center gap-6">
          <OndelOndel type="male" variant="float" className="w-24 h-40" />
          <OndelOndel type="female" variant="float-delayed" className="w-24 h-40" />
        </div>
      </motion.div>
    </section>
  );
}
