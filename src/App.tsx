import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence } from 'motion/react';
import { WeddingProvider, useWeddingConfig } from './context/WeddingContext';
import { resolveTheme } from './modules/frontend/themes';
import { Panel as AdminPanel } from './modules/backend/Panel';
import { SEO } from './modules/frontend/shared/components/SEO';
import { MusicPlayer as DefaultMusicPlayer } from './modules/frontend/shared/components/MusicPlayer';
import { GuestQRPassFloatingButton } from './modules/frontend/shared/components/GuestQRPassFloatingButton';
import { LiveWishesProjector } from './modules/frontend/shared/components/LiveWishesProjector';

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

const DefaultNullFrame: React.FC = () => null;

function AppContent({ currentPath }: { currentPath: string }) {
  const { weddingConfig, loading } = useWeddingConfig();
  const [isOpened, setIsOpened] = useState(false);

  // Check URL query parameter ?theme= for live demo/preview override (must be called unconditionally)
  const previewTheme = useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('theme') || undefined;
    } catch {
      return undefined;
    }
  }, [currentPath]);

  const activeTheme = useMemo(() => {
    return resolveTheme(previewTheme || weddingConfig?.theme);
  }, [previewTheme, weddingConfig?.theme]);

  const rawPath = currentPath.toLowerCase().replace(/\/+$/, '') || '/';
  const isLogin = rawPath === '/login';
  const isModules = rawPath === '/modules';
  const isLiveWishes = rawPath === '/live' || rawPath === '/projector' || rawPath === '/live-wishes';
  
  if (loading) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center font-body"
        style={{ backgroundColor: activeTheme.meta.previewColors.bg }}
      >
        <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const siteName = `The Wedding of ${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
  
  const seoTitle = weddingConfig.seo?.title || `${siteName} | Wedding Invitation`;
  const seoDesc = weddingConfig.seo?.description || "Kami mengundang Anda untuk hadir di acara pernikahan kami.";
  const seoKeywords = weddingConfig.seo?.keywords || "wedding, pernikahan, undangan digital";
  const seoImage = weddingConfig.seo?.image || weddingConfig.gallery?.[0] || activeTheme.meta.thumbnail;

  if (isLiveWishes) {
    return (
      <>
        <SEO 
          title={`Live Stage Screen | ${siteName}`}
          description="Layar LED Proyektor Panggung Dinding Doa & Ucapan Restu Tamu."
          robots="noindex, nofollow"
          siteName={siteName}
        />
        <LiveWishesProjector />
      </>
    );
  }

  if (isLogin || isModules) {
    return (
      <>
        <SEO 
          title={isModules ? `Panel Modules | ${siteName}` : `Panel Login | ${siteName}`}
          description="Halaman panel modules untuk mengatur undangan pernikahan."
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

  const {
    OpeningCover,
    InvitationContent,
    AppFrame = DefaultNullFrame,
    MusicPlayer = DefaultMusicPlayer,
  } = activeTheme.components;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDesc}
        keywords={seoKeywords}
        author={`${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`}
        siteName={siteName}
        image={seoImage}
        favicon={activeTheme.meta.favicon}
        themeColor={activeTheme.meta.previewColors.bg}
      />
      <div 
        className="relative min-h-screen w-full flex items-center justify-center font-body selection:bg-sage/30 transition-colors duration-500"
        style={{ backgroundColor: activeTheme.meta.previewColors.bg }}
      >
        {/* Desktop background decoration */}
        <div className="hidden md:block fixed inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(var(--color-sage-dark) 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        </div>
        {/* Mobile App Container */}
        <div className="relative w-full md:max-w-[430px] h-[100dvh] bg-warm-white md:min-h-[min(900px,calc(100vh-48px))] md:h-[min(900px,calc(100vh-48px))] md:rounded-[36px] shadow-2xl overflow-hidden flex flex-col md:border-8 border-white">
          <AppFrame />
          <AnimatePresence mode="wait">
            {!isOpened ? (
              <OpeningCover key={`opening-${activeTheme.meta.id}`} onOpen={() => setIsOpened(true)} />
            ) : (
              <InvitationContent key={`content-${activeTheme.meta.id}`} />
            )}
          </AnimatePresence>
          <MusicPlayer isOpened={isOpened} />
          <GuestQRPassFloatingButton isOpened={isOpened} />
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
