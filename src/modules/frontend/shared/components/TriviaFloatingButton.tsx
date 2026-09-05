import { useState, lazy, Suspense } from 'react';
import { Gamepad2, Sparkles } from 'lucide-react';
import { cn } from '../../../../utils/cn';

const TriviaQuizModal = lazy(() =>
  import('./TriviaQuizModal').then((m) => ({ default: m.TriviaQuizModal }))
);

interface TriviaFloatingButtonProps {
  isOpened: boolean;
}

export function TriviaFloatingButton({ isOpened }: TriviaFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpened) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed md:absolute z-50 p-3 rounded-full shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center",
          "bottom-[calc(140px+env(safe-area-inset-bottom))] left-5 md:left-6",
          "bg-gradient-to-tr from-amber-500 to-amber-600 text-black border-amber-300/60 backdrop-blur-md shadow-amber-500/30 ring-4 ring-amber-400/20"
        )}
        aria-label="Mainkan Wedding Trivia Quiz"
        title="Mainkan Wedding Trivia Quiz"
      >
        <div className="relative flex items-center justify-center">
          <Gamepad2 size={18} className="text-black" />
          <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
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
