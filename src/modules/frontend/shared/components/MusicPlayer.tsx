import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { VolumeX, Music, Repeat, Repeat1, Shuffle, ListMusic } from 'lucide-react';
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

const PLAYBACK_MODE_CONFIG = {
  'repeat-all': {
    label: 'Ulangi Semua',
    icon: Repeat,
  },
  'repeat-one': {
    label: 'Ulangi Satu',
    icon: Repeat1,
  },
  'shuffle': {
    label: 'Acak',
    icon: Shuffle,
  },
  'linear': {
    label: 'Sekali Jalan',
    icon: ListMusic,
  },
} as const;

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
  const currentYtVideoIdRef = useRef<string | null>(null);
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

  const rawMode = weddingConfig.music?.mode;
  const mode: 'repeat-all' | 'repeat-one' | 'shuffle' | 'linear' = 
    (rawMode && ['repeat-all', 'repeat-one', 'shuffle', 'linear'].includes(rawMode))
      ? rawMode
      : 'repeat-all';

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

  // Unified playback navigator: safely transitions or rewinds current track
  const playTrackAtIndex = useCallback((index: number) => {
    if (playlist.length === 0) return;
    const safeIdx = Math.max(0, Math.min(index, playlist.length - 1));
    const targetUrl = playlist[safeIdx];
    const targetYtId = getYouTubeVideoId(targetUrl);

    if (safeIdx === currentTrackIndex) {
      // Replay the current track from beginning
      if (targetYtId && ytPlayerRef.current?.seekTo) {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch (err) {
          console.warn('Failed to replay YouTube track:', err);
        }
      } else if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        } catch (err) {
          console.warn('Failed to replay native audio track:', err);
        }
      }
      return;
    }

    setCurrentTrackIndex(safeIdx);

    // If target track is YouTube and player already exists, switch smoothly without DOM teardown
    if (targetYtId && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        currentYtVideoIdRef.current = targetYtId;
        ytPlayerRef.current.loadVideoById({
          videoId: targetYtId,
          startSeconds: 0,
        });
        setIsPlaying(true);
      } catch (err) {
        console.warn('Failed to switch YouTube video via loadVideoById:', err);
      }
    }
  }, [playlist, currentTrackIndex]);

  // Main playback mode logic triggered upon track completion
  const handleEnded = useCallback(() => {
    // Mode 1: Repeat One
    if (mode === 'repeat-one') {
      playTrackAtIndex(currentTrackIndex);
      return;
    }

    // Mode 2: Shuffle
    if (mode === 'shuffle') {
      if (playlist.length <= 1) {
        playTrackAtIndex(currentTrackIndex);
      } else {
        const candidateIndices = playlist
          .map((_, i) => i)
          .filter(i => i !== currentTrackIndex);
        const nextIdx = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
        playTrackAtIndex(nextIdx);
      }
      return;
    }

    // Mode 3: Linear (sequential single pass)
    if (mode === 'linear') {
      if (currentTrackIndex < playlist.length - 1) {
        playTrackAtIndex(currentTrackIndex + 1);
      } else {
        // Stop at the end of the playlist
        setIsPlaying(false);
      }
      return;
    }

    // Mode 4: Repeat All (default)
    if (playlist.length <= 1) {
      playTrackAtIndex(currentTrackIndex);
    } else {
      const nextIdx = (currentTrackIndex + 1) % playlist.length;
      playTrackAtIndex(nextIdx);
    }
  }, [mode, playlist, currentTrackIndex, playTrackAtIndex]);

  // Safe error recovery to avoid silent stops
  const handleTrackError = useCallback(() => {
    console.warn('Playback error for track:', currentUrl);
    if (playlist.length > 1) {
      if (mode === 'shuffle') {
        const candidateIndices = playlist
          .map((_, i) => i)
          .filter(i => i !== currentTrackIndex);
        const nextIdx = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
        playTrackAtIndex(nextIdx);
      } else if (mode === 'linear') {
        if (currentTrackIndex < playlist.length - 1) {
          playTrackAtIndex(currentTrackIndex + 1);
        } else {
          setIsPlaying(false);
        }
      } else {
        const nextIdx = (currentTrackIndex + 1) % playlist.length;
        playTrackAtIndex(nextIdx);
      }
    }
  }, [currentUrl, playlist, mode, currentTrackIndex, playTrackAtIndex]);

  // Refs to prevent stale closure inside YouTube event listeners
  const handleEndedRef = useRef(handleEnded);
  const handleTrackErrorRef = useRef(handleTrackError);

  useEffect(() => {
    handleEndedRef.current = handleEnded;
  }, [handleEnded]);

  useEffect(() => {
    handleTrackErrorRef.current = handleTrackError;
  }, [handleTrackError]);

  // Initialize or update YouTube Player
  useEffect(() => {
    if (!isYouTube || !ytApiReady || !ytVideoId || !ytContainerRef.current) return;

    // If player instance already exists and video changed, use loadVideoById to preserve mobile gesture context
    if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      if (currentYtVideoIdRef.current !== ytVideoId) {
        currentYtVideoIdRef.current = ytVideoId;
        try {
          ytPlayerRef.current.loadVideoById({
            videoId: ytVideoId,
            startSeconds: 0,
          });
          if (isPlaying && isOpened) {
            ytPlayerRef.current.playVideo();
          }
        } catch (err) {
          console.warn('Failed to load video on existing YT.Player:', err);
        }
      }
      return;
    }

    currentYtVideoIdRef.current = ytVideoId;
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
              handleEndedRef.current();
            }
          },
          onError: () => {
            handleTrackErrorRef.current();
          }
        }
      });
    } catch (err) {
      console.warn('Failed to initialize YT.Player:', err);
    }

    return () => {
      // Only destroy if transitioning away from YouTube
      if (!isYouTube && ytPlayerRef.current?.destroy) {
        try {
          ytPlayerRef.current.destroy();
          ytPlayerRef.current = null;
          currentYtVideoIdRef.current = null;
        } catch {
          // Safe fallback
        }
      }
    };
  }, [isYouTube, ytApiReady, ytVideoId, mode, isOpened, isPlaying]);

  // Handle Playback for Native Audio Element
  useEffect(() => {
    if (isYouTube) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && isOpened) {
      audio.load();
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
        try {
          ytPlayerRef.current.pauseVideo();
        } catch {
          // Safe fallback
        }
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // If linear mode reached the end of playlist, reset to first track
      if (mode === 'linear' && currentTrackIndex >= playlist.length - 1) {
        playTrackAtIndex(0);
      }
      setIsPlaying(true);
      if (isYouTube && ytPlayerRef.current?.playVideo) {
        try {
          ytPlayerRef.current.playVideo();
        } catch {
          // Safe fallback
        }
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const currentModeConfig = PLAYBACK_MODE_CONFIG[mode] || PLAYBACK_MODE_CONFIG['repeat-all'];
  const ModeIcon = currentModeConfig.icon;
  const buttonTitle = `${isPlaying ? 'Jeda Musik' : 'Putar Musik'} • Mode: ${currentModeConfig.label}${playlist.length > 1 ? ` (${currentTrackIndex + 1}/${playlist.length})` : ''}`;

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
            "fixed md:absolute z-50 p-3 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group",
            "bottom-[calc(85px+env(safe-area-inset-bottom))] right-5 md:right-6"
          )}
          style={{
            backgroundColor: tokens.floatingBtnBg,
            borderColor: tokens.floatingBtnBorder,
            color: isPlaying ? tokens.floatingBtnActiveText : tokens.floatingBtnText,
            boxShadow: isPlaying ? `0 0 0 4px ${tokens.floatingBtnRing}, 0 10px 25px -5px rgba(0,0,0,0.3)` : '0 8px 20px -4px rgba(0,0,0,0.15)',
          }}
          aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
          title={buttonTitle}
        >
          <div className={cn("transition-transform duration-700 flex items-center justify-center", isPlaying && "animate-spin [animation-duration:4s]")}>
            {isPlaying ? <Music size={18} /> : <VolumeX size={18} />}
          </div>

          {/* Mini Playback Mode Indicator Badge */}
          <div 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] shadow-sm border border-white/40 transition-transform group-hover:scale-110"
            style={{
              backgroundColor: tokens.primary,
              color: '#ffffff',
            }}
            title={`Mode: ${currentModeConfig.label}`}
            aria-hidden="true"
          >
            <ModeIcon size={10} strokeWidth={2.5} />
          </div>
        </button>
      )}
    </>
  );
}
