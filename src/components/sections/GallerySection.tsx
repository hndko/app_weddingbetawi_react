import React from "react";
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { config } from '../../data/config';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = config.gallery;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
    }
  };
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
    }
  };

  return (
    <section className="py-24 px-6 bg-ivory text-center">
      <h3 className="font-heading text-4xl text-text-dark mb-4">Galeri Bahagia</h3>
      <p className="text-xs text-text-dark/60 max-w-[260px] mx-auto leading-relaxed mb-12">
        Momen-momen indah yang mengantarkan kami menuju hari bahagia.
      </p>

      <div className="flex flex-col gap-3">
        {images[0] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full aspect-[4/5] rounded-[20px] overflow-hidden cursor-pointer relative group bg-light-gray"
            onClick={() => openLightbox(0)}
          >
            <img src={images[0]} alt="Gallery 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
          </motion.div>
        )}

        <div className="flex gap-3">
          {images[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-1/2 aspect-square rounded-[16px] overflow-hidden cursor-pointer relative group bg-light-gray"
              onClick={() => openLightbox(1)}
            >
              <img src={images[1]} alt="Gallery 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
            </motion.div>
          )}
          {images[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="w-1/2 aspect-square rounded-[16px] overflow-hidden cursor-pointer relative group bg-light-gray"
              onClick={() => openLightbox(2)}
            >
              <img src={images[2]} alt="Gallery 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
            </motion.div>
          )}
        </div>

        {images[3] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full aspect-[3/2] rounded-[20px] overflow-hidden cursor-pointer relative group bg-light-gray"
            onClick={() => openLightbox(3)}
          >
            <img src={images[3]} alt="Gallery 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-center items-center backdrop-blur-md"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white p-2">
              <X size={28} />
            </button>
            
            <div className="relative w-full max-w-[430px] px-4 flex items-center justify-between" onClick={e => e.stopPropagation()}>
              <button onClick={prevImage} className="text-white/70 hover:text-white p-2 bg-black/30 rounded-full">
                <ChevronLeft size={24} />
              </button>
              
              <div className="w-full mx-4 rounded-xl overflow-hidden shadow-2xl bg-black">
                <img 
                  key={lightboxIndex}
                  src={images[lightboxIndex]} 
                  alt={`Lightbox ${lightboxIndex}`} 
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              
              <button onClick={nextImage} className="text-white/70 hover:text-white p-2 bg-black/30 rounded-full">
                <ChevronRight size={24} />
              </button>
            </div>
            <div className="absolute bottom-8 text-white/50 text-xs tracking-widest font-mono">
              {String(lightboxIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
