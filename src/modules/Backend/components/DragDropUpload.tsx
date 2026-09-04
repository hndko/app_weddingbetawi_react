import React, { useState, useRef } from 'react';
import { Upload, ImageIcon, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {previewItems.map((item) => (
              <div
                key={`${id}-preview-${item.index}`}
                className="bg-white border border-gray-200 rounded-xl p-2.5 flex items-center justify-between gap-3 shadow-xs hover:border-sage/40 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200/80 flex items-center justify-center">
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
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-gray-800 truncate">
                      {multiple ? `Foto #${item.index + 1}` : 'Foto Berhasil Diunggah'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">
                      Siap digunakan
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
    </div>
  );
}
