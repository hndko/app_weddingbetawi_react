import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, DollarSign, Plus, Trash2, Edit2, Download, Search, CheckCircle2, 
  Clock, AlertCircle, Phone, Sparkles, Building, Utensils, Shirt, Flower2, 
  Camera, Music, Gift, HeartHandshake, Truck, ExternalLink, X, Check,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { WeddingExpense, ExpenseCategory, PaymentStatus } from '../../../types';

interface BudgetVendorTrackerProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

const CATEGORY_MAP: Record<ExpenseCategory, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bgColor: string }> = {
  venue: { label: 'Venue & Gedung', icon: Building, color: 'text-amber-800', bgColor: 'bg-amber-50 border-amber-200/80' },
  catering: { label: 'Katering & Konsumsi', icon: Utensils, color: 'text-emerald-800', bgColor: 'bg-emerald-50 border-emerald-200/80' },
  attire_mua: { label: 'Rias & Busana', icon: Shirt, color: 'text-purple-800', bgColor: 'bg-purple-50 border-purple-200/80' },
  decoration: { label: 'Dekorasi & Pelaminan', icon: Flower2, color: 'text-pink-800', bgColor: 'bg-pink-50 border-pink-200/80' },
  photography: { label: 'Foto & Dokumentasi', icon: Camera, color: 'text-blue-800', bgColor: 'bg-blue-50 border-blue-200/80' },
  entertainment_mc: { label: 'Hiburan, Sound & MC', icon: Music, color: 'text-indigo-800', bgColor: 'bg-indigo-50 border-indigo-200/80' },
  invitation_souvenir: { label: 'Undangan & Souvenir', icon: Gift, color: 'text-rose-800', bgColor: 'bg-rose-50 border-rose-200/80' },
  rings_dowry: { label: 'Cincin & Mahar', icon: HeartHandshake, color: 'text-yellow-800', bgColor: 'bg-yellow-50 border-yellow-200/80' },
  logistics_other: { label: 'Logistik & Lainnya', icon: Truck, color: 'text-stone-700', bgColor: 'bg-stone-100 border-stone-200/80' },
};

