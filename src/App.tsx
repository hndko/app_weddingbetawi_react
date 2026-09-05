import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { WeddingProvider, useWeddingConfig } from './context/WeddingContext';
import { resolveTheme } from './modules/frontend/themes';
import { SEO } from './modules/frontend/shared/components/SEO';
import { MusicPlayer as DefaultMusicPlayer } from './modules/frontend/shared/components/MusicPlayer';
import { GuestQRPassFloatingButton } from './modules/frontend/shared/components/GuestQRPassFloatingButton';

// Lazy-loaded route components for high performance and zero-overhead code splitting
const AdminPanel = lazy(() => 
  import('./modules/backend/Panel').then(m => ({ default: m.Panel }))
);
const LiveWishesProjector = lazy(() => 
  import('./modules/frontend/shared/components/LiveWishesProjector').then(m => ({ default: m.LiveWishesProjector }))
);

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

function RouteLoadingSpinner({ bg = '#F4F7F4', text = 'Memuat...' }: { bg?: string; text?: string }) {
  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center font-body gap-3 select-none"
      style={{ backgroundColor: bg }}
    >
      <div className="w-9 h-9 border-4 border-sage/40 border-t-sage rounded-full animate-spin"></div>
      {text && <span className="text-xs font-semibold text-text-dark/70 tracking-wider animate-pulse">{text}</span>}
    </div>
  );
}

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
    return <RouteLoadingSpinner bg={activeTheme.meta.previewColors.bg} text="Menyiapkan Undangan..." />;
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
        <Suspense fallback={<RouteLoadingSpinner bg="#0F172A" text="Menyiapkan Layar Panggung..." />}>
          <LiveWishesProjector />
        </Suspense>
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
        <Suspense fallback={<RouteLoadingSpinner bg="#F8FAFC" text="Membuka Panel Dasbor..." />}>
          <AdminPanel 
            currentRoute={isModules ? 'modules' : 'login'} 
            onNavigate={navigateTo}
            onReplace={replaceTo}
          />
        </Suspense>
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
          <Suspense fallback={<RouteLoadingSpinner bg={activeTheme.meta.previewColors.bg} text="Menyiapkan Tampilan..." />}>
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
          </Suspense>
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
