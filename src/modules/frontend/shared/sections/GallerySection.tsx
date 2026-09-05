import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { ChevronLeft, ChevronRight, X, Maximize2, Sparkles } from 'lucide-react';
import { PhotoBoothSection } from './PhotoBoothSection';
import type { GalleryLayoutStyle } from '../../../../types';

export function GallerySection() {
  const { weddingConfig } = useWeddingConfig();
  const { tokens } = useThemeTokens();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const images = weddingConfig.gallery || [];
  const layoutStyle: GalleryLayoutStyle = weddingConfig.galleryLayout || 'editorial';

  // Lightbox handlers
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((curr) => {
      if (curr === null) return null;
      return curr === 0 ? images.length - 1 : curr - 1;
    });
  }, [images.length]);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLightboxIndex((curr) => {
      if (curr === null) return null;
      return curr === images.length - 1 ? 0 : curr + 1;
    });
  }, [images.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, prevImage, nextImage]);

  // Carousel touch swipe handling
  const touchStartXRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swipe left -> next
        setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        // Swipe right -> prev
        setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    touchStartXRef.current = null;
  };

  // =========================================================================
  // RENDERER 1: EDITORIAL ASYMMETRIC (MAGAZINE STYLE)
  // =========================================================================
  const renderEditorialGrid = () => {
    // Chunk images into groups of 4 for rhythmic magazine flow
    const chunks: string[][] = [];
    for (let i = 0; i < images.length; i += 4) {
      chunks.push(images.slice(i, i + 4));
    }

    return (
      <div className="flex flex-col gap-3">
        {chunks.map((chunk, chunkIdx) => {
          const baseIdx = chunkIdx * 4;
          return (
            <React.Fragment key={chunkIdx}>
              {/* Photo 1: Featured Portrait Aspect 4/5 */}
              {chunk[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="w-full aspect-[4/5] rounded-[20px] overflow-hidden cursor-pointer relative group bg-black/5 shadow-sm"
                  onClick={() => openLightbox(baseIdx)}
                >
                  <img
                    src={chunk[0]}
                    alt={`Gallery ${baseIdx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg">
                      <Maximize2 size={18} />
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Photo 2 & 3: Side-by-Side Squares */}
              {(chunk[1] || chunk[2]) && (
                <div className="flex gap-3">
                  {chunk[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className={`${chunk[2] ? 'w-1/2' : 'w-full'} aspect-square rounded-[16px] overflow-hidden cursor-pointer relative group bg-black/5 shadow-sm`}
                      onClick={() => openLightbox(baseIdx + 1)}
                    >
                      <img
                        src={chunk[1]}
                        alt={`Gallery ${baseIdx + 2}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg">
                          <Maximize2 size={16} />
                        </span>
                      </div>
                    </motion.div>
                  )}
                  {chunk[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="w-1/2 aspect-square rounded-[16px] overflow-hidden cursor-pointer relative group bg-black/5 shadow-sm"
                      onClick={() => openLightbox(baseIdx + 2)}
                    >
                      <img
                        src={chunk[2]}
                        alt={`Gallery ${baseIdx + 3}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg">
                          <Maximize2 size={16} />
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Photo 4: Cinematic Landscape Aspect 3/2 */}
              {chunk[3] && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="w-full aspect-[3/2] rounded-[20px] overflow-hidden cursor-pointer relative group bg-black/5 shadow-sm"
                  onClick={() => openLightbox(baseIdx + 3)}
                >
                  <img
                    src={chunk[3]}
                    alt={`Gallery ${baseIdx + 4}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg">
                      <Maximize2 size={18} />
                    </span>
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // =========================================================================
  // RENDERER 2: MODERN MASONRY (PINTEREST STYLE 2-COLUMN)
  // =========================================================================
  const renderMasonryGrid = () => {
    // Split into 2 alternating columns
    const col1 = images.filter((_, idx) => idx % 2 === 0);
    const col2 = images.filter((_, idx) => idx % 2 !== 0);

    const getAspectClass = (originalIdx: number) => {
      const patterns = ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[2/3]'];
      return patterns[originalIdx % patterns.length];
    };

    return (
      <div className="grid grid-cols-2 gap-3 items-start">
        {/* Column 1 */}
        <div className="flex flex-col gap-3">
          {col1.map((img, colIdx) => {
            const originalIdx = colIdx * 2;
            return (
              <motion.div
                key={originalIdx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (colIdx % 3) * 0.1 }}
                className={`w-full ${getAspectClass(originalIdx)} rounded-[18px] overflow-hidden cursor-pointer relative group bg-black/5 shadow-sm`}
                onClick={() => openLightbox(originalIdx)}
              >
                <img
                  src={img}
                  alt={`Masonry Photo ${originalIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white pointer-events-none">
                  <span className="text-[10px] font-mono opacity-80">#{String(originalIdx + 1).padStart(2, '0')}</span>
                  <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-xs">
                    <Maximize2 size={13} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-3">
          {col2.map((img, colIdx) => {
            const originalIdx = colIdx * 2 + 1;
            return (
              <motion.div
                key={originalIdx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ((colIdx % 3) + 1) * 0.1 }}
                className={`w-full ${getAspectClass(originalIdx)} rounded-[18px] overflow-hidden cursor-pointer relative group bg-black/5 shadow-sm`}
                onClick={() => openLightbox(originalIdx)}
              >
                <img
                  src={img}
                  alt={`Masonry Photo ${originalIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3 text-white pointer-events-none">
                  <span className="text-[10px] font-mono opacity-80">#{String(originalIdx + 1).padStart(2, '0')}</span>
                  <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-xs">
                    <Maximize2 size={13} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  // =========================================================================
  // RENDERER 3: INTERACTIVE CAROUSEL / SLIDER
  // =========================================================================
  const renderCarouselSlider = () => {
    const currentImg = images[carouselIndex] || images[0];

    return (
      <div className="flex flex-col gap-4">
        {/* Main Active Card */}
        <div
          className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg bg-black/5 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={carouselIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="w-full h-full cursor-pointer relative group"
              onClick={() => openLightbox(carouselIndex)}
            >
              <img
                src={currentImg}
                alt={`Carousel Slide ${carouselIndex + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white shadow-xl">
                  <Maximize2 size={20} />
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Foto Sebelumnya"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
            aria-label="Foto Selanjutnya"
          >
            <ChevronRight size={20} />
          </button>

          {/* Top-Right Badge Counter */}
          <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-mono tracking-wider font-semibold pointer-events-none">
            {String(carouselIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>
        </div>

        {/* Interactive Dots Pagination */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCarouselIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                carouselIndex === idx
                  ? 'w-6 shadow-xs'
                  : 'w-2 bg-black/20 hover:bg-black/40 dark:bg-white/20'
              }`}
              style={{
                backgroundColor: carouselIndex === idx ? tokens.primary : undefined,
              }}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail Track Strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCarouselIndex(idx)}
                className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  carouselIndex === idx
                    ? 'border-solid scale-105 shadow-sm'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{
                  borderColor: carouselIndex === idx ? tokens.primary : 'transparent',
                }}
              >
                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // RENDERER 4: POLAROID STACK (NOSTALGIC SCRAPBOOK STYLE)
  // =========================================================================
  const renderPolaroidStack = () => {
    const rotations = ['-rotate-1.5', 'rotate-2', '-rotate-1', 'rotate-1.5', '-rotate-2', 'rotate-1'];

    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 items-start">
        {images.map((img, idx) => {
          const rotClass = rotations[idx % rotations.length];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
              className={`p-2.5 pb-4 bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group relative ${rotClass} hover:rotate-0 hover:scale-105 z-10 hover:z-20`}
              onClick={() => openLightbox(idx)}
            >
              {/* Decorative Washi Tape Strip */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 bg-amber-100/80 border border-amber-300/40 rounded-xs -rotate-2 shadow-2xs pointer-events-none" />

              {/* Photo Frame */}
              <div className="w-full aspect-square overflow-hidden bg-gray-100 rounded-xs relative">
                <img
                  src={img}
                  alt={`Polaroid Momen ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-1.5 rounded-full bg-white/30 backdrop-blur-xs text-white">
                    <Maximize2 size={14} />
                  </span>
                </div>
              </div>

              {/* Polaroid Caption */}
              <div className="mt-2.5 px-1 text-center">
                <p className="text-[11px] font-serif text-gray-700 font-medium tracking-wide italic truncate">
                  Momen #{String(idx + 1).padStart(2, '0')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <section 
      className="py-24 px-6 text-center transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 shadow-2xs"
        style={{
          backgroundColor: `${tokens.primary}15`,
          color: tokens.primary,
        }}
      >
        <Sparkles size={13} />
        <span className="text-[11px] font-semibold uppercase tracking-wider">Potret Kenangan</span>
      </div>

      <h3 
        className="font-heading text-4xl mb-4 font-bold"
        style={{ color: tokens.textPrimary }}
      >
        Galeri Bahagia
      </h3>
      <p 
        className="text-xs max-w-[280px] mx-auto leading-relaxed mb-12 font-medium"
        style={{ color: tokens.textMuted }}
      >
        Momen-momen indah yang mengantarkan kami menuju hari bahagia.
      </p>

      {/* Render Selected Gallery Layout */}
      {images.length === 0 ? (
        <div className="py-12 px-4 rounded-2xl border border-dashed border-gray-200 text-center text-xs opacity-60">
          Foto galeri kenangan mempelai akan segera ditampilkan di sini.
        </div>
      ) : (
        <>
          {layoutStyle === 'editorial' && renderEditorialGrid()}
          {layoutStyle === 'masonry' && renderMasonryGrid()}
          {layoutStyle === 'carousel' && renderCarouselSlider()}
          {layoutStyle === 'polaroid' && renderPolaroidStack()}
        </>
      )}

      {/* Virtual Wedding Photo Booth Teaser Card */}
      <PhotoBoothSection />

      {/* Universal Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center backdrop-blur-md select-none"
            onClick={closeLightbox}
          >
            <button 
              onClick={closeLightbox} 
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Tutup Pratinjau"
            >
              <X size={28} />
            </button>
            
            <div className="relative w-full max-w-[460px] px-4 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <button 
                onClick={prevImage} 
                className="text-white/70 hover:text-white p-2.5 bg-black/40 hover:bg-black/70 rounded-full transition-colors cursor-pointer shrink-0 active:scale-95"
                aria-label="Foto Sebelumnya"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="w-full mx-3 rounded-2xl overflow-hidden shadow-2xl bg-black/40 border border-white/10">
                <img 
                  key={lightboxIndex}
                  src={images[lightboxIndex]} 
                  alt={`Lightbox ${lightboxIndex + 1}`} 
                  className="w-full h-auto max-h-[72vh] object-contain mx-auto"
                />
              </div>
              
              <button 
                onClick={nextImage} 
                className="text-white/70 hover:text-white p-2.5 bg-black/40 hover:bg-black/70 rounded-full transition-colors cursor-pointer shrink-0 active:scale-95"
                aria-label="Foto Selanjutnya"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="absolute bottom-8 text-white/60 text-xs tracking-widest font-mono bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
