import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Map, Navigation, CloudSun, Wind, Droplets, Copy, Check } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const BentoLocationWeather: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [copied, setCopied] = useState(false);

  const mainEvent = weddingConfig.events?.resepsi || weddingConfig.events?.akad;
  const mapUrl = mainEvent?.mapUrl || 'https://maps.google.com';
  const address = mainEvent?.address || 'Jakarta, Indonesia';
  const venue = mainEvent?.venue || 'Gedung Pernikahan';

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${venue}, ${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full px-4 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#30B0C7]/10 flex items-center justify-center text-[#30B0C7]">
            <Map size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            MAPS &amp; WEATHER
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#30B0C7]">Lokasi &amp; Suasana</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* iOS Weather Widget Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] bg-gradient-to-br from-[#4A90E2] to-[#0056B3] text-white p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,122,255,0.25)] flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                  WEATHER FORECAST
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Hari Pernikahan
                </h3>
              </div>
              <CloudSun size={32} className="text-[#FFD60A] drop-shadow-md" />
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-sans">
                29°
              </span>
              <span className="text-sm font-medium text-white/90">
                Cerah Berawan
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/20 text-xs text-white/80">
            <div className="flex items-center gap-1.5">
              <Droplets size={14} className="text-[#64D2FF]" />
              <span>Kelembapan 65%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind size={14} className="text-[#64D2FF]" />
              <span>Angin 12 km/h</span>
            </div>
          </div>
        </motion.div>

        {/* Location & Navigation Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF] bg-[#007AFF]/10 px-2.5 py-0.5 rounded-full">
                VENUE LOCATION
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Apple Maps Ready
              </span>
            </div>

            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1">
              {venue}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
              {address}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Navigation size={14} />
              <span>Buka Petunjuk Arah</span>
            </a>
            <button
              type="button"
              onClick={handleCopyAddress}
              className="py-2.5 px-3 rounded-2xl bg-[#F2F2F7] hover:bg-[#E5E5EA] dark:bg-white/5 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Salin Alamat"
            >
              {copied ? <Check size={14} className="text-[#34C759]" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
