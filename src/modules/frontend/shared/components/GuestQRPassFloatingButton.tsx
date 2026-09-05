import { useState } from 'react';
import { QrCode } from 'lucide-react';
import { useGuestName } from '../../../../hooks/useGuestName';
import { GuestQRPassModal } from './GuestQRPassModal';
import { cn } from '../../../../utils/cn';

interface GuestQRPassFloatingButtonProps {
  isOpened: boolean;
}

export function GuestQRPassFloatingButton({ isOpened }: GuestQRPassFloatingButtonProps) {
  const guestName = useGuestName();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpened) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed md:absolute z-50 p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center",
          "bottom-[calc(85px+env(safe-area-inset-bottom))] left-5 md:left-6",
          "bg-white/95 text-sage-dark border-sage/40 backdrop-blur-md shadow-sage/25 ring-4 ring-sage/20"
        )}
        aria-label="Buka Tiket E-Pass QR Resepsi"
        title="Tiket Masuk & QR Pass Resepsi"
      >
        <div className="relative flex items-center justify-center">
          <QrCode size={18} />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sage"></span>
          </span>
        </div>
      </button>

      <GuestQRPassModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        guestName={guestName || 'Tamu Undangan'}
        guestPax={1}
      />
    </>
  );
}
