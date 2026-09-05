import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Sparkles, 
  Download, 
  RotateCcw, 
  X, 
  RefreshCw, 
  Image as ImageIcon, 
  ChevronRight, 
  Layers, 
  Palette,
  CheckCircle2,
  Sliders,
  Maximize2
} from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { 
  generatePhotostrip, 
  downloadPhotostrip, 
  PhotostripLayout, 
  FrameTemplate, 
  PhotoFilter 
} from '../utils/photostripCanvas';
import { 
  playCountdownBeep, 
  playShutterSound, 
  playStripReadyChime 
} from '../utils/photoboothAudio';
import { cn } from '../../../../utils/cn';

interface PhotoBoothModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 'setup' | 'capture' | 'preview';
type CaptureSource = 'camera' | 'upload';

export function PhotoBoothModal({ isOpen, onClose }: PhotoBoothModalProps) {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();

  // Wizard States
  const [step, setStep] = useState<WizardStep>('setup');
  const [source, setSource] = useState<CaptureSource>('camera');
  const [layout, setLayout] = useState<PhotostripLayout>('strip_3pose');
  const [template, setTemplate] = useState<FrameTemplate>('theme');
  const [filter, setFilter] = useState<PhotoFilter>('natural');

  // Captured Photos (Base64 data URLs)
  const [photos, setPhotos] = useState<string[]>([]);
  const [activePoseIndex, setActivePoseIndex] = useState<number>(0);

  // Camera States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);

  // Rendered Output State
  const [renderedStripUrl, setRenderedStripUrl] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const totalPoses = layout === 'strip_3pose' ? 3 : 1;

  // Guest Name from URL parameter
  const guestName = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('to') || undefined 
    : undefined;

  const weddingDateText = weddingConfig.events?.[0]?.date 
    ? new Date(weddingConfig.events[0].date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '17 Agustus 2026';

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Clean up camera stream
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
  }, []);

  // Initialize camera stream
  const startCameraStream = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);
    setIsCameraReady(false);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera langsung.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kamera tidak dapat diakses.';
      setCameraError(errorMessage);
    }
  }, [facingMode, stopCameraStream]);

  // Start camera when entering capture step with camera source
  useEffect(() => {
    if (isOpen && step === 'capture' && source === 'camera') {
      startCameraStream();
    } else {
      stopCameraStream();
    }
  }, [isOpen, step, source, facingMode, startCameraStream, stopCameraStream]);

  // Handle Close Modal
  const handleClose = () => {
    stopCameraStream();
    onClose();
  };

  // Flip Camera Front / Back
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Capture video frame into Base64 image
  const grabVideoFrame = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Mirror image if front facing camera for intuitive selfie feel
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  // Trigger shutter capture with countdown
  const startCountdownAndCapture = () => {
    if (countdown !== null) return; // already counting down

    let count = 3;
    setCountdown(count);
    playCountdownBeep(1);

    const interval = window.setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        playCountdownBeep(1 + (3 - count) * 0.35);
      } else {
        window.clearInterval(interval);
        setCountdown(null);

        // Shutter flash effect
        setIsFlashActive(true);
        playShutterSound();
        setTimeout(() => setIsFlashActive(false), 220);

        // Grab photo
        const frameData = grabVideoFrame();
        if (frameData) {
          setPhotos((prev) => {
            const next = [...prev];
            next[activePoseIndex] = frameData;
            return next;
          });

          // Check if more poses needed
          const nextIndex = activePoseIndex + 1;
          if (nextIndex < totalPoses) {
            setActivePoseIndex(nextIndex);
          } else {
            // All poses captured -> advance to preview
            setTimeout(() => {
              stopCameraStream();
              setStep('preview');
              playStripReadyChime();
            }, 500);
          }
        }
      }
    }, 1000);
  };

  // File Upload Handler (for gallery photo pick)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotos((prev) => {
          const next = [...prev];
          next[targetIndex] = dataUrl;
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-generate Canvas Photostrip whenever dependencies change in 'preview' step
  useEffect(() => {
    if (step === 'preview' && photos.length > 0) {
      let isMounted = true;
      setIsRendering(true);

      generatePhotostrip(photos, {
        layout,
        template,
        filter,
        groomName: weddingConfig.groom.nickname,
        brideName: weddingConfig.bride.nickname,
        weddingDateText,
        guestName,
        themeColors: {
          bg: tokens.bg,
          textPrimary: tokens.textPrimary,
          accent: tokens.accent,
          cardBorder: tokens.cardBorder,
          isDark
        }
      })
        .then((url) => {
          if (isMounted) {
            setRenderedStripUrl(url);
            setIsRendering(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setIsRendering(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [step, photos, layout, template, filter, weddingConfig, weddingDateText, guestName, tokens, isDark]);

  // Handle Download
  const handleDownload = () => {
    if (!renderedStripUrl) return;
    const cleanGroom = weddingConfig.groom.nickname.replace(/[^a-zA-Z0-9]/g, '');
    const cleanBride = weddingConfig.bride.nickname.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `Photostrip-${cleanGroom}&${cleanBride}-${Date.now()}.png`;
    downloadPhotostrip(renderedStripUrl, filename);
  };

  // Reset and restart
  const handleReset = () => {
    setPhotos([]);
    setActivePoseIndex(0);
    setRenderedStripUrl(null);
    setStep('setup');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-0 md:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Digital Photo Booth"
    >
      <div 
        className={cn(
          "relative w-full md:max-w-[440px] h-full md:h-[92vh] md:max-h-[820px] md:rounded-[32px] overflow-hidden flex flex-col shadow-2xl transition-colors duration-300",
          isDark ? "bg-[#141416] text-white border border-white/10" : "bg-white text-stone-800 md:border md:border-stone-200"
        )}
      >
        {/* Shutter Flash Screen Overlay */}
        <AnimatePresence>
          {isFlashActive && (
            <motion.div 
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-0 bg-white z-[100] pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: `${tokens.accent}25`, color: tokens.accent }}
            >
              <Camera size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-none">Virtual Photo Booth</h2>
              <p className="text-[11px] opacity-60 mt-0.5">
                {step === 'setup' && 'Pilih Layout & Format'}
                {step === 'capture' && `Studio Foto (${activePoseIndex + 1}/${totalPoses})`}
                {step === 'preview' && 'Kustomisasi & Simpan'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all text-current opacity-70 hover:opacity-100 cursor-pointer"
            aria-label="Tutup Photo Booth"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col">
          {/* STEP 1: SETUP */}
          {step === 'setup' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Banner Info */}
              <div 
                className="p-3.5 rounded-2xl border text-xs leading-relaxed relative overflow-hidden"
                style={{
                  backgroundColor: `${tokens.primary}15`,
                  borderColor: `${tokens.primary}30`
                }}
              >
                <div className="flex items-start gap-2.5">
                  <Sparkles size={16} className="shrink-0 mt-0.5" style={{ color: tokens.accent }} />
                  <div>
                    <span className="font-semibold block mb-0.5">Abadikan Momen Bahagiamu!</span>
                    Foto selfie langsung atau unggah foto terbaikmu untuk dicetak ke photostrip kenang-kenangan bertema pernikahan ini.
                  </div>
                </div>
              </div>

              {/* 1. Format Layout */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2 flex items-center gap-1.5">
                  <Layers size={13} /> 1. Format Photostrip
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLayout('strip_3pose')}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center text-center",
                      layout === 'strip_3pose' 
                        ? "ring-2 shadow-md" 
                        : "opacity-75 hover:opacity-100 border-white/10 bg-white/[0.03]"
                    )}
                    style={{
                      borderColor: layout === 'strip_3pose' ? tokens.primary : undefined,
                      boxShadow: layout === 'strip_3pose' ? `0 0 0 2px ${tokens.primary}` : undefined,
                      backgroundColor: layout === 'strip_3pose' ? `${tokens.primary}15` : undefined
                    }}
                  >
                    <div className="w-10 h-14 rounded-md border-2 border-dashed border-current flex flex-col justify-between p-1 mb-2 opacity-80">
                      <div className="w-full h-2.5 bg-current rounded-xs opacity-60" />
                      <div className="w-full h-2.5 bg-current rounded-xs opacity-60" />
                      <div className="w-full h-2.5 bg-current rounded-xs opacity-60" />
                    </div>
                    <span className="text-xs font-bold">3-Pose Strip</span>
                    <span className="text-[10px] opacity-60 mt-0.5">Korean Self Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLayout('single_polaroid')}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center text-center",
                      layout === 'single_polaroid' 
                        ? "ring-2 shadow-md" 
                        : "opacity-75 hover:opacity-100 border-white/10 bg-white/[0.03]"
                    )}
                    style={{
                      borderColor: layout === 'single_polaroid' ? tokens.primary : undefined,
                      boxShadow: layout === 'single_polaroid' ? `0 0 0 2px ${tokens.primary}` : undefined,
                      backgroundColor: layout === 'single_polaroid' ? `${tokens.primary}15` : undefined
                    }}
                  >
                    <div className="w-11 h-14 rounded-md border-2 border-dashed border-current flex flex-col justify-start p-1.5 mb-2 opacity-80">
                      <div className="w-full h-7 bg-current rounded-xs opacity-60 mb-1" />
                      <div className="w-2/3 h-1.5 bg-current rounded-xs opacity-40" />
                    </div>
                    <span className="text-xs font-bold">Single Polaroid</span>
                    <span className="text-[10px] opacity-60 mt-0.5">Classic Square Frame</span>
                  </button>
                </div>
              </div>

              {/* 2. Frame Template */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2 flex items-center gap-1.5">
                  <Palette size={13} /> 2. Desain Bingkai
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'theme', label: 'Theme Matched', sub: 'Nuansa Tema Aktif', color: tokens.bg },
                    { id: 'black_studio', label: 'Black Studio', sub: 'Hitam & Emas', color: '#121214' },
                    { id: 'white_studio', label: 'White Studio', sub: 'Minimalis Bersih', color: '#FFFFFF' },
                    { id: 'romantic_pastel', label: 'Romantic Pastel', sub: 'Soft Blush Pink', color: '#FDF2F4' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id as FrameTemplate)}
                      className={cn(
                        "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2",
                        template === tpl.id 
                          ? "ring-2 shadow-sm font-semibold" 
                          : "opacity-75 hover:opacity-100 border-white/10 bg-white/[0.03]"
                      )}
                      style={{
                        borderColor: template === tpl.id ? tokens.accent : undefined,
                        boxShadow: template === tpl.id ? `0 0 0 2px ${tokens.accent}` : undefined,
                      }}
                    >
                      <div 
                        className="w-5 h-5 rounded-full border border-black/20 shrink-0" 
                        style={{ backgroundColor: tpl.color }}
                      />
                      <div className="truncate">
                        <div className="text-[11px] leading-tight truncate">{tpl.label}</div>
                        <div className="text-[9px] opacity-60 truncate">{tpl.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Source Method */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-2 flex items-center gap-1.5">
                  <Camera size={13} /> 3. Metode Pengambilan
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSource('camera')}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5",
                      source === 'camera'
                        ? "ring-2 shadow-sm font-semibold"
                        : "opacity-75 hover:opacity-100 border-white/10 bg-white/[0.03]"
                    )}
                    style={{
                      borderColor: source === 'camera' ? tokens.primary : undefined,
                      boxShadow: source === 'camera' ? `0 0 0 2px ${tokens.primary}` : undefined,
                      backgroundColor: source === 'camera' ? `${tokens.primary}15` : undefined
                    }}
                  >
                    <Camera size={16} style={{ color: tokens.accent }} />
                    <div>
                      <div className="text-xs">Kamera Selfie</div>
                      <div className="text-[10px] opacity-60">Timer 3 detik</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSource('upload')}
                    className={cn(
                      "p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5",
                      source === 'upload'
                        ? "ring-2 shadow-sm font-semibold"
                        : "opacity-75 hover:opacity-100 border-white/10 bg-white/[0.03]"
                    )}
                    style={{
                      borderColor: source === 'upload' ? tokens.primary : undefined,
                      boxShadow: source === 'upload' ? `0 0 0 2px ${tokens.primary}` : undefined,
                      backgroundColor: source === 'upload' ? `${tokens.primary}15` : undefined
                    }}
                  >
                    <ImageIcon size={16} style={{ color: tokens.primary }} />
                    <div>
                      <div className="text-xs">Unggah Galeri</div>
                      <div className="text-[10px] opacity-60">Pilih dari HP</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* CTA Next */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPhotos(new Array(totalPoses).fill(''));
                    setActivePoseIndex(0);
                    setStep('capture');
                  }}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 hover:opacity-95"
                  style={{
                    backgroundColor: tokens.primary,
                    color: tokens.btnPrimaryText
                  }}
                >
                  <Camera size={15} /> Mulai Pengambilan Foto ({totalPoses} Pose) <ChevronRight size={15} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CAPTURE / UPLOAD */}
          {step === 'capture' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full space-y-3"
            >
              {/* Pose Indicator Bar */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold flex items-center gap-1.5">
                  Pose {activePoseIndex + 1} dari {totalPoses}
                </span>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPoses }).map((_, idx) => (
                    <div 
                      key={idx}
                      className={cn(
                        "w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center transition-all",
                        idx === activePoseIndex 
                          ? "ring-2 scale-110" 
                          : photos[idx] 
                            ? "opacity-90" 
                            : "opacity-40 border border-current"
                      )}
                      style={{
                        backgroundColor: photos[idx] || idx === activePoseIndex ? tokens.accent : 'transparent',
                        color: photos[idx] || idx === activePoseIndex ? '#FFFFFF' : 'inherit',
                        boxShadow: idx === activePoseIndex ? `0 0 0 2px ${tokens.accent}` : undefined
                      }}
                    >
                      {photos[idx] ? '✓' : idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* CAMERA MODE */}
              {source === 'camera' && (
                <div className="flex-1 flex flex-col justify-between">
                  {cameraError ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-red-500/20 bg-red-500/10 rounded-2xl">
                      <Camera size={32} className="text-red-400 mb-2" />
                      <p className="text-xs font-semibold text-red-400 mb-1">Akses Kamera Terkendala</p>
                      <p className="text-[11px] opacity-75 mb-4 max-w-xs">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => setSource('upload')}
                        className="py-2 px-4 rounded-xl text-xs font-bold bg-white text-stone-900 shadow-md cursor-pointer"
                      >
                        Ganti ke Unggah Galeri Saja
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full aspect-[4/3] md:aspect-square bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-white/10">
                      {/* Video element */}
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={cn(
                          "w-full h-full object-cover transition-transform duration-300",
                          facingMode === 'user' ? "-scale-x-100" : ""
                        )}
                      />

                      {/* Loading spinner before camera stream is ready */}
                      {!isCameraReady && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs text-white">
                          <RefreshCw size={24} className="animate-spin text-white/70 mb-2" />
                          <span className="text-xs font-medium">Menghubungkan Kamera...</span>
                        </div>
                      )}

                      {/* Countdown Overlay */}
                      <AnimatePresence>
                        {countdown !== null && (
                          <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 1.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/40 z-30 pointer-events-none"
                          >
                            <span 
                              className="text-7xl font-extrabold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-heading"
                              style={{ color: tokens.accent }}
                            >
                              {countdown}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Switch Camera Button Overlay */}
                      <button
                        type="button"
                        onClick={toggleFacingMode}
                        disabled={!isCameraReady || countdown !== null}
                        className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 active:scale-95 transition-all z-20 cursor-pointer backdrop-blur-xs disabled:opacity-40"
                        aria-label="Balik Kamera Depan / Belakang"
                        title="Balik Kamera"
                      >
                        <RefreshCw size={16} />
                      </button>

                      {/* Camera Viewfinder Crosshairs */}
                      <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none" />
                    </div>
                  )}

                  {/* Thumbnail Row of Captured Poses */}
                  <div className="flex gap-2 my-2 overflow-x-auto py-1">
                    {Array.from({ length: totalPoses }).map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActivePoseIndex(idx)}
                        className={cn(
                          "w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer relative shrink-0 transition-all bg-black/20 flex items-center justify-center",
                          idx === activePoseIndex ? "ring-2 shadow-md" : "opacity-60 hover:opacity-100"
                        )}
                        style={{
                          borderColor: idx === activePoseIndex ? tokens.accent : 'transparent',
                          boxShadow: idx === activePoseIndex ? `0 0 0 2px ${tokens.accent}` : undefined
                        }}
                      >
                        {photos[idx] ? (
                          <img src={photos[idx]} alt={`Pose ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-semibold opacity-50">Pose {idx + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Shutter Action Bar */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('setup')}
                      className="py-2.5 px-4 rounded-xl border border-white/20 text-xs font-medium cursor-pointer active:scale-95"
                    >
                      Kembali
                    </button>

                    <button
                      type="button"
                      onClick={startCountdownAndCapture}
                      disabled={!isCameraReady || countdown !== null}
                      className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                      style={{
                        backgroundColor: tokens.primary,
                        color: tokens.btnPrimaryText
                      }}
                    >
                      <Camera size={16} />
                      {countdown !== null ? `Mengambil Foto...` : `Ambil Foto Pose ${activePoseIndex + 1}`}
                    </button>
                  </div>
                </div>
              )}

              {/* UPLOAD MODE */}
              {source === 'upload' && (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Array.from({ length: totalPoses }).map((_, idx) => (
                      <div 
                        key={idx}
                        className={cn(
                          "p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center relative transition-all min-h-[140px]",
                          photos[idx] ? "border-solid border-emerald-500/50 bg-emerald-500/5" : "border-white/20 hover:border-white/40"
                        )}
                      >
                        {photos[idx] ? (
                          <div className="relative w-full h-full flex flex-col items-center">
                            <img 
                              src={photos[idx]} 
                              alt={`Pose ${idx + 1}`} 
                              className="w-24 h-24 object-cover rounded-xl shadow-md mb-2" 
                            />
                            <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Pose {idx + 1} Terisi
                            </span>
                            <label className="mt-2 text-[10px] underline opacity-70 hover:opacity-100 cursor-pointer">
                              Ganti Foto
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, idx)}
                              />
                            </label>
                          </div>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center p-2 w-full h-full justify-center">
                            <ImageIcon size={24} className="opacity-40 mb-1.5" />
                            <span className="text-xs font-semibold block mb-0.5">Unggah Foto Pose {idx + 1}</span>
                            <span className="text-[10px] opacity-50">Klik untuk pilih dari perangkat</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, idx)}
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('setup')}
                      className="py-2.5 px-4 rounded-xl border border-white/20 text-xs font-medium cursor-pointer active:scale-95"
                    >
                      Kembali
                    </button>

                    <button
                      type="button"
                      disabled={photos.filter(Boolean).length < totalPoses}
                      onClick={() => {
                        setStep('preview');
                        playStripReadyChime();
                      }}
                      className="flex-1 py-3 px-4 rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-40"
                      style={{
                        backgroundColor: tokens.primary,
                        color: tokens.btnPrimaryText
                      }}
                    >
                      <Sparkles size={16} /> Lanjut ke Pratinjau Photostrip ({photos.filter(Boolean).length}/{totalPoses})
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: PREVIEW & CUSTOMIZE */}
          {step === 'preview' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Photo Filter Switcher */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1.5 flex items-center gap-1.5">
                  <Sliders size={12} /> Pilih Filter Warna
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'natural', label: 'Natural' },
                    { id: 'bw', label: 'B&W Vintage' },
                    { id: 'vintage', label: 'Sepia Retro' },
                    { id: 'warm', label: 'Warm Glow' },
                  ].map((flt) => (
                    <button
                      key={flt.id}
                      type="button"
                      onClick={() => setFilter(flt.id as PhotoFilter)}
                      className={cn(
                        "py-1.5 px-2 rounded-xl text-[10px] font-medium border text-center transition-all cursor-pointer truncate",
                        filter === flt.id 
                          ? "ring-2 font-bold shadow-xs" 
                          : "border-white/10 opacity-70 hover:opacity-100"
                      )}
                      style={{
                        borderColor: filter === flt.id ? tokens.accent : undefined,
                        boxShadow: filter === flt.id ? `0 0 0 2px ${tokens.accent}` : undefined,
                        backgroundColor: filter === flt.id ? `${tokens.accent}20` : undefined,
                        color: filter === flt.id ? tokens.accent : 'inherit'
                      }}
                    >
                      {flt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Frame Style Switcher */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider opacity-70 block mb-1.5 flex items-center gap-1.5">
                  <Palette size={12} /> Ganti Warna Bingkai
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'theme', label: 'Theme' },
                    { id: 'black_studio', label: 'Black' },
                    { id: 'white_studio', label: 'White' },
                    { id: 'romantic_pastel', label: 'Pastel' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id as FrameTemplate)}
                      className={cn(
                        "py-1.5 px-2 rounded-xl text-[10px] font-medium border text-center transition-all cursor-pointer truncate",
                        template === tpl.id 
                          ? "ring-2 font-bold shadow-xs" 
                          : "border-white/10 opacity-70 hover:opacity-100"
                      )}
                      style={{
                        borderColor: template === tpl.id ? tokens.primary : undefined,
                        boxShadow: template === tpl.id ? `0 0 0 2px ${tokens.primary}` : undefined,
                        backgroundColor: template === tpl.id ? `${tokens.primary}20` : undefined,
                      }}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photostrip Canvas Preview Container */}
              <div className="relative w-full max-w-[320px] mx-auto bg-black/40 rounded-2xl p-3 border border-white/10 flex items-center justify-center min-h-[320px] shadow-2xl">
                {isRendering ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-white">
                    <RefreshCw size={24} className="animate-spin text-white/60 mb-2" />
                    <span className="text-xs font-semibold">Merakit Photostrip HD...</span>
                  </div>
                ) : renderedStripUrl ? (
                  <div className="relative group max-h-[440px] overflow-y-auto rounded-xl">
                    <img
                      src={renderedStripUrl}
                      alt="Wedding Photostrip Result"
                      className="w-full h-auto object-contain rounded-lg shadow-xl"
                    />
                  </div>
                ) : (
                  <span className="text-xs opacity-50">Menunggu foto...</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!renderedStripUrl || isRendering}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50 hover:opacity-95"
                  style={{
                    backgroundColor: tokens.accent,
                    color: '#FFFFFF'
                  }}
                >
                  <Download size={16} /> Unduh Photostrip HD (PNG)
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('capture');
                      setActivePoseIndex(0);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-white/15 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 active:scale-98"
                  >
                    <RotateCcw size={14} /> Foto Ulang Pose
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-white/15 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white/5 active:scale-98"
                  >
                    <Layers size={14} /> Ganti Format
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
