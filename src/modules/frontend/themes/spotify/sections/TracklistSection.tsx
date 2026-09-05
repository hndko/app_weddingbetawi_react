import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ListMusic, ChevronDown, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { SoundwaveVisualizer } from '../decorations/SoundwaveVisualizer';

const TRACK_DURATIONS = ['03:24', '04:15', '03:50', '05:20', '04:08'];

export const TracklistSection: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [activeTrackIndex, setActiveTrackIndex] = React.useState<number | null>(0);

  const stories = weddingConfig.loveStory || [
    { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan pertama di sebuah kedai kopi di Jakarta Selatan.' },
    { year: '2023', title: 'Menjalin Kasih', description: 'Sepakat melangkah bersama dalam komitmen yang lebih serius.' },
    { year: '2025', title: 'Lamaran Resmi', description: 'Mengikat janji pertunangan dengan restu hangat dari kedua keluarga.' },
    { year: '2026', title: 'Hari Pernikahan', description: 'Mengucap ijab kabul suci menuju gerbang bahagia selamanya.' },
  ];

  return (
    <section className="relative px-5 py-12 flex flex-col items-center bg-[#0E0E0E] text-white">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181818] border border-[#282828] mb-2">
          <ListMusic size={12} className="text-[#1DB954]" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#1DB954] uppercase">
            ALBUM TRACKLIST
          </span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Kisah &amp; Melodi Cinta
        </h2>
        <p className="text-xs text-[#B3B3B3] max-w-xs mt-1">
          Setiap fase perjalanan kami yang terekam dalam tangga nada kehidupan
        </p>
      </div>

      {/* Spotify Tracklist Container */}
      <div className="w-full max-w-sm rounded-2xl bg-[#141414] border border-[#242424] overflow-hidden shadow-2xl">
        {/* Table Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#242424] text-[10px] text-[#777777] font-semibold uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="w-4 text-center">#</span>
            <span>JUDUL LAGU &amp; MOMEN</span>
          </div>
          <span>DURASI</span>
        </div>

        {/* Tracks List */}
        <div className="divide-y divide-[#1F1F1F]">
          {stories.map((story, index) => {
            const isActive = activeTrackIndex === index;
            const duration = TRACK_DURATIONS[index % TRACK_DURATIONS.length];

            return (
              <div key={index} className="transition-colors">
                {/* Track Row */}
                <button
                  type="button"
                  onClick={() => setActiveTrackIndex(isActive ? null : index)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors group ${
                    isActive ? 'bg-[#1C281F]/80' : 'hover:bg-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    {/* Index or Play / Soundwave */}
                    <div className="w-5 flex items-center justify-center shrink-0">
                      {isActive ? (
                        <SoundwaveVisualizer barCount={4} height={14} color="#1DB954" />
                      ) : (
                        <span className="text-xs font-mono text-[#888888] group-hover:hidden">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      )}
                      {!isActive && (
                        <Play
                          size={13}
                          fill="currentColor"
                          className="hidden group-hover:block text-[#1DB954]"
                        />
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="min-w-0">
                      <h4
                        className={`text-sm font-semibold truncate transition-colors ${
                          isActive ? 'text-[#1DB954]' : 'text-white group-hover:text-[#1DB954]'
                        }`}
                      >
                        {story.title}
                      </h4>
                      <p className="text-[11px] text-[#888888] truncate">
                        Tahun {story.year} • {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Expand Chevron */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-[#888888]">{duration}</span>
                    <ChevronDown
                      size={14}
                      className={`text-[#888888] transition-transform duration-300 ${
                        isActive ? 'rotate-180 text-[#1DB954]' : ''
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Story Description */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden bg-[#111A13]/60 px-4 py-3 border-t border-[#1DB954]/20"
                    >
                      <div className="flex items-start gap-2 text-xs text-[#CCCCCC] leading-relaxed">
                        <Sparkles size={14} className="text-[#1DB954] shrink-0 mt-0.5" />
                        <p>{story.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Liner Footer */}
        <div className="px-4 py-3 bg-[#111111] border-t border-[#242424] flex items-center justify-between text-[11px] text-[#777777]">
          <span>{stories.length} Lagu Cinta</span>
          <span className="font-semibold text-[#1DB954]">Diputar Otomatis</span>
        </div>
      </div>
    </section>
  );
};