const DEFAULT_EXPENSE_PRESETS: Array<Omit<WeddingExpense, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'Sewa Gedung / Venue Pernikahan',
    category: 'venue',
    estimatedCost: 25000000,
    actualCost: 25000000,
    paidAmount: 10000000,
    paymentStatus: 'partial',
    vendorName: 'Ballroom Graha Wedding',
    vendorPhone: '081234567890',
    dueDate: '2026-08-15',
    notes: 'Kapasitas 800 pax, AC central, ruang rias 2 kamar',
    isCompleted: true,
  },
  {
    title: 'Paket Katering Prasmanan (500 Pax)',
    category: 'catering',
    estimatedCost: 45000000,
    actualCost: 42500000,
    paidAmount: 20000000,
    paymentStatus: 'partial',
    vendorName: 'Berkah Rasa Catering',
    vendorPhone: '085712345678',
    dueDate: '2026-09-01',
    notes: 'Menu 5 lauk utama, 3 stall gubukan, free ice cream & dessert',
    isCompleted: false,
  },
  {
    title: 'Tata Rias & Busana Akad + Resepsi',
    category: 'attire_mua',
    estimatedCost: 15000000,
    actualCost: 16000000,
    paidAmount: 16000000,
    paymentStatus: 'paid',
    vendorName: 'Griya Pengantin Cantika',
    vendorPhone: '081987654321',
    dueDate: '2026-08-01',
    notes: 'Busana adat sepasang, make up 2 ibu kandung & 4 pagar ayu',
    isCompleted: true,
  },
  {
    title: 'Dekorasi Pelaminan & Photobooth',
    category: 'decoration',
    estimatedCost: 20000000,
    actualCost: 19000000,
    paidAmount: 8000000,
    paymentStatus: 'partial',
    vendorName: 'Pesona Art Decoration',
    vendorPhone: '082133445566',
    dueDate: '2026-08-25',
    notes: 'Panjang pelaminan 12 meter, bunga segar semi-artificial',
    isCompleted: false,
  },
  {
    title: 'Dokumentasi Foto & Sinematik Video',
    category: 'photography',
    estimatedCost: 12000000,
    actualCost: 12000000,
    paidAmount: 5000000,
    paymentStatus: 'partial',
    vendorName: 'Lensa Cinta Cinema',
    vendorPhone: '087811223344',
    dueDate: '2026-09-05',
    notes: '2 Photographer, 2 Videographer, 1 Drone operator, All raw files',
    isCompleted: false,
  },
  {
    title: 'Sound System, Akustik Band & MC',
    category: 'entertainment_mc',
    estimatedCost: 8500000,
    actualCost: 8000000,
    paidAmount: 8000000,
    paymentStatus: 'paid',
    vendorName: 'Harmoni Nada & MC Fadil',
    vendorPhone: '081399887766',
    dueDate: '2026-08-20',
    notes: 'MC formal akad + resepsi santai, live acoustic 4 person',
    isCompleted: true,
  },
  {
    title: 'Souvenir Tamu & Undangan Cetak VIP',
    category: 'invitation_souvenir',
    estimatedCost: 6000000,
    actualCost: 5500000,
    paidAmount: 5500000,
    paymentStatus: 'paid',
    vendorName: 'Creative Souvenir House',
    vendorPhone: '085277889900',
    dueDate: '2026-07-30',
    notes: '500 pcs pouch kulit premium beremboss inisial & kartu ucapan',
    isCompleted: true,
  },
  {
    title: 'Cincin Kawin & Set Perhiasan Mahar',
    category: 'rings_dowry',
    estimatedCost: 18000000,
    actualCost: 17500000,
    paidAmount: 17500000,
    paymentStatus: 'paid',
    vendorName: 'Toko Emas Mulia Abadi',
    vendorPhone: '',
    dueDate: '',
    notes: 'Emas putih 75% sepasang cincin grafir nama & box mahar kaca',
    isCompleted: true,
  },
  {
    title: 'Tenda, Kursi Tambahan & Genset 60 KVA',
    category: 'logistics_other',
    estimatedCost: 7500000,
    actualCost: 7000000,
    paidAmount: 2000000,
    paymentStatus: 'partial',
    vendorName: 'Mandiri Power & Tent',
    vendorPhone: '081277112233',
    dueDate: '2026-09-10',
    notes: 'Genset silent 8 jam backup penuh, 50 kursi futura tambahan',
    isCompleted: false,
  },
  {
    title: 'Kotak Hantaran & Perlengkapan Adat',
    category: 'logistics_other',
    estimatedCost: 4000000,
    actualCost: 3800000,
    paidAmount: 0,
    paymentStatus: 'unpaid',
    vendorName: 'Adat Nuansa Tradisi',
    vendorPhone: '081566778899',
    dueDate: '2026-08-30',
    notes: 'Hias 12 kotak seserahan mika akrilik & sewa sirih pinang adat',
    isCompleted: false,
  },
];

const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const sanitizePhoneForWhatsApp = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
};

