import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, Heart, MessageSquare, Check, Sparkles } from 'lucide-react';
import { api } from '../../../../../services/api';
import { socket } from '../../../../../services/socket';
import { useGuestName } from '../../../../../hooks/useGuestName';
import { RSVPPollSticker } from '../components/InteractiveStickers';
import { Wish } from '../../../../../types';
import { playStoryPop } from '../utils/instagramAudio';

const defaultMockWishes: Wish[] = [
  { id: '1', name: 'Dimas & Keluarga', text: 'Barakallahu lakuma! Bahagia selalu sampai kakek nenek! ❤️', time: '10m' },
  { id: '2', name: 'Siti Rahma', text: 'Selamat Cecep & Ipeh! Lancar sampai hari-H yaa!', time: '1h' },
];

export const WishesSlide: React.FC = () => {
  const defaultGuestName = useGuestName();
  const [wishes, setWishes] = useState<Wish[]>(defaultMockWishes);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setName(defaultGuestName);
    }
  }, [defaultGuestName]);

  // REST API + Socket.io Real-Time listener
  useEffect(() => {
    api.getWishes().then((data) => {
      if (data && data.length > 0) setWishes(data.slice(0, 20));
    }).catch(console.warn);

    const onCreated = (newWish: Wish) => {
      setWishes((prev) => [newWish, ...prev.filter((w) => w.id !== newWish.id)].slice(0, 20));
    };

    socket.on('wish:created', onCreated);
    return () => {
      socket.off('wish:created', onCreated);
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    playStoryPop();
    try {
      await api.createWish({
        name: name.trim(),
        text: text.trim(),
        time: 'Baru saja',
      });
      setText('');
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 2500);
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none bg-gradient-to-b from-[#181818] via-[#121212] to-[#0A0A0A] overflow-y-auto no-scrollbar">
      {/* Top Header Tag */}
      <div className="relative z-10 pt-10 text-center">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#00E676] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          STORY POLL &amp; WISHES
        </span>
      </div>

      {/* Center Content: Poll Sticker & Wishes List */}
      <div className="relative z-10 my-auto flex flex-col gap-3 max-w-[320px] mx-auto w-full py-2">
        {/* Instagram Poll Sticker for RSVP */}
        <RSVPPollSticker />

        {/* Story Replies Stream (Question Box style) */}
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-3 shadow-xl">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/10">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare size={11} className="text-[#FF0069]" />
              <span>Balasan Cerita ({wishes.length})</span>
            </span>
            <span className="text-[9px] text-[#00E676] font-semibold">Live Stream</span>
          </div>

          <div className="max-h-[140px] overflow-y-auto no-scrollbar space-y-2 pr-1">
            {wishes.map((w, idx) => (
              <div
                key={w.id || idx}
                className="bg-black/40 rounded-xl p-2.5 border border-white/5 text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-white truncate max-w-[170px]">
                    {w.name}
                  </span>
                  <span className="text-[9px] text-white/50">{w.time}</span>
                </div>
                <p className="text-[11px] text-white/90 leading-snug">{w.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reply to Story Input Form */}
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Balas cerita Cecep & Ipeh..."
            className="flex-1 pl-3.5 pr-10 py-2 rounded-full bg-white/15 border border-white/20 text-xs text-white placeholder:text-white/50 focus:outline-hidden focus:ring-2 focus:ring-[#FF0069]"
          />
          <button
            type="submit"
            disabled={isSubmitting || !text.trim()}
            className="absolute right-1 w-7 h-7 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#FF0069] disabled:opacity-40 text-white flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
            title="Kirim Balasan"
          >
            <Send size={12} className="ml-0.5" />
          </button>
        </form>

        {sentSuccess && (
          <p className="text-[10px] text-[#00E676] font-semibold text-center">
            Pesan doa Anda telah terkirim!
          </p>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <span className="text-[10px] text-white/60">
          Ketuk kiri untuk kembali ke awal
        </span>
      </div>
    </div>
  );
};
