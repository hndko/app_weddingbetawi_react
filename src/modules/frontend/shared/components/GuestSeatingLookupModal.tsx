import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, MapPin, Users, Crown, Sparkles, CheckCircle2, Armchair, HelpCircle } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { WeddingTable, TableZone } from '../../../../types';

interface GuestSeatingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGuestName?: string;
}

const ZONE_DESCRIPTIONS: Record<TableZone, { label: string; locationDesc: string; badgeColor: string }> = {
  vip_front: {
    label: 'Zona Depan (VIP & Pejabat)',
    locationDesc: 'Berada tepat di barisan depan menghadap panggung pelaminan pengantin.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  family_center: {
    label: 'Zona Tengah (Keluarga Inti)',
    locationDesc: 'Berada di area tengah ballroom dekat jalur karpet merah pengantin.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  regular_left: {
    label: 'Sayap Kiri (Sahabat & Teman)',
    locationDesc: 'Berada di area sayap kiri ballroom, dekat photobooth dan hiburan musik.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  regular_right: {
    label: 'Sayap Kanan (Kolega & Mitra)',
    locationDesc: 'Berada di area sayap kanan ballroom, dekat buffet prasmanan utama.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
};

export function GuestSeatingLookupModal({
  isOpen,
  onClose,
  defaultGuestName = '',
}: GuestSeatingLookupModalProps) {
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [searchQuery, setSearchQuery] = useState(defaultGuestName);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync tables from Firestore
  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'wedding_tables'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as WeddingTable[];
        setTables(list);
      },
      () => {}
    );
    return () => unsub();
  }, [isOpen]);

  // Set default search query when modal opens
  useEffect(() => {
    if (isOpen && defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setSearchQuery(defaultGuestName);
      setHasSearched(true);
    }
  }, [isOpen, defaultGuestName]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // In-memory search for assigned table
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();

    const matches: Array<{
      table: WeddingTable;
      guestName: string;
      pax: number;
      isVip?: boolean;
    }> = [];

    tables.forEach((t) => {
      (t.assignedGuests || []).forEach((g) => {
        if (g.name.toLowerCase().includes(q)) {
          matches.push({
            table: t,
            guestName: g.name,
            pax: g.pax || 1,
            isVip: g.isVip,
          });
        }
      });
    });

    return matches;
  }, [tables, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop click to dismiss */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#D4AF37]/30 shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative accent */}
            <div className="bg-gradient-to-r from-[#8C7851] via-[#D4AF37] to-[#8C7851] h-2 w-full" />

            {/* Header */}
            <div className="p-5 sm:p-6 pb-3 flex items-start justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center">
                  <Armchair size={20} />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Cari Meja & Denah Duduk
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ketahui nomor meja resepsi Anda sebelum tiba di ballroom
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
                title="Tutup"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ketik nama Anda sesuai undangan..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHasSearched(true);
                  }}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition bg-gray-50/50"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchQuery.trim() === '' ? (
                <div className="py-8 text-center bg-gray-50/70 rounded-2xl border border-dashed border-gray-200 p-6">
                  <Armchair size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    Masukkan nama Anda pada kotak pencarian di atas untuk melihat alokasi meja.
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-8 text-center bg-amber-50/50 rounded-2xl border border-amber-200/60 p-6">
                  <HelpCircle size={32} className="mx-auto text-amber-600 mb-2" />
                  <h4 className="font-heading text-sm font-bold text-gray-800">
                    Meja Belum Ditemukan
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Nama <strong>"{searchQuery}"</strong> belum dialokasikan ke nomor meja spesifik, atau Anda dapat menempati kursi reguler yang tersedia.
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2 italic">
                    Silakan tanyakan langsung kepada petugas penerima tamu (*usher*) saat tiba di meja resepsi.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-72 overflow-y-auto">
                  {searchResults.map((res, idx) => {
                    const zoneInfo = ZONE_DESCRIPTIONS[res.table.zone] || {
                      label: res.table.zone,
                      locationDesc: 'Area ballroom utama.',
                      badgeColor: 'bg-gray-100 text-gray-800',
                    };

                    return (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-white to-[#FBF9F5] rounded-2xl p-4 border border-amber-200/80 shadow-xs flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7851]">
                              Alokasi Meja Anda
                            </span>
                            <h4 className="text-base font-bold text-gray-900 leading-tight">
                              {res.guestName}
                            </h4>
                          </div>

                          {/* Table Number Pill */}
                          <div className="text-right">
                            <span className="inline-block px-3 py-1 rounded-xl bg-amber-600 text-white font-heading font-bold text-sm shadow-xs">
                              {res.table.number}
                            </span>
                          </div>
                        </div>

                        {/* Table Name & Pax */}
                        <div className="flex items-center gap-2 text-xs text-gray-700 bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/60">
                          <span className="font-semibold text-amber-900">{res.table.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-gray-600">
                            <Users size={12} className="text-amber-700" />
                            {res.pax} Kursi
                          </span>
                        </div>

                        {/* Zone & Location Guidance */}
                        <div className="text-xs text-gray-600 flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-amber-600 shrink-0" />
                            <span className="font-semibold text-gray-800">{zoneInfo.label}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 pl-4 leading-relaxed">
                            {zoneInfo.locationDesc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Footer Guidance */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px]">
                  Informasi diperbarui otomatis secara real-time
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
