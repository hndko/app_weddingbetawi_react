import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { WeddingProvider, useWeddingConfig } from './context/WeddingContext';
import { OpeningCover } from './components/OpeningCover';
import { InvitationContent } from './components/InvitationContent';
import { AppFrame } from './components/decorations/AppFrame';
import { AdminPanel } from './components/admin/AdminPanel';
import { SEO } from './components/SEO';
import { MusicPlayer } from './components/MusicPlayer';

function AppContent({ isAdminParam }: { isAdminParam: boolean }) {
  const { weddingConfig } = useWeddingConfig();
  const [isOpened, setIsOpened] = useState(false);
  
  const siteName = `The Wedding of ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
  
  const seoTitle = weddingConfig.seo?.title || `${siteName} | Wedding Invitation`;
  const seoDesc = weddingConfig.seo?.description || "Kami mengundang Anda untuk hadir di acara pernikahan kami.";
  const seoKeywords = weddingConfig.seo?.keywords || "wedding, pernikahan, undangan digital";
  const seoImage = weddingConfig.seo?.image || weddingConfig.gallery?.[0] || '/images/og-image.jpg';

  if (isAdminParam) {
    return (
      <>
        <SEO 
          title={`Admin Panel | ${siteName}`}
          description="Halaman admin untuk mengatur undangan pernikahan."
          robots="noindex, nofollow"
          siteName={siteName}
        />
        <AdminPanel />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        author={`${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`}
        siteName={siteName}
        image={seoImage}
      />
      <div className="relative min-h-screen w-full bg-[#E8EBE3] flex items-center justify-center font-body selection:bg-sage/30">
        {/* Desktop background decoration */}
        <div className="hidden md:block fixed inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--color-sage-dark) 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        </div>
        {/* Mobile App Container */}
        <div className="relative w-full md:max-w-[430px] h-[100dvh] bg-warm-white md:min-h-[min(900px,calc(100vh-48px))] md:h-[min(900px,calc(100vh-48px))] md:rounded-[36px] shadow-2xl overflow-hidden flex flex-col md:border-8 border-white">
          <AppFrame />
          <AnimatePresence mode="wait">
            {!isOpened ? (
              <OpeningCover key="opening" onOpen={() => setIsOpened(true)} />
            ) : (
              <InvitationContent key="content" />
            )}
          </AnimatePresence>
          {isOpened && <MusicPlayer />}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const isAdminParam = searchParams.has('admin') || window.location.pathname.endsWith('/admin');

  return (
    <WeddingProvider>
      <AppContent isAdminParam={isAdminParam} />
    </WeddingProvider>
  );
}
