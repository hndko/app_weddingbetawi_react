import { useState, lazy, Suspense } from 'react';
import { Gamepad2 } from 'lucide-react';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

const TriviaQuizModal = lazy(() =>
  import('./TriviaQuizModal').then((m) => ({ default: m.TriviaQuizModal }))
);

interface TriviaFloatingButtonProps {
  isOpened: boolean;
}

export function TriviaFloatingButton({ isOpened }: TriviaFloatingButtonProps) {
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
          "bottom-[calc(140px+env(safe-area-inset-bottom))] left-5 md:left-6"
        )}
        style={{
          backgroundColor: tokens.floatingBtnBg,
          borderColor: tokens.floatingBtnBorder,
          color: tokens.floatingBtnActiveText,
          boxShadow: `0 0 0 4px ${tokens.floatingBtnRing}, 0 8px 20px -4px rgba(0,0,0,0.2)`
        }}
        aria-label="Mainkan Wedding Trivia Quiz"
        title="Mainkan Wedding Trivia Quiz"
      >
        <div className="relative flex items-center justify-center">
          <Gamepad2 size={18} />
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
          <TriviaQuizModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
