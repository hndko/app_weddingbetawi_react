import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Plus, Trash2, Edit2, Download, Search, CheckCircle2,
  AlertCircle, Sparkles, X, Check, AlertTriangle, Crown,
  Layers, MapPin, UserPlus, UserX, ArrowRight, CornerDownRight,
  ChevronRight, RefreshCw, Info, HelpCircle
} from 'lucide-react';
import {
  collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc,
  deleteDoc, serverTimestamp, writeBatch
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import {
  WeddingTable, TableShape, TableZone, TableGuestAssignment,
  GuestInvitation, RSVPResponse
} from '../../../types';

interface SeatingChartManagerProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

const ZONE_LABELS: Record<TableZone, { label: string; badgeColor: string; icon: string }> = {
  vip_front: { label: 'Zona Depan (VIP & Pejabat)', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300', icon: '👑' },
  family_center: { label: 'Zona Tengah (Keluarga Inti)', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: '👨‍👩‍👧‍👦' },
  regular_left: { label: 'Sayap Kiri (Sahabat & Teman)', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300', icon: '👥' },
  regular_right: { label: 'Sayap Kanan (Kolega & Mitra)', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300', icon: '🏢' },
};

const SHAPE_LABELS: Record<TableShape, { label: string; desc: string }> = {
  round: { label: 'Meja Bundar (Round)', desc: 'Ideal 8 - 10 Kursi' },
  long: { label: 'Meja Panjang (Long)', desc: 'Ideal 10 - 12 Kursi' },
  vip_stage: { label: 'Meja VIP Panggung', desc: 'Dekat Pelaminan Utama' },
};

const DEFAULT_TABLE_PRESETS: Array<Omit<WeddingTable, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    number: 'VIP-01',
    name: 'VIP Utama & Tamu Kehormatan',
    shape: 'vip_stage',
    zone: 'vip_front',
    capacity: 10,
    assignedGuests: [],
    notes: 'Posisi persis depan panggung pelaminan, layanan table service',
    posX: 30,
    posY: 15,
  },
  {
    number: 'VIP-02',
    name: 'VIP Sesepuh & Tokoh Adat',
    shape: 'vip_stage',
    zone: 'vip_front',
    capacity: 10,
    assignedGuests: [],
    notes: 'Posisi depan panggung sisi kanan, ramah lansia & akses mudah',
    posX: 70,
    posY: 15,
  },
  {
    number: 'FAM-01',
    name: 'Keluarga Inti Mempelai Pria',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [],
    notes: 'Meja bundar keluarga utama pihak pria',
    posX: 25,
    posY: 40,
  },
  {
    number: 'FAM-02',
    name: 'Keluarga Besar Mempelai Pria',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [],
    notes: 'Paman, bibi, dan sepupu keluarga pria',
    posX: 45,
    posY: 40,
  },
  {
    number: 'FAM-03',
    name: 'Keluarga Inti Mempelai Wanita',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [],
    notes: 'Meja bundar keluarga utama pihak wanita',
    posX: 65,
    posY: 40,
  },
  {
    number: 'FAM-04',
    name: 'Keluarga Besar Mempelai Wanita',
    shape: 'round',
    zone: 'family_center',
    capacity: 8,
    assignedGuests: [],
    notes: 'Paman, bibi, dan sepupu keluarga wanita',
    posX: 85,
    posY: 40,
  },
  {
    number: 'REG-01',
    name: 'Sahabat Kuliah & Kampus',
    shape: 'round',
    zone: 'regular_left',
    capacity: 8,
    assignedGuests: [],
    notes: 'Alumni rekan kampus mempelai',
    posX: 20,
    posY: 68,
  },
  {
    number: 'REG-02',
    name: 'Teman SMA & Komunitas',
    shape: 'round',
    zone: 'regular_left',
    capacity: 8,
    assignedGuests: [],
    notes: 'Teman sekolah & hobi mempelai',
    posX: 40,
    posY: 68,
  },
  {
    number: 'REG-03',
    name: 'Rekan Kerja & Kantor Pria',
    shape: 'round',
    zone: 'regular_left',
    capacity: 8,
    assignedGuests: [],
    notes: 'Teman satu divisi dan tim kerja',
    posX: 20,
    posY: 88,
  },
  {
    number: 'REG-04',
    name: 'Rekan Kerja & Kantor Wanita',
    shape: 'round',
    zone: 'regular_right',
    capacity: 8,
    assignedGuests: [],
    notes: 'Teman kantor dan rekan sejawat wanita',
    posX: 60,
    posY: 68,
  },
  {
    number: 'REG-05',
    name: 'Tetangga & Tokoh Warga',
    shape: 'round',
    zone: 'regular_right',
    capacity: 8,
    assignedGuests: [],
    notes: 'Aparatur RT/RW dan tetangga lingkungan rumah',
    posX: 80,
    posY: 68,
  },
  {
    number: 'REG-06',
    name: 'Tamu Umum & Mitra Bisnis',
    shape: 'round',
    zone: 'regular_right',
    capacity: 8,
    assignedGuests: [],
    notes: 'Kolega, vendor partner, dan relasi umum',
    posX: 80,
    posY: 88,
  },
];

export function SeatingChartManager({ onNotify }: SeatingChartManagerProps) {
  // State: Tables from Firestore
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [loadingTables, setLoadingTables] = useState(true);

  // State: Guests from Firestore (guest_invitations & rsvps)
  const [invitations, setInvitations] = useState<GuestInvitation[]>([]);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);

  // Filtering & View state
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<'all' | TableZone>('all');
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [unassignedSearchQuery, setUnassignedSearchQuery] = useState('');
  const [isUnassignedDrawerOpen, setIsUnassignedDrawerOpen] = useState(false);

  // Modal: Add / Edit Table
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<WeddingTable | null>(null);
  const [tableFormNumber, setTableFormNumber] = useState('');
  const [tableFormName, setTableFormName] = useState('');
  const [tableFormShape, setTableFormShape] = useState<TableShape>('round');
  const [tableFormZone, setTableFormZone] = useState<TableZone>('regular_left');
  const [tableFormCapacity, setTableFormCapacity] = useState<number>(8);
  const [tableFormNotes, setTableFormNotes] = useState('');
  const [isSavingTable, setIsSavingTable] = useState(false);

  // Modal: Table Details & Guest Allocation
  const [inspectingTable, setInspectingTable] = useState<WeddingTable | null>(null);

  // SweetAlert Confirmations
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<WeddingTable | null>(null);
  const [isDeletingTable, setIsDeletingTable] = useState(false);

  const [isPresetConfirmOpen, setIsPresetConfirmOpen] = useState(false);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);

  // 1. Subscribe to Firestore collections
  useEffect(() => {
    const qTables = query(collection(db, 'wedding_tables'), orderBy('number', 'asc'));
    const unsubTables = onSnapshot(
      qTables,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as WeddingTable[];
        setTables(list);
        setLoadingTables(false);

        // Keep inspecting table up-to-date if open
        setInspectingTable((prev) => {
          if (!prev || !prev.id) return prev;
          return list.find((t) => t.id === prev.id) || null;
        });
      },
      () => {
        setLoadingTables(false);
      }
    );

    const qInvites = query(collection(db, 'guests'), orderBy('createdAt', 'desc'));
    const unsubInvites = onSnapshot(qInvites, (snapshot) => {
      setInvitations(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GuestInvitation))
      );
    });

    const qRsvps = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const unsubRsvps = onSnapshot(qRsvps, (snapshot) => {
      setRsvps(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as RSVPResponse))
      );
    });

    return () => {
      unsubTables();
      unsubInvites();
      unsubRsvps();
    };
  }, []);

  // 2. Lock body scroll on open modal
  useEffect(() => {
    const hasOpenModal =
      isTableModalOpen ||
      inspectingTable !== null ||
      deleteConfirmTarget !== null ||
      isPresetConfirmOpen;

    if (hasOpenModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isTableModalOpen, inspectingTable, deleteConfirmTarget, isPresetConfirmOpen]);

  // 3. Compute Map of assigned guest names
  const assignedGuestIdsOrNames = useMemo(() => {
    const set = new Set<string>();
    tables.forEach((t) => {
      t.assignedGuests?.forEach((g) => {
        if (g.id) set.add(g.id.toLowerCase().trim());
        if (g.name) set.add(g.name.toLowerCase().trim());
      });
    });
    return set;
  }, [tables]);

  // 4. Compute unassigned guest list (combines guest_invitations & rsvps)
  const unassignedGuests = useMemo(() => {
    const list: Array<{ id: string; name: string; pax: number; source: string }> = [];
    const seen = new Set<string>();

    // From invitations
    invitations.forEach((inv) => {
      const norm = (inv.name || '').toLowerCase().trim();
      if (!norm || seen.has(norm)) return;
      seen.add(norm);

      if (!assignedGuestIdsOrNames.has(norm) && !assignedGuestIdsOrNames.has(inv.id || '')) {
        list.push({
          id: inv.id || norm,
          name: inv.name,
          pax: 2, // default invitation pax
          source: 'Daftar Undangan',
        });
      }
    });

    // From RSVPs (if not already captured)
    rsvps.forEach((rsvp) => {
      const norm = (rsvp.name || '').toLowerCase().trim();
      if (!norm || seen.has(norm)) return;
      seen.add(norm);

      if (!assignedGuestIdsOrNames.has(norm) && rsvp.attendance === 'attending') {
        list.push({
          id: rsvp.id || norm,
          name: rsvp.name,
          pax: rsvp.guestCount || 1,
          source: 'Konfirmasi RSVP',
        });
      }
    });

    return list;
  }, [invitations, rsvps, assignedGuestIdsOrNames]);

  // Filtered unassigned guests
  const filteredUnassignedGuests = useMemo(() => {
    if (!unassignedSearchQuery.trim()) return unassignedGuests;
    const q = unassignedSearchQuery.toLowerCase();
    return unassignedGuests.filter((g) => g.name.toLowerCase().includes(q));
  }, [unassignedGuests, unassignedSearchQuery]);

  // 5. Compute KPIs
  const kpis = useMemo(() => {
    const totalCapacity = tables.reduce((acc, t) => acc + (t.capacity || 0), 0);
    const totalAssignedPax = tables.reduce(
      (acc, t) => acc + (t.assignedGuests || []).reduce((sum, g) => sum + (g.pax || 1), 0),
      0
    );
    const availableSeats = Math.max(0, totalCapacity - totalAssignedPax);
    const unassignedCount = unassignedGuests.length;
    const fillPercent = totalCapacity > 0 ? Math.round((totalAssignedPax / totalCapacity) * 100) : 0;

    return {
      totalCapacity,
      totalAssignedPax,
      availableSeats,
      unassignedCount,
      fillPercent,
    };
  }, [tables, unassignedGuests]);

  // 6. Filtered tables for floor plan / list
  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      if (selectedZoneFilter !== 'all' && table.zone !== selectedZoneFilter) return false;
      if (tableSearchQuery.trim()) {
        const q = tableSearchQuery.toLowerCase();
        const inNum = table.number.toLowerCase().includes(q);
        const inName = table.name.toLowerCase().includes(q);
        const inGuest = (table.assignedGuests || []).some((g) => g.name.toLowerCase().includes(q));
        if (!inNum && !inName && !inGuest) return false;
      }
      return true;
    });
  }, [tables, selectedZoneFilter, tableSearchQuery]);

  // 7. Reset Form
  const resetTableForm = () => {
    setEditingTable(null);
    setTableFormNumber(`Meja ${String(tables.length + 1).padStart(2, '0')}`);
    setTableFormName('');
    setTableFormShape('round');
    setTableFormZone('regular_left');
    setTableFormCapacity(8);
    setTableFormNotes('');
  };

  const handleOpenAddModal = () => {
    resetTableForm();
    setIsTableModalOpen(true);
  };

  const handleOpenEditModal = (table: WeddingTable) => {
    setEditingTable(table);
    setTableFormNumber(table.number);
    setTableFormName(table.name);
    setTableFormShape(table.shape);
    setTableFormZone(table.zone);
    setTableFormCapacity(table.capacity);
    setTableFormNotes(table.notes || '');
    setIsTableModalOpen(true);
  };

  // 8. Submit Add / Edit Table
  const handleSaveTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableFormNumber.trim() || !tableFormName.trim()) {
      onNotify?.('Nomor meja dan nama meja wajib diisi!', 'error');
      return;
    }

    setIsSavingTable(true);
    try {
      if (editingTable?.id) {
        // Update existing table
        await updateDoc(doc(db, 'wedding_tables', editingTable.id), {
          number: tableFormNumber.trim(),
          name: tableFormName.trim(),
          shape: tableFormShape,
          zone: tableFormZone,
          capacity: Number(tableFormCapacity) || 8,
          notes: tableFormNotes.trim(),
          updatedAt: serverTimestamp(),
        });
        onNotify?.(`Meja ${tableFormNumber} berhasil diperbarui`, 'success');
      } else {
        // Add new table
        await addDoc(collection(db, 'wedding_tables'), {
          number: tableFormNumber.trim(),
          name: tableFormName.trim(),
          shape: tableFormShape,
          zone: tableFormZone,
          capacity: Number(tableFormCapacity) || 8,
          assignedGuests: [],
          notes: tableFormNotes.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        onNotify?.(`Meja baru ${tableFormNumber} berhasil ditambahkan`, 'success');
      }
      setIsTableModalOpen(false);
      resetTableForm();
    } catch {
      onNotify?.('Terjadi kesalahan saat menyimpan data meja', 'error');
    } finally {
      setIsSavingTable(false);
    }
  };

  // 9. Delete Table
  const handleDeleteTable = async () => {
    if (!deleteConfirmTarget?.id) return;
    setIsDeletingTable(true);
    try {
      await deleteDoc(doc(db, 'wedding_tables', deleteConfirmTarget.id));
      onNotify?.(`Meja ${deleteConfirmTarget.number} berhasil dihapus`, 'success');
      setDeleteConfirmTarget(null);
      if (inspectingTable?.id === deleteConfirmTarget.id) {
        setInspectingTable(null);
      }
    } catch {
      onNotify?.('Gagal menghapus meja', 'error');
    } finally {
      setIsDeletingTable(false);
    }
  };

  // 10. Load 12 Preset Tables
  const handleLoadPresets = async () => {
    setIsLoadingPresets(true);
    try {
      const batch = writeBatch(db);

      // Clean old tables if any
      tables.forEach((t) => {
        if (t.id) {
          batch.delete(doc(db, 'wedding_tables', t.id));
        }
      });

      // Insert 12 standard ballroom tables
      DEFAULT_TABLE_PRESETS.forEach((preset) => {
        const newDocRef = doc(collection(db, 'wedding_tables'));
        batch.set(newDocRef, {
          ...preset,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      onNotify?.('12 Meja Ballroom Standar berhasil dimuat!', 'success');
      setIsPresetConfirmOpen(false);
    } catch {
      onNotify?.('Gagal memuat template meja', 'error');
    } finally {
      setIsLoadingPresets(false);
    }
  };

  // 11. Assign Guest to Table
  const handleAssignGuestToTable = async (
    targetTable: WeddingTable,
    guest: { id: string; name: string; pax: number },
    isVip = false
  ) => {
    if (!targetTable.id) return;

    const existing = targetTable.assignedGuests || [];
    if (existing.some((g) => g.name.toLowerCase() === guest.name.toLowerCase())) {
      onNotify?.(`${guest.name} sudah terdaftar di meja ini`, 'error');
      return;
    }

    const currentTotalPax = existing.reduce((sum, g) => sum + (g.pax || 1), 0);
    if (currentTotalPax + guest.pax > targetTable.capacity) {
      onNotify?.(
        `Perhatian: Kapasitas meja ${targetTable.number} terlampaui (${currentTotalPax + guest.pax}/${targetTable.capacity})`,
        'error'
      );
    }

    const updatedGuests: TableGuestAssignment[] = [
      ...existing,
      {
        id: guest.id,
        name: guest.name,
        pax: guest.pax || 1,
        isVip,
      },
    ];

    try {
      await updateDoc(doc(db, 'wedding_tables', targetTable.id), {
        assignedGuests: updatedGuests,
        updatedAt: serverTimestamp(),
      });

      // Also sync tableNumber to guests collection if guest exists there
      const matchedInvite = invitations.find(
        (inv) => inv.name.toLowerCase() === guest.name.toLowerCase() || inv.id === guest.id
      );
      if (matchedInvite?.id) {
        await updateDoc(doc(db, 'guests', matchedInvite.id), {
          tableNumber: targetTable.number,
        });
      }

      onNotify?.(`${guest.name} (${guest.pax} pax) dialokasikan ke ${targetTable.number}`, 'success');
    } catch {
      onNotify?.('Gagal mengalokasikan tamu ke meja', 'error');
    }
  };

  // 12. Remove Guest from Table
  const handleRemoveGuestFromTable = async (targetTable: WeddingTable, guestName: string) => {
    if (!targetTable.id) return;
    const existing = targetTable.assignedGuests || [];
    const updated = existing.filter((g) => g.name.toLowerCase() !== guestName.toLowerCase());

    try {
      await updateDoc(doc(db, 'wedding_tables', targetTable.id), {
        assignedGuests: updated,
        updatedAt: serverTimestamp(),
      });

      // Clear tableNumber on guests collection if exists
      const matchedInvite = invitations.find(
        (inv) => inv.name.toLowerCase() === guestName.toLowerCase()
      );
      if (matchedInvite?.id) {
        await updateDoc(doc(db, 'guests', matchedInvite.id), {
          tableNumber: '',
        });
      }

      onNotify?.(`Tamu ${guestName} dilepas dari ${targetTable.number}`, 'success');
    } catch {
      onNotify?.('Gagal melepas tamu dari meja', 'error');
    }
  };

  // 13. Export CSV
  const handleExportCSV = () => {
    if (tables.length === 0) {
      onNotify?.('Belum ada data meja untuk diekspor', 'error');
      return;
    }

    const rows: string[] = [];
    rows.push('No,Nomor Meja,Nama Meja,Bentuk,Zona,Kapasitas,Nama Tamu,Pax,Status VIP,Catatan Meja');

    let counter = 1;
    tables.forEach((t) => {
      const zoneName = ZONE_LABELS[t.zone]?.label || t.zone;
      const shapeName = SHAPE_LABELS[t.shape]?.label || t.shape;
      const notes = (t.notes || '').replace(/"/g, '""');

      if (!t.assignedGuests || t.assignedGuests.length === 0) {
        rows.push(
          `${counter++},"${t.number}","${t.name}","${shapeName}","${zoneName}",${t.capacity},"(Kosong)",0,"Tidak","${notes}"`
        );
      } else {
        t.assignedGuests.forEach((g) => {
          rows.push(
            `${counter++},"${t.number}","${t.name}","${shapeName}","${zoneName}",${t.capacity},"${g.name}",${g.pax},"${g.isVip ? 'VIP' : 'Reguler'}","${notes}"`
          );
        });
      }
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(rows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `Seating_Chart_Ballroom_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify?.('Berkas CSV Seating Chart berhasil diunduh', 'success');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. HEADER & TOP ACTION TOOLBAR */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <Layers size={18} />
            </span>
            <h2 className="font-heading text-xl font-bold text-gray-900">
              Manajemen Meja & Seating Chart Ballroom
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Tata letak denah ballroom visual, alokasi kursi VIP & keluarga, pemantauan kapasitas terisi real-time, dan sinkronisasi otomatis ke tiket QR tamu.
          </p>
        </div>

        {/* Dual Button Rule: Icon + Text */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setIsPresetConfirmOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 transition shadow-xs cursor-pointer"
            title="Muat 12 meja preset siap pakai"
          >
            <Sparkles size={15} className="text-amber-700" />
            <span>Template Ballroom (12 Meja)</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition shadow-xs cursor-pointer"
            title="Ekspor CSV untuk Liaison Officer / Usher"
          >
            <Download size={15} className="text-gray-600" />
            <span>Ekspor CSV Usher</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-sage-dark text-white hover:bg-sage-dark/90 transition shadow-xs cursor-pointer"
          >
            <Plus size={15} />
            <span>Tambah Meja Baru</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. STATS & CAPACITY KPI CARDS */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Kapasitas Kursi */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Total Kapasitas Ballroom</span>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <Users size={18} />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-gray-900 font-sans">
              {kpis.totalCapacity} <span className="text-xs font-normal text-gray-500">Kursi</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              Dari {tables.length} meja aktif di ballroom
            </p>
          </div>
        </div>

        {/* KPI 2: Kursi Terisi / Dialokasikan */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Kursi Terisi / Dialokasikan</span>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-emerald-700 font-sans">
                {kpis.totalAssignedPax} <span className="text-xs font-normal text-gray-500">Pax</span>
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-sans">
                {kpis.fillPercent}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, kpis.fillPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Kursi Tersedia */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Kursi Masih Tersedia</span>
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Sparkles size={18} />
            </span>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-amber-700 font-sans">
              {kpis.availableSeats} <span className="text-xs font-normal text-gray-500">Kursi</span>
            </h3>
            <p className="text-[11px] text-gray-500 mt-1">
              Dapat ditempati tamu undangan baru
            </p>
          </div>
        </div>

        {/* KPI 4: Tamu Belum Dialokasikan */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Tamu Belum Dapat Meja</span>
            <span className="p-2 bg-rose-50 text-rose-700 rounded-xl">
              <UserX size={18} />
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-rose-600 font-sans">
                {kpis.unassignedCount} <span className="text-xs font-normal text-gray-500">Tamu</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsUnassignedDrawerOpen(true)}
                className="text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-lg transition cursor-pointer"
              >
                Buka Drawer
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Dari buku tamu & konfirmasi hadir
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. CONTROLS: SEARCH & ZONE FILTERS */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nomor meja, nama meja, atau nama tamu..."
            value={tableSearchQuery}
            onChange={(e) => setTableSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark transition bg-gray-50/50"
          />
          {tableSearchQuery && (
            <button
              type="button"
              onClick={() => setTableSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Zone Filter Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setSelectedZoneFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap ${
              selectedZoneFilter === 'all'
                ? 'bg-sage-dark text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua Zona ({tables.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedZoneFilter('vip_front')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedZoneFilter === 'vip_front'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            <span>👑 VIP Depan</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedZoneFilter('family_center')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedZoneFilter === 'family_center'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <span>👨‍👩‍👧‍👦 Keluarga</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedZoneFilter('regular_left')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedZoneFilter === 'regular_left'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <span>👥 Sayap Kiri</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedZoneFilter('regular_right')}
            className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              selectedZoneFilter === 'regular_right'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <span>🏢 Sayap Kanan</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. VISUAL BALLROOM FLOOR PLAN */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FAF8F5] rounded-3xl p-5 sm:p-7 border border-amber-200/70 shadow-inner flex flex-col gap-6">
        {/* Stage Pelaminan Banner */}
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-amber-950 font-bold py-3.5 px-6 rounded-2xl shadow-md border border-amber-400 text-center flex items-center justify-center gap-2.5">
            <Crown size={20} className="text-amber-800 animate-pulse" />
            <span className="tracking-wider uppercase text-xs sm:text-sm font-heading">
              Panggung Pelaminan & Stage Utama Pengantin
            </span>
            <Crown size={20} className="text-amber-800 animate-pulse" />
          </div>
          {/* Carpet / Stage runway indicator */}
          <div className="w-16 h-4 bg-red-600/70 mx-auto rounded-b-md shadow-xs" />
        </div>

        {/* Ballroom Grid / Floor Layout */}
        {loadingTables ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw size={28} className="animate-spin text-sage-dark" />
            <p className="text-xs text-gray-500 font-medium">Memuat tata letak meja ballroom...</p>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="py-16 text-center bg-white/70 backdrop-blur-xs rounded-2xl border border-dashed border-gray-300 p-8 max-w-md mx-auto">
            <Layers size={40} className="mx-auto text-gray-300 mb-3" />
            <h4 className="font-heading text-base font-bold text-gray-800">
              Belum Ada Meja yang Ditampilkan
            </h4>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              {tables.length === 0
                ? 'Denah ballroom masih kosong. Klik tombol di bawah untuk membuat 12 meja preset otomatis.'
                : 'Tidak ada meja yang cocok dengan filter atau kata kunci pencarian.'}
            </p>
            {tables.length === 0 ? (
              <button
                type="button"
                onClick={() => setIsPresetConfirmOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition cursor-pointer shadow-xs"
              >
                <Sparkles size={15} />
                <span>Muat Template 12 Meja</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelectedZoneFilter('all');
                  setTableSearchQuery('');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
              >
                <span>Reset Filter Pencarian</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTables.map((table) => {
              const assigned = table.assignedGuests || [];
              const occupiedPax = assigned.reduce((sum, g) => sum + (g.pax || 1), 0);
              const capacity = table.capacity || 8;
              const isFull = occupiedPax === capacity;
              const isOver = occupiedPax > capacity;
              const percent = Math.min(100, Math.round((occupiedPax / capacity) * 100));

              const zoneInfo = ZONE_LABELS[table.zone] || { label: table.zone, badgeColor: 'bg-gray-100 text-gray-700' };

              return (
                <div
                  key={table.id}
                  onClick={() => setInspectingTable(table)}
                  className={`group relative bg-white rounded-2xl p-4 border transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between ${
                    table.shape === 'vip_stage'
                      ? 'border-amber-300 ring-2 ring-amber-100 hover:border-amber-400'
                      : 'border-gray-200/80 hover:border-sage-dark/40'
                  }`}
                >
                  {/* Top table info */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 min-w-10 h-8 rounded-xl flex items-center justify-center font-sans font-bold text-xs shadow-xs tracking-tight ${
                            table.shape === 'vip_stage'
                              ? 'bg-amber-500 text-white'
                              : 'bg-sage-dark text-white'
                          }`}
                        >
                          {table.number}
                        </span>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-sage-dark transition">
                            {table.name}
                          </h4>
                          <span className={`inline-block text-[10px] font-medium px-2 py-0.2 rounded-full border ${zoneInfo.badgeColor}`}>
                            {zoneInfo.label.split(' ')[0]} {zoneInfo.label.split(' ')[1]}
                          </span>
                        </div>
                      </div>

                      {/* Capacity status pill */}
                      <div className="text-right">
                        <span
                          className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isOver
                              ? 'bg-rose-100 text-rose-800'
                              : isFull
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {occupiedPax}/{capacity}
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden my-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOver ? 'bg-rose-500' : isFull ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Assigned Guest Badges List */}
                    <div className="mt-3 flex flex-wrap gap-1 min-h-[50px] content-start">
                      {assigned.length === 0 ? (
                        <div className="w-full py-2 text-center text-gray-400 text-[11px] italic bg-gray-50/70 rounded-lg border border-dashed border-gray-200">
                          Belum ada tamu di meja ini
                        </div>
                      ) : (
                        assigned.slice(0, 4).map((guest, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                              guest.isVip
                                ? 'bg-amber-50 text-amber-900 border-amber-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}
                          >
                            <span className="line-clamp-1 max-w-[80px]">{guest.name}</span>
                            <span className="text-[9px] text-gray-400 font-mono">({guest.pax}p)</span>
                          </span>
                        ))
                      )}
                      {assigned.length > 4 && (
                        <span className="text-[10px] font-bold text-gray-500 self-center px-1">
                          +{assigned.length - 4} lainnya
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card bottom actions (Table action icon-only according to rule) */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="text-[11px] text-gray-400">
                      {SHAPE_LABELS[table.shape]?.label || table.shape}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(table)}
                        className="p-1.5 text-gray-400 hover:text-sage-dark hover:bg-gray-100 rounded-lg transition cursor-pointer"
                        title="Edit Info Meja"
                        aria-label="Edit Info Meja"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmTarget(table)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Hapus Meja"
                        aria-label="Hapus Meja"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. TABLE DETAIL & GUEST ALLOCATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {inspectingTable && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setInspectingTable(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 flex flex-col gap-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 min-w-[56px] h-10 rounded-xl bg-sage-dark text-white font-bold font-sans flex items-center justify-center text-sm shadow-xs">
                  {inspectingTable.number}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-gray-900">
                      {inspectingTable.name}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ZONE_LABELS[inspectingTable.zone]?.badgeColor}`}>
                      {ZONE_LABELS[inspectingTable.zone]?.label.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kapasitas: <strong>{inspectingTable.capacity} Kursi</strong> • Bentuk: {SHAPE_LABELS[inspectingTable.shape]?.label}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectingTable(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                title="Tutup Modal"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>

            {/* Capacity Status */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 flex items-center justify-between text-xs">
              <span className="text-gray-600">Status Keterisian Kursi:</span>
              <span className="font-bold text-gray-900">
                {(inspectingTable.assignedGuests || []).reduce((sum, g) => sum + (g.pax || 1), 0)} dari {inspectingTable.capacity} Kursi
              </span>
            </div>

            {/* List of Guests assigned to this table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Daftar Tamu Dialokasikan ({(inspectingTable.assignedGuests || []).length} Tamu)
              </h4>

              {(!inspectingTable.assignedGuests || inspectingTable.assignedGuests.length === 0) ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <UserPlus size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    Belum ada tamu yang ditempatkan di meja ini.
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Gunakan daftar di bawah untuk memasukkan tamu unassigned.
                  </p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 border border-gray-200/80 rounded-xl">
                  {inspectingTable.assignedGuests.map((guest, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex items-center justify-between hover:bg-gray-50/80 transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 text-center text-xs text-gray-400 font-mono">
                          {idx + 1}.
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-900">{guest.name}</span>
                            {guest.isVip && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-500">{guest.pax} Kursi / Pax</span>
                        </div>
                      </div>

                      {/* Remove Button (Table Action Icon-Only) */}
                      <button
                        type="button"
                        onClick={() => handleRemoveGuestFromTable(inspectingTable, guest.name)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title={`Lepas ${guest.name} dari meja`}
                        aria-label="Lepas Tamu"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add Unassigned Guest to This Table */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
                <span>Masukkan Tamu Belum Dialokasikan</span>
                <span className="text-[11px] text-sage-dark font-semibold">
                  {unassignedGuests.length} Tamu Siap
                </span>
              </h4>

              {unassignedGuests.length === 0 ? (
                <p className="text-xs text-gray-400 italic">
                  Semua tamu dalam sistem sudah memiliki meja.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="max-h-40 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-xl bg-gray-50/50">
                    {unassignedGuests.slice(0, 10).map((g) => (
                      <div
                        key={g.id}
                        className="p-2.5 flex items-center justify-between hover:bg-white transition text-xs"
                      >
                        <div>
                          <span className="font-semibold text-gray-900">{g.name}</span>
                          <span className="text-[11px] text-gray-400 ml-2">({g.pax} Pax • {g.source})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAssignGuestToTable(inspectingTable, g, false)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sage-dark text-white hover:bg-sage-dark/90 transition shadow-xs cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Tempatkan</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  {unassignedGuests.length > 10 && (
                    <p className="text-[11px] text-gray-400 text-center">
                      Menampilkan 10 dari {unassignedGuests.length} tamu. Buka drawer samping untuk mencari seluruh tamu.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
              {inspectingTable.notes && (
                <p className="text-xs text-gray-500 italic max-w-xs line-clamp-1">
                  Catatan: {inspectingTable.notes}
                </p>
              )}
              <button
                type="button"
                onClick={() => setInspectingTable(null)}
                className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
              >
                <Check size={14} />
                <span>Selesai</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. DRAWER: UNASSIGNED GUESTS PANEL */}
      {/* ------------------------------------------------------------- */}
      {isUnassignedDrawerOpen && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setIsUnassignedDrawerOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Tamu Belum Dialokasikan
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unassignedGuests.length} tamu belum memiliki meja resepsi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUnassignedDrawerOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  title="Tutup Panel"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search input in drawer */}
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama tamu..."
                  value={unassignedSearchQuery}
                  onChange={(e) => setUnassignedSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark transition bg-gray-50/50"
                />
                {unassignedSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setUnassignedSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Guest list with table select dropdown */}
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden max-h-[calc(100vh-250px)] overflow-y-auto">
                {filteredUnassignedGuests.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 text-xs italic">
                    {unassignedSearchQuery ? 'Tidak ada nama yang cocok' : 'Semua tamu telah memiliki meja!'}
                  </div>
                ) : (
                  filteredUnassignedGuests.map((guest) => (
                    <div
                      key={guest.id}
                      className="p-3 hover:bg-gray-50/80 transition flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900">{guest.name}</span>
                        <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {guest.pax} Pax
                        </span>
                      </div>

                      {/* Dropdown to assign to a specific table */}
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            const tableId = e.target.value;
                            if (!tableId) return;
                            const target = tables.find((t) => t.id === tableId);
                            if (target) {
                              handleAssignGuestToTable(target, guest, false);
                            }
                            e.target.value = '';
                          }}
                          className="flex-1 text-xs py-1.5 px-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-sage-dark text-gray-700"
                        >
                          <option value="" disabled>
                            Pilih Meja Tujuan...
                          </option>
                          {tables.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.number} - {t.name} ({(t.assignedGuests || []).length}/{t.capacity} Kursi)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsUnassignedDrawerOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
              >
                Tutup Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. MODAL: ADD / EDIT TABLE FORM */}
      {/* ------------------------------------------------------------- */}
      {isTableModalOpen && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsTableModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 flex flex-col gap-5 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sage-50 text-sage-dark rounded-lg">
                  <Layers size={18} />
                </span>
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  {editingTable ? 'Edit Konfigurasi Meja' : 'Tambah Meja Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTable} className="flex flex-col gap-4">
              {/* Nomor Meja */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nomor / Kode Meja *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: VIP-01, Meja 05"
                  value={tableFormNumber}
                  onChange={(e) => setTableFormNumber(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark transition"
                />
              </div>

              {/* Nama Meja */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nama / Kelompok Tamu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Keluarga Inti Pria, Rekan Kantor"
                  value={tableFormName}
                  onChange={(e) => setTableFormName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark transition"
                />
              </div>

              {/* Bentuk & Kapasitas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Bentuk Meja
                  </label>
                  <select
                    value={tableFormShape}
                    onChange={(e) => setTableFormShape(e.target.value as TableShape)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark bg-white transition"
                  >
                    <option value="round">Meja Bundar (Round)</option>
                    <option value="long">Meja Panjang (Long)</option>
                    <option value="vip_stage">Meja VIP Panggung</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Kapasitas Kursi (Pax)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={tableFormCapacity}
                    onChange={(e) => setTableFormCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark transition"
                  />
                </div>
              </div>

              {/* Zona Ballroom */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Zona / Penempatan Ballroom
                </label>
                <select
                  value={tableFormZone}
                  onChange={(e) => setTableFormZone(e.target.value as TableZone)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark bg-white transition"
                >
                  <option value="vip_front">👑 Zona Depan (VIP & Pejabat)</option>
                  <option value="family_center">👨‍👩‍👧‍👦 Zona Tengah (Keluarga Inti)</option>
                  <option value="regular_left">👥 Sayap Kiri (Sahabat & Teman)</option>
                  <option value="regular_right">🏢 Sayap Kanan (Kolega & Mitra)</option>
                </select>
              </div>

              {/* Catatan Tambahan */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Catatan Meja (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Dekat akses pintu darurat, sediakan high chair balita"
                  value={tableFormNotes}
                  onChange={(e) => setTableFormNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sage-dark/20 focus:border-sage-dark transition"
                />
              </div>

              {/* Action Buttons (Dual Button Rule: Icon + Text) */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={15} />
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  disabled={isSavingTable}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sage-dark text-white hover:bg-sage-dark/90 transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Check size={15} />
                  <span>{isSavingTable ? 'Menyimpan...' : 'Simpan Meja'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. SWEETALERT-STYLE DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirmTarget && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 text-center flex flex-col items-center gap-3 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-1">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900">
              Hapus Meja {deleteConfirmTarget.number}?
            </h3>
            <p className="text-xs text-gray-500">
              Meja <strong>{deleteConfirmTarget.name}</strong> beserta seluruh alokasi {deleteConfirmTarget.assignedGuests?.length || 0} tamu di dalamnya akan dihapus. Aksi ini tidak dapat dibatalkan.
            </p>

            {/* Dual Button Rule */}
            <div className="flex items-center justify-center gap-2.5 w-full mt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={15} />
                <span>Batal</span>
              </button>
              <button
                type="button"
                disabled={isDeletingTable}
                onClick={handleDeleteTable}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={15} />
                <span>{isDeletingTable ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 9. SWEETALERT-STYLE PRESET CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {isPresetConfirmOpen && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsPresetConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center flex flex-col items-center gap-3 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
              <Sparkles size={24} />
            </div>
            <h3 className="font-heading text-lg font-bold text-gray-900">
              Muat Template Ballroom Standar?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sistem akan memuat <strong>12 meja ballroom standar</strong> (2 VIP Depan, 4 Keluarga Inti Tengah, 6 Sayap Kiri & Kanan).
              {tables.length > 0 && (
                <span className="block text-rose-600 font-semibold mt-1">
                  Perhatian: {tables.length} meja yang ada saat ini akan diganti dengan susunan baru template ini.
                </span>
              )}
            </p>

            <div className="flex items-center justify-center gap-2.5 w-full mt-3">
              <button
                type="button"
                onClick={() => setIsPresetConfirmOpen(false)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition cursor-pointer"
              >
                <X size={15} />
                <span>Batal</span>
              </button>
              <button
                type="button"
                disabled={isLoadingPresets}
                onClick={handleLoadPresets}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles size={15} />
                <span>{isLoadingPresets ? 'Memuat...' : 'Ya, Muat Template'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
