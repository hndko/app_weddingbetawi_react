import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock, Flashlight, Camera, ChevronUp, Sparkles, MessageCircleHeart } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { playUnlockSound } from './utils/appleAudio';
import { FloatingAppleParticles } from './decorations/FloatingAppleParticles';

export const OpeningCover: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');
  const [flashlightOn, setFlashlightOn] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUnlock = () => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    playUnlockSound();
    setTimeout(() => {
      onOpen();
    }, 400);
  };

  const formattedDate = weddingConfig.dateStr || 'Sabtu, 20 September 2026';

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-between items-center text-neutral-900 dark:text-white px-5 pt-10 pb-6 overflow-hidden select-none bg-gradient-to-b from-[#F2F2F7] via-[#E5E5EA] to-[#D1D1D6] dark:from-[#000000] dark:via-[#1C1C1E] dark:to-[#121212]"
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
    >
      {/* Background Subtle Apple Dot Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#007AFF 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating Apple Particles */}
      <FloatingAppleParticles count={6} />

      {/* Top Section: Lock Status & Big Digital Clock */}
      <div className="relative z-10 w-full flex flex-col items-center mt-2">
        {/* Animated Face ID / Padlock Icon */}
        <motion.div
          animate={{ scale: isUnlocked ? [1, 1.25, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md flex items-center justify-center mb-1 text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/10 shadow-xs"
        >
          {isUnlocked ? (
            <Unlock size={16} className="text-[#34C759]" />
          ) : (
            <Lock size={16} className="text-neutral-700 dark:text-neutral-300" />
          )}
        </motion.div>

        {/* Date string */}
        <span className="text-[13px] sm:text-sm font-semibold tracking-wide text-neutral-600 dark:text-neutral-300">
          {formattedDate}
        </span>

        {/* Big Bold Clock (iOS Lockscreen style) */}
        <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-neutral-900 dark:text-white font-sans leading-none my-1">
          {currentTime}
        </h1>

        {/* Couple Subtitle Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-xs mt-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-200">
          <Sparkles size={11} className="text-[#D4AF37]" />
          <span>The Wedding of {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}</span>
        </div>
      </div>

      {/* Center Section: Depth Wallpaper Frame + Incoming Notification */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center gap-3 my-auto">
        {/* iOS Wallpaper Photo Frame */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-[28px] overflow-hidden border-2 border-white/80 dark:border-white/20 shadow-[0_16px_36px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_36px_rgba(0,0,0,0.6)]">
          <img
            src={
              weddingConfig.groom.image ||
              'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
            alt="Couple Wallpaper"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          <div className="absolute bottom-2.5 left-0 right-0 text-center text-white px-2">
            <p className="text-[10px] tracking-widest uppercase font-bold text-white/90">
              FEATURED COUPLE
            </p>
          </div>
        </div>

        {/* iOS Incoming Notification Banner */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          onClick={handleUnlock}
          className="w-full bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-[22px] p-3.5 border border-white/60 dark:border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_25px_rgba(0,0,0,0.4)] cursor-pointer active:scale-[0.98] transition-transform text-left"
        >
          {/* Notification Header */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white shadow-xs">
                <MessageCircleHeart size={12} />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                UNDANGAN RESMI
              </span>
            </div>
            <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium">
              Baru Saja
            </span>
          </div>

          {/* Notification Body */}
          <div className="space-y-0.5">
            <p className="text-[12px] font-bold text-neutral-900 dark:text-white leading-tight">
              Katur Dhumateng: {guestName || 'Tamu Undangan'}
            </p>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-snug">
              Sentuh untuk membuka undangan pernikahan {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Shortcuts & Swipe/Tap to Unlock */}
      <div className="relative z-10 w-full max-w-[340px] flex flex-col items-center gap-3">
        {/* Tap to Unlock Button Pill */}
        <motion.button
          onClick={handleUnlock}
          whileTap={{ scale: 0.96 }}
          className="w-full py-3 px-5 rounded-full bg-[#007AFF] hover:bg-[#0062CC] text-white font-semibold text-[13px] shadow-[0_6px_20px_rgba(0,122,255,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronUp size={16} />
          </motion.div>
          <span>Sentuh untuk Membuka</span>
        </motion.button>

        {/* iOS Lock Screen Bottom Action Circular Buttons */}
        <div className="w-full flex items-center justify-between px-3">
          {/* Flashlight toggle */}
          <button
            type="button"
            onClick={() => setFlashlightOn(!flashlightOn)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              flashlightOn
                ? 'bg-white text-neutral-900 shadow-md'
                : 'bg-black/10 dark:bg-white/10 backdrop-blur-md text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/10'
            }`}
            aria-label="Toggle Flashlight"
          >
            <Flashlight size={18} />
          </button>

          {/* Swipe indicator bar */}
          <div className="w-28 h-1 rounded-full bg-neutral-400/60 dark:bg-neutral-600/60" />

          {/* Camera shortcut button */}
          <button
            type="button"
            onClick={handleUnlock}
            className="w-11 h-11 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md flex items-center justify-center text-neutral-800 dark:text-neutral-200 border border-black/5 dark:border-white/10 shadow-xs transition-all active:scale-90"
            aria-label="Open Camera"
          >
            <Camera size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
