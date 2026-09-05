import React, { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { Film } from 'lucide-react';
import { BottomNavigation } from '../../shared/components/BottomNavigation';
import { HeroSection } from './sections/HeroSection';

// Lazy load Netflix theme sections and shared domain sections
const CastAndCrew = lazy(() => import('./sections/CastAndCrew').then(module => ({ default: module.CastAndCrew })));
const EpisodesSection = lazy(() => import('./sections/EpisodesSection').then(module => ({ default: module.EpisodesSection })));
const SeriesTimeline = lazy(() => import('./sections/SeriesTimeline').then(module => ({ default: module.SeriesTimeline })));
const CountdownSection = lazy(() => import('../../shared/sections/CountdownSection').then(module => ({ default: module.CountdownSection })));
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
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth pb-[120px] bg-[#141414] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Top Netflix Streaming Header Bar */}
        <div className="pt-4 pb-2.5 flex items-center justify-center gap-2 bg-[#0C0C0C] text-[#999999] text-[10px] tracking-[0.25em] uppercase font-bold select-none border-b border-[#222222]">
          <span className="text-[#E50914] font-black text-xs">N</span>
          <span>SERIES • ORIGINAL WEDDING PREMIERE</span>
        </div>

        <div id="home">
          <HeroSection />
        </div>

        <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-[#E50914]">Memuat tayangan...</div>}>
          <div id="mempelai"><CastAndCrew /></div>
          <CountdownSection />
          <div id="acara"><EpisodesSection /></div>
          <div id="cerita"><SeriesTimeline /></div>
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
