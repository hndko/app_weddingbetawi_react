import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tv, Play, ChevronDown, Sparkles, CheckCircle } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const SeriesTimeline: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [activeSeason, setActiveSeason] = React.useState<number | null>(0);

  const seasons = weddingConfig.loveStory || [
    { year: '2021', title: 'Pertama Bertemu', description: 'Pertemuan pertama kami di sebuah acara kebudayaan di Setu Babakan.' },
    { year: '2023', title: 'Menjalin Hubungan', description: 'Setelah mengenal lebih jauh, kami memutuskan untuk memulai lembaran baru bersama.' },
    { year: '2025', title: 'Lamaran', description: 'Dengan restu kedua orang tua, kami melangkah ke jenjang yang lebih serius.' },
    { year: '2026', title: 'Menikah', description: 'Puncak perjalanan cinta kami, mengikat janji suci di hadapan Allah SWT.' },
  ];

  return (
    <section className="relative px-5 py-12 flex flex-col items-center bg-[#0F0F0F] text-white">
      {/* Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1F1F1F] border border-[#2E2E2E] mb-2">
          <Tv size={12} className="text-[#E50914]" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#E50914] uppercase">
            ORIGINAL SERIES
          </span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Alur Cerita &amp; Musim
        </h2>
        <p className="text-xs text-[#888888] max-w-xs mt-1">
          Kilas balik episode-episode terpenting yang membawa kami ke hari bahagia
        </p>
      </div>

      {/* Seasons Accordion Container */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        {seasons.map((item, index) => {
          const isActive = activeSeason === index;
          const isFinale = index === seasons.length - 1;

          return (
            <div
              key={index}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isActive
                  ? 'bg-[#1C1112] border-[#E50914]/60 shadow-lg'
                  : 'bg-[#161616] border-[#252525] hover:border-[#383838]'
              }`}
            >
              {/* Season Row Button */}
              <button
                type="button"
                onClick={() => setActiveSeason(isActive ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#E50914] text-white'
                        : 'bg-[#222222] text-[#888888] group-hover:text-white'
                    }`}
                  >
                    {isFinale ? 'FIN' : `S${index + 1}`}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#E50914] uppercase tracking-wider">
                        {item.year}
                      </span>
                      {isFinale && (
                        <span className="px-1.5 py-0.2 rounded bg-[#E5C158]/20 text-[#E5C158] text-[9px] font-bold">
                          FINALE
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-bold truncate transition-colors ${
                        isActive ? 'text-white' : 'text-[#CCCCCC] group-hover:text-white'
                      }`}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ChevronDown
                    size={16}
                    className={`text-[#888888] transition-transform duration-300 ${
                      isActive ? 'rotate-180 text-[#E50914]' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Expandable Synopsis Content */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-black/40 px-4 pb-4 pt-1 border-t border-[#E50914]/20"
                  >
                    <div className="flex items-start gap-2.5 text-xs text-[#B3B3B3] leading-relaxed pt-2">
                      <Sparkles size={14} className="text-[#E50914] shrink-0 mt-0.5" />
                      <p>{item.description}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
