import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, ImageIcon, Trash2, Loader2, CheckCircle2, 
  ChevronLeft, ChevronRight, X, Maximize2 
} from 'lucide-react';

export interface DragDropUploadProps {
  id: string;
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  value?: string | string[];
  isUploading?: boolean;
  onFileSelect: (files: File[]) => void;
  onRemove?: (index?: number) => void;
  className?: string;
}

export function DragDropUpload({
  id,
  label = 'Tarik & lepas foto di sini, atau klik untuk memilih',
  helperText = 'Format: JPG, PNG, WebP (otomatis dikompresi & zero storage cost)',
  accept = 'image/*',
  multiple = false,
  value,
  isUploading = false,
  onFileSelect,
  onRemove,
  className = '',
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalIndex, setPreviewModalIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const filtered = filesArray.filter((file) => file.type.startsWith('image/'));
      if (filtered.length > 0) {
        onFileSelect(filtered);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFileSelect(filesArray);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const triggerSelect = () => {
    fileInputRef.current?.click();
  };

  // Normalize preview items
  const previewItems: { url: string; index: number }[] = [];
  if (Array.isArray(value)) {
    value.forEach((url, idx) => {
      if (url && typeof url === 'string' && url.trim() !== '') {
        previewItems.push({ url, index: idx });
      }
    });
  } else if (value && typeof value === 'string' && value.trim() !== '') {
    previewItems.push({ url: value, index: 0 });
  }

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (previewModalIndex === null) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewModalIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setPreviewModalIndex((prev) => 
          prev !== null && prev > 0 ? prev - 1 : previewItems.length - 1
        );
      } else if (e.key === 'ArrowRight') {
        setPreviewModalIndex((prev) => 
          prev !== null && prev < previewItems.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previewModalIndex, previewItems.length]);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Interactive Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerSelect}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group ${
          isDragging
            ? 'border-sage-dark bg-sage/10 scale-[0.99] shadow-inner'
            : 'border-gray-300 hover:border-sage bg-gray-50/70 hover:bg-sage/5'
        }`}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="sr-only"
        />

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isDragging
              ? 'bg-sage-dark text-white scale-110'
              : 'bg-white text-sage-dark shadow-sm border border-gray-100 group-hover:scale-105'
          }`}
        >
          {isUploading ? (
            <Loader2 size={22} className="animate-spin text-sage-dark" />
          ) : (
            <Upload size={22} />
          )}
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xs font-semibold text-gray-700 group-hover:text-sage-dark transition-colors">
            {isUploading ? 'Sedang memproses & mengompres berkas...' : label}
          </p>
          <span className="text-[11px] text-gray-400 mt-0.5">{helperText}</span>
        </div>
      </div>

      {/* Itemized Uploaded Files Preview List */}
      {previewItems.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Berkas Terunggah ({previewItems.length})
            </span>
            <span className="text-[10px] text-gray-400 italic">
              Klik foto untuk membuka pratinjau penuh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {previewItems.map((item) => (
              <div
                key={`${id}-preview-${item.index}`}
                onClick={() => setPreviewModalIndex(item.index)}
                className="bg-white border border-gray-200 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-xs hover:border-sage/60 hover:shadow-sm transition-all cursor-pointer group/card"
                title="Klik untuk perbesar / geser foto"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200/80 flex items-center justify-center group-hover/card:scale-105 transition-transform">
                    {item.url.startsWith('http') || item.url.startsWith('data:image') ? (
                      <img
                        src={item.url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon size={18} className="text-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 size={13} />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-gray-800 truncate group-hover/card:text-sage-dark transition-colors">
                      {multiple ? `Foto #${item.index + 1}` : 'Foto Berhasil Diunggah'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span>Siap digunakan</span>
                      <span className="text-gray-400 hidden sm:inline">&bull; Klik perbesar</span>
                    </span>
                  </div>
                </div>

                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(multiple ? item.index : undefined);
                    }}
                    title="Hapus foto ini"
                    aria-label="Hapus foto ini"
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox / Slider Full-Screen Modal */}
      {previewModalIndex !== null && previewItems[previewModalIndex] && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 select-none"
          onClick={() => setPreviewModalIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Pratinjau Foto"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setPreviewModalIndex(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all cursor-pointer z-10"
            title="Tutup pratinjau (Esc)"
            aria-label="Tutup pratinjau foto"
          >
            <X size={20} />
          </button>

          {/* Top Counter & Info Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center gap-2 z-10">
            <span>
              {multiple
                ? `Foto ${previewModalIndex + 1} dari ${previewItems.length}`
                : 'Pratinjau Foto'}
            </span>
            {previewItems.length > 1 && (
              <span className="text-white/60 text-[11px] font-normal hidden sm:inline">
                &bull; Geser dengan tombol panah keyboard &larr; &rarr;
              </span>
            )}
          </div>

          {/* Centered Image Container */}
          <div
            className="relative max-w-5xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewItems[previewModalIndex].url}
              alt={`Foto #${previewModalIndex + 1}`}
              className="max-h-[80vh] max-w-[88vw] object-contain rounded-2xl shadow-2xl border border-white/10 transition-all duration-200"
            />
          </div>

          {/* Navigation Controls for multiple items */}
          {previewItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewModalIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : previewItems.length - 1
                  );
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all cursor-pointer border border-white/15 shadow-lg active:scale-95"
                title="Foto Sebelumnya (Panah Kiri)"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewModalIndex((prev) =>
                    prev !== null && prev < previewItems.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm transition-all cursor-pointer border border-white/15 shadow-lg active:scale-95"
                title="Foto Berikutnya (Panah Kanan)"
                aria-label="Foto Berikutnya"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
