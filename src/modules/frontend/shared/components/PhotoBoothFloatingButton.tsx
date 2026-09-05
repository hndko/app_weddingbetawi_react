import { useState, lazy, Suspense } from 'react';
import { Camera } from 'lucide-react';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

const PhotoBoothModal = lazy(() =>
  import('./PhotoBoothModal').then((m) => ({ default: m.PhotoBoothModal }))
);

interface PhotoBoothFloatingButtonProps {
  isOpened: boolean;
}

export function PhotoBoothFloatingButton({ isOpened }: PhotoBoothFloatingButtonProps) {
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
          "bottom-[calc(140px+env(safe-area-inset-bottom))] right-5 md:right-6"
        )}
        style={{
          backgroundColor: tokens.floatingBtnBg,
          borderColor: tokens.floatingBtnBorder,
          color: tokens.floatingBtnActiveText,
          boxShadow: `0 0 0 4px ${tokens.floatingBtnRing}, 0 8px 20px -4px rgba(0,0,0,0.2)`
        }}
        aria-label="Buka Virtual Photo Booth & Cetak Photostrip"
        title="Buka Virtual Photo Booth"
      >
        <div className="relative flex items-center justify-center">
          <Camera size={18} />
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
        </div>
      </button>

      {isOpen && (
        <Suspense fallback={null}>
          <PhotoBoothModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
