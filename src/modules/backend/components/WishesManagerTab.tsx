import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, Trash2, Search, RotateCcw, X, Tv, ExternalLink 
} from 'lucide-react';
import { Wish } from '../../../types';

export interface WishesManagerTabProps {
  wishes: Wish[];
  showToast: (type: 'success' | 'error', message: string) => void;
  onRequestDeleteWish: (wish: Wish) => void;
}

export function WishesManagerTab({
  wishes,
  onRequestDeleteWish,
}: WishesManagerTabProps) {
  const [wishSearchQuery, setWishSearchQuery] = useState('');

  // Saring data secara real-time in-memory (Pilar 5: Zero URL Pollution)
  const filteredWishes = useMemo(() => {
    if (!wishSearchQuery.trim()) return wishes;
    const q = wishSearchQuery.toLowerCase().trim();
    return wishes.filter(
      (w) =>
        w.name?.toLowerCase().includes(q) ||
        w.text?.toLowerCase().includes(q) ||
        w.time?.toLowerCase().includes(q)
    );
  }, [wishes, wishSearchQuery]);

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Live Projector Screen Link */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-text-dark">Moderasi Doa & Ucapan Restu</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Daftar seluruh kiriman doa dan restu dari tamu undangan ({wishes.length} ucapan masuk)
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.open('/live', '_blank')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Tv size={15} />
          <span>Buka Layar Proyektor Panggung</span>
          <ExternalLink size={13} />
        </button>
      </div>

      {/* In-Memory Live Search Bar */}
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={wishSearchQuery}
          onChange={(e) => setWishSearchQuery(e.target.value)}
          placeholder="Cari pengirim atau isi pesan doa ucapan..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all placeholder:text-gray-400 shadow-2xs"
        />
        {wishSearchQuery && (
          <button
            type="button"
            onClick={() => setWishSearchQuery('')}
            className="absolute right-3 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            title="Hapus filter pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Responsive Table */}
      {filteredWishes.length === 0 ? (
        <div className="text-center py-14 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-2 shadow-2xs">
          <MessageSquare size={36} className="text-gray-300" />
          <p className="text-xs text-gray-500 font-medium">
            {wishSearchQuery
              ? `Tidak ada ucapan yang cocok dengan "${wishSearchQuery}"`
              : 'Belum ada ucapan doa masuk.'}
          </p>
          {wishSearchQuery && (
            <button
              type="button"
              onClick={() => setWishSearchQuery('')}
              className="text-xs text-sage-dark hover:underline flex items-center gap-1 font-semibold mt-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Pencarian</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-4 w-44">Pengirim</th>
                <th className="py-3 px-4">Pesan Doa & Ucapan</th>
                <th className="py-3 px-3 text-center w-28">Waktu</th>
                <th className="py-3 px-3 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWishes.map((w, idx) => (
                <tr key={w.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-3.5 text-center text-gray-400 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-text-dark whitespace-nowrap">
                    {w.name}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 leading-relaxed italic">
                    "{w.text}"
                  </td>
                  <td className="py-3.5 px-3 text-center text-gray-400 text-[11px] whitespace-nowrap">
                    {w.time || '-'}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRequestDeleteWish(w)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus ucapan ini"
                      aria-label="Hapus ucapan ini"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
