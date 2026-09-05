import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EventDetail } from '../../../../types';

function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-gold opacity-60 ${className}`}>
      <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-current" />
      <span className="text-xs">✦</span>
      <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

function EventCard({ event, delay }: { event: EventDetail, delay: number }) {
  const { weddingConfig } = useWeddingConfig();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="bg-white/80 backdrop-blur-sm rounded-[32px] p-2 shadow-lg shadow-sage/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 border-[3px] border-double border-gold/30 rounded-[32px] m-1 pointer-events-none"></div>
      
      <div className="bg-gradient-to-b from-ivory to-white rounded-[24px] p-6 sm:p-8 relative overflow-hidden border border-sage/10">
        
        {/* Arch design element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-16 border-b border-sage/10 rounded-b-[100%] pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-12 border-b border-gold/20 rounded-b-[100%] pointer-events-none"></div>

        {/* Corner Ornaments */}
        <svg className="absolute top-3 left-3 w-8 h-8 text-sage opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M 24 0 C 12 0 0 12 0 24" />
          <path d="M 24 6 C 16 6 6 16 6 24" />
        </svg>
        <svg className="absolute top-3 right-3 w-8 h-8 text-sage opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M 0 0 C 12 0 24 12 24 24" />
          <path d="M 0 6 C 8 6 18 16 18 24" />
        </svg>
        <svg className="absolute bottom-3 left-3 w-8 h-8 text-sage opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M 24 24 C 12 24 0 12 0 0" />
          <path d="M 24 18 C 16 18 6 8 6 0" />
        </svg>
        <svg className="absolute bottom-3 right-3 w-8 h-8 text-sage opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M 0 24 C 12 24 24 12 24 0" />
          <path d="M 0 18 C 8 18 18 8 18 0" />
        </svg>

        <div className="relative z-10 flex flex-col items-center">
          <h4 className="font-heading text-3xl text-sage-dark mb-3 text-center tracking-wide drop-shadow-sm">{event.title}</h4>
          <div className="w-12 h-0.5 bg-gold-soft mb-8"></div>
          
          <div className="w-full flex flex-col gap-5 text-[13px] text-text-dark/80 mb-8 px-2">
            <div className="flex items-start gap-4">
              <div className="mt-0.5 text-gold bg-gold/10 p-2 rounded-full"><Calendar size={18} /></div>
              <div className="flex-1 mt-1">
                <p className="font-medium text-text-dark text-sm mb-1">{event.day}</p>
                <p>{event.date}</p>
              </div>
            </div>
            
            <div className="w-full flex items-start gap-4">
              <div className="mt-0.5 text-gold bg-gold/10 p-2 rounded-full"><Clock size={18} /></div>
              <div className="flex-1 mt-1">
                <p>{event.time}</p>
              </div>
            </div>
            
            <div className="w-full flex items-start gap-4">
              <div className="mt-0.5 text-gold bg-gold/10 p-2 rounded-full"><MapPin size={18} /></div>
              <div className="flex-1 mt-1">
                <p className="font-medium text-text-dark text-sm mb-1.5">{event.venue}</p>
                <p className="text-xs text-text-dark/70 leading-relaxed">{event.address}</p>
              </div>
            </div>
          </div>
          
          <a 
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname} - ${event.title}`)}&dates=${weddingConfig.dateISO.replace(/[-:]/g, '').split('+')[0]}Z/${weddingConfig.dateISO.replace(/[-:]/g, '').split('+')[0]}Z&details=${encodeURIComponent(event.address)}&location=${encodeURIComponent(event.address)}`}
            target="_blank" rel="noopener noreferrer"
            className="w-full bg-sage text-white py-3.5 rounded-full text-[13px] font-medium tracking-wide text-center hover:bg-sage-dark transition-colors shadow-sm hover:shadow-md"
          >
            Tambahkan ke Kalender
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export function EventSection() {
  const { weddingConfig } = useWeddingConfig();
  return (
    <section className="py-24 px-6 bg-warm-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full rotate-180 opacity-50">
        <SectionDivider />
      </div>
      
      <div className="text-center mb-12 mt-4">
         <h3 className="font-heading text-4xl text-text-dark mb-4">Rangkaian Acara</h3>
         <p className="text-xs text-text-dark/60 max-w-[260px] mx-auto leading-relaxed">
            Kehadiran Anda adalah doa dan restu yang paling kami harapkan.
         </p>
      </div>

      <div className="flex flex-col gap-8">
        <EventCard event={weddingConfig.events.akad} delay={0} />
        <EventCard event={weddingConfig.events.resepsi} delay={0.2} />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full opacity-50">
        <SectionDivider />
      </div>
    </section>
  );
}
