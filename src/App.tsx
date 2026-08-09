import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { WeddingProvider } from './context/WeddingContext';
import { OpeningCover } from './components/OpeningCover';
import { InvitationContent } from './components/InvitationContent';
import { AppFrame } from './components/decorations/AppFrame';
import { AdminPanel } from './components/admin/AdminPanel';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  
  const searchParams = new URLSearchParams(window.location.search);
  const isAdminParam = searchParams.has('admin') || window.location.pathname.endsWith('/admin');

  if (isAdminParam) {
    return (
      <WeddingProvider>
        <AdminPanel />
      </WeddingProvider>
    );
  }

  return (
    <WeddingProvider>
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
        </div>
      </div>
    </WeddingProvider>
  );
}
