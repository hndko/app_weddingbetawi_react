import React, { useState, useEffect } from "react";
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useGuestName } from '../../../../hooks/useGuestName';
import { AlertCircle, User, Users, CheckCircle2, MessageSquare, Send, RotateCcw, Loader2 } from 'lucide-react';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';

export function RSVPSection() {
  const defaultGuestName = useGuestName();
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState('hadir');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setName(defaultGuestName);
    }
    if (localStorage.getItem('rsvp_submitted') === 'true') {
      setIsSubmitted(true);
    }
  }, [defaultGuestName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await addDoc(collection(db, 'rsvps'), {
        name: name.trim(),
        guestCount: Number(guestCount),
        attendance,
        notes: notes.trim(),
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      localStorage.setItem('rsvp_submitted', 'true');
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      setErrorMessage('Gagal mengirim RSVP. Silakan periksa koneksi internet Anda dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
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
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Nama</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-sage-dark pointer-events-none" />
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Tamu"
                  className="w-full bg-light-gray border-none rounded-xl pl-10 pr-4 py-3.5 text-sm text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all placeholder:text-text-dark/30"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Jumlah Tamu</label>
              <div className="relative flex items-center">
                <Users size={16} className="absolute left-3.5 text-sage-dark pointer-events-none" />
                <select 
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full bg-light-gray border-none rounded-xl pl-10 pr-4 py-3.5 text-sm text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value={1}>1 Orang</option>
                  <option value={2}>2 Orang</option>
                  <option value={3}>3 Orang</option>
                  <option value={4}>4 Orang</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Kehadiran</label>
              <div className="relative flex items-center">
                <CheckCircle2 size={16} className="absolute left-3.5 text-sage-dark pointer-events-none" />
                <select 
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="w-full bg-light-gray border-none rounded-xl pl-10 pr-4 py-3.5 text-sm text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="hadir">Hadir</option>
                  <option value="tidak_hadir">Maaf, Tidak Bisa Hadir</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-text-dark/80 uppercase tracking-widest mb-1.5 ml-1">Pesan / Catatan (Opsional)</label>
              <div className="relative flex">
                <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-sage-dark pointer-events-none" />
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pesan doa atau ucapan tambahan..."
                  rows={2}
                  className="w-full bg-light-gray border-none rounded-xl pl-10 pr-4 py-3.5 text-xs text-text-dark focus:ring-1 focus:ring-sage outline-none transition-all resize-none placeholder:text-text-dark/30"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 w-full bg-sage text-white py-3.5 rounded-full text-[13px] font-semibold tracking-wide hover:bg-sage-dark transition-all disabled:opacity-70 cursor-pointer shadow-sm flex items-center justify-center gap-2 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Kirim Konfirmasi</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-4 text-sage border border-sage/20">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-heading text-xl text-text-dark mb-2">Terima Kasih</h4>
            <p className="text-xs text-text-dark/60 leading-relaxed mb-6">
              Konfirmasi kehadiran Anda telah tersimpan di sistem kami.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-sage-dark hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Ubah Konfirmasi</span>
            </button>
          </div>
        )}
      </motion.div>
    </section>
  );
}
