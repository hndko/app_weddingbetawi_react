import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  ListMusic, 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  X, 
  SlidersHorizontal, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
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

type PlaybackMode = keyof typeof PLAYBACK_MODE_CONFIG;

interface MusicPlayerProps {
  isOpened: boolean;
}

interface NormalizedTrack {
  url: string;
  title: string;
  artist?: string;
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTracklist, setShowTracklist] = useState(false);

  // Override mode putar lokal (bisa diganti langsung oleh tamu di player)
  const [activeModeOverride, setActiveModeOverride] = useState<PlaybackMode | null>(null);

  // State Volume, Mute, dan Auto-Ducking
  const defaultVolumeConfig = weddingConfig.music?.defaultVolume ?? 75;
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wedding_music_volume');
      if (saved !== null && !isNaN(Number(saved))) {
        return Math.max(0, Math.min(100, Number(saved)));
      }
    }
    return defaultVolumeConfig;
  });
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDucked, setIsDucked] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const currentYtVideoIdRef = useRef<string | null>(null);
  const [ytApiReady, setYtApiReady] = useState(false);

  // Normalize playlist URLs & titles
  const playlist: NormalizedTrack[] = useMemo(() => {
    let rawItems: { url: string; title?: string; artist?: string }[] = [];

    if (weddingConfig.music?.playlist?.length) {
      rawItems = weddingConfig.music.playlist.filter(t => Boolean(t.url?.trim()));
    } else if (weddingConfig.musicUrl?.trim()) {
      rawItems = [{ url: weddingConfig.musicUrl.trim(), title: 'Lagu Utama' }];
    }

    if (rawItems.length === 0) {
      rawItems = [{ url: DEFAULT_MUSIC_URL, title: 'Kidung Asmaradana (Instrumental)' }];
    }

    return rawItems.map((item, idx) => {
      let cleanUrl = item.url.trim();
      // Auto-convert Google Drive /view links to direct stream links
      if (cleanUrl.includes('drive.google.com/file/d/')) {
        const match = cleanUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          cleanUrl = `https://docs.google.com/uc?export=download&id=${match[1]}`;
        }
      }
      // Auto-convert Dropbox links for direct streaming
      if (cleanUrl.includes('dropbox.com')) {
        cleanUrl = cleanUrl.replace('dl=0', 'raw=1');
      }

      return {
        url: cleanUrl,
        title: item.title?.trim() || `Lagu #${idx + 1}`,
        artist: item.artist?.trim(),
      };
    });
  }, [weddingConfig.music, weddingConfig.musicUrl]);

  const rawMode = weddingConfig.music?.mode;
  const mode: PlaybackMode = activeModeOverride || (
    (rawMode && ['repeat-all', 'repeat-one', 'shuffle', 'linear'].includes(rawMode))
      ? (rawMode as PlaybackMode)
      : 'repeat-all'
  );

  const currentTrack = playlist[currentTrackIndex] || playlist[0];
  const currentUrl = currentTrack?.url || DEFAULT_MUSIC_URL;
  const ytVideoId = useMemo(() => getYouTubeVideoId(currentUrl), [currentUrl]);
  const isYouTube = Boolean(ytVideoId);

  // Volume efektif setelah memperhitungkan mute dan auto-ducking
  const effectiveVolume = useMemo(() => {
    if (isMuted) return 0;
    if (isDucked) {
      return Math.min(15, Math.max(5, Math.round(volume * 0.2)));
    }
    return volume;
  }, [volume, isMuted, isDucked]);

  // Listener untuk Smart Audio Auto-Ducking saat Voice Memo diputar
  useEffect(() => {
    const handleVoiceMemoEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ isPlaying?: boolean }>;
      setIsDucked(Boolean(customEvent.detail?.isPlaying));
    };

    window.addEventListener('wedding:voice-memo-play', handleVoiceMemoEvent);
    return () => {
      window.removeEventListener('wedding:voice-memo-play', handleVoiceMemoEvent);
    };
  }, []);

  // Terapkan perubahan volume ke elemen audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = effectiveVolume / 100;
      audioRef.current.muted = isMuted;
    }

    if (ytPlayerRef.current) {
      try {
        if (typeof ytPlayerRef.current.setVolume === 'function') {
          ytPlayerRef.current.setVolume(effectiveVolume);
        }
        if (isMuted && typeof ytPlayerRef.current.mute === 'function') {
          ytPlayerRef.current.mute();
        } else if (!isMuted && typeof ytPlayerRef.current.unMute === 'function') {
          ytPlayerRef.current.unMute();
        }
      } catch {
        // Safe fallback
      }
    }
  }, [effectiveVolume, isMuted]);

  // Handler ubah volume interaktif dari slider
  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(100, newVol));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('wedding_music_volume', clamped.toString());
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

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
    const targetUrl = playlist[safeIdx]?.url;
    const targetYtId = getYouTubeVideoId(targetUrl);

    if (safeIdx === currentTrackIndex) {
      if (targetYtId && ytPlayerRef.current?.seekTo) {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch {
          // Safe fallback
        }
      } else if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        } catch {
          // Safe fallback
        }
      }
      return;
    }

    setCurrentTrackIndex(safeIdx);

    if (targetYtId && ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
      try {
        currentYtVideoIdRef.current = targetYtId;
        ytPlayerRef.current.loadVideoById({
          videoId: targetYtId,
          startSeconds: 0,
        });
        setIsPlaying(true);
      } catch {
        // Safe fallback
      }
    }
  }, [playlist, currentTrackIndex]);

  // Tombol Lagu Selanjutnya
  const handleNextTrack = useCallback(() => {
    if (playlist.length <= 1) {
      playTrackAtIndex(0);
      return;
    }
    if (mode === 'shuffle') {
      const candidateIndices = playlist
        .map((_, i) => i)
        .filter(i => i !== currentTrackIndex);
      const nextIdx = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
      playTrackAtIndex(nextIdx);
    } else {
      const nextIdx = (currentTrackIndex + 1) % playlist.length;
      playTrackAtIndex(nextIdx);
    }
  }, [playlist, mode, currentTrackIndex, playTrackAtIndex]);

  // Tombol Lagu Sebelumnya
  const handlePrevTrack = useCallback(() => {
    if (playlist.length <= 1) {
      playTrackAtIndex(0);
      return;
    }
    const prevIdx = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    playTrackAtIndex(prevIdx);
  }, [playlist, currentTrackIndex, playTrackAtIndex]);

  // Siklus pergantian mode putar
  const cyclePlaybackMode = () => {
    const modes: PlaybackMode[] = ['repeat-all', 'repeat-one', 'shuffle', 'linear'];
    const currentIdx = modes.indexOf(mode);
    const nextMode = modes[(currentIdx + 1) % modes.length];
    setActiveModeOverride(nextMode);
  };

  // Main playback mode logic triggered upon track completion
  const handleEnded = useCallback(() => {
    if (mode === 'repeat-one') {
      playTrackAtIndex(currentTrackIndex);
      return;
    }

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

    if (mode === 'linear') {
      if (currentTrackIndex < playlist.length - 1) {
        playTrackAtIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
      return;
    }

    if (playlist.length <= 1) {
      playTrackAtIndex(currentTrackIndex);
    } else {
      const nextIdx = (currentTrackIndex + 1) % playlist.length;
      playTrackAtIndex(nextIdx);
    }
  }, [mode, playlist, currentTrackIndex, playTrackAtIndex]);

  // Safe error recovery to avoid silent stops
  const handleTrackError = useCallback(() => {
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
  }, [playlist, mode, currentTrackIndex, playTrackAtIndex]);

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
        } catch {
          // Safe fallback
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
          rel: 0,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(effectiveVolume);
            if (isMuted) event.target.mute();
            if (isOpened && isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
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
          },
        },
      });
    } catch {
      // Safe fallback
    }

    return () => {
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
      audio.play().catch(() => {});
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

      {/* Expanded Audio Studio Popover Card */}
      <AnimatePresence>
        {isOpened && isExpanded && (
          <>
            {/* Backdrop click outside to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1.5px] cursor-pointer"
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed md:absolute z-50 w-[290px] sm:w-[310px] rounded-2xl shadow-2xl border backdrop-blur-xl p-4 flex flex-col gap-3 right-4 md:right-6 bottom-[calc(145px+env(safe-area-inset-bottom))]"
              style={{
                backgroundColor: tokens.cardBg,
                borderColor: tokens.cardBorder,
                color: tokens.textPrimary,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shadow-xs"
                    style={{ backgroundColor: tokens.primary, color: tokens.btnPrimaryText }}
                  >
                    <Music size={13} />
                  </div>
                  <span className="text-xs font-semibold tracking-wide" style={{ color: tokens.textPrimary }}>
                    Pemutar Musik
                  </span>
                  {isDucked && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                      Auto-Ducking
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors cursor-pointer"
                  aria-label="Tutup panel audio"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Active Track Info */}
              <div className="flex items-center gap-3">
                {/* Mini spinning vinyl disc */}
                <div 
                  className={cn(
                    "w-11 h-11 rounded-full shrink-0 flex items-center justify-center border-2 shadow-inner transition-transform duration-700",
                    isPlaying && "animate-spin [animation-duration:5s]"
                  )}
                  style={{
                    backgroundColor: tokens.bg,
                    borderColor: tokens.accent,
                  }}
                >
                  <div 
                    className="w-3.5 h-3.5 rounded-full border border-white/50"
                    style={{ backgroundColor: tokens.primary }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold truncate" style={{ color: tokens.textPrimary }}>
                    {currentTrack?.title || `Lagu #${currentTrackIndex + 1}`}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]" style={{ color: tokens.textMuted }}>
                      {playlist.length > 1 ? `Lagu ${currentTrackIndex + 1} dari ${playlist.length}` : 'Lagu Utama'}
                    </span>
                    {/* Dancing Equaliser Bar */}
                    <div className="flex items-center gap-0.5 h-2.5">
                      {[30, 80, 50, 100].map((h, i) => (
                        <motion.span
                          key={i}
                          animate={isPlaying ? { height: ['20%', `${h}%`, '30%'] } : { height: '30%' }}
                          transition={{
                            repeat: isPlaying ? Infinity : 0,
                            duration: 0.35 + i * 0.1,
                            ease: 'easeInOut',
                          }}
                          className="w-0.5 rounded-full"
                          style={{
                            backgroundColor: tokens.accent,
                            height: isPlaying ? `${h}%` : '30%',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Playback Controls (Prev, Play/Pause, Next, Mode) */}
              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  type="button"
                  onClick={cyclePlaybackMode}
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-stone-500 transition-all cursor-pointer flex items-center gap-1"
                  title={`Mode: ${currentModeConfig.label} (Klik untuk ganti)`}
                >
                  <ModeIcon size={14} style={{ color: tokens.accent }} />
                  <span className="text-[10px] font-medium hidden sm:inline" style={{ color: tokens.textMuted }}>
                    {currentModeConfig.label}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevTrack}
                    disabled={playlist.length <= 1}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    title="Lagu Sebelumnya"
                    aria-label="Lagu Sebelumnya"
                  >
                    <SkipBack size={15} style={{ color: tokens.textPrimary }} />
                  </button>

                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                    style={{
                      backgroundColor: tokens.primary,
                      color: tokens.btnPrimaryText,
                    }}
                    title={isPlaying ? "Jeda Musik" : "Putar Musik"}
                    aria-label={isPlaying ? "Jeda Musik" : "Putar Musik"}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleNextTrack}
                    disabled={playlist.length <= 1}
                    className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                    title="Lagu Selanjutnya"
                    aria-label="Lagu Selanjutnya"
                  >
                    <SkipForward size={15} style={{ color: tokens.textPrimary }} />
                  </button>
                </div>
              </div>

              {/* Volume Slider & Mute Toggle */}
              <div className="pt-2 border-t border-black/5 dark:border-white/10 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-medium" style={{ color: tokens.textMuted }}>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      title={isMuted ? "Bunyikan Musik" : "Bisukan Musik"}
                    >
                      {isMuted || volume === 0 ? <VolumeX size={14} className="text-red-500" /> : <Volume2 size={14} style={{ color: tokens.accent }} />}
                    </button>
                    <span>Volume</span>
                  </div>
                  <span className="font-mono text-[10px] font-semibold" style={{ color: tokens.textPrimary }}>
                    {isMuted ? 'Mute' : (isDucked ? `${effectiveVolume}% (Ducked)` : `${volume}%`)}
                  </span>
                </div>

                <div className="relative flex items-center">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-stone-200 dark:bg-stone-700"
                    style={{ accentColor: tokens.primary }}
                  />
                </div>
              </div>

              {/* Playlist Drawer Toggle (if > 1 track) */}
              {playlist.length > 1 && (
                <div className="pt-2 border-t border-black/5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowTracklist(prev => !prev)}
                    className="w-full flex items-center justify-between text-[11px] font-medium py-1 px-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                    style={{ color: tokens.textMuted }}
                  >
                    <div className="flex items-center gap-1.5">
                      <ListMusic size={13} style={{ color: tokens.accent }} />
                      <span>Daftar Putar ({playlist.length} Lagu)</span>
                    </div>
                    {showTracklist ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
                  </button>

                  {showTracklist && (
                    <div className="mt-2 max-h-28 overflow-y-auto flex flex-col gap-1 pr-1 no-scrollbar">
                      {playlist.map((track, idx) => {
                        const isActive = idx === currentTrackIndex;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => playTrackAtIndex(idx)}
                            className={cn(
                              "w-full text-left px-2 py-1.5 rounded-lg text-[11px] flex items-center justify-between transition-colors cursor-pointer",
                              isActive 
                                ? "bg-black/5 dark:bg-white/10 font-semibold" 
                                : "hover:bg-black/5 dark:hover:bg-white/5 text-stone-600 dark:text-stone-300"
                            )}
                            style={{
                              color: isActive ? tokens.primary : undefined,
                            }}
                          >
                            <span className="truncate flex-1 pr-2">
                              {idx + 1}. {track.title || `Lagu #${idx + 1}`}
                            </span>
                            {isActive && isPlaying && (
                              <span className="w-1.5 h-1.5 rounded-full animate-ping shrink-0" style={{ backgroundColor: tokens.accent }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Audio Control Button Group (tampil anggun setelah cover dibuka) */}
      {isOpened && (
        <div 
          className={cn(
            "fixed md:absolute z-50 flex items-center gap-1.5",
            "bottom-[calc(85px+env(safe-area-inset-bottom))] right-5 md:right-6"
          )}
        >
          {/* Quick Studio / Expand Controls Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(prev => !prev)}
            className={cn(
              "p-2.5 rounded-full shadow-md border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center",
              isExpanded ? "scale-105" : ""
            )}
            style={{
              backgroundColor: tokens.floatingBtnBg,
              borderColor: tokens.floatingBtnBorder,
              color: isExpanded ? tokens.accent : tokens.floatingBtnText,
            }}
            aria-label="Buka studio kontrol audio"
            title="Buka Studio Kontrol Audio & Playlist"
          >
            <SlidersHorizontal size={14} />
          </button>

          {/* Primary Play/Pause Floating Button */}
          <button 
            type="button"
            onClick={togglePlay}
            className={cn(
              "p-3 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center group relative",
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
        </div>
      )}
    </>
  );
}
