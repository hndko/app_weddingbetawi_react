import React, { useState, useEffect } from "react";
import { motion } from 'motion/react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useGuestName } from '../../../../hooks/useGuestName';
import { AlertCircle, CheckCircle2, User, MessageSquareQuote, Send, ChevronDown, Loader2 } from 'lucide-react';
import { Wish } from '../../../../types';

function SectionDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-gold opacity-60 ${className}`}>
      <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-current" />
      <span className="text-xs">✦</span>
      <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

const defaultWishes: Wish[] = [
  { id: '1', name: 'Andi & Keluarga', text: 'Selamat menempuh hidup baru, semoga menjadi keluarga sakinah mawaddah warahmah.', time: '2 jam lalu' },
  { id: '2', name: 'Siti', text: 'Happy wedding! Lancar-lancar terus yaa dan bahagia selalu.', time: '5 jam lalu' },
];

export function WishesSection() {
  const defaultGuestName = useGuestName();
  const [wishes, setWishes] = useState<Wish[]>(defaultWishes);
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setName(defaultGuestName);
    }
  }, [defaultGuestName]);

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedWishes: Wish[] = snapshot.docs.map(doc => {
          const data = doc.data();
          let timeFormatted = 'Baru saja';
          if (data.createdAt?.toDate) {
            const date = data.createdAt.toDate();
            timeFormatted = date.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
          return {
            id: doc.id,
            name: data.name,
            text: data.text,
            time: timeFormatted,
          };
        });
        setWishes(fetchedWishes);
      }
    }, (error) => {
      console.error('Error listening to wishes:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wishText.trim()) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        text: wishText.trim(),
        createdAt: serverTimestamp(),
      });
      setWishText('');
      setSuccessMessage('Ucapan dan doa Anda berhasil dikirimkan!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Failed to submit wish:', err);
      setErrorMessage('Gagal mengirim ucapan. Silakan periksa koneksi internet Anda dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-warm-white relative overflow-hidden flex flex-col items-center">
      <div className="max-w-[340px] w-full mx-auto relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
           <h3 className="font-heading text-4xl text-text-dark mb-4">Ucapan & Doa</h3>
           <SectionDivider />
        </div>

        <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-3">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}
          <div className="relative flex items-center">
            <User size={16} className="absolute left-3.5 text-sage-dark pointer-events-none" />
            <input 
              type="text" 
              placeholder="Nama Lengkap Anda" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white border border-sage/20 rounded-xl pl-10 pr-4 py-3.5 text-[13px] text-text-dark focus:border-sage outline-none transition-all placeholder:text-text-dark/30 shadow-sm"
            />
          </div>
          <div className="relative flex">
            <MessageSquareQuote size={16} className="absolute left-3.5 top-3.5 text-sage-dark pointer-events-none" />
            <textarea 
              placeholder="Tulis ucapan dan doa restu terbaik Anda..."
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              required
              rows={3}
              className="w-full bg-white border border-sage/20 rounded-xl pl-10 pr-4 py-3.5 text-[13px] text-text-dark focus:border-sage outline-none transition-all placeholder:text-text-dark/30 shadow-sm resize-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-sage-dark text-white py-3.5 rounded-xl text-[13px] font-semibold tracking-wide hover:bg-sage transition-all disabled:opacity-70 shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Kirim Ucapan & Doa</span>
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
          {wishes.slice(0, visibleCount).map((wish, index) => (
            <motion.div 
              key={wish.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-2xl border border-sage/10 shadow-sm"
            >
              <div className="flex justify-between items-baseline mb-2">
                 <h5 className="font-heading text-lg text-sage-dark font-medium">{wish.name}</h5>
                 <span className="text-[9px] text-text-dark/40 tracking-wider uppercase">{wish.time}</span>
              </div>
              <p className="text-[13px] text-text-dark/70 leading-relaxed italic">
                "{wish.text}"
              </p>
            </motion.div>
          ))}
          {wishes.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="mt-2 text-xs text-sage-dark font-semibold hover:underline py-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ChevronDown size={14} />
              <span>Lihat Lebih Banyak ({wishes.length - visibleCount})</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
