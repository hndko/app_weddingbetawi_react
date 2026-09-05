import { useState, useEffect, useMemo, useRef } from 'react';
import { VolumeX, Music } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

const DEFAULT_MUSIC_URL = "https://www.youtube.com/watch?v=RO75uUZiAw0";

interface MusicPlayerProps {
  isOpened: boolean;
}

function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function MusicPlayer({ isOpened }: MusicPlayerProps) {
  const { weddingConfig } = useWeddingConfig();
  const { tokens } = useThemeTokens();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const [ytApiReady, setYtApiReady] = useState(false);

  // Normalize playlist URLs
  const playlist = useMemo(() => {
    let urls: string[] = [];
    if (weddingConfig.music?.playlist?.length) {
      urls = weddingConfig.music.playlist.map(t => t.url?.trim()).filter(Boolean) as string[];
    } else if (weddingConfig.musicUrl?.trim()) {
      urls = [weddingConfig.musicUrl.trim()];
    }

    if (urls.length === 0) {
      urls = [DEFAULT_MUSIC_URL];
    }

    return urls.map(url => {
      // Auto-convert Google Drive /view links to direct stream links
      if (url.includes('drive.google.com/file/d/')) {
        const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          return `https://docs.google.com/uc?export=download&id=${match[1]}`;
        }
      }
      // Auto-convert Dropbox links for direct streaming
      if (url.includes('dropbox.com')) {
        return url.replace('dl=0', 'raw=1');
      }
      return url;
    });
  }, [weddingConfig.music, weddingConfig.musicUrl]);

  const mode = weddingConfig.music?.mode || 'repeat-all';
  const currentUrl = playlist[currentTrackIndex] || playlist[0] || DEFAULT_MUSIC_URL;
  const ytVideoId = useMemo(() => getYouTubeVideoId(currentUrl), [currentUrl]);
  const isYouTube = Boolean(ytVideoId);

  // Load YouTube IFrame API script once if YouTube URL is used
  useEffect(() => {
    if (!isYouTube) return;

    if (window.YT && window.YT.Player) {
      setYtApiReady(true);
      return;
    }

    const existingScript = document.getElementById('youtube-iframe-api');
    if (!existingScript) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const prevHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevHandler) prevHandler();
      setYtApiReady(true);
    };
  }, [isYouTube]);

  const handleEnded = () => {
    if (mode === 'repeat-one') {
      if (isYouTube && ytPlayerRef.current?.seekTo) {
        ytPlayerRef.current.seekTo(0);
        ytPlayerRef.current.playVideo();
      } else if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    if (mode === 'shuffle') {
      const nextIdx = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(nextIdx);
    } else if (mode === 'linear') {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    } else { // repeat-all
      setCurrentTrackIndex((currentTrackIndex + 1) % playlist.length);
    }
  };

  const handleTrackError = () => {
    console.warn('Playback error for track:', currentUrl);
    if (playlist.length > 1) {
      setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
    }
  };

  // Initialize or update YouTube Player when ready
  useEffect(() => {
    if (!isYouTube || !ytApiReady || !ytVideoId || !ytContainerRef.current) return;

    // Destroy previous instance if any
    if (ytPlayerRef.current?.destroy) {
      try {
        ytPlayerRef.current.destroy();
      } catch {
        // Safe fallback
      }
    }

    const playerElement = document.createElement('div');
    ytContainerRef.current.innerHTML = '';
    ytContainerRef.current.appendChild(playerElement);

    try {
      ytPlayerRef.current = new window.YT.Player(playerElement, {
        videoId: ytVideoId,
        playerVars: {
          autoplay: isOpened ? 1 : 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          loop: mode === 'repeat-one' ? 1 : 0,
          playlist: ytVideoId,
          modestbranding: 1,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(75);
            if (isOpened && isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // 1: PLAYING, 2: PAUSED, 0: ENDED
            if (event.data === 1) {
              setIsPlaying(true);
            } else if (event.data === 2) {
              setIsPlaying(false);
            } else if (event.data === 0) {
              handleEnded();
            }
          },
          onError: () => {
            handleTrackError();
          }
        }
      });
    } catch (err) {
      console.warn('Failed to initialize YT.Player:', err);
    }

    return () => {
      if (ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // Safe fallback
        }
      }
    };
  }, [isYouTube, ytApiReady, ytVideoId, mode]);

  // Handle Playback for Native Audio Element
  useEffect(() => {
    if (isYouTube) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && isOpened) {
      audio.play().catch((err) => {
        console.warn('Autoplay restricted by browser, waiting for user gesture:', err);
      });
    } else {
      audio.pause();
    }
  }, [isYouTube, isPlaying, isOpened, currentUrl]);

  // Handle Play/Pause synchronization for YouTube
  useEffect(() => {
    if (!isYouTube || !ytPlayerRef.current) return;

    try {
      if (isPlaying && isOpened) {
        ytPlayerRef.current.playVideo?.();
      } else {
        ytPlayerRef.current.pauseVideo?.();
      }
    } catch {
      // Safe fallback
    }
  }, [isYouTube, isPlaying, isOpened]);

  // Auto-start playback when invitation cover is opened
  useEffect(() => {
    if (isOpened) {
      setIsPlaying(true);
    }
  }, [isOpened]);

  // Global touch/click gesture unlock for restricted browsers
  useEffect(() => {
    if (!isOpened) return;

    const unlockAudio = () => {
      if (isYouTube && ytPlayerRef.current?.playVideo) {
        ytPlayerRef.current.playVideo();
      } else if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, [isOpened, isYouTube]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (isYouTube && ytPlayerRef.current?.pauseVideo) {
        ytPlayerRef.current.pauseVideo();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (isYouTube && ytPlayerRef.current?.playVideo) {
        ytPlayerRef.current.playVideo();
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <>
      {/* Off-screen Audio Engine (Native HTML5 Audio & YouTube IFrame API) */}
      <div 
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '200px',
          height: '200px',
          opacity: 0.001,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
        aria-hidden="true"
      >
        {isYouTube ? (
          <div ref={ytContainerRef} id="yt-player-container" style={{ width: '200px', height: '200px' }} />
        ) : (
          <audio 
            ref={audioRef}
            src={currentUrl}
            loop={mode === 'repeat-one'}
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={handleEnded}
            onError={handleTrackError}
          />
        )}
      </div>

      {/* Floating Audio Control Button (tampil anggun setelah cover dibuka) */}
      {isOpened && (
        <button 
          type="button"
          onClick={togglePlay}
          className={cn(
            "fixed md:absolute z-50 p-3 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center",
            "bottom-[calc(85px+env(safe-area-inset-bottom))] right-5 md:right-6"
          )}
          style={{
            backgroundColor: tokens.floatingBtnBg,
            borderColor: tokens.floatingBtnBorder,
            color: isPlaying ? tokens.floatingBtnActiveText : tokens.floatingBtnText,
            boxShadow: isPlaying ? `0 0 0 4px ${tokens.floatingBtnRing}, 0 10px 25px -5px rgba(0,0,0,0.3)` : '0 8px 20px -4px rgba(0,0,0,0.15)',
          }}
          aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
          title={isPlaying ? "Jeda Musik" : "Putar Musik"}
        >
          <div className={cn("transition-transform duration-700 flex items-center justify-center", isPlaying && "animate-spin [animation-duration:4s]")}>
            {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
          </div>
        </button>
      )}
    </>
  );
}
