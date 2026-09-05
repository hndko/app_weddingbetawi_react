import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, MapPin, Users, Crown, Sparkles,
  Armchair, HelpCircle, LayoutGrid, Compass, Info
} from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import type { WeddingTable, TableZone } from '../../../../types';

interface GuestSeatingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultGuestName?: string;
}

const ZONE_DESCRIPTIONS: Record<TableZone, { label: string; locationDesc: string; badgeColor: string; dotColor: string }> = {
  vip_front: {
    label: 'Zona Depan (VIP & Pejabat)',
    locationDesc: 'Tepat di barisan depan menghadap panggung pelaminan utama.',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    dotColor: '#D97706',
  },
  family_center: {
    label: 'Zona Tengah (Keluarga Inti)',
    locationDesc: 'Di area tengah ballroom dekat jalur karpet merah pengantin.',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    dotColor: '#059669',
  },
  regular_left: {
    label: 'Sayap Kiri (Sahabat & Teman)',
    locationDesc: 'Area sayap kiri ballroom, dekat panggung musik & photobooth.',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    dotColor: '#2563EB',
  },
  regular_right: {
    label: 'Sayap Kanan (Kolega & Mitra)',
    locationDesc: 'Area sayap kanan ballroom, dekat area buffet dan hidangan utama.',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    dotColor: '#7C3AED',
  },
};

const DEFAULT_PRESET_TABLES: WeddingTable[] = [
  {
    id: 'preset-vip-01',
    number: 'VIP-01',
    name: 'VIP Utama & Tamu Kehormatan',
    shape: 'vip_stage',
    zone: 'vip_front',
    capacity: 10,
    assignedGuests: [
      { id: '1', name: 'Bapak H. Sukardi & Ibu', pax: 2, isVip: true },
      { id: '2', name: 'Keluarga Bapak Budi', pax: 4, isVip: true },
      { id: '3', name: 'Prof. Dr. Bambang Hermanto', pax: 2, isVip: true },
    ],
    notes: 'Posisi persis depan panggung pelaminan, layanan table service',
    posX: 28,
    posY: 22,
  },
  {
    id: 'preset-vip-02',
    number: 'VIP-02',
    name: 'VIP Sesepuh & Tokoh Adat',
    shape: 'vip_stage',
    zone: 'vip_front',
    capacity: 10,
    assignedGuests: [
      { id: '4', name: 'Keluarga Besar Tokoh Adat', pax: 6, isVip: true },
      { id: '5', name: 'Drs. H. Ridwan Kamil & Rekan', pax: 2, isVip: true },
    ],
    notes: 'Posisi depan panggung sisi kanan, ramah lansia & akses mudah',
    posX: 72,
    posY: 22,
  },
  {
    id: 'preset-fam-01',
    number: 'FAM-01',
    name: 'Keluarga Inti Pria',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [
      { id: '6', name: 'Om Hendra & Tante Dewi', pax: 2 },
      { id: '7', name: 'Keluarga Dimas Pratama', pax: 4 },
    ],
    notes: 'Meja bundar keluarga utama pihak pria',
    posX: 22,
    posY: 46,
  },
  {
    id: 'preset-fam-02',
    number: 'FAM-02',
    name: 'Keluarga Besar Pria',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [
      { id: '8', name: 'Budi Santoso & Keluarga', pax: 3 },
      { id: '9', name: 'Paman Joko & Istri', pax: 2 },
    ],
    notes: 'Paman, bibi, dan sepupu keluarga pria',
    posX: 40,
    posY: 46,
  },
  {
    id: 'preset-fam-03',
    number: 'FAM-03',
    name: 'Keluarga Inti Wanita',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [
      { id: '10', name: 'Keluarga Ibu Hj. Siti', pax: 4 },
      { id: '11', name: 'dr. Anisa & Suami', pax: 2 },
    ],
    notes: 'Meja bundar keluarga utama pihak wanita',
    posX: 60,
    posY: 46,
  },
  {
    id: 'preset-fam-04',
    number: 'FAM-04',
    name: 'Keluarga Besar Wanita',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [
      { id: '12', name: 'Tante Rina & Anak', pax: 3 },
      { id: '13', name: 'Keluarga Besar Bandung', pax: 4 },
    ],
    notes: 'Paman, bibi, dan sepupu keluarga wanita',
    posX: 78,
    posY: 46,
  },
  {
    id: 'preset-reg-01',
    number: 'REG-01',
    name: 'Sahabat & Teman Kampus',
    shape: 'round',
    zone: 'regular_left',
    capacity: 10,
    assignedGuests: [
      { id: '14', name: 'Rizky & Rombongan Kampus', pax: 6 },
    ],
    notes: 'Dekat area hiburan musik dan photobooth',
    posX: 26,
    posY: 72,
  },
  {
    id: 'preset-reg-02',
    number: 'REG-02',
    name: 'Rekan Kerja & Mitra Kantor',
    shape: 'round',
    zone: 'regular_right',
    capacity: 10,
    assignedGuests: [
      { id: '15', name: 'Tim Divisi IT & Digital', pax: 7 },
    ],
    notes: 'Dekat area buffet dan coffee corner',
    posX: 74,
    posY: 72,
  },
];

