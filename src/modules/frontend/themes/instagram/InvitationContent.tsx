import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, Volume2, VolumeX, Sparkles, X } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { StoryProgressBar } from './components/StoryProgressBar';
import { CoverSlide } from './slides/CoverSlide';
import { CoupleSlide } from './slides/CoupleSlide';
import { StorySlide } from './slides/StorySlide';
import { EventSlide } from './slides/EventSlide';
import { LocationSlide } from './slides/LocationSlide';
import { GiftSlide } from './slides/GiftSlide';
import { WishesSlide } from './slides/WishesSlide';
import { playStoryPop, playHeartChime } from './utils/instagramAudio';
import { BottomNavigation } from '../../shared/components/BottomNavigation';

const SLIDE_DURATION_MS = 8000;
const TOTAL_SLIDES = 7;

export const InvitationContent: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const pauseTimerRef = useRef(false);
  pauseTimerRef.current = isPaused;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < TOTAL_SLIDES - 1) {
        playStoryPop();
        setProgress(0);
        return prev + 1;
      }
      return prev; // Stay on final slide so user can write wishes and poll!
    });
  }, []);

  const prevSlide = useCallback(() => {
    playStoryPop();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    setProgress(0);
  }, []);

  // Timer loop for story progression
  useEffect(() => {
    const interval = 50; // update every 50ms
    const step = (interval / SLIDE_DURATION_MS) * 100;

    const timer = setInterval(() => {
      if (!pauseTimerRef.current) {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 100;
          }
          return prev + step;
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, select, textarea, form')) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.3) {
      prevSlide();
    } else if (clickX > width * 0.7) {
      nextSlide();
    }
  };

  const handleSendHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHeartChime();
    const id = Date.now() + Math.random();
    setFloatingHearts((prev) => [...prev, { id, x: 75 + (Math.random() * 15 - 7.5) }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 2000);
  };

  const slides = [
    <CoverSlide key="0" />,
    <CoupleSlide key="1" />,
    <StorySlide key="2" />,
    <EventSlide key="3" />,
    <LocationSlide key="4" />,
    <GiftSlide key="5" />,
    <WishesSlide key="6" />,
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-black text-white overflow-hidden select-none">
      {/* 1. Top Story Progress Bar */}
      <StoryProgressBar
        totalSegments={TOTAL_SLIDES}
        activeIndex={activeIndex}
        progress={progress}
        onSegmentClick={(idx) => {
          playStoryPop();
          setActiveIndex(idx);
          setProgress(0);
        }}
      />

      {/* 2. Top Story Header: Author Info */}
      <div className="absolute top-6 left-0 right-0 z-40 px-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Avatar with small gradient ring */}
          <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-[#FFD600] to-[#FF0069] overflow-hidden">
            <img
              src={
                weddingConfig.groom.image ||
                'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80'
              }
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-tight">
                {weddingConfig.groom.nickname.toLowerCase()}_{weddingConfig.bride.nickname.toLowerCase()}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
            </div>
            <span className="text-[9px] text-white/70 mt-0.5">
              Story {activeIndex + 1} dari {TOTAL_SLIDES}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-white/80 pointer-events-auto">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-semibold text-white/90">
            <Sparkles size={10} className="text-[#FFD600]" />
            <span>Close Friends</span>
          </div>
        </div>
      </div>

      {/* 3. Main Slide Viewport (Handles Tap Left / Tap Right & Hold to Pause) */}
      <div
        id="scroll-container"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onClick={handleScreenClick}
        className="flex-1 w-full h-full relative cursor-pointer overflow-hidden pb-[110px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full"
          >
            {slides[activeIndex]}
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Floating Hearts Reaction Animation */}
        {floatingHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 1, y: 0, scale: 0.8, x: `${h.x}%` }}
            animate={{ opacity: 0, y: -260, scale: 1.8 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute bottom-24 pointer-events-none z-50 text-[#FF0069]"
          >
            <Heart size={28} className="fill-[#FF0069] drop-shadow-lg" />
          </motion.div>
        ))}
      </div>

      {/* 4. Bottom Story Action Bar */}
      <div className="absolute bottom-16 left-0 right-0 z-40 px-4 py-2 flex items-center justify-between gap-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-auto">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex(6); // Go to Wishes slide
            setProgress(0);
          }}
          className="flex-1 h-9 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 px-4 flex items-center text-white/60 text-xs cursor-pointer backdrop-blur-md transition-colors"
        >
          <span>Kirim pesan atau doa restu...</span>
        </div>

        {/* Heart Reaction Button */}
        <button
          type="button"
          onClick={handleSendHeart}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF7A00] via-[#FF0069] to-[#D300C5] flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform cursor-pointer"
          title="Kirim Reaksi Hati"
        >
          <Heart size={18} className="fill-white" />
        </button>
      </div>

      {/* 5. Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};
