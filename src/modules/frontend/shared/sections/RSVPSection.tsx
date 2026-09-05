import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useGuestName } from '../../../../hooks/useGuestName';
import { useThemeTokens } from '../../themes';
import { cn } from '../../../../utils/cn';
import { AlertCircle, User, Users, CheckCircle2, MessageSquare, Send, RotateCcw, Loader2, QrCode } from 'lucide-react';

const GuestQRPassModal = lazy(() => 
  import('../components/GuestQRPassModal').then(m => ({ default: m.GuestQRPassModal }))
);
const TriviaQuizSection = lazy(() => 
  import('./TriviaQuizSection').then(m => ({ default: m.TriviaQuizSection }))
);

export function RSVPSection() {
  const defaultGuestName = useGuestName();
  const { tokens, isDark } = useThemeTokens();
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState('hadir');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

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
    <section 
      className="py-24 px-6 relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={cn(
          "max-w-[340px] mx-auto rounded-[28px] p-8 backdrop-blur-md transition-all duration-300",
          isDark ? "shadow-2xl shadow-black/80" : "shadow-sm"
        )}
        style={{
          backgroundColor: tokens.cardBg,
          border: `1px solid ${tokens.cardBorder}`,
        }}
      >
        <h3 
          className="font-heading text-3xl font-bold mb-2 text-center"
          style={{ color: tokens.textPrimary }}
        >
          RSVP
        </h3>
        <p 
          className="text-xs text-center mb-8 leading-relaxed"
          style={{ color: tokens.textMuted }}
        >
          Harap konfirmasi kehadiran Anda untuk memudahkan kami dalam mempersiapkan acara.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}
            <div>
              <label 
                className="block text-[11px] font-medium uppercase tracking-widest mb-1.5 ml-1"
                style={{ color: tokens.textMuted }}
              >
                Nama
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 pointer-events-none" style={{ color: tokens.accent }} />
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap Tamu"
                  className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
                  style={{
                    backgroundColor: tokens.inputBg,
                    border: `1px solid ${tokens.inputBorder}`,
                    color: tokens.inputText,
                  }}
                />
              </div>
            </div>
            
            <div>
              <label 
                className="block text-[11px] font-medium uppercase tracking-widest mb-1.5 ml-1"
                style={{ color: tokens.textMuted }}
              >
                Jumlah Tamu
              </label>
              <div className="relative flex items-center">
                <Users size={16} className="absolute left-3.5 pointer-events-none" style={{ color: tokens.accent }} />
                <select 
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundColor: tokens.inputBg,
                    border: `1px solid ${tokens.inputBorder}`,
                    color: tokens.inputText,
                  }}
                >
                  <option value={1} style={{ backgroundColor: tokens.bg, color: tokens.textPrimary }}>1 Orang</option>
                  <option value={2} style={{ backgroundColor: tokens.bg, color: tokens.textPrimary }}>2 Orang</option>
                  <option value={3} style={{ backgroundColor: tokens.bg, color: tokens.textPrimary }}>3 Orang</option>
                  <option value={4} style={{ backgroundColor: tokens.bg, color: tokens.textPrimary }}>4 Orang</option>
                </select>
              </div>
            </div>
            
            <div>
              <label 
                className="block text-[11px] font-medium uppercase tracking-widest mb-1.5 ml-1"
                style={{ color: tokens.textMuted }}
              >
                Kehadiran
              </label>
              <div className="relative flex items-center">
                <CheckCircle2 size={16} className="absolute left-3.5 pointer-events-none" style={{ color: tokens.accent }} />
                <select 
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundColor: tokens.inputBg,
                    border: `1px solid ${tokens.inputBorder}`,
                    color: tokens.inputText,
                  }}
                >
                  <option value="hadir" style={{ backgroundColor: tokens.bg, color: tokens.textPrimary }}>Hadir</option>
                  <option value="tidak_hadir" style={{ backgroundColor: tokens.bg, color: tokens.textPrimary }}>Maaf, Tidak Bisa Hadir</option>
                </select>
              </div>
            </div>

            <div>
              <label 
                className="block text-[11px] font-medium uppercase tracking-widest mb-1.5 ml-1"
                style={{ color: tokens.textMuted }}
              >
                Pesan / Catatan (Opsional)
              </label>
              <div className="relative flex">
                <MessageSquare size={16} className="absolute left-3.5 top-3.5 pointer-events-none" style={{ color: tokens.accent }} />
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pesan doa atau ucapan tambahan..."
                  rows={2}
                  className="w-full rounded-xl pl-10 pr-4 py-3.5 text-xs outline-none transition-all resize-none"
                  style={{
                    backgroundColor: tokens.inputBg,
                    border: `1px solid ${tokens.inputBorder}`,
                    color: tokens.inputText,
                  }}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 rounded-full text-[13px] font-semibold tracking-wide transition-all disabled:opacity-70 cursor-pointer shadow-md flex items-center justify-center gap-2 active:scale-98"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.btnPrimaryText
              }}
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

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsPassModalOpen(true)}
                className="text-[11px] font-medium hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                style={{ color: tokens.accent }}
              >
                <QrCode size={13} />
                <span>Lihat / Unduh E-Ticket QR Anda</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center flex flex-col items-center">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 border"
              style={{ 
                backgroundColor: tokens.inputBg,
                borderColor: tokens.cardBorder,
                color: tokens.accent
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <h4 
              className="font-heading text-xl font-bold mb-1"
              style={{ color: tokens.textPrimary }}
            >
              Terima Kasih
            </h4>
            <p 
              className="text-xs leading-relaxed mb-5"
              style={{ color: tokens.textMuted }}
            >
              Konfirmasi kehadiran Anda telah tersimpan di sistem kami.
            </p>

            <button
              type="button"
              onClick={() => setIsPassModalOpen(true)}
              className="w-full py-3 px-4 rounded-full text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 mb-3"
              style={{
                backgroundColor: tokens.primary,
                color: tokens.btnPrimaryText
              }}
            >
              <QrCode size={15} />
              <span>Buka E-Ticket & QR Guest Pass</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs hover:underline flex items-center gap-1.5 font-semibold cursor-pointer"
              style={{ color: tokens.accent }}
            >
              <RotateCcw size={13} />
              <span>Ubah Konfirmasi</span>
            </button>
          </div>
        )}

        {isPassModalOpen && (
          <Suspense fallback={null}>
            <GuestQRPassModal
              isOpen={isPassModalOpen}
              onClose={() => setIsPassModalOpen(false)}
              guestName={name || defaultGuestName}
              guestPax={guestCount}
            />
          </Suspense>
        )}
      </motion.div>

      {/* Interactive Wedding Trivia Mini Game */}
      <Suspense fallback={null}>
        <TriviaQuizSection />
      </Suspense>
    </section>
  );
}
