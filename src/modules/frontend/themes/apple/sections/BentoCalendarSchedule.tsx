import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, PlusCircle } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const BentoCalendarSchedule: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { events, dateStr } = weddingConfig;

  // Helper to build Google Calendar URL
  const buildCalendarUrl = (title: string, dateStr: string, timeStr: string, venue: string, address: string) => {
    const text = encodeURIComponent(title);
    const details = encodeURIComponent(`Undangan Pernikahan ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}\nLokasi: ${venue} (${address})`);
    const location = encodeURIComponent(`${venue}, ${address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  return (
    <div className="w-full px-4 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF3B30]/10 flex items-center justify-center text-[#FF3B30]">
            <Calendar size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            CALENDAR &amp; SCHEDULE
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#FF3B30]">Rangkaian Acara</span>
      </div>

      {/* Bento Grid: Akad & Resepsi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Akad Nikah Event Card */}
        {events?.akad && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header Row: iOS Date Badge + Title */}
              <div className="flex items-start gap-3.5 mb-3">
                {/* Red iOS Calendar Icon */}
                <div className="w-13 h-14 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-extrabold uppercase text-[#FF3B30] tracking-wider leading-none">
                    AKAD
                  </span>
                  <span className="text-xl font-black text-[#FF3B30] leading-tight">
                    01
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
                    {events.akad.title || 'Akad Nikah'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                    <Clock size={12} className="text-[#007AFF]" />
                    <span>{events.akad.time || '08:00 - 10:00 WIB'}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                    {events.akad.date || dateStr}
                  </span>
                </div>
              </div>

              {/* Venue & Location */}
              <div className="bg-[#F2F2F7] dark:bg-white/5 rounded-2xl p-3 mb-3 border border-black/[0.04] dark:border-white/5">
                <div className="flex items-start gap-2 text-xs">
                  <MapPin size={14} className="text-[#FF3B30] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {events.akad.venue}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                      {events.akad.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action: Add to Calendar */}
            <a
              href={buildCalendarUrl(events.akad.title || 'Akad Nikah', events.akad.date, events.akad.time, events.akad.venue, events.akad.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle size={14} />
              <span>Simpan ke Kalender</span>
            </a>
          </motion.div>
        )}

        {/* Resepsi Event Card */}
        {events?.resepsi && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
          >
            <div>
              {/* Header Row: iOS Date Badge + Title */}
              <div className="flex items-start gap-3.5 mb-3">
                {/* Red iOS Calendar Icon */}
                <div className="w-13 h-14 rounded-2xl bg-[#FF3B30]/10 border border-[#FF3B30]/20 flex flex-col items-center justify-center shrink-0 shadow-xs">
                  <span className="text-[9px] font-extrabold uppercase text-[#FF3B30] tracking-wider leading-none">
                    RESEPSI
                  </span>
                  <span className="text-xl font-black text-[#FF3B30] leading-tight">
                    02
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
                    {events.resepsi.title || 'Resepsi Pernikahan'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                    <Clock size={12} className="text-[#007AFF]" />
                    <span>{events.resepsi.time || '11:00 - 13:00 WIB'}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                    {events.resepsi.date || dateStr}
                  </span>
                </div>
              </div>

              {/* Venue & Location */}
              <div className="bg-[#F2F2F7] dark:bg-white/5 rounded-2xl p-3 mb-3 border border-black/[0.04] dark:border-white/5">
                <div className="flex items-start gap-2 text-xs">
                  <MapPin size={14} className="text-[#FF3B30] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {events.resepsi.venue}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
                      {events.resepsi.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action: Add to Calendar */}
            <a
              href={buildCalendarUrl(events.resepsi.title || 'Resepsi Pernikahan', events.resepsi.date, events.resepsi.time, events.resepsi.venue, events.resepsi.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PlusCircle size={14} />
              <span>Simpan ke Kalender</span>
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};
