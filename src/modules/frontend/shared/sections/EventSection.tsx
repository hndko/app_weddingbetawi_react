import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { EventDetail } from '../../../../types';
import { CalendarEventModal } from '../components/CalendarEventModal';
import { cn } from '../../../../utils/cn';

function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 opacity-60 ${className}`}>
      <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-current" />
      <span className="text-xs">✦</span>
      <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

function EventCard({ 
  event, 
  delay, 
  onSaveCalendar 
}: { 
  event: EventDetail; 
  delay: number; 
  onSaveCalendar: () => void; 
}) {
  const { tokens, isDark } = useThemeTokens();
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={cn(
        "backdrop-blur-md rounded-[32px] p-2 relative overflow-hidden transition-all duration-300",
        isDark ? "shadow-2xl shadow-black/80" : "shadow-lg shadow-black/5"
      )}
      style={{
        backgroundColor: tokens.cardBg,
        border: `1px solid ${tokens.cardBorder}`,
      }}
    >
      <div 
        className="rounded-[24px] p-6 sm:p-8 relative overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: tokens.cardBg,
          border: `1px solid ${tokens.cardBorder}`,
        }}
      >
        
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
          <h4 
            className="font-heading text-3xl font-bold mb-3 text-center tracking-wide"
            style={{ color: tokens.textPrimary }}
          >
            {event.title}
          </h4>
          <div 
            className="w-12 h-0.5 mb-8"
            style={{ backgroundColor: tokens.accent }}
          />
          
          <div className="w-full flex flex-col gap-5 text-[13px] mb-8 px-2">
            <div className="flex items-start gap-4">
              <div 
                className="mt-0.5 p-2 rounded-full"
                style={{ 
                  backgroundColor: `${tokens.accent}20`,
                  color: tokens.accent
                }}
              >
                <Calendar size={18} />
              </div>
              <div className="flex-1 mt-1">
                <p className="font-bold text-sm mb-1" style={{ color: tokens.textPrimary }}>{event.day}</p>
                <p style={{ color: tokens.textMuted }}>{event.date}</p>
              </div>
            </div>
            
            <div className="w-full flex items-start gap-4">
              <div 
                className="mt-0.5 p-2 rounded-full"
                style={{ 
                  backgroundColor: `${tokens.accent}20`,
                  color: tokens.accent
                }}
              >
                <Clock size={18} />
              </div>
              <div className="flex-1 mt-1">
                <p style={{ color: tokens.textMuted }}>{event.time}</p>
              </div>
            </div>
            
            <div className="w-full flex items-start gap-4">
              <div 
                className="mt-0.5 p-2 rounded-full"
                style={{ 
                  backgroundColor: `${tokens.accent}20`,
                  color: tokens.accent
                }}
              >
                <MapPin size={18} />
              </div>
              <div className="flex-1 mt-1">
                <p className="font-bold text-sm mb-1.5" style={{ color: tokens.textPrimary }}>{event.venue}</p>
                <p className="text-xs leading-relaxed" style={{ color: tokens.textMuted }}>{event.address}</p>
              </div>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={onSaveCalendar}
            className="w-full py-3.5 rounded-full text-[13px] font-medium tracking-wide text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group hover:opacity-90 active:scale-98"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.btnPrimaryText
            }}
          >
            <Calendar size={16} className="group-hover:scale-110 transition-transform" />
            <span>Simpan ke Kalender</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function EventSection() {
  const { weddingConfig } = useWeddingConfig();
  const { tokens } = useThemeTokens();
  const [selectedEventForCalendar, setSelectedEventForCalendar] = useState<EventDetail | null>(null);

  return (
    <section 
      className="py-24 px-6 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <div className="absolute top-0 left-0 w-full rotate-180 opacity-50" style={{ color: tokens.accent }}>
        <SectionDivider />
      </div>
      
      <div className="text-center mb-12 mt-4">
         <h3 
           className="font-heading text-4xl mb-4 font-bold"
           style={{ color: tokens.textPrimary }}
         >
           Rangkaian Acara
         </h3>
         <p 
           className="text-xs max-w-[260px] mx-auto leading-relaxed font-medium"
           style={{ color: tokens.textMuted }}
         >
            Kehadiran Anda adalah doa dan restu yang paling kami harapkan.
         </p>
      </div>

      <div className="flex flex-col gap-8">
        <EventCard 
          event={weddingConfig.events.akad} 
          delay={0} 
          onSaveCalendar={() => setSelectedEventForCalendar(weddingConfig.events.akad)} 
        />
        <EventCard 
          event={weddingConfig.events.resepsi} 
          delay={0.2} 
          onSaveCalendar={() => setSelectedEventForCalendar(weddingConfig.events.resepsi)} 
        />
      </div>

      {/* Calendar Selection & Navigation Modal */}
      <CalendarEventModal
        isOpen={!!selectedEventForCalendar}
        onClose={() => setSelectedEventForCalendar(null)}
        event={selectedEventForCalendar}
        weddingConfig={weddingConfig}
      />
      
      <div className="absolute bottom-0 left-0 w-full opacity-50">
        <SectionDivider />
      </div>
    </section>
  );
}
