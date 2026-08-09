import React, { useState, useEffect } from "react";
import { motion } from 'motion/react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useGuestName } from '../../hooks/useGuestName';
import { FloatingFlowers } from '../decorations/FloatingFlowers';
import { OndelFloralDecoration } from '../decorations/OndelFloralDecoration';
import { FloralDivider } from '../decorations/FloralDivider';
import { HouseBackgroundFlowers } from '../decorations/HouseBackgroundFlowers';
import { Wish } from '../../types';

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
    try {
      await addDoc(collection(db, 'wishes'), {
        name: name.trim(),
        text: wishText.trim(),
        createdAt: serverTimestamp(),
      });
      setWishText('');
    } catch (err) {
      console.error('Failed to submit wish:', err);
      alert('Gagal mengirim ucapan, silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-warm-white relative overflow-hidden flex flex-col items-center">
      <FloatingFlowers className="opacity-40" />
      <OndelFloralDecoration position="center" className="opacity-[0.04] scale-150" />
      
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[0px] -z-10 w-[90%] max-w-[320px] pointer-events-none">
         <HouseBackgroundFlowers className="w-full h-auto opacity-40 drop-shadow-sm scale-[0.85] origin-bottom" />
      </div>

      <div className="max-w-[340px] w-full mx-auto relative z-10">
        <div className="text-center mb-10 flex flex-col items-center">
           <h3 className="font-heading text-4xl text-text-dark mb-4">Ucapan & Doa</h3>
           <FloralDivider />
        </div>

        <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="Nama Anda"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-white border border-sage/20 rounded-xl px-4 py-3.5 text-[13px] text-text-dark focus:border-sage outline-none transition-all placeholder:text-text-dark/30 shadow-sm"
          />
          <textarea 
            placeholder="Tulis ucapan dan doa Anda..."
            value={wishText}
            onChange={(e) => setWishText(e.target.value)}
            required
            rows={3}
            className="w-full bg-white border border-sage/20 rounded-xl px-4 py-3.5 text-[13px] text-text-dark focus:border-sage outline-none transition-all placeholder:text-text-dark/30 shadow-sm resize-none"
          />
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sage-dark text-white py-3.5 rounded-xl text-[13px] font-medium tracking-wide hover:bg-sage transition-colors disabled:opacity-70 shadow-sm cursor-pointer"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
          {wishes.map((wish, index) => (
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
        </div>
      </div>
    </section>
  );
}
