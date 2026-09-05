import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, PlusCircle } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const EventSlide: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { events, dateStr } = weddingConfig;

  const buildCalendarUrl = (title: string, dateStr: string, timeStr: string, venue: string, address: string) => {
    const text = encodeURIComponent(title);
    const details = encodeURIComponent(`Undangan Pernikahan ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}\nLokasi: ${venue} (${address})`);
    const location = encodeURIComponent(`${venue}, ${address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none bg-gradient-to-b from-[#181818] via-[#121212] to-[#0A0A0A] overflow-y-auto no-scrollbar">
      {/* Top Header Tag */}
      <div className="relative z-10 pt-10 text-center">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#00E676] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          EVENT SCHEDULE • WAKTU &amp; TEMPAT
        </span>
      </div>

      {/* Events Cards */}
      <div className="relative z-10 my-auto flex flex-col gap-3 max-w-[320px] mx-auto w-full py-3">
        {/* Akad Nikah */}
        {events?.akad && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-[#FFD600] tracking-wider">
                01 • AKAD NIKAH
              </span>
              <div className="flex items-center gap-1 text-[11px] text-white/90">
                <Clock size={12} className="text-[#FFD600]" />
                <span>{events.akad.time}</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{events.akad.venue}</h4>
            <p className="text-[10px] text-white/70 line-clamp-2 mb-3 leading-snug">
              {events.akad.address}
            </p>
            <a
              href={buildCalendarUrl(events.akad.title || 'Akad Nikah', events.akad.date, events.akad.time, events.akad.venue, events.akad.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF0069] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <PlusCircle size={13} />
              <span>Simpan Akad ke Kalender</span>
            </a>
          </motion.div>
        )}

        {/* Resepsi */}
        {events?.resepsi && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase text-[#00E676] tracking-wider">
                02 • RESEPSI PERNIKAHAN
              </span>
              <div className="flex items-center gap-1 text-[11px] text-white/90">
                <Clock size={12} className="text-[#00E676]" />
                <span>{events.resepsi.time}</span>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{events.resepsi.venue}</h4>
            <p className="text-[10px] text-white/70 line-clamp-2 mb-3 leading-snug">
              {events.resepsi.address}
            </p>
            <a
              href={buildCalendarUrl(events.resepsi.title || 'Resepsi Pernikahan', events.resepsi.date, events.resepsi.time, events.resepsi.venue, events.resepsi.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-xl bg-[#00E676] hover:bg-[#00C853] text-black text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <PlusCircle size={13} />
              <span>Simpan Resepsi ke Kalender</span>
            </a>
          </motion.div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <span className="text-[10px] text-white/60">
          Ketuk kanan untuk melihat peta lokasi
        </span>
      </div>
    </div>
  );
};
