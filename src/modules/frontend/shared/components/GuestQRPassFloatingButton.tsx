import { useState, lazy, Suspense } from 'react';
import { QrCode } from 'lucide-react';
import { useGuestName } from '../../../../hooks/useGuestName';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

const GuestQRPassModal = lazy(() => 
  import('./GuestQRPassModal').then(m => ({ default: m.GuestQRPassModal }))
);

interface GuestQRPassFloatingButtonProps {
  isOpened: boolean;
}

export function GuestQRPassFloatingButton({ isOpened }: GuestQRPassFloatingButtonProps) {
  const guestName = useGuestName();
  const { tokens } = useThemeTokens();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpened) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed md:absolute z-50 p-3 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center",
          "bottom-[calc(85px+env(safe-area-inset-bottom))] left-5 md:left-6"
        )}
        style={{
          backgroundColor: tokens.floatingBtnBg,
          borderColor: tokens.floatingBtnBorder,
          color: tokens.floatingBtnActiveText,
          boxShadow: `0 0 0 4px ${tokens.floatingBtnRing}, 0 8px 20px -4px rgba(0,0,0,0.2)`
        }}
        aria-label="Buka Tiket E-Pass QR Resepsi"
        title="Tiket Masuk & QR Pass Resepsi"
      >
        <div className="relative flex items-center justify-center">
          <QrCode size={18} />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: tokens.accent }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: tokens.accent }}
            />
          </span>
        </div>
      </button>

      {isOpen && (
        <Suspense fallback={null}>
          <GuestQRPassModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            guestName={guestName || 'Tamu Undangan'}
            guestPax={1}
          />
        </Suspense>
      )}
    </>
  );
}
