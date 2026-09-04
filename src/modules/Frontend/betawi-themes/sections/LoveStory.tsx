import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { cn } from '../../../../utils/cn';

export function LoveStory() {
  const { weddingConfig } = useWeddingConfig();
  return (
    <section className="py-24 px-8 bg-warm-white relative overflow-hidden">
      <div className="text-center mb-16 relative z-10">
         <h3 className="font-heading text-4xl text-text-dark mb-4">Kisah Kami</h3>
         <div className="w-12 h-[1px] bg-sage mx-auto"></div>
      </div>

      <div className="relative max-w-[320px] mx-auto z-10">
        <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-sage-soft"></div>
        
        {weddingConfig.loveStory.map((story, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative pl-12 mb-10 last:mb-0"
          >
            <div className={cn(
               "absolute left-[11px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-warm-white outline outline-1 outline-sage-soft bg-sage"
            )}></div>
            <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-sage/10 shadow-sm">
               <span className="inline-block text-[10px] font-bold tracking-widest text-gold mb-2 bg-gold/10 px-2 py-0.5 rounded-full">{story.year}</span>
               <h4 className="font-heading text-xl text-text-dark mb-2">{story.title}</h4>
               <p className="text-xs text-text-dark/70 leading-relaxed">{story.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
