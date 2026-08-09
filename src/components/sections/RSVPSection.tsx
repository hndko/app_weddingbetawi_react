import React from "react";
import { useState } from 'react';
import { motion } from 'motion/react';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';

export function RSVPSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section className="py-24 px-6 bg-ivory relative overflow-hidden">
      <OndelFloralDecoration position="top-right" className="opacity-20 scale-75 -translate-y-12 translate-x-12" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-[340px] mx-auto bg-white rounded-[24px] p-8 border border-gold-soft/30 shadow-sm"
      >
        <h3 className="font-heading text-3xl text-text-dark mb-2 text-center">RSVP</h3>
        <p className="text-xs text-text-dark/60 text-center mb-8 leading-relaxed">
          Harap konfirmasi kehadiran Anda untuk memudahkan kami dalam mempersiapkan acara.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Nama</label>
              <input 
                type="text" 
                required 
                placeholder="Nama Lengkap"
                className="w-full bg-light-gray border-none rounded-xl px-4 py-3.5 text-sm text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all placeholder:text-text-dark/30"
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Jumlah Tamu</label>
              <select className="w-full bg-light-gray border-none rounded-xl px-4 py-3.5 text-sm text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all appearance-none cursor-pointer">
                <option value="1">1 Orang</option>
                <option value="2">2 Orang</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Kehadiran</label>
              <select className="w-full bg-light-gray border-none rounded-xl px-4 py-3.5 text-sm text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all appearance-none cursor-pointer">
                <option value="hadir">Hadir</option>
                <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-4 w-full bg-sage text-white py-3.5 rounded-full text-[13px] font-medium tracking-wide hover:bg-sage-dark transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Konfirmasi'}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-4 text-sage">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h4 className="font-heading text-xl text-text-dark mb-2">Terima Kasih</h4>
            <p className="text-xs text-text-dark/60 leading-relaxed">
              Konfirmasi kehadiran Anda telah kami terima.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
