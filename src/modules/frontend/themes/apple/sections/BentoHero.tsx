import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Heart, Clock, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';

export const BentoHero: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(weddingConfig.dateISO).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingConfig.dateISO]);

  return (
    <div className="w-full px-4 pt-4 pb-2">
      {/* Outer Bento Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Main Hero Card: Featured Memories (Spans full or 1 col) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[28px] overflow-hidden bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between min-h-[300px]"
        >
          {/* Top Label & Badge */}
          <div className="flex items-center justify-between z-10 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md text-[10px] font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider">
              <Sparkles size={11} className="text-[#D4AF37]" />
              <span>MEMORIES • FOR YOU</span>
            </div>
            <span className="text-[11px] font-semibold text-[#007AFF]">
              {weddingConfig.dateStr || '20 September 2026'}
            </span>
          </div>

          {/* Photo Frame in Card */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-3 shadow-inner">
            <img
              src={
                weddingConfig.groom.image ||
                'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
              }
              alt="Couple Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between text-white">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
                  THE WEDDING CELEBRATION
                </span>
                <h2 className="text-xl font-bold font-sans tracking-tight">
                  {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
                </h2>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Heart size={14} className="fill-white" />
              </div>
            </div>
          </div>

          {/* Quote / Subtitle Text */}
          <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed line-clamp-2">
            "Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu agar kamu cenderung dan merasa tenteram kepadanya."
          </p>
        </motion.div>

        {/* Live Countdown & System Status Widget */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                <Clock size={14} />
              </div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Live Countdown
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[#34C759]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
              <span>Real-Time</span>
            </div>
          </div>

          {/* Countdown Clock Squares (iOS Widget style) */}
          <div className="grid grid-cols-4 gap-2 my-2">
            <div className="rounded-2xl bg-[#F2F2F7] dark:bg-white/5 p-2.5 text-center border border-black/[0.04] dark:border-white/5">
              <span className="block text-xl font-extrabold font-mono text-neutral-900 dark:text-white leading-none">
                {timeLeft.days}
              </span>
              <span className="text-[9px] font-semibold uppercase text-neutral-500 dark:text-neutral-400 mt-1 block">
                Hari
              </span>
            </div>
            <div className="rounded-2xl bg-[#F2F2F7] dark:bg-white/5 p-2.5 text-center border border-black/[0.04] dark:border-white/5">
              <span className="block text-xl font-extrabold font-mono text-neutral-900 dark:text-white leading-none">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] font-semibold uppercase text-neutral-500 dark:text-neutral-400 mt-1 block">
                Jam
              </span>
            </div>
            <div className="rounded-2xl bg-[#F2F2F7] dark:bg-white/5 p-2.5 text-center border border-black/[0.04] dark:border-white/5">
              <span className="block text-xl font-extrabold font-mono text-neutral-900 dark:text-white leading-none">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] font-semibold uppercase text-neutral-500 dark:text-neutral-400 mt-1 block">
                Menit
              </span>
            </div>
            <div className="rounded-2xl bg-[#F2F2F7] dark:bg-white/5 p-2.5 text-center border border-black/[0.04] dark:border-white/5">
              <span className="block text-xl font-extrabold font-mono text-[#007AFF] leading-none">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] font-semibold uppercase text-[#007AFF] mt-1 block">
                Detik
              </span>
            </div>
          </div>

          {/* Footer banner */}
          <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-[#007AFF]" />
              <span>Hari Bahagia</span>
            </div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {weddingConfig.events?.akad?.time || '08:00 WIB'}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
