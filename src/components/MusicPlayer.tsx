import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { cn } from '../utils/cn';

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e) {
          console.log('Autoplay prevented:', e);
          setIsPlaying(false);
        }
      }
    };
    
    playAudio();
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop src="https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58bc.mp3?filename=soft-romantic-piano-113661.mp3" />
      
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
