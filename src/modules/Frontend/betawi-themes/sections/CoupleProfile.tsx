import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { Instagram } from 'lucide-react';
import { MonasSilhouette } from '../decorations/MonasSilhouette';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';
import { FloatingFlowers } from '../decorations/FloatingFlowers';
import { PersonInfo } from '../../../../types';

function ProfileCard({ data, delay, index }: { data: PersonInfo, delay: number, index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col items-center text-center relative z-10"
    >
      <div className="relative w-48 h-64 md:w-52 md:h-72 mb-6 p-[2px] rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-sage-soft via-transparent to-transparent shadow-sm">
        {/* Decorative floral accents on the card itself, appearing alternately and animated */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: delay + 0.3 }}
          className="absolute z-30 w-full h-full pointer-events-none inset-0"
        >
          <OndelFloralDecoration 
            position={isEven ? "top-left" : "top-right"} 
            className={`opacity-90 scale-50 ${isEven ? '-translate-x-8 -translate-y-8' : 'translate-x-8 -translate-y-8'}`} 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 45 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: delay + 0.6 }}
          className="absolute z-30 w-full h-full pointer-events-none inset-0"
        >
          <OndelFloralDecoration 
            position={isEven ? "bottom-right" : "bottom-left"} 
            className={`opacity-90 scale-50 ${isEven ? 'translate-x-8 translate-y-8' : '-translate-x-8 translate-y-8'}`} 
          />
        </motion.div>

        <div className="w-full h-full rounded-t-full rounded-b-[1.85rem] overflow-hidden bg-light-gray relative">
          <img src={data.image} alt={data.fullName} className="w-full h-full object-cover object-center" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-sage-dark/10 mix-blend-overlay"></div>
        </div>
      </div>
      
      <h3 className="font-heading text-3xl text-text-dark mb-2">{data.fullName}</h3>
      <p className="text-[11px] text-text-dark/60 leading-relaxed mb-5 px-4 max-w-[280px]">
        {data.parents}
      </p>
      
      <a href={`https://instagram.com/${data.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] tracking-wide text-sage-dark hover:text-sage transition-colors bg-sage-50/50 py-1.5 px-4 rounded-full border border-sage/20 shadow-sm">
        <Instagram size={12} />
        <span>{data.instagram}</span>
      </a>
    </motion.div>
  );
}

export function CoupleProfile() {
  const { weddingConfig } = useWeddingConfig();
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-warm-white">
      <FloatingFlowers className="opacity-30" />
      <OndelFloralDecoration position="bottom-left" className="opacity-10 scale-150 translate-x-12 translate-y-12" />
      <OndelFloralDecoration position="top-right" className="opacity-10 scale-150 -translate-x-12 -translate-y-12" />
      <MonasSilhouette className="absolute left-1/2 -translate-x-1/2 bottom-10 w-64 h-96 opacity-[0.03]" />
      
      <div className="absolute top-0 left-0 w-full flex justify-center opacity-[0.02]">
         <svg width="400" height="40" viewBox="0 0 400 40" fill="var(--color-sage-dark)">
            <path d="M0 40 L20 0 L40 40 L60 0 L80 40 L100 0 L120 40 L140 0 L160 40 L180 0 L200 40 L220 0 L240 40 L260 0 L280 40 L300 0 L320 40 L340 0 L360 40 L380 0 L400 40 Z" />
         </svg>
      </div>

      <div className="flex flex-col gap-14">
        <ProfileCard data={weddingConfig.groom} delay={0} index={0} />
        
        <div className="flex justify-center items-center gap-4 text-gold/60 relative z-10 my-4">
           <span className="w-16 h-[1px] bg-gold/40"></span>
           <span className="font-heading text-5xl italic text-sage">&</span>
           <span className="w-16 h-[1px] bg-gold/40"></span>
        </div>

        <ProfileCard data={weddingConfig.bride} delay={0.2} index={1} />
      </div>
    </section>
  );
}