export function GuestSeatingLookupModal({
  isOpen,
  onClose,
  defaultGuestName = '',
}: GuestSeatingLookupModalProps) {
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'floorplan'>('search');
  const [searchQuery, setSearchQuery] = useState(defaultGuestName);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Sync tables from Firestore with fallback to presets
  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'wedding_tables'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as WeddingTable[];
          setTables(list);
        } else {
          setTables(DEFAULT_PRESET_TABLES);
        }
      },
      () => {
        setTables(DEFAULT_PRESET_TABLES);
      }
    );
    return () => unsub();
  }, [isOpen]);

  // Set default search query when modal opens
  useEffect(() => {
    if (isOpen && defaultGuestName && defaultGuestName !== 'Tamu Undangan') {
      setSearchQuery(defaultGuestName);
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

  // Active tables list (use state tables or presets fallback)
  const effectiveTables = tables.length > 0 ? tables : DEFAULT_PRESET_TABLES;

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

    effectiveTables.forEach((t) => {
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
  }, [effectiveTables, searchQuery]);

  // Handle navigate to table on floor plan
  const handleViewOnFloorPlan = (table: WeddingTable) => {
    setSelectedTableId(table.id || table.number);
    setActiveTab('floorplan');
  };

  const selectedTable = useMemo(() => {
    if (!selectedTableId) return null;
    return effectiveTables.find((t) => (t.id || t.number) === selectedTableId) || null;
  }, [effectiveTables, selectedTableId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop click to dismiss */}
          <div className="fixed inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl border border-[#D4AF37]/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative accent */}
            <div className="bg-gradient-to-r from-[#8C7851] via-[#D4AF37] to-[#8C7851] h-2 w-full shrink-0" />

            {/* Header */}
            <div className="p-4 sm:p-5 pb-3 flex items-start justify-between border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <Armchair size={20} />
                </span>
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    Cari Meja & Denah Duduk
                  </h3>
                  <p className="text-xs text-gray-500">
                    Alokasi nomor meja & tata ruang ballroom resepsi
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

            {/* Tab Navigation */}
            <div className="flex items-center border-b border-gray-200 px-4 pt-2 bg-gray-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === 'search'
                    ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Search size={14} />
                <span>Pencarian Nama</span>
                {searchResults.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
                    {searchResults.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('floorplan')}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === 'floorplan'
                    ? 'border-amber-600 text-amber-800 bg-white rounded-t-lg'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Denah Visual 2D</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                  {effectiveTables.length} Meja
                </span>
              </button>
            </div>

            {/* Content Scrollable Area */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto no-scrollbar">
              {activeTab === 'search' ? (
                /* Search Tab */
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Ketik nama Anda sesuai undangan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition bg-gray-50/50"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

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
                        Nama <strong>"{searchQuery}"</strong> belum dialokasikan ke meja khusus, atau Anda dapat menempati kursi reguler yang tersedia.
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('floorplan')}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700 transition cursor-pointer"
                      >
                        <LayoutGrid size={13} />
                        <span>Lihat Semua Meja di Denah</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {searchResults.map((res, idx) => {
                        const zoneInfo = ZONE_DESCRIPTIONS[res.table.zone] || {
                          label: res.table.zone,
                          locationDesc: 'Area ballroom utama.',
                          badgeColor: 'bg-gray-100 text-gray-800',
                          dotColor: '#666666',
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

                            {/* Jump to Floor Plan Button */}
                            <button
                              type="button"
                              onClick={() => handleViewOnFloorPlan(res.table)}
                              className="mt-1 w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                            >
                              <Compass size={14} className="text-amber-700" />
                              <span>Sorot Posisi Meja di Denah 2D</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* Interactive 2D Floor Plan Tab */
                <div className="flex flex-col gap-3">
                  {/* Legend Info */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-gray-600 font-medium">VIP Depan</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-gray-600 font-medium">Keluarga</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-gray-600 font-medium">Sahabat (Kiri)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-gray-600 font-medium">Mitra (Kanan)</span>
                    </div>
                  </div>

                  {/* 2D Interactive Ballroom Canvas Container */}
                  <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#1E293B] to-[#0F172A] rounded-2xl border-2 border-amber-400/40 p-3 shadow-inner overflow-hidden select-none">
                    {/* Top Stage / Pelaminan */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[70%] py-1 px-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-lg text-center shadow-md border border-yellow-200 z-10 flex items-center justify-center gap-1">
                      <Crown size={12} className="text-slate-900" />
                      <span className="text-[10px] font-bold text-slate-950 uppercase tracking-widest">
                        PANGGUNG PELAMINAN PENGANTIN
                      </span>
                    </div>

                    {/* Red Carpet / Main Aisle */}
                    <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-[16%] bg-red-700/60 border-x border-dashed border-red-400/50 z-0 flex flex-col items-center justify-around py-3">
                      <span className="text-[8px] text-red-200 uppercase font-mono tracking-widest rotate-90 whitespace-nowrap opacity-60">
                        KARPET MERAH
                      </span>
                    </div>

                    {/* Left Wing: Photo Booth & Music */}
                    <div className="absolute top-12 left-2 px-1.5 py-2 bg-slate-800/80 border border-slate-700 rounded text-center">
                      <span className="text-[8px] text-slate-300 block font-semibold">PHOTO BOOTH</span>
                      <span className="text-[7px] text-slate-400 block">&amp; LIVE MUSIC</span>
                    </div>

                    {/* Right Wing: Buffet Prasmanan */}
                    <div className="absolute top-12 right-2 px-1.5 py-2 bg-slate-800/80 border border-slate-700 rounded text-center">
                      <span className="text-[8px] text-slate-300 block font-semibold">BUFFET UTAMA</span>
                      <span className="text-[7px] text-slate-400 block">&amp; COFFEE BAR</span>
                    </div>

                    {/* Bottom Entrance */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-slate-700/90 border border-slate-600 rounded text-center z-10">
                      <span className="text-[9px] text-amber-200 font-semibold tracking-wider">
                        ▲ PINTU MASUK UTAMA ▲
                      </span>
                    </div>

                    {/* Tables Nodes */}
                    {effectiveTables.map((table) => {
                      const isSelected = selectedTableId === (table.id || table.number);
                      const zoneInfo = ZONE_DESCRIPTIONS[table.zone] || {
                        dotColor: '#EAB308',
                        label: table.zone,
                      };

                      const leftPercent = table.posX ?? 50;
                      const topPercent = table.posY ?? 50;

                      return (
                        <motion.button
                          key={table.id || table.number}
                          type="button"
                          onClick={() => setSelectedTableId(table.id || table.number)}
                          style={{
                            left: `${leftPercent}%`,
                            top: `${topPercent}%`,
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center z-20 cursor-pointer transition-shadow shadow-md ${
                            isSelected
                              ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-900 bg-white text-slate-900 shadow-xl'
                              : 'bg-slate-800/90 hover:bg-slate-700 text-white border-2'
                          }`}
                        >
                          <div
                            className="w-full h-full rounded-full flex flex-col items-center justify-center p-0.5 border"
                            style={{ borderColor: zoneInfo.dotColor }}
                          >
                            <span
                              className={`text-[8.5px] font-black leading-none ${
                                isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-100'
                              }`}
                            >
                              {table.number}
                            </span>
                            <span className="text-[7px] text-amber-400 font-mono mt-0.5 leading-none">
                              {table.assignedGuests?.length || 0}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Selected Table Inspection Card */}
                  {selectedTable ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-amber-50/90 rounded-2xl p-4 border border-amber-300 shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-600 text-white text-xs font-heading font-bold">
                              {selectedTable.number}
                            </span>
                            <h4 className="font-bold text-gray-900 text-sm">
                              {selectedTable.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-1">
                            {ZONE_DESCRIPTIONS[selectedTable.zone]?.locationDesc || selectedTable.notes}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-xl">
                          {selectedTable.assignedGuests?.length || 0} / {selectedTable.capacity} Kursi
                        </span>
                      </div>

                      {/* Guest list for this table */}
                      {selectedTable.assignedGuests && selectedTable.assignedGuests.length > 0 && (
                        <div className="mt-1 pt-2 border-t border-amber-200/80">
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider block mb-1">
                            Daftar Tamu Semeja:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedTable.assignedGuests.map((g, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[11px] bg-white px-2.5 py-1 rounded-lg border border-amber-200 text-gray-800 shadow-2xs font-medium"
                              >
                                {g.isVip && <Crown size={10} className="text-amber-600" />}
                                <span>{g.name}</span>
                                <span className="text-gray-400 text-[9px]">({g.pax}pax)</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center py-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-500">
                      Sentuh salah satu meja pada denah di atas untuk melihat detail & tamu semeja.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-gray-100 flex items-center justify-between text-xs shrink-0 bg-gray-50/50">
              <span className="text-gray-400 text-[11px] flex items-center gap-1">
                <Info size={12} />
                Real-time synchronized
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
