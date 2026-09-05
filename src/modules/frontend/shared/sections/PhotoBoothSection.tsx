import { useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Download, ChevronRight, Layers } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';

const PhotoBoothModal = lazy(() =>
  import('../components/PhotoBoothModal').then((m) => ({ default: m.PhotoBoothModal }))
);

interface PhotoBoothSectionProps {
  asStandalone?: boolean;
}

export function PhotoBoothSection({ asStandalone = false }: PhotoBoothSectionProps) {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={cn(
          "max-w-[360px] mx-auto text-white rounded-[28px] p-6 shadow-xl relative overflow-hidden text-left backdrop-blur-md transition-all duration-300",
          isDark ? "bg-[#161616]/90 border border-white/10" : "bg-[#1c1917]/95 border border-white/10"
        )}
      >
        {/* Glow ambient decoration */}
        <div 
          className="absolute top-0 right-0 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-25"
          style={{ backgroundColor: tokens.accent }}
        />
        <div 
          className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20"
          style={{ backgroundColor: tokens.primary }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: `${tokens.accent}20`,
                borderColor: `${tokens.accent}40`,
                color: tokens.accent,
              }}
            >
              <Sparkles size={11} className="animate-spin" /> Virtual Photo Booth
            </span>
            <span className="text-[11px] text-white/50 font-medium">100% Gratis & HD</span>
          </div>

          <h3 className="font-heading text-xl font-bold text-white mb-2 leading-tight">
            Abadikan Momen Manis Bersama {weddingConfig.groom.nickname} & {weddingConfig.bride.nickname}
          </h3>

          <p className="text-xs text-white/70 leading-relaxed mb-5">
            Foto selfie dengan timer otomatis 3 detik atau unggah foto dari galerimu. Buat photostrip gaya Korean self-studio atau polaroid elegan dan simpan ke HP-mu!
          </p>

          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="bg-white/[0.05] border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
              <Layers size={16} className="shrink-0" style={{ color: tokens.accent }} />
              <span className="text-[11px] text-white/80 font-medium">3-Pose Strip & Polaroid</span>
            </div>
            <div className="bg-white/[0.05] border border-white/10 rounded-xl p-2.5 flex items-center gap-2">
              <Download size={16} className="shrink-0" style={{ color: tokens.primary }} />
              <span className="text-[11px] text-white/80 font-medium">1-Click Unduh PNG</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 text-xs tracking-wider transition-all transform active:scale-95 cursor-pointer hover:opacity-90"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.btnPrimaryText,
            }}
          >
            <Camera size={16} /> BUKA VIRTUAL PHOTO BOOTH <ChevronRight size={15} />
          </button>
        </div>
      </motion.div>

      {isModalOpen && (
        <Suspense fallback={null}>
          <PhotoBoothModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </>
  );

  if (asStandalone) {
    return (
      <section className="py-12 px-6 relative text-center">
        {content}
      </section>
    );
  }

  return (
    <div className="my-8 px-2">
      {content}
    </div>
  );
}
