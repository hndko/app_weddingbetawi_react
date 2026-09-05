import React from 'react';
import { motion } from 'motion/react';
import { Play, Clock, MapPin, Calendar, Film } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const EpisodesSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { events } = weddingConfig;

  const episodes = [
    {
      num: 1,
      title: 'Akad Nikah: The Sacred Vow',
      day: events.akad.day || 'Minggu',
      date: events.akad.date || '20 September 2026',
      time: events.akad.time || '09:00 - 11:00 WIB',
      duration: '120 Menit',
      venue: events.akad.venue || 'Masjid Cut Meutia',
      address: events.akad.address || 'Jl. Taman Cut Mutiah No.1, Menteng, Jakarta Pusat',
      synopsis: 'Pengucapan ijab kabul suci di hadapan penghulu, saksi, dan keluarga besar, mengawali babak baru ikatan pernikahan.',
      mapUrl: events.akad.mapUrl,
    },
    {
      num: 2,
      title: 'Resepsi: The Grand Celebration',
      day: events.resepsi.day || 'Minggu',
      date: events.resepsi.date || '20 September 2026',
      time: events.resepsi.time || '19:00 - 22:00 WIB',
      duration: '180 Menit',
      venue: events.resepsi.venue || 'Gedung Smesco',
      address: events.resepsi.address || 'Jl. Gatot Subroto Kav. 94, Pancoran, Jakarta Selatan',
      synopsis: 'Malam perayaan penuh sukacita bersama sanak keluarga, sahabat, dan tamu kehormatan dalam jamuan pesta pernikahan.',
      mapUrl: events.resepsi.mapUrl,
    },
  ];

  return (
    <section className="relative px-5 py-12 flex flex-col items-center bg-[#0F0F0F] text-white">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm mb-6 border-b border-[#242424] pb-3">
        <div className="flex items-center gap-2">
          <Film size={16} className="text-[#E50914]" />
          <h2 className="font-heading text-lg sm:text-xl font-bold text-white tracking-wide">
            Episodes
          </h2>
        </div>
        <span className="text-xs text-[#808080] font-semibold">Season 1: Wedding Day</span>
      </div>

      {/* Episodes List */}
      <div className="flex flex-col gap-6 w-full max-w-sm">
        {episodes.map((ep) => (
          <motion.div
            key={ep.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl bg-[#181818] border border-[#282828] p-4 shadow-xl flex flex-col gap-3 group hover:border-[#E50914]/50 transition-colors"
          >
            {/* Episode Top Row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#242424] text-[#E50914] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#E50914] group-hover:text-white transition-colors">
                  {ep.num}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#E50914] transition-colors truncate">
                    {ep.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#A0A0A0] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock size={11} className="text-[#E50914]" /> {ep.duration}
                    </span>
                    <span>•</span>
                    <span>{ep.day}, {ep.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-xs text-[#B3B3B3] leading-relaxed">
              {ep.synopsis}
            </p>

            {/* Venue & Time Pill Info */}
            <div className="p-3 rounded-lg bg-[#121212] border border-[#222222] flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#E5C158] font-semibold">
                <Calendar size={13} />
                <span>{ep.time}</span>
              </div>
              <div className="flex items-start gap-2 text-white">
                <MapPin size={13} className="text-[#E50914] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{ep.venue}</span>
                  <p className="text-[11px] text-[#888888] mt-0.5 leading-normal">{ep.address}</p>
                </div>
              </div>
            </div>

            {/* Navigation Action */}
            {ep.mapUrl && (
              <a
                href={ep.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded bg-[#242424] hover:bg-[#E50914] text-[#CCCCCC] hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin size={13} />
                <span>Petunjuk Arah Google Maps</span>
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};
