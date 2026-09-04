import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { WeddingProvider, useWeddingConfig } from './context/WeddingContext';
import { OpeningCover } from './modules/Frontend/betawi-themes/OpeningCover';
import { InvitationContent } from './modules/Frontend/betawi-themes/InvitationContent';
import { AppFrame } from './modules/Frontend/betawi-themes/decorations/AppFrame';
import { Panel as AdminPanel } from './modules/Backend/Panel';
import { SEO } from './modules/Frontend/betawi-themes/SEO';
import { MusicPlayer } from './modules/Frontend/betawi-themes/MusicPlayer';

export function navigateTo(path: string) {
  if (window.location.pathname !== path) {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('app_navigate'));
  }
}

export function replaceTo(path: string) {
  window.history.replaceState(null, '', path);
  window.dispatchEvent(new Event('app_navigate'));
}

function useCurrentPath(): string {
  const [path, setPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('app_navigate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('app_navigate', handleLocationChange);
    };
  }, []);

  return path;
}

function AppContent({ currentPath }: { currentPath: string }) {
  const { weddingConfig, loading } = useWeddingConfig();
  const [isOpened, setIsOpened] = useState(false);

  const rawPath = currentPath.toLowerCase().replace(/\/+$/, '') || '/';
  const isLogin = rawPath === '/login';
  const isModules = rawPath === '/modules';
  
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#E8EBE3] flex items-center justify-center font-body">
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const siteName = `The Wedding of ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
  
  const seoTitle = weddingConfig.seo?.title || `${siteName} | Wedding Invitation`;
  const seoDesc = weddingConfig.seo?.description || "Kami mengundang Anda untuk hadir di acara pernikahan kami.";
  const seoKeywords = weddingConfig.seo?.keywords || "wedding, pernikahan, undangan digital";
  const seoImage = weddingConfig.seo?.image || weddingConfig.gallery?.[0] || '/images/og-image.jpg';

  if (isLogin || isModules) {
    return (
      <>
        <SEO 
          title={isModules ? `Admin Modules | ${siteName}` : `Admin Login | ${siteName}`}
          description="Halaman admin untuk mengatur undangan pernikahan."
          robots="noindex, nofollow"
          siteName={siteName}
        />
        <AdminPanel 
          currentRoute={isModules ? 'modules' : 'login'} 
          onNavigate={navigateTo}
          onReplace={replaceTo}
        />
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
          <MusicPlayer isOpened={isOpened} />
        </div>
      </div>
    </>
  );
}

export default function App() {
  const currentPath = useCurrentPath();

  return (
    <WeddingProvider>
      <AppContent currentPath={currentPath} />
    </WeddingProvider>
  );
}
