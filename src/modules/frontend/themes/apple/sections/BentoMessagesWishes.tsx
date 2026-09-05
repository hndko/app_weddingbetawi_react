import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { MessageCircle, Send, CheckCircle2, User, Users, Check, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '../../../../../lib/firebase';
import { useGuestName } from '../../../../../hooks/useGuestName';
import { Wish } from '../../../../../types';

const defaultMockWishes: Wish[] = [
  { id: '1', name: 'Dimas Pratama', text: 'Selamat menempuh hidup baru! Semoga selalu diberkahi kebahagiaan dan cinta yang abadi.', time: '10:42' },
  { id: '2', name: 'Nadia Salsabila', text: 'Barakallahu lakuma wa baraka alaikuma! Lancar sampai hari-H yaa guys! 🎉', time: '11:15' },
];

export const BentoMessagesWishes: React.FC = () => {
  const defaultGuestName = useGuestName();
  const [wishes, setWishes] = useState<Wish[]>(defaultMockWishes);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir'>('hadir');
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setName(defaultGuestName);
    }
    if (localStorage.getItem('apple_rsvp_submitted') === 'true') {
      setRsvpSuccess(true);
    }
  }, [defaultGuestName]);

  // Firestore Real-Time Listener with cleanup & limit(30) per Pilar 6
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'), limit(30));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetched: Wish[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            let timeStr = 'Baru saja';
            if (data.createdAt?.toDate) {
              const d = data.createdAt.toDate();
              timeStr = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            }
            return {
              id: doc.id,
              name: data.name || 'Tamu',
              text: data.text || '',
              time: timeStr,
            };
          });
          setWishes(fetched);
        }
      },
      () => {
        // Fallback gracefully on local error
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText('');
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setErrorMsg('Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendRSVP = async () => {
    if (!name.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await addDoc(collection(db, 'rsvps'), {
        name: name.trim(),
        guestCount: Number(guestCount),
        attendance,
        notes: text.trim(),
        createdAt: serverTimestamp(),
      });
      setRsvpSuccess(true);
      localStorage.setItem('apple_rsvp_submitted', 'true');
    } catch {
      setErrorMsg('Gagal mengonfirmasi RSVP. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#34C759]/10 flex items-center justify-center text-[#34C759]">
            <MessageCircle size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            IMESSAGE • RSVP &amp; WISHES
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#34C759]">Doa &amp; Kehadiran</span>
      </div>

      {/* Outer Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Card 1: RSVP Confirmation (iOS Settings / Form Card Style) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#007AFF] bg-[#007AFF]/10 px-2.5 py-0.5 rounded-full">
                RSVP FORM
              </span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                Konfirmasi Kehadiran
              </span>
            </div>

            {rsvpSuccess ? (
              <div className="bg-[#34C759]/10 border border-[#34C759]/20 rounded-2xl p-4 text-center my-4">
                <CheckCircle2 size={28} className="text-[#34C759] mx-auto mb-1.5" />
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  RSVP Anda Telah Diterima!
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1">
                  Terima kasih atas konfirmasi kehadiran Anda. Sampai jumpa di hari bahagia!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Guest Name Input */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Dimas Pratama"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F2F2F7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#007AFF]"
                    />
                  </div>
                </div>

                {/* Attendance Segmented Control */}
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F2F2F7] dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setAttendance('hadir')}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        attendance === 'hadir'
                          ? 'bg-white dark:bg-[#2C2C2E] text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance('tidak_hadir')}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        attendance === 'tidak_hadir'
                          ? 'bg-white dark:bg-[#2C2C2E] text-neutral-900 dark:text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-700'
                      }`}
                    >
                      Tidak Hadir
                    </button>
                  </div>
                </div>

                {/* Guest Count */}
                {attendance === 'hadir' && (
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 block mb-1">
                      Jumlah Tamu
                    </label>
                    <div className="relative">
                      <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#F2F2F7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#007AFF]"
                      >
                        <option value={1}>1 Orang</option>
                        <option value={2}>2 Orang</option>
                      </select>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSendRSVP}
                  disabled={isSubmitting || !name.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Konfirmasi Kehadiran</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 2: iMessage Wishes Chat Stream */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-4 sm:p-5 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#34C759] animate-pulse" />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                iMessage Group Chat
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
              {wishes.length} Pesan
            </span>
          </div>

          {/* iMessage Chat Bubble Stream */}
          <div className="flex-1 space-y-2.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1 mb-3">
            {wishes.map((w, i) => {
              const isMe = name.trim().toLowerCase() === w.name.trim().toLowerCase();
              return (
                <div
                  key={w.id || i}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] font-semibold text-neutral-400 dark:text-neutral-500 px-2 mb-0.5">
                    {w.name} • {w.time}
                  </span>
                  <div
                    className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#007AFF] text-white rounded-br-xs shadow-xs'
                        : 'bg-[#E5E5EA] dark:bg-[#2C2C2E] text-neutral-900 dark:text-white rounded-bl-xs'
                    }`}
                  >
                    {w.text}
                  </div>
                  {isMe && (
                    <span className="text-[8px] text-neutral-400 dark:text-neutral-500 pr-1 mt-0.5">
                      Terkirim
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* iMessage Input Bar */}
          <form onSubmit={handleSendWish} className="relative flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tulis ucapan doa iMessage..."
              className="flex-1 pl-3.5 pr-10 py-2 rounded-full bg-[#F2F2F7] dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[#007AFF]"
            />
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="absolute right-1 w-7 h-7 rounded-full bg-[#007AFF] hover:bg-[#0062CC] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer"
              title="Kirim iMessage"
            >
              <Send size={12} className="ml-0.5" />
            </button>
          </form>

          {submitSuccess && (
            <p className="text-[10px] text-[#34C759] font-medium text-center mt-1.5">
              Pesan doa terkirim via iMessage!
            </p>
          )}

          {errorMsg && (
            <p className="text-[10px] text-[#FF3B30] font-medium text-center mt-1.5 flex items-center justify-center gap-1">
              <AlertCircle size={10} />
              <span>{errorMsg}</span>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
