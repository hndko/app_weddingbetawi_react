import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { BottomNavigation } from '../../shared/components/BottomNavigation';
import { HeroSection } from './sections/HeroSection';
import { IntroSection } from './sections/IntroSection';

// Lazy load Arcade sections and shared domain sections
const CoupleProfile = lazy(() => import('./sections/CoupleProfile').then(module => ({ default: module.CoupleProfile })));
const CountdownSection = lazy(() => import('../../shared/sections/CountdownSection').then(module => ({ default: module.CountdownSection })));
const EventSection = lazy(() => import('../../shared/sections/EventSection').then(module => ({ default: module.EventSection })));
const LocationSection = lazy(() => import('../../shared/sections/LocationSection').then(module => ({ default: module.LocationSection })));
const LoveStory = lazy(() => import('../../shared/sections/LoveStory').then(module => ({ default: module.LoveStory })));
const GallerySection = lazy(() => import('../../shared/sections/GallerySection').then(module => ({ default: module.GallerySection })));
const WeddingGift = lazy(() => import('../../shared/sections/WeddingGift').then(module => ({ default: module.WeddingGift })));
const RSVPSection = lazy(() => import('../../shared/sections/RSVPSection').then(module => ({ default: module.RSVPSection })));
const WishesSection = lazy(() => import('../../shared/sections/WishesSection').then(module => ({ default: module.WishesSection })));
const ClosingSection = lazy(() => import('./sections/ClosingSection').then(module => ({ default: module.ClosingSection })));

export const InvitationContent: React.FC = () => {
  return (
    <>
      <motion.div
        id="scroll-container"
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px] bg-[#0F172A]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div id="home">
          <HeroSection />
        </div>
        <IntroSection />

        <Suspense fallback={<div className="h-[200px] flex items-center justify-center font-mono text-[#22D3EE]">LOADING STAGE...</div>}>
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