export function BudgetVendorTracker({ onNotify }: BudgetVendorTrackerProps) {
  const [expenses, setExpenses] = useState<WeddingExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and filter states (Zero URL pollution)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<WeddingExpense | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'venue' as ExpenseCategory,
    estimatedCost: 0,
    actualCost: 0,
    paidAmount: 0,
    paymentStatus: 'unpaid' as PaymentStatus,
    vendorName: '',
    vendorPhone: '',
    dueDate: '',
    notes: '',
    isCompleted: false,
  });

  // Delete modal state (SweetAlert2 style)
  const [deleteTarget, setDeleteTarget] = useState<WeddingExpense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preset loading state
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);

  // Floating toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error') => {
    setToastMessage({ text, type });
    if (onNotify) onNotify(text, type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isFormOpen || deleteTarget) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFormOpen, deleteTarget]);

  // Real-time Firestore Listener
  useEffect(() => {
    const expensesRef = collection(db, 'wedding_expenses');
    const q = query(expensesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: WeddingExpense[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as WeddingExpense);
        });
        setExpenses(items);
        setIsLoading(false);
      },
      (error) => {
        showToast('Gagal memuat data anggaran: ' + error.message, 'error');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || item.paymentStatus === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [expenses, searchQuery, selectedCategory, selectedStatus]);

  // Financial KPI Calculations
  const stats = useMemo(() => {
    const totalEstimated = expenses.reduce((acc, item) => acc + (Number(item.estimatedCost) || 0), 0);
    const totalActual = expenses.reduce((acc, item) => acc + (Number(item.actualCost) || 0), 0);
    const totalPaid = expenses.reduce((acc, item) => acc + (Number(item.paidAmount) || 0), 0);
    const totalRemaining = expenses.reduce((acc, item) => {
      const actual = Number(item.actualCost) || 0;
      const paid = Number(item.paidAmount) || 0;
      return acc + Math.max(0, actual - paid);
    }, 0);

    const paidPercentage = totalActual > 0 ? Math.min(100, Math.round((totalPaid / totalActual) * 100)) : 0;
    const completedTasks = expenses.filter((item) => item.isCompleted).length;
    const totalTasks = expenses.length;

    return {
      totalEstimated,
      totalActual,
      totalPaid,
      totalRemaining,
      paidPercentage,
      completedTasks,
      totalTasks,
    };
  }, [expenses]);

  // Open Form for Add
  const handleOpenAdd = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      category: 'venue',
      estimatedCost: 0,
      actualCost: 0,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      vendorName: '',
      vendorPhone: '',
      dueDate: '',
      notes: '',
      isCompleted: false,
    });
    setIsFormOpen(true);
  };

  // Open Form for Edit
  const handleOpenEdit = (item: WeddingExpense) => {
    setEditingExpense(item);
    setFormData({
      title: item.title,
      category: item.category,
      estimatedCost: item.estimatedCost || 0,
      actualCost: item.actualCost || 0,
      paidAmount: item.paidAmount || 0,
      paymentStatus: item.paymentStatus,
      vendorName: item.vendorName || '',
      vendorPhone: item.vendorPhone || '',
      dueDate: item.dueDate || '',
      notes: item.notes || '',
      isCompleted: !!item.isCompleted,
    });
    setIsFormOpen(true);
  };

  // Close Form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  // Handle Form Submit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Nama pos pengeluaran wajib diisi!', 'error');
      return;
    }

    try {
      // Determine automatic payment status if paid amount matches or is zero
      let finalStatus = formData.paymentStatus;
      if (formData.actualCost > 0) {
        if (formData.paidAmount >= formData.actualCost) {
          finalStatus = 'paid';
        } else if (formData.paidAmount > 0) {
          finalStatus = 'partial';
        } else {
          finalStatus = 'unpaid';
        }
      }

      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        estimatedCost: Number(formData.estimatedCost) || 0,
        actualCost: Number(formData.actualCost) || 0,
        paidAmount: Number(formData.paidAmount) || 0,
        paymentStatus: finalStatus,
        vendorName: formData.vendorName.trim(),
        vendorPhone: formData.vendorPhone.trim(),
        dueDate: formData.dueDate,
        notes: formData.notes.trim(),
        isCompleted: formData.isCompleted,
        updatedAt: serverTimestamp(),
      };

      if (editingExpense?.id) {
        await updateDoc(doc(db, 'wedding_expenses', editingExpense.id), payload);
        showToast('Data pos pengeluaran berhasil diperbarui!', 'success');
      } else {
        await addDoc(collection(db, 'wedding_expenses'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        showToast('Pos pengeluaran baru berhasil ditambahkan!', 'success');
      }

      handleCloseForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      showToast('Gagal menyimpan data: ' + msg, 'error');
    }
  };

  // Toggle Checklist Status
  const handleToggleCompleted = async (item: WeddingExpense) => {
    if (!item.id) return;
    try {
      await updateDoc(doc(db, 'wedding_expenses', item.id), {
        isCompleted: !item.isCompleted,
        updatedAt: serverTimestamp(),
      });
      showToast(
        item.isCompleted
          ? `Status kesiapan "${item.title}" ditandai belum selesai.`
          : `Kesiapan "${item.title}" selesai!`,
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui status';
      showToast(msg, 'error');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'wedding_expenses', deleteTarget.id));
      showToast(`Pos "${deleteTarget.title}" berhasil dihapus.`, 'success');
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal menghapus data';
      showToast(msg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Apply Nusantara Standard Preset
  const handleApplyPresets = async () => {
    setIsApplyingPreset(true);
    try {
      const batch = writeBatch(db);
      DEFAULT_EXPENSE_PRESETS.forEach((preset) => {
        const newDocRef = doc(collection(db, 'wedding_expenses'));
        batch.set(newDocRef, {
          ...preset,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      showToast('10 Template Pos Anggaran Nusantara berhasil dimuat!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat template';
      showToast(msg, 'error');
    } finally {
      setIsApplyingPreset(false);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (expenses.length === 0) {
      showToast('Tidak ada data anggaran untuk diekspor!', 'error');
      return;
    }

    const headers = [
      'No',
      'Pos Pengeluaran',
      'Kategori',
      'Estimasi Anggaran (Rp)',
      'Biaya Kesepakatan Aktual (Rp)',
      'Terbayar / DP (Rp)',
      'Sisa Tagihan (Rp)',
      'Status Pembayaran',
      'Nama Vendor',
      'Kontak WA Vendor',
      'Jatuh Tempo',
      'Kesiapan Hari-H',
      'Catatan',
    ];

    const rows = expenses.map((item, index) => {
      const actual = Number(item.actualCost) || 0;
      const paid = Number(item.paidAmount) || 0;
      const remaining = Math.max(0, actual - paid);
      const categoryLabel = CATEGORY_MAP[item.category]?.label || item.category;
      const statusLabel =
        item.paymentStatus === 'paid'
          ? 'Lunas'
          : item.paymentStatus === 'partial'
          ? 'DP Terbayar'
          : 'Belum Bayar';
      const completedLabel = item.isCompleted ? 'Selesai' : 'Belum Selesai';

      return [
        index + 1,
        `"${(item.title || '').replace(/"/g, '""')}"`,
        `"${categoryLabel.replace(/"/g, '""')}"`,
        item.estimatedCost || 0,
        actual,
        paid,
        remaining,
        `"${statusLabel}"`,
        `"${(item.vendorName || '').replace(/"/g, '""')}"`,
        `"${(item.vendorPhone || '').replace(/"/g, '""')}"`,
        `"${item.dueDate || '-'}"`,
        `"${completedLabel}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap-anggaran-pernikahan-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Rekap anggaran berhasil diunduh (CSV UTF-8 BOM)!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4 border ${
            toastMessage.type === 'success'
              ? 'bg-emerald-800 text-white border-emerald-700'
              : 'bg-rose-800 text-white border-rose-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 size={18} className="text-emerald-300 shrink-0" />
          ) : (
            <AlertCircle size={18} className="text-rose-300 shrink-0" />
          )}
          <span className="text-sm font-medium">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/80 hover:text-white ml-2 transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sage/15 via-white to-sage/5 rounded-2xl p-6 border border-sage/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/20 text-sage-dark text-xs font-semibold uppercase tracking-wider mb-2">
            <Wallet size={13} />
            <span>Manajemen Anggaran & Vendor</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-dark">
            Wedding Budget & Checklist Vendor
          </h2>
          <p className="text-xs text-text-dark/60 mt-1 max-w-xl leading-relaxed">
            Pantau target alokasi anggaran, realisasi kontrak vendor, catatan jatuh tempo pembayaran, dan kesiapan logistik hari-H pernikahan secara terpadu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {expenses.length === 0 && (
            <button
              type="button"
              onClick={handleApplyPresets}
              disabled={isApplyingPreset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
              title="Isi otomatis 10 pos biaya umum pernikahan adat Nusantara"
            >
              <Sparkles size={14} className={isApplyingPreset ? 'animate-spin text-amber-600' : 'text-amber-600'} />
              <span>Muat Template Standar</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={expenses.length === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-gray-200 text-text-dark/80 hover:text-text-dark hover:border-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sage-dark hover:bg-sage text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-98"
          >
            <Plus size={15} />
            <span>Tambah Pos Biaya</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Estimasi Target */}
        <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Target Anggaran</span>
            <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
              <DollarSign size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-heading text-text-dark mt-3">
              {formatRupiah(stats.totalEstimated)}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Dari {expenses.length} pos alokasi rencana
            </div>
          </div>
        </div>

        {/* Card 2: Biaya Aktual Kontrak */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Kontrak Aktual</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
              <Building size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-heading text-amber-800 mt-3">
              {formatRupiah(stats.totalActual)}
            </div>
            <div className="text-[11px] text-amber-700/80 font-medium mt-1">
              {stats.totalActual > stats.totalEstimated
                ? `+${formatRupiah(stats.totalActual - stats.totalEstimated)} dari target (Lebih)`
                : stats.totalActual < stats.totalEstimated
                ? `Hemat ${formatRupiah(stats.totalEstimated - stats.totalActual)} dari rencana`
                : 'Tepat sesuai estimasi rencana'}
            </div>
          </div>
        </div>

        {/* Card 3: Telah Dibayar / DP */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Telah Dibayar (DP/Lunas)</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-heading text-emerald-800 mt-3">
              {formatRupiah(stats.totalPaid)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              {stats.paidPercentage}% terbayar dari total kontrak
            </div>
          </div>
        </div>

        {/* Card 4: Sisa Pelunasan */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Sisa Tagihan Pelunasan</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
              <Clock size={18} />
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-heading text-rose-700 mt-3">
              {formatRupiah(stats.totalRemaining)}
            </div>
            <div className="text-[11px] text-rose-500/80 mt-1">
              Wajib lunas menjelang hari-H pernikahan
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Kesiapan Logistik */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2.5">
          <span className="text-text-dark font-semibold flex items-center gap-2">
            <span>Realisasi Pembayaran Vendor:</span>
            <span className="text-emerald-700 font-bold font-mono text-sm">{stats.paidPercentage}%</span>
          </span>
          <span className="text-gray-500 font-medium">
            Checklist Logistik: <strong className="text-amber-700 font-bold">{stats.completedTasks}</strong> dari {stats.totalTasks} pos siap
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
            style={{ width: `${stats.paidPercentage}%` }}
          />
        </div>
      </div>

      {/* Filter & Live Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white border border-gray-200/80 p-3.5 rounded-2xl shadow-xs">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pos pengeluaran, nama vendor, atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-text-dark placeholder-gray-400 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-sage transition-all cursor-pointer"
          >
            <option value="all">Semua Kategori ({expenses.length})</option>
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-sage transition-all cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="unpaid">Belum Bayar</option>
            <option value="partial">DP Terbayar</option>
            <option value="paid">Lunas</option>
          </select>

          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="px-2.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-xs transition-colors cursor-pointer"
              title="Reset Filter"
            >
              <RefreshCw size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-600 border-b border-gray-200 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[200px]">Pos Pengeluaran & Kategori</th>
                <th className="py-3.5 px-4 min-w-[160px]">Vendor & Kontak</th>
                <th className="py-3.5 px-4 text-right min-w-[120px]">Estimasi</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Kontrak Aktual</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Terbayar (DP)</th>
                <th className="py-3.5 px-4 text-right min-w-[130px]">Sisa Tagihan</th>
                <th className="py-3.5 px-3 text-center min-w-[100px]">Status</th>
                <th className="py-3.5 px-3 text-center min-w-[90px]">Kesiapan</th>
                <th className="py-3.5 px-3 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-sage-dark border-t-transparent rounded-full animate-spin" />
                      <span>Memuat data anggaran pernikahan...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mb-1">
                        <Wallet size={24} />
                      </div>
                      <p className="text-gray-700 font-semibold text-sm">Belum ada pos pengeluaran yang cocok.</p>
                      {expenses.length === 0 ? (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={handleApplyPresets}
                            disabled={isApplyingPreset}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Sparkles size={13} className="text-amber-600" />
                            <span>Muat 10 Template Pos Nusantara</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleOpenAdd}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sage-dark hover:bg-sage text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>Tambah Manual</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                            setSelectedStatus('all');
                          }}
                          className="text-xs text-sage-dark font-medium hover:underline mt-1 cursor-pointer"
                        >
                          Bersihkan filter pencarian
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item, index) => {
                  const actual = Number(item.actualCost) || 0;
                  const paid = Number(item.paidAmount) || 0;
                  const remaining = Math.max(0, actual - paid);
                  const catConfig = CATEGORY_MAP[item.category] || CATEGORY_MAP.logistics_other;
                  const Icon = catConfig.icon;

                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-gray-50/70 transition-colors group"
                    >
                      {/* # Auto-numbering 1-indexed */}
                      <td className="py-3 px-3 text-center text-gray-400 font-mono text-[11px]">
                        {index + 1}
                      </td>

                      {/* Title & Category */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-text-dark group-hover:text-sage-dark transition-colors">
                          {item.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${catConfig.bgColor} ${catConfig.color}`}>
                            <Icon size={11} />
                            <span>{catConfig.label}</span>
                          </span>
                          {item.dueDate && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                              <Clock size={10} />
                              <span>{item.dueDate}</span>
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 italic">
                            "{item.notes}"
                          </p>
                        )}
                      </td>

                      {/* Vendor & WhatsApp */}
                      <td className="py-3 px-4">
                        {item.vendorName ? (
                          <div>
                            <div className="font-medium text-gray-800">{item.vendorName}</div>
                            {item.vendorPhone ? (
                              <a
                                href={`https://wa.me/${sanitizePhoneForWhatsApp(item.vendorPhone)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 hover:underline mt-0.5"
                                title="Buka Chat WhatsApp Vendor"
                              >
                                <Phone size={11} />
                                <span>{item.vendorPhone}</span>
                                <ExternalLink size={9} />
                              </a>
                            ) : (
                              <span className="text-[11px] text-gray-400">-</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Belum ada vendor</span>
                        )}
                      </td>

                      {/* Estimasi */}
                      <td className="py-3 px-4 text-right font-mono text-gray-500">
                        {formatRupiah(item.estimatedCost || 0)}
                      </td>

                      {/* Aktual */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-amber-900">
                        {formatRupiah(actual)}
                      </td>

                      {/* Terbayar */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-700">
                        {formatRupiah(paid)}
                      </td>

                      {/* Sisa */}
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        <span className={remaining > 0 ? 'text-rose-600' : 'text-gray-400'}>
                          {formatRupiah(remaining)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {item.paymentStatus === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={10} />
                            <span>Lunas</span>
                          </span>
                        ) : item.paymentStatus === 'partial' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock size={10} />
                            <span>DP</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle size={10} />
                            <span>Belum</span>
                          </span>
                        )}
                      </td>

                      {/* Checklist Hari-H */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleCompleted(item)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            item.isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-gray-600 hover:border-gray-300'
                          }`}
                          title={item.isCompleted ? 'Sudah Siap (Klik untuk batalkan)' : 'Belum Siap (Klik jika sudah selesai)'}
                        >
                          <Check size={14} className={item.isCompleted ? 'stroke-[2.5]' : 'stroke-[1.5]'} />
                        </button>
                      </td>

                      {/* Aksi (Icon-Only per Pilar 5) */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-amber-50 text-gray-500 hover:text-amber-700 border border-gray-200 hover:border-amber-200 transition-colors cursor-pointer"
                            title="Edit Pos Pengeluaran"
                            aria-label="Edit Pos Pengeluaran"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer"
                            title="Hapus Pos Pengeluaran"
                            aria-label="Hapus Pos Pengeluaran"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Form (Full-Screen Viewport Backdrop) */}
      {isFormOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-sage/10 via-white to-amber-50/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sage/15 text-sage-dark border border-sage/20">
                  <Wallet size={16} />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-text-dark">
                    {editingExpense ? 'Edit Pos Pengeluaran' : 'Tambah Pos Pengeluaran Baru'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Isi detail anggaran, informasi rekanan vendor, dan kesiapan logistik.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseForm}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nama Pos Pengeluaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Paket Katering Prasmanan 500 Pax"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-text-dark placeholder-gray-400 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Kategori Pengeluaran
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-sage transition-all cursor-pointer"
                  >
                    {Object.entries(CATEGORY_MAP).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Status Pembayaran
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })}
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:border-sage transition-all cursor-pointer"
                  >
                    <option value="unpaid">Belum Bayar</option>
                    <option value="partial">DP Terbayar</option>
                    <option value="paid">Lunas Penuh</option>
                  </select>
                </div>
              </div>

              {/* Financial Numbers */}
              <div className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-sage-dark uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={13} />
                  <span>Kalkulasi Biaya (Rupiah)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Estimasi Rencana (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      placeholder="0"
                      value={formData.estimatedCost || ''}
                      onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs text-text-dark font-mono focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-amber-800 mb-1">
                      Kontrak Aktual (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      placeholder="0"
                      value={formData.actualCost || ''}
                      onChange={(e) => setFormData({ ...formData, actualCost: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs text-amber-900 font-mono font-semibold focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                      Terbayar / DP (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={50000}
                      placeholder="0"
                      value={formData.paidAmount || ''}
                      onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs text-emerald-800 font-mono font-semibold focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 transition-all"
                    />
                  </div>
                </div>

                {/* Sisa Tagihan Live Preview */}
                <div className="pt-2.5 border-t border-gray-200/80 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium">Sisa Tagihan yang Wajib Dilunasi:</span>
                  <span className="font-mono font-bold text-rose-600 text-sm sm:text-base">
                    {formatRupiah(Math.max(0, formData.actualCost - formData.paidAmount))}
                  </span>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nama Vendor / Rekanan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sanggar Rias Cantika"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-text-dark placeholder-gray-400 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Nomor WhatsApp Vendor
                  </label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="081234567890"
                      value={formData.vendorPhone}
                      onChange={(e) => setFormData({ ...formData, vendorPhone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-text-dark placeholder-gray-400 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Batas Waktu / Jatuh Tempo Pelunasan
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-text-dark focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all cursor-pointer"
                  />
                </div>

                <div className="flex items-center sm:items-end pb-2">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-gray-700 hover:text-text-dark transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={formData.isCompleted}
                      onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
                      className="w-4 h-4 rounded text-sage-dark focus:ring-sage/30 border-gray-300 cursor-pointer"
                    />
                    <span>Tandai Kesiapan Logistik Selesai</span>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Catatan Kesepakatan / Perjanjian Vendor
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Sudah include 2 kali fitting busana, garansi genset backup jika listrik padam"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-xl text-xs text-text-dark placeholder-gray-400 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage/20 transition-all"
                />
              </div>

              {/* Modal Footer Actions (Icon + Text per Pilar 5) */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <X size={14} />
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sage-dark hover:bg-sage text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-98"
                >
                  <Check size={14} />
                  <span>{editingExpense ? 'Simpan Perubahan' : 'Tambah Pos Pengeluaran'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (SweetAlert2 Style) */}
      {deleteTarget && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-heading font-bold text-text-dark mb-1">Hapus Pos Pengeluaran?</h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Apakah Anda yakin ingin menghapus pos <strong className="text-gray-800">"{deleteTarget.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <X size={14} />
                <span>Batal</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs active:scale-98"
              >
                <Trash2 size={14} />
                <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
