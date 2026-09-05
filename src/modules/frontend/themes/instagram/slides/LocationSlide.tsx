import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Copy, Check } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { LocationSticker } from '../components/InteractiveStickers';

export const LocationSlide: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [copied, setCopied] = useState(false);

  const mainEvent = weddingConfig.events?.resepsi || weddingConfig.events?.akad;
  const venue = mainEvent?.venue || 'Gedung Pernikahan';
  const address = mainEvent?.address || 'Jakarta, Indonesia';
  const mapUrl = mainEvent?.mapUrl || 'https://maps.google.com';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${venue}, ${address}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none bg-gradient-to-b from-[#181818] via-[#121212] to-[#0A0A0A] overflow-y-auto no-scrollbar">
      {/* Top Header Tag */}
      <div className="relative z-10 pt-10 text-center">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#FF0069] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          LOCATION TAG • PETA LOKASI
        </span>
      </div>

      {/* Center Location Card */}
      <div className="relative z-10 my-auto flex flex-col gap-3 max-w-[320px] mx-auto w-full py-3 items-center">
        {/* Instagram Location Sticker */}
        <LocationSticker venue={venue} mapUrl={mapUrl} />

        {/* Venue Information Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-xl text-center"
        >
          <div className="w-10 h-10 rounded-full bg-[#FF0069]/20 flex items-center justify-center text-[#FF0069] mx-auto mb-2">
            <MapPin size={20} />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">{venue}</h4>
          <p className="text-[11px] text-white/70 leading-relaxed mb-4">{address}</p>

          <div className="flex items-center gap-2">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Navigation size={14} />
              <span>Buka Google Maps</span>
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Salin Alamat"
            >
              {copied ? <Check size={14} className="text-[#00E676]" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <span className="text-[10px] text-white/60">
          Ketuk kanan untuk amplop digital
        </span>
      </div>
    </div>
  );
};
