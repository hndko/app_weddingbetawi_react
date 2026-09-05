import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Volume2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoiceMemoRecorderProps {
  onAudioRecorded: (audioDataUrl: string | null, durationSeconds: number) => void;
  accentColor?: string;
  isDark?: boolean;
}

const MAX_RECORDING_SECONDS = 20;

export function VoiceMemoRecorder({
  onAudioRecorded,
  accentColor = '#D4AF37',
  isDark = false,
}: VoiceMemoRecorderProps) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'recorded'>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Browser Anda tidak mendukung perekaman suara.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      // Determine supported mimeType
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else {
          mimeType = ''; // Default browser choice
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Data = reader.result as string;
          setAudioUrl(base64Data);
          setStatus('recorded');
          onAudioRecorded(base64Data, recordingSeconds);
        };
      };

      recorder.start(250); // Emit slice every 250ms
      setStatus('recording');
      setRecordingSeconds(0);

      // Countdown timer
      const startTime = Date.now();
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        if (elapsed >= MAX_RECORDING_SECONDS) {
          stopRecording();
        } else {
          setRecordingSeconds(elapsed);
        }
      }, 250);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Izin mikrofon ditolak.';
      console.warn('Microphone access issue:', message);
      setErrorMessage('Izin mikrofon diperlukan untuk merekam pesan suara.');
      setStatus('idle');
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePreviewPlay = () => {
    if (!audioUrl) return;

    if (!previewAudioRef.current) {
      const audio = new Audio(audioUrl);
      previewAudioRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.onerror = () => setIsPlayingPreview(false);
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.currentTime = 0;
      previewAudioRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch((e) => {
        console.warn('Audio preview error:', e);
        setIsPlayingPreview(false);
      });
    }
  };

  const handleReset = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    setAudioUrl(null);
    setRecordingSeconds(0);
    setStatus('idle');
    onAudioRecorded(null, 0);
  };

  return (
    <div className="w-full">
      {errorMessage && (
        <div className="mb-2 p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] flex items-center gap-1.5">
          <AlertCircle size={13} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-gray-300 dark:border-white/20 bg-gray-50/50 dark:bg-white/5"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                <Mic size={15} />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold" style={{ color: isDark ? '#FFF' : '#333' }}>
                  Pesan Suara (Audio Guestbook)
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Rekam ucapan suara hingga {MAX_RECORDING_SECONDS} detik (opsional)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={startRecording}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs cursor-pointer flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <Mic size={13} />
              <span>Rekam Suara</span>
            </button>
          </motion.div>
        )}

        {status === 'recording' && (
          <motion.div
            key="recording"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-3 rounded-xl border border-red-400/40 bg-red-500/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>

              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-500">
                <span>0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                <span className="text-gray-400 font-normal">/ 0:{MAX_RECORDING_SECONDS}s</span>
              </div>

              {/* Dynamic Soundwave Indicator */}
              <div className="flex items-center gap-0.5 h-4 ml-2">
                {[40, 70, 90, 60, 100, 50, 80].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: ['25%', `${h}%`, '30%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5 + (i % 3) * 0.2,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-red-500 rounded-full"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={stopRecording}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Square size={12} className="fill-white" />
              <span>Selesai</span>
            </button>
          </motion.div>
        )}

        {status === 'recorded' && (
          <motion.div
            key="recorded"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="p-2.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
                title={isPlayingPreview ? 'Jeda' : 'Putar Pesan Suara'}
              >
                {isPlayingPreview ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>

              <div>
                <div className="flex items-center gap-1.5">
                  <Volume2 size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    Pesan Suara Terlampir
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Durasi: {recordingSeconds} detik • Siap dikirim
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 cursor-pointer transition-colors"
              title="Hapus dan rekam ulang"
            >
              <RotateCcw size={12} />
              <span>Ulang</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
