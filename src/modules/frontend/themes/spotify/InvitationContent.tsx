import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { Radio } from 'lucide-react';
import { BottomNavigation } from '../../shared/components/BottomNavigation';
import { HeroSection } from './sections/HeroSection';

// Lazy load Spotify theme sections and shared domain sections
const CoupleProfile = lazy(() => import('./sections/CoupleProfile').then(module => ({ default: module.CoupleProfile })));
const TracklistSection = lazy(() => import('./sections/TracklistSection').then(module => ({ default: module.TracklistSection })));
const CountdownSection = lazy(() => import('../../shared/sections/CountdownSection').then(module => ({ default: module.CountdownSection })));
const EventSection = lazy(() => import('../../shared/sections/EventSection').then(module => ({ default: module.EventSection })));
const LocationSection = lazy(() => import('../../shared/sections/LocationSection').then(module => ({ default: module.LocationSection })));
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
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px] bg-[#121212] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Top Spotify Live Broadcasting Indicator */}
        <div className="pt-4 pb-2 flex items-center justify-center gap-2 bg-[#0E0E0E] text-[#B3B3B3] text-[10px] tracking-[0.25em] uppercase font-semibold select-none border-b border-[#1F1F1F]">
          <Radio size={12} className="text-[#1DB954] animate-pulse" />
          <span>Spotify Interactive • Official Album</span>
        </div>

        <div id="home">
          <HeroSection />
        </div>

        <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-[#1DB954]">Memuat data...</div>}>
          <div id="mempelai"><CoupleProfile /></div>
          <CountdownSection />
          <div id="cerita"><TracklistSection /></div>
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
