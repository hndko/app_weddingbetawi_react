import React from "react";
import { useState } from 'react';
import { motion } from 'motion/react';

const initialWishes = [
  { name: 'Andi & Keluarga', text: 'Selamat menempuh hidup baru, semoga menjadi keluarga sakinah mawaddah warahmah.', time: '2 jam lalu' },
  { name: 'Siti', text: 'Happy wedding! Lancar-lancar terus yaa dan bahagia selalu.', time: '5 jam lalu' },
];

export function WishesSection() {
  const [wishes, setWishes] = useState(initialWishes);
  const [name, setName] = useState('');
  const [wishText, setWishText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !wishText) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setWishes([{ name, text: wishText, time: 'Baru saja' }, ...wishes]);
      setName('');
      setWishText('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section className="py-24 px-6 bg-warm-white relative">
      <div className="max-w-[340px] mx-auto">
        <div className="text-center mb-10">
           <h3 className="font-heading text-4xl text-text-dark mb-4">Ucapan & Doa</h3>
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
            className="w-full bg-sage-dark text-white py-3.5 rounded-xl text-[13px] font-medium tracking-wide hover:bg-sage transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
          </button>
        </form>

        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
          {wishes.map((wish, index) => (
            <motion.div 
              key={index}
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
