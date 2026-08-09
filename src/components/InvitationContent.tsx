import { motion } from 'motion/react';
import { BottomNavigation } from './BottomNavigation';
import { HeroSection } from './sections/HeroSection';
import { IntroSection } from './sections/IntroSection';
import { MusicPlayer } from './MusicPlayer';

import React, { Suspense, lazy } from 'react';

// Lazy load sections below the fold
const CoupleProfile = lazy(() => import('./sections/CoupleProfile').then(module => ({ default: module.CoupleProfile })));
const CountdownSection = lazy(() => import('./sections/CountdownSection').then(module => ({ default: module.CountdownSection })));
const EventSection = lazy(() => import('./sections/EventSection').then(module => ({ default: module.EventSection })));
const LocationSection = lazy(() => import('./sections/LocationSection').then(module => ({ default: module.LocationSection })));
const LoveStory = lazy(() => import('./sections/LoveStory').then(module => ({ default: module.LoveStory })));
const GallerySection = lazy(() => import('./sections/GallerySection').then(module => ({ default: module.GallerySection })));
const WeddingGift = lazy(() => import('./sections/WeddingGift').then(module => ({ default: module.WeddingGift })));
const RSVPSection = lazy(() => import('./sections/RSVPSection').then(module => ({ default: module.RSVPSection })));
const WishesSection = lazy(() => import('./sections/WishesSection').then(module => ({ default: module.WishesSection })));
const ClosingSection = lazy(() => import('./sections/ClosingSection').then(module => ({ default: module.ClosingSection })));

export const InvitationContent: React.FC = () => {
  return (
    <>
      <motion.div 
        id="scroll-container"
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div id="home"><HeroSection /></div>
      <IntroSection />
      
      <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-sage">Memuat...</div>}>
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
    
    <MusicPlayer />
    <BottomNavigation />
  </>
);
}

