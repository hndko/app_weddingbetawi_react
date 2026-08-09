import { useState, useEffect, useMemo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useWeddingConfig } from '../context/WeddingContext';
import { cn } from '../utils/cn';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Player = ReactPlayer as any;

export function MusicPlayer() {
  const { weddingConfig } = useWeddingConfig();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playlist = useMemo(() => {
    let urls = [];
    if (weddingConfig.music?.playlist?.length) {
      urls = weddingConfig.music.playlist.map(t => t.url).filter(Boolean);
    } else {
      urls = [weddingConfig.musicUrl || "https://www.youtube.com/watch?v=RO75uUZiAw0"];
    }

    return urls.map(url => {
      // Auto-convert Google Drive /view links to direct download links
      if (url.includes('drive.google.com/file/d/')) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://docs.google.com/uc?export=download&id=${match[1]}`;
        }
      }
      return url;
    });
  }, [weddingConfig.music, weddingConfig.musicUrl]);

  const mode = weddingConfig.music?.mode || 'repeat-all';

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    if (mode === 'repeat-one') {
      return; 
    }
    
    if (mode === 'shuffle') {
      const nextIdx = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(nextIdx);
    } else if (mode === 'linear') {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false); // Stop playing when we reach the end
      }
    } else { // repeat-all
      setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length);
    }
  };

  const currentUrl = playlist[currentTrackIndex] || playlist[0];

  return (
    <>
      <div className="hidden">
        <Player 
          url={currentUrl} 
          playing={isPlaying} 
          loop={mode === 'repeat-one'}
          volume={0.5}
          playsinline
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          config={{
            youtube: {
              playerVars: { 
                autoplay: 1, 
                controls: 0,
                showinfo: 0,
                rel: 0,
                origin: window.location.origin
              }
            },
            file: {
              forceAudio: currentUrl.includes('docs.google.com') || currentUrl.endsWith('.mp3'),
              attributes: {
                crossOrigin: "anonymous"
              }
            }
          }}
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
