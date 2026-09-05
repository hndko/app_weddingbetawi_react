import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { WayangGunungan } from './decorations/WayangGunungan';
import { BottomNavigation } from '../../betawi-themes/BottomNavigation';
import { HeroSection } from './sections/HeroSection';
import { IntroSection } from './sections/IntroSection';

// Lazy load Javanese cultural sections and shared domain sections
const CoupleProfile = lazy(() => import('./sections/CoupleProfile').then(module => ({ default: module.CoupleProfile })));
const CountdownSection = lazy(() => import('../../betawi-themes/sections/CountdownSection').then(module => ({ default: module.CountdownSection })));
const EventSection = lazy(() => import('../../betawi-themes/sections/EventSection').then(module => ({ default: module.EventSection })));
const LocationSection = lazy(() => import('../../betawi-themes/sections/LocationSection').then(module => ({ default: module.LocationSection })));
const LoveStory = lazy(() => import('../../betawi-themes/sections/LoveStory').then(module => ({ default: module.LoveStory })));
const GallerySection = lazy(() => import('../../betawi-themes/sections/GallerySection').then(module => ({ default: module.GallerySection })));
const WeddingGift = lazy(() => import('../../betawi-themes/sections/WeddingGift').then(module => ({ default: module.WeddingGift })));
const RSVPSection = lazy(() => import('../../betawi-themes/sections/RSVPSection').then(module => ({ default: module.RSVPSection })));
const WishesSection = lazy(() => import('../../betawi-themes/sections/WishesSection').then(module => ({ default: module.WishesSection })));
const ClosingSection = lazy(() => import('./sections/ClosingSection').then(module => ({ default: module.ClosingSection })));

export const InvitationContent: React.FC = () => {
  return (
    <>
      <motion.div
        id="scroll-container"
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px] bg-[#FAF8F2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Javanese Kraton Greeting Banner at Top */}
        <div className="pt-6 pb-2 flex flex-col items-center justify-center bg-gradient-to-b from-[#132A1C] to-transparent text-[#E5C158] select-none">
          <WayangGunungan size={48} color="#E5C158" accentColor="#132A1C" />
          <span className="text-[10px] tracking-[0.25em] uppercase font-serif mt-1 text-[#E5C158]/90">
            Pawiwahan Ageng
          </span>
        </div>

        <div id="home">
          <HeroSection />
        </div>
        <IntroSection />

        <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-[#C5A059]">Memuat data...</div>}>
          <div id="mempelai"><CoupleProfile /></div>
          <CountdownSection />
          <div id="cerita"><LoveStory /></div>
          <div id="acara"><EventSection /></div>
          <LocationSection />
          <div id="galeri"><GallerySection /></div>
          <WeddingGift />
          <RSVPSection />
          <div id="ucapan"><WishesSection /></div>
          <ClosingSection />
        </Suspense>
      </motion.div>

      <BottomNavigation />
    </>
  );
};
