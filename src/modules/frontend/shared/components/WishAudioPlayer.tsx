import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

interface WishAudioPlayerProps {
  audioUrl: string;
  durationSeconds?: number;
  accentColor?: string;
  isDark?: boolean;
}

export function WishAudioPlayer({
  audioUrl,
  durationSeconds = 0,
  accentColor = '#D4AF37',
  isDark = false,
}: WishAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(durationSeconds);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(Math.round(audio.duration));
      }
    };

    audio.ontimeupdate = () => {
      setCurrentTime(Math.floor(audio.currentTime));
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.onerror = () => {
      setIsPlaying(false);
    };

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="mt-2.5 p-2 rounded-xl flex items-center gap-2.5 transition-colors border"
      style={{
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
      }}
    >
      <button
        type="button"
        onClick={togglePlay}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs cursor-pointer active:scale-95 transition-all"
        style={{ backgroundColor: accentColor }}
        title={isPlaying ? 'Jeda Suara' : 'Putar Pesan Suara'}
      >
        {isPlaying ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <div className="flex items-center gap-1 font-medium" style={{ color: accentColor }}>
            <Volume2 size={11} />
            <span>Pesan Suara</span>
          </div>
          <span className="font-mono text-gray-500 dark:text-gray-400">
            0:{currentTime < 10 ? `0${currentTime}` : currentTime} / 0:{duration < 10 ? `0${duration}` : duration}
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercent))}%`,
              backgroundColor: accentColor,
            }}
          />
        </div>
      </div>

      {/* Animated Soundwave pill */}
      <div className="flex items-center gap-0.5 h-3 shrink-0 px-1">
        {[40, 90, 60, 100, 50].map((h, i) => (
          <motion.span
            key={i}
            animate={
              isPlaying
                ? { height: ['20%', `${h}%`, '30%'] }
                : { height: '30%' }
            }
            transition={{
              repeat: isPlaying ? Infinity : 0,
              duration: 0.4 + (i % 3) * 0.15,
              ease: 'easeInOut',
            }}
            className="w-0.5 rounded-full"
            style={{
              backgroundColor: accentColor,
              height: isPlaying ? `${h}%` : '30%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
