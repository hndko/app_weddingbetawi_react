import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { BottomNavigation } from '../../shared/components/BottomNavigation';
import { BentoHero } from './sections/BentoHero';
import { BentoCoupleProfile } from './sections/BentoCoupleProfile';
import { BentoCalendarSchedule } from './sections/BentoCalendarSchedule';
import { BentoLocationWeather } from './sections/BentoLocationWeather';
import { BentoAppleWallet } from './sections/BentoAppleWallet';
import { BentoMessagesWishes } from './sections/BentoMessagesWishes';
import { ClosingSection } from './sections/ClosingSection';

// Shared domain sections for Story & Gallery
const LoveStory = lazy(() =>
  import('../../shared/sections/LoveStory').then((m) => ({ default: m.LoveStory }))
);
const GallerySection = lazy(() =>
  import('../../shared/sections/GallerySection').then((m) => ({ default: m.GallerySection }))
);

export const InvitationContent: React.FC = () => {
  return (
    <>
      <motion.div
        id="scroll-container"
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px] bg-[#F2F2F7] dark:bg-[#000000] text-neutral-900 dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        {/* iOS Top Status Bar Padding Spacer */}
        <div className="pt-12" />

        {/* Top iOS Header Pill */}
        <div className="flex items-center justify-center my-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 shadow-xs">
            <Sparkles size={11} className="text-[#007AFF]" />
            <span>WEDDING ECOSYSTEM • BENTO OS</span>
          </div>
        </div>

        {/* 1. Hero Bento Card with Live Countdown */}
        <div id="home">
          <BentoHero />
        </div>

        {/* 2. Couple Profiles (People & Memories) */}
        <div id="mempelai">
          <BentoCoupleProfile />
        </div>

        {/* 3. Love Story Timeline */}
        <div id="cerita">
          <Suspense fallback={<div className="h-20 flex items-center justify-center text-xs text-neutral-400">Memuat cerita...</div>}>
            <LoveStory />
          </Suspense>
        </div>

        {/* 4. Calendar & Schedule (Akad & Resepsi) */}
        <div id="acara">
          <BentoCalendarSchedule />
        </div>

        {/* 5. Maps & Weather */}
        <BentoLocationWeather />

        {/* 6. Photo Gallery */}
        <div id="galeri">
          <Suspense fallback={<div className="h-20 flex items-center justify-center text-xs text-neutral-400">Memuat galeri...</div>}>
            <GallerySection />
          </Suspense>
        </div>

        {/* 7. Apple Wallet Digital Gifts */}
        <BentoAppleWallet />

        {/* 8. iMessage RSVP & Wishes */}
        <div id="ucapan">
          <BentoMessagesWishes />
        </div>

        {/* 9. Closing Section */}
        <ClosingSection />
      </motion.div>

      {/* Persistent Bottom Navigation */}
      <BottomNavigation />
    </>
  );
};
