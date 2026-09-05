import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { BotanicalEucalyptus } from './decorations/BotanicalEucalyptus';
import { BottomNavigation } from '../../shared/components/BottomNavigation';
import { HeroSection } from './sections/HeroSection';
import { IntroSection } from './sections/IntroSection';

// Lazy load Minimalist cultural sections and shared domain sections
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
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px] bg-[#F7FAFC]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Modern Minimalist Top Banner */}
        <div className="pt-6 pb-2 flex flex-col items-center justify-center bg-gradient-to-b from-[#EDF2F7] to-transparent text-[#718096] select-none">
          <BotanicalEucalyptus size={50} primaryColor="#2D3748" secondaryColor="#9AA79C" accentColor="#D4AF37" />
          <span className="text-[9px] tracking-[0.3em] uppercase font-sans mt-1 text-[#718096]">
            Modern Botanical Wedding
          </span>
        </div>

        <div id="home">
          <HeroSection />
        </div>
        <IntroSection />

        <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-[#718096]">Memuat data...</div>}>
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
