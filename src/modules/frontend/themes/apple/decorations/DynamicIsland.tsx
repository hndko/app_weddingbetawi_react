import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BatteryCharging, Radio, Sparkles, ChevronDown } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { playDynamicPop } from '../utils/appleAudio';

export const DynamicIsland: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(weddingConfig.dateISO).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingConfig.dateISO]);

  const toggleExpand = () => {
    playDynamicPop();
    setIsExpanded(prev => !prev);
  };

  const groomInitial = (weddingConfig.groom.nickname || 'G').charAt(0).toUpperCase();
  const brideInitial = (weddingConfig.bride.nickname || 'B').charAt(0).toUpperCase();

  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-[90] w-full max-w-[390px] px-3 pointer-events-none flex justify-center">
      <motion.div
        layout
        onClick={toggleExpand}
        className="pointer-events-auto cursor-pointer bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/15 overflow-hidden transition-colors select-none"
        style={{
          borderRadius: isExpanded ? 28 : 20,
          width: isExpanded ? '100%' : 'auto',
          minWidth: isExpanded ? '320px' : '205px',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        aria-label="Dynamic Island Wedding Widget"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            /* Collapsed Dynamic Island Pill */
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-[34px] px-3.5 flex items-center justify-between gap-3"
            >
              {/* Left: Camera / Sensor dot + Couple Initials */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E] border border-white/20 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-[#007AFF] animate-pulse" />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-white tracking-wide">
                  <span>{groomInitial}</span>
                  <Heart size={10} className="fill-[#FF2D55] text-[#FF2D55]" />
                  <span>{brideInitial}</span>
                </div>
              </div>

              {/* Right: Audio Wave Bar & 100% Love Battery */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-[#34C759] rounded-full animate-bounce [animation-delay:-0.2s]" />
                  <span className="w-0.5 h-3 bg-[#34C759] rounded-full animate-bounce [animation-delay:-0.4s]" />
                  <span className="w-0.5 h-1.5 bg-[#34C759] rounded-full animate-bounce [animation-delay:-0.1s]" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-[#34C759]">
                  <BatteryCharging size={13} className="text-[#34C759]" />
                  <span>100%</span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Expanded Dynamic Island Widget */
            <motion.div
              key="expanded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="p-3.5 flex flex-col gap-2.5"
            >
              {/* Top Row: Live Wedding Broadcast Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007AFF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007AFF]" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF]">
                    WEDDING COUNTDOWN LIVE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                  <Radio size={11} className="text-[#34C759]" />
                  <span>Connected</span>
                  <ChevronDown size={12} className="text-white/40 ml-0.5" />
                </div>
              </div>

              {/* Center: Live Days, Hours, Minutes, Seconds */}
              <div className="grid grid-cols-4 gap-1.5 bg-white/5 rounded-2xl p-2 border border-white/10 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-base font-extrabold text-white font-mono leading-none">
                    {timeLeft.days}
                  </span>
                  <span className="text-[8px] text-white/50 uppercase mt-0.5">Hari</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base font-extrabold text-white font-mono leading-none">
                    {timeLeft.hours}
                  </span>
                  <span className="text-[8px] text-white/50 uppercase mt-0.5">Jam</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base font-extrabold text-white font-mono leading-none">
                    {timeLeft.minutes}
                  </span>
                  <span className="text-[8px] text-white/50 uppercase mt-0.5">Menit</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base font-extrabold text-[#34C759] font-mono leading-none">
                    {timeLeft.seconds}
                  </span>
                  <span className="text-[8px] text-[#34C759] uppercase mt-0.5">Detik</span>
                </div>
              </div>

              {/* Bottom Row: Love Battery and Groom & Bride info */}
              <div className="flex items-center justify-between text-[10px] text-white/70 pt-0.5 px-0.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={11} className="text-[#D4AF37]" />
                  <span className="font-medium text-white/90">
                    {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
                  </span>
                </div>
                <span className="text-[9px] text-white/40 italic">
                  Ketuk untuk ciutkan
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
