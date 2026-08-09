import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player';
import { cn } from '../utils/cn';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-play might be blocked without user interaction.
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setIsPlaying(true);
      }
    };
    
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="hidden">
        <ReactPlayer 
          url="https://www.youtube.com/watch?v=RO75uUZiAw0" 
          playing={isPlaying} 
          loop={true}
          volume={0.5}
          playsinline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
      
      <button 
        onClick={togglePlay}
        className={cn(
          "absolute z-[100] bg-white/80 backdrop-blur-md border border-light-gray p-3 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] text-sage-dark transition-all duration-300 hover:scale-105",
          "bottom-[calc(100px+env(safe-area-inset-bottom))] right-6"
        )}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
