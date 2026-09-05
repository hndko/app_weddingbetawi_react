import { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Camera, Gamepad2, QrCode } from 'lucide-react';
import { useGuestName } from '../../../../hooks/useGuestName';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

const GuestQRPassModal = lazy(() =>
  import('./GuestQRPassModal').then((m) => ({ default: m.GuestQRPassModal }))
);
const TriviaQuizModal = lazy(() =>
  import('./TriviaQuizModal').then((m) => ({ default: m.TriviaQuizModal }))
);
const PhotoBoothModal = lazy(() =>
  import('./PhotoBoothModal').then((m) => ({ default: m.PhotoBoothModal }))
);

interface FloatingFeatureHubProps {
  isOpened: boolean;
}

type ActiveModalType = 'none' | 'qr' | 'trivia' | 'photobooth';

export function FloatingFeatureHub({ isOpened }: FloatingFeatureHubProps) {
  const guestName = useGuestName();
  const { tokens, isDark } = useThemeTokens();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState<ActiveModalType>('none');

  if (!isOpened) return null;

  const handleOpenFeature = (modal: ActiveModalType) => {
    setActiveModal(modal);
    setIsExpanded(false);
  };

  const featureItems = [
    {
      id: 'photobooth' as const,
      label: 'Photo Booth',
      sublabel: 'Cetak Photostrip HD',
      icon: Camera,
      badge: 'Baru',
      onClick: () => handleOpenFeature('photobooth')
    },
    {
      id: 'trivia' as const,
      label: 'Mini Game Trivia',
      sublabel: 'Kuis Seru Mempelai',
      icon: Gamepad2,
      badge: 'Game',
      onClick: () => handleOpenFeature('trivia')
    },
    {
      id: 'qr' as const,
      label: 'E-Ticket QR Pass',
      sublabel: 'Check-in Resepsi',
      icon: QrCode,
      badge: 'Tiket',
      onClick: () => handleOpenFeature('qr')
    }
  ];

  return (
    <>
      {/* Click-outside backdrop catcher when menu is open */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Speed Dial Container */}
      <div 
        className={cn(
          "fixed md:absolute z-50 flex flex-col items-start select-none",
          "bottom-[calc(80px+env(safe-area-inset-bottom))] left-5 md:left-6"
        )}
      >
        {/* Expanded Feature Items Stack */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start gap-2.5 mb-3 origin-bottom-left"
            >
              {featureItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    onClick={item.onClick}
                    className="flex items-center gap-2.5 group cursor-pointer active:scale-95 transition-transform"
                    aria-label={item.label}
                  >
                    {/* Circle Icon Button */}
                    <div
                      className="w-10 h-10 rounded-full shadow-lg border backdrop-blur-md flex items-center justify-center transition-all duration-200 group-hover:scale-105"
                      style={{
                        backgroundColor: tokens.floatingBtnBg,
                        borderColor: tokens.floatingBtnBorder,
                        color: tokens.floatingBtnActiveText,
                        boxShadow: `0 0 0 3px ${tokens.floatingBtnRing}, 0 6px 16px -2px rgba(0,0,0,0.25)`
                      }}
                    >
                      <IconComponent size={17} />
                    </div>

                    {/* Floating Label Pill */}
                    <div
                      className={cn(
                        "py-1.5 px-3 rounded-xl shadow-lg border backdrop-blur-md text-left flex items-center gap-2 transition-all duration-200 group-hover:scale-102",
                        isDark ? "bg-[#18181b]/95 border-white/15 text-white" : "bg-white/95 border-stone-200 text-stone-800"
                      )}
                      style={{
                        boxShadow: '0 4px 14px -2px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div>
                        <div className="text-[11px] font-bold leading-tight flex items-center gap-1.5">
                          <span>{item.label}</span>
                          <span 
                            className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${tokens.accent}25`,
                              color: tokens.accent
                            }}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <div className="text-[9px] opacity-60 leading-none mt-0.5">
                          {item.sublabel}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Trigger Button */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            "p-3 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center",
            isExpanded ? "rotate-90" : "rotate-0"
          )}
          style={{
            backgroundColor: tokens.floatingBtnBg,
            borderColor: tokens.floatingBtnBorder,
            color: tokens.floatingBtnActiveText,
            boxShadow: `0 0 0 4px ${tokens.floatingBtnRing}, 0 8px 20px -4px rgba(0,0,0,0.25)`
          }}
          aria-label={isExpanded ? "Tutup Menu Fitur Tamu" : "Buka Menu Fitur Interaktif Tamu"}
          title={isExpanded ? "Tutup Menu" : "Fitur Interaktif (Game, QR, Photo Booth)"}
        >
          <div className="relative flex items-center justify-center">
            {isExpanded ? (
              <X size={18} />
            ) : (
              <>
                <Sparkles size={18} />
                {/* Subtle pulse indicator dot when collapsed */}
                <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: tokens.accent }}
                  />
                  <span 
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ backgroundColor: tokens.accent }}
                  />
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Lazy-loaded feature modals */}
      {activeModal === 'photobooth' && (
        <Suspense fallback={null}>
          <PhotoBoothModal
            isOpen={activeModal === 'photobooth'}
            onClose={() => setActiveModal('none')}
          />
        </Suspense>
      )}

      {activeModal === 'trivia' && (
        <Suspense fallback={null}>
          <TriviaQuizModal
            isOpen={activeModal === 'trivia'}
            onClose={() => setActiveModal('none')}
          />
        </Suspense>
      )}

      {activeModal === 'qr' && (
        <Suspense fallback={null}>
          <GuestQRPassModal
            isOpen={activeModal === 'qr'}
            onClose={() => setActiveModal('none')}
            guestName={guestName || 'Tamu Undangan'}
            guestPax={1}
          />
        </Suspense>
      )}
    </>
  );
}
