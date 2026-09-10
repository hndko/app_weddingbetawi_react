import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, Link as LinkIcon, Users, UserX, MessageSquare, MessageSquareHeart, 
  Trash2, X, LogOut, Heart, Calendar, Image as ImageIcon, Sparkles, 
  Download, ExternalLink, Menu, LayoutDashboard, SlidersHorizontal, 
  ArrowUpRight, ShieldCheck, QrCode, Tv, Wallet, Armchair, Gamepad2, 
  Radio, Send, KeyRound, CheckCircle2, AlertCircle, Save
} from 'lucide-react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { api } from '../../services/api';
import { socket } from '../../services/socket';
import { 
  RSVPResponse, 
  Wish, 
  GuestInvitation, 
  LiveRundownStatus 
} from '../../types';
import { Login } from '../auth/Login';
import { ReceptionCheckin } from './components/ReceptionCheckin';
import { BudgetVendorTracker } from './components/BudgetVendorTracker';
import { SeatingChartManager } from './components/SeatingChartManager';
import { TriviaQuizManager } from './components/TriviaQuizManager';
import { ExportReportModal } from './components/ExportReportModal';
import { GuestManagerTab } from './components/GuestManagerTab';
import { ConfigEditorTab, ConfigSubTab } from './components/ConfigEditorTab';
import { RsvpManagerTab } from './components/RsvpManagerTab';
import { WishesManagerTab } from './components/WishesManagerTab';
import { APP_VERSION } from '../../version';

export interface PanelProps {
  currentRoute?: 'login' | 'modules';
  onNavigate?: (path: string) => void;
  onReplace?: (path: string) => void;
}

export type AdminPanelProps = PanelProps;

const RUNDOWN_QUICK_PRESETS = [
  { title: 'Akad Nikah', time: '08:00 - 09:30', note: 'Sedang berlangsung ijab kabul & prosesi akad sakral' },
  { title: 'Temu Manten & Kirab', time: '10:30 - 11:00', note: 'Iring-iringan pengantin Betawi Palang Pintu memasuki ballroom' },
  { title: 'Sesi Foto Keluarga', time: '11:00 - 11:30', note: 'Sesi pemotretan bersama keluarga besar mempelai' },
  { title: 'Prasmanan Resepsi Dibuka', time: '11:30 - 13:30', note: 'Silakan menikmati hidangan resepsi di area buffet dan live station' },
  { title: 'Live Music & Hiburan', time: '12:00 - 13:30', note: 'Penampilan musik akustik & persembahan lagu spesial' },
  { title: 'Lempar Hand Bouquet', time: '13:00 - 13:20', note: 'Pemberian buket bunga untuk sahabat mempelai' },
  { title: 'Ramah Tamah & Penutupan', time: '13:30 - 14:00', note: 'Terima kasih atas kehadiran & doa restu Bapak/Ibu/Saudara/i' },
  { title: 'Acara Selesai', time: '14:00', note: 'Seluruh rangkaian resepsi pernikahan telah selesai dengan lancar' },
];

export function Panel({ currentRoute = 'login', onNavigate, onReplace }: PanelProps) {
  const { weddingConfig, updateWeddingConfig } = useWeddingConfig();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('admin_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Modern Dashboard Navigation State
  const [activeMenu, setActiveMenu] = useState<'overview' | 'reception' | 'seating' | 'generator' | 'config' | 'budget' | 'trivia' | 'rsvps' | 'wishes'>('overview');
  const [configSubTab, setConfigSubTab] = useState<ConfigSubTab>('theme');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Live data state from REST API + Socket.io
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [guests, setGuests] = useState<GuestInvitation[]>([]);

  // Live Rundown Broadcaster states
  const [isBroadcastingRundown, setIsBroadcastingRundown] = useState(false);
  const [rundownActive, setRundownActive] = useState<boolean>(() => Boolean(weddingConfig?.liveRundown?.active));
  const [rundownCurrentEvent, setRundownCurrentEvent] = useState<string>(() => weddingConfig?.liveRundown?.currentEvent || 'Resepsi Pernikahan');
  const [rundownCurrentTime, setRundownCurrentTime] = useState<string>(() => weddingConfig?.liveRundown?.currentEventTime || '');
  const [rundownMessage, setRundownMessage] = useState<string>(() => weddingConfig?.liveRundown?.broadcastMessage || '');

  // Change password modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // Export & Report modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // SweetAlert2-Style confirmation modal state
  const [deleteModal, setDeleteModal] = useState<{
    type: 'wish' | 'rsvp' | 'guest' | 'all_guests';
    id: string;
    title: string;
    description: string;
  } | null>(null);

  // Floating toast notification state
  const [toastNotification, setToastNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToastNotification({ type, message });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Live countdown calculation for overview widget
  const [countdownLeft, setCountdownLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (weddingConfig?.liveRundown) {
      setRundownActive(Boolean(weddingConfig.liveRundown.active));
      if (weddingConfig.liveRundown.currentEvent) setRundownCurrentEvent(weddingConfig.liveRundown.currentEvent);
      if (weddingConfig.liveRundown.currentEventTime) setRundownCurrentTime(weddingConfig.liveRundown.currentEventTime);
      if (weddingConfig.liveRundown.broadcastMessage) setRundownMessage(weddingConfig.liveRundown.broadcastMessage);
    }
  }, [weddingConfig]);

  // Sync RSVPs from REST API + Socket.io
  useEffect(() => {
    api.getRsvps().then(setRsvps).catch(console.warn);
    const onCreatedOrUpdated = (r: RSVPResponse) => setRsvps(prev => [r, ...prev.filter(x => x.id !== r.id)]);
    const onDeleted = (id: string) => setRsvps(prev => prev.filter(x => x.id !== id));
    socket.on('rsvp:created', onCreatedOrUpdated);
    socket.on('rsvp:updated', onCreatedOrUpdated);
    socket.on('rsvp:deleted', onDeleted);
    return () => {
      socket.off('rsvp:created', onCreatedOrUpdated);
      socket.off('rsvp:updated', onCreatedOrUpdated);
      socket.off('rsvp:deleted', onDeleted);
    };
  }, []);

  // Sync Wishes from REST API + Socket.io
  useEffect(() => {
    api.getWishes({ all: true }).then(setWishes).catch(console.warn);
    const onCreated = (w: Wish) => setWishes(prev => [w, ...prev.filter(x => x.id !== w.id)]);
    const onDeleted = (id: string) => setWishes(prev => prev.filter(x => x.id !== id));
    socket.on('wish:created', onCreated);
    socket.on('wish:deleted', onDeleted);
    return () => {
      socket.off('wish:created', onCreated);
      socket.off('wish:deleted', onDeleted);
    };
  }, []);

  // Sync Guests from REST API + Socket.io
  useEffect(() => {
    const fetchGuests = () => api.getGuests().then(setGuests).catch(console.warn);
    fetchGuests();
    const onCreated = (g: GuestInvitation) => setGuests(prev => [g, ...prev.filter(x => x.id !== g.id)]);
    const onUpdated = (g: Partial<GuestInvitation> & { id: string }) => setGuests(prev => prev.map(x => x.id === g.id ? { ...x, ...g } : x));
    const onSouvenirClaimed = (data: { id: string; souvenirClaimed: boolean; souvenirClaimedAt: string | null }) => {
      setGuests(prev => prev.map(x => x.id === data.id ? { ...x, souvenirClaimed: data.souvenirClaimed, souvenirClaimedAt: data.souvenirClaimedAt || undefined } : x));
    };
    const onDeleted = (id: string) => setGuests(prev => prev.filter(x => x.id !== id));
    const onReset = () => setGuests([]);
    socket.on('guest:created', onCreated);
    socket.on('guest:updated', onUpdated);
    socket.on('guest:checked_in', onUpdated);
    socket.on('guest:souvenir_claimed', onSouvenirClaimed);
    socket.on('guest:deleted', onDeleted);
    socket.on('guests:imported', fetchGuests);
    socket.on('guests:reset', onReset);
    return () => {
      socket.off('guest:created', onCreated);
      socket.off('guest:updated', onUpdated);
      socket.off('guest:checked_in', onUpdated);
      socket.off('guest:souvenir_claimed', onSouvenirClaimed);
      socket.off('guest:deleted', onDeleted);
      socket.off('guests:imported', fetchGuests);
      socket.off('guests:reset', onReset);
    };
  }, []);

  // Calculate live countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const targetTime = new Date(weddingConfig?.dateISO || '2026-09-20T08:00:00+07:00').getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setCountdownLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCountdownLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingConfig?.dateISO]);

  // Route synchronization
  useEffect(() => {
    if (currentRoute === 'modules' && !isAuthenticated) {
      if (onReplace) {
        onReplace('/login');
      } else {
        window.history.replaceState(null, '', '/login');
      }
    } else if (currentRoute === 'login' && isAuthenticated) {
      if (onReplace) {
        onReplace('/modules');
      } else {
        window.history.replaceState(null, '', '/modules');
      }
    }
  }, [currentRoute, isAuthenticated, onReplace]);

  // Body scroll lock on modal open
  useEffect(() => {
    if (deleteModal || isMobileSidebarOpen || isPasswordModalOpen || isExportModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [deleteModal, isMobileSidebarOpen, isPasswordModalOpen, isExportModalOpen]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_user');
      sessionStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token');
    } catch {
      // Safe fallback
    }
    setIsAuthenticated(false);
    if (onNavigate) {
      onNavigate('/login');
    } else {
      window.history.pushState(null, '', '/login');
    }
  };

  // Tangani sesi token kedaluwarsa dari respons API
  useEffect(() => {
    const handleUnauthorized = () => {
      showToast('error', 'Sesi login Anda telah kedaluwarsa. Silakan masuk kembali.');
      handleLogout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPasswordInput || !newPasswordInput) {
      showToast('error', 'Password lama dan password baru wajib diisi!');
      return;
    }
    if (newPasswordInput.length < 6) {
      showToast('error', 'Password baru minimal 6 karakter!');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      showToast('error', 'Konfirmasi password baru tidak cocok!');
      return;
    }

    setIsSubmittingPassword(true);
    try {
      let username = 'superadmin';
      try {
        const stored = sessionStorage.getItem('admin_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.username) username = parsed.username;
        }
      } catch {}

      const res = await api.changePassword({
        username,
        oldPassword: oldPasswordInput,
        newPassword: newPasswordInput,
      });

      showToast('success', res.message || 'Password admin berhasil diperbarui di database!');
      setIsPasswordModalOpen(false);
      setOldPasswordInput('');
      setNewPasswordInput('');
      setConfirmPasswordInput('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui password';
      showToast('error', msg);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // Delete modal triggers
  const requestDeleteWish = (wish: Wish) => {
    if (!wish.id) return;
    setDeleteModal({
      type: 'wish',
      id: wish.id,
      title: 'Hapus Ucapan & Doa?',
      description: `Apakah Anda yakin ingin menghapus ucapan dari "${wish.name}"? Tindakan ini tidak dapat dibatalkan.`,
    });
  };

  const requestDeleteRsvp = (rsvp: RSVPResponse) => {
    if (!rsvp.id) return;
    setDeleteModal({
      type: 'rsvp',
      id: rsvp.id,
      title: 'Hapus Data RSVP?',
      description: `Apakah Anda yakin ingin menghapus respon RSVP dari "${rsvp.name}"? Tindakan ini permanen dan tidak dapat dibatalkan.`,
    });
  };

  const requestDeleteGuest = (guest: GuestInvitation) => {
    if (!guest.id) return;
    setDeleteModal({
      type: 'guest',
      id: guest.id,
      title: 'Hapus Tamu Undangan?',
      description: `Apakah Anda yakin ingin menghapus "${guest.name}" dari daftar tamu undangan? Tindakan ini permanen dan tidak dapat dibatalkan.`,
    });
  };

  const requestResetAllGuests = () => {
    if (guests.length === 0) return;
    setDeleteModal({
      type: 'all_guests',
      id: 'ALL',
      title: 'Hapus Seluruh Daftar Tamu?',
      description: `Apakah Anda yakin ingin mengosongkan seluruh daftar (${guests.length} tamu)? Seluruh riwayat pengiriman pesan juga akan terhapus.`,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      if (deleteModal.type === 'wish') {
        await api.deleteWish(deleteModal.id);
        showToast('success', 'Data ucapan berhasil dihapus.');
      } else if (deleteModal.type === 'rsvp') {
        await api.deleteRsvp(deleteModal.id);
        showToast('success', 'Data RSVP berhasil dihapus.');
      } else if (deleteModal.type === 'guest') {
        await api.deleteGuest(deleteModal.id);
        showToast('success', 'Data tamu berhasil dihapus.');
      } else if (deleteModal.type === 'all_guests') {
        await api.resetAllGuests();
        showToast('success', 'Seluruh data tamu berhasil direset.');
      }
    } catch {
      showToast('error', 'Gagal menghapus data.');
    } finally {
      setDeleteModal(null);
    }
  };

  // Broadcast rundown status to guests
  const handleBroadcastRundown = async (overrides?: Partial<LiveRundownStatus>) => {
    setIsBroadcastingRundown(true);
    try {
      const isAct = overrides?.active !== undefined ? overrides.active : (overrides?.isActive !== undefined ? overrides.isActive : rundownActive);
      const noteMsg = overrides?.broadcastMessage !== undefined ? overrides.broadcastMessage : (overrides?.customNote !== undefined ? overrides.customNote : rundownMessage);

      const payload: LiveRundownStatus = {
        active: isAct,
        isActive: isAct,
        currentEvent: overrides?.currentEvent !== undefined ? overrides.currentEvent : rundownCurrentEvent,
        currentEventTime: overrides?.currentEventTime !== undefined ? overrides.currentEventTime : rundownCurrentTime,
        broadcastMessage: noteMsg,
        customNote: noteMsg,
        lastUpdated: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await api.broadcastRundown(payload);
      setRundownActive(Boolean(payload.active));
      setRundownCurrentEvent(payload.currentEvent);
      setRundownCurrentTime(payload.currentEventTime || '');
      setRundownMessage(payload.broadcastMessage || '');

      if (weddingConfig) {
        await updateWeddingConfig({
          ...weddingConfig,
          liveRundown: payload,
        });
      }

      showToast(
        'success',
        payload.active
          ? `Status rundown "${payload.currentEvent}" berhasil disiarkan secara live ke seluruh tamu!`
          : 'Siaran status live rundown telah dinonaktifkan.'
      );
    } catch {
      showToast('error', 'Gagal menyiarkan status rundown ke server.');
    } finally {
      setIsBroadcastingRundown(false);
    }
  };

  const handleApplyRundownPreset = async (preset: { title: string; time: string; note: string }) => {
    setRundownActive(true);
    setRundownCurrentEvent(preset.title);
    setRundownCurrentTime(preset.time);
    setRundownMessage(preset.note);
    await handleBroadcastRundown({
      active: true,
      currentEvent: preset.title,
      currentEventTime: preset.time,
      broadcastMessage: preset.note,
    });
  };

  // Calculations for overview stats
  const totalAttending = useMemo(() => {
    return rsvps
      .filter(r => r.attendance === 'hadir')
      .reduce((acc, r) => acc + (Number(r.guestCount) || 1), 0);
  }, [rsvps]);

  const totalNotAttending = useMemo(() => {
    return rsvps.filter(r => r.attendance !== 'hadir').length;
  }, [rsvps]);

  const totalResponses = rsvps.length;
  const attendanceRate = totalResponses > 0 
    ? Math.round((rsvps.filter(r => r.attendance === 'hadir').length / totalResponses) * 100) 
    : 0;

  // CSV Export for RSVP data (Quick Action)
  const exportRsvpToCsv = () => {
    if (rsvps.length === 0) {
      showToast('error', 'Belum ada data RSVP untuk diekspor.');
      return;
    }

    const headers = ['No', 'Nama Tamu', 'Kehadiran', 'Jumlah Tamu', 'Catatan / Doa', 'Waktu Konfirmasi'];
    const rows = rsvps.map((r, i) => {
      let formattedDate = '-';
      if (r.createdAt && typeof (r.createdAt as { toDate?: () => Date }).toDate === 'function') {
        formattedDate = (r.createdAt as { toDate: () => Date }).toDate().toLocaleString('id-ID');
      }
      return [
        (i + 1).toString(),
        `"${(r.name || '').replace(/"/g, '""')}"`,
        r.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir',
        (r.guestCount || 1).toString(),
        `"${(r.notes || '').replace(/"/g, '""')}"`,
        `"${formattedDate}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap-rsvp-wedding-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Rekap data RSVP berhasil diunduh (CSV)!');
  };

  if (!isAuthenticated) {
    return (
      <Login
        groomName={weddingConfig?.groom?.nickname || 'Mempelai Pria'}
        brideName={weddingConfig?.bride?.nickname || 'Mempelai Wanita'}
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          if (onNavigate) {
            onNavigate('/modules');
          } else {
            window.history.pushState(null, '', '/modules');
          }
        }}
        onNavigateBack={() => {
          if (onNavigate) {
            onNavigate('/');
          } else {
            window.location.href = '/';
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex flex-col antialiased text-text-dark selection:bg-sage/30">
      {/* TOPBAR HEADER */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-sage-dark hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            title="Buka Menu Sidebar"
            aria-label="Buka Menu Sidebar"
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage/15 text-sage-dark flex items-center justify-center font-bold text-sm shadow-2xs">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <span>Panel Modules</span>
                <span>/</span>
                <span className="text-sage-dark font-semibold capitalize">{activeMenu}</span>
              </div>
              <h1 className="text-sm sm:text-base font-heading font-bold text-text-dark leading-none mt-0.5">
                {activeMenu === 'overview' && 'Ringkasan Dashboard'}
                {activeMenu === 'reception' && 'Meja Resepsi & Check-in Tamu'}
                {activeMenu === 'seating' && 'Manajemen Meja & Seating Chart'}
                {activeMenu === 'generator' && 'WhatsApp Link Generator'}
                {activeMenu === 'config' && 'Kelola Konten Undangan'}
                {activeMenu === 'budget' && 'Wedding Budget & Checklist Vendor'}
                {activeMenu === 'trivia' && 'Wedding Trivia & Games'}
                {activeMenu === 'rsvps' && 'Buku Tamu & RSVP'}
                {activeMenu === 'wishes' && 'Doa & Ucapan Restu'}
              </h1>
            </div>
          </div>
        </div>

        {/* Topbar Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Panel Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Panel Mode</span>
          </div>

          {/* Direct Link to Invitation */}
          <button
            type="button"
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/90 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-98"
            title="Pratinjau Undangan Publik di Tab Baru"
          >
            <ExternalLink size={14} className="text-sage-dark" />
            <span className="hidden sm:inline">Lihat Web</span>
          </button>

          {/* Export & Report Suite Button */}
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100/90 border border-amber-200/80 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-98"
            title="Pusat Laporan & Ekspor Data (Excel & PDF)"
          >
            <Download size={14} className="text-amber-600" />
            <span className="hidden sm:inline">Laporan & Ekspor</span>
          </button>

          {/* Change Password Button */}
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/90 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-98"
            title="Ubah Password Akun Admin"
          >
            <KeyRound size={14} className="text-amber-600" />
            <span className="hidden sm:inline">Ganti Password</span>
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-200/80 rounded-xl transition-colors cursor-pointer shadow-2xs active:scale-98"
            title="Keluar dari sesi admin"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD MAIN LAYOUT CONTAINER */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200/80 shrink-0 select-none justify-between">
          <div>
            {/* Cultural Betawi Brand Header */}
            <div className="p-5 border-b border-gray-100 bg-linear-to-br from-warm-white to-gray-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-amber-50 to-emerald-50 border border-gold/30 flex items-center justify-center text-sage-dark shadow-xs">
                  <Sparkles size={20} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-text-dark tracking-tight">
                    Mari Partner
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">Wedding Invitation</p>
                </div>
              </div>

              {/* Active Couple Banner Card */}
              <div className="mt-3.5 p-2.5 bg-sage/10 border border-sage/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-betawi-red shrink-0 fill-betawi-red" />
                  <span className="text-xs font-semibold text-sage-dark truncate">
                    {weddingConfig?.groom?.nickname || 'Groom'} & {weddingConfig?.bride?.nickname || 'Bride'}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/60 shadow-2xs">
                  Active
                </span>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="p-3.5 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5">
                Menu Utama
              </span>

              <button
                type="button"
                onClick={() => setActiveMenu('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'overview'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={16} />
                  <span>Ringkasan Dashboard</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('reception')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'reception'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <QrCode size={16} />
                  <span>Meja Resepsi</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  activeMenu === 'reception' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  Hari-H
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('seating')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'seating'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Armchair size={16} />
                  <span>Seating Chart</span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                  activeMenu === 'seating' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  Ballroom
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('generator')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'generator'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LinkIcon size={16} />
                  <span>Generator Link WA</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeMenu === 'generator' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {guests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('config')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'config'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal size={16} />
                  <span>Kelola Undangan</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('budget')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'budget'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet size={16} />
                  <span>Budget & Vendor</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('trivia')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'trivia'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad2 size={16} />
                  <span>Wedding Trivia</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('rsvps')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'rsvps'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users size={16} />
                  <span>Buku Tamu (RSVP)</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeMenu === 'rsvps' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {rsvps.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenu('wishes')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeMenu === 'wishes'
                    ? 'bg-sage-dark text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={16} />
                  <span>Doa & Ucapan Restu</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeMenu === 'wishes' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {wishes.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
              <span>Versi Sistem</span>
              <span className="font-mono font-semibold px-2 py-0.5 bg-white border border-gray-200 rounded-md">v{APP_VERSION}</span>
            </div>
          </div>
        </aside>

        {/* MOBILE SLIDE-OVER DRAWER SIDEBAR */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 z-50 lg:hidden flex"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" />

            {/* Drawer Content */}
            <div 
              className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-warm-white">
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={18} className="text-gold" />
                    <div>
                      <span className="font-heading font-bold text-sm block leading-tight">Mari Partner</span>
                      <span className="text-[10px] text-gray-500 font-medium block">Wedding Invitation</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <nav className="p-3 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('overview'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'overview' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LayoutDashboard size={16} />
                    <span>Ringkasan Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('reception'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'reception' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <QrCode size={16} />
                      <span>Meja Resepsi</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Hari-H
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('seating'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'seating' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Armchair size={16} />
                      <span>Seating Chart</span>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Ballroom
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('generator'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'generator' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <LinkIcon size={16} />
                    <span>Generator Link WA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('config'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      activeMenu === 'config' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    <span>Kelola Undangan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('budget'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      activeMenu === 'budget' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Wallet size={16} />
                    <span>Budget & Vendor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('trivia'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      activeMenu === 'trivia' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Gamepad2 size={16} />
                    <span>Wedding Trivia & Games</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('rsvps'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'rsvps' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users size={16} />
                      <span>Buku Tamu (RSVP)</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold">{rsvps.length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveMenu('wishes'); setIsMobileSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'wishes' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare size={16} />
                      <span>Doa & Ucapan Restu</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold">{wishes.length}</span>
                  </button>
                </nav>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Panel Modules v{APP_VERSION}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-red-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWPORT CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ========================================================================= */}
          {/* MENU 1: RINGKASAN DASHBOARD (OVERVIEW) */}
          {/* ========================================================================= */}
          {activeMenu === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Event Countdown & Welcome Banner */}
              <div className="bg-linear-to-r from-sage-dark via-[#435334] to-[#2C3E2D] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
                {/* Subtle Betawi Ornament Watermark */}
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-10 translate-y-10">
                  <Sparkles size={240} />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex flex-col gap-1.5 max-w-lg">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold uppercase tracking-widest">
                      <Sparkles size={14} /> The Wedding Celebration
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold">
                      {weddingConfig?.groom?.nickname || 'Mempelai Pria'} & {weddingConfig?.bride?.nickname || 'Mempelai Wanita'}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      {weddingConfig?.dateStr || 'Minggu, 20 September 2026'} &bull; {weddingConfig?.events?.akad?.venue || 'Masjid Raya Betawi'}
                    </p>
                    <div className="mt-2.5">
                      <button
                        type="button"
                        onClick={() => setIsExportModalOpen(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer shadow-xs active:scale-98"
                      >
                        <Download size={14} className="text-gold" />
                        <span>Ekspor Laporan Pernikahan (Excel / PDF)</span>
                      </button>
                    </div>
                  </div>

                  {/* Live Countdown Timer Cards */}
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <div className="flex flex-col items-center px-2 sm:px-3">
                      <span className="text-lg sm:text-2xl font-bold font-mono">{countdownLeft.days}</span>
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider">Hari</span>
                    </div>
                    <span className="text-gray-400 font-bold">:</span>
                    <div className="flex flex-col items-center px-2 sm:px-3">
                      <span className="text-lg sm:text-2xl font-bold font-mono">{countdownLeft.hours}</span>
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider">Jam</span>
                    </div>
                    <span className="text-gray-400 font-bold">:</span>
                    <div className="flex flex-col items-center px-2 sm:px-3">
                      <span className="text-lg sm:text-2xl font-bold font-mono">{countdownLeft.minutes}</span>
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider">Menit</span>
                    </div>
                    <span className="text-gray-400 font-bold">:</span>
                    <div className="flex flex-col items-center px-2 sm:px-3">
                      <span className="text-lg sm:text-2xl font-bold font-mono text-gold">{countdownLeft.seconds}</span>
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider">Detik</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Core KPI Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Tamu Hadir */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tamu Hadir</span>
                    <span className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1">{totalAttending}</span>
                    <span className="text-[11px] text-emerald-600 font-medium mt-0.5">Orang terkonfirmasi</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Users size={24} />
                  </div>
                </div>

                {/* 2. Tamu Berhalangan */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Berhalangan</span>
                    <span className="text-2xl sm:text-3xl font-bold text-red-700 mt-1">{totalNotAttending}</span>
                    <span className="text-[11px] text-red-600 font-medium mt-0.5">Tidak dapat hadir</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0">
                    <UserX size={24} />
                  </div>
                </div>

                {/* 3. Total Respon & Rate */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Respon</span>
                    <span className="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">{totalResponses}</span>
                    <span className="text-[11px] text-blue-600 font-medium mt-0.5">{attendanceRate}% Kehadiran</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                </div>

                {/* 4. Doa & Restu */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Doa Masuk</span>
                    <span className="text-2xl sm:text-3xl font-bold text-amber-700 mt-1">{wishes.length}</span>
                    <span className="text-[11px] text-amber-600 font-medium mt-0.5">Ucapan selamat</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                    <MessageSquareHeart size={24} />
                  </div>
                </div>
              </div>

              {/* Attendance Ratio Visual Progress Bar */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-dark flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" /> Rasio Konfirmasi Kehadiran Tamu
                  </span>
                  <span className="font-semibold text-gray-600">
                    {attendanceRate}% Hadir ({rsvps.filter(r => r.attendance === 'hadir').length} dari {totalResponses} respon)
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${attendanceRate}%` }} 
                    className="bg-emerald-500 h-full transition-all duration-500 rounded-l-full" 
                    title={`Hadir: ${attendanceRate}%`}
                  />
                  <div 
                    style={{ width: `${100 - attendanceRate}%` }} 
                    className="bg-red-400 h-full transition-all duration-500 rounded-r-full" 
                    title={`Tidak Hadir: ${100 - attendanceRate}%`}
                  />
                </div>
                <div className="flex items-center gap-4 text-[11px] text-gray-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Hadir ({totalAttending} Orang)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span>Tidak Hadir ({totalNotAttending} Tamu)</span>
                  </span>
                </div>
              </div>

              {/* LIVE WEDDING RUNDOWN BROADCAST CONTROL (WO Hari-H Suite) */}
              <div className="bg-linear-to-br from-gray-900 via-gray-850 to-gray-900 text-white rounded-3xl p-6 border border-gray-700/60 shadow-xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-gray-750">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      rundownActive ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/30 animate-pulse' : 'bg-gray-800 text-gray-400'
                    }`}>
                      <Radio size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-base font-bold">
                          Live Wedding Rundown Broadcaster
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          rundownActive ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-750 text-gray-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${rundownActive ? 'bg-white' : 'bg-gray-500'}`} />
                          {rundownActive ? 'Siaran Live Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Siarkan status rangkaian acara hari-H secara instan (real-time via Socket.io) ke floating banner di layar ponsel tamu undangan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isBroadcastingRundown}
                      onClick={() => handleBroadcastRundown({ active: !rundownActive })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                        rundownActive
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Radio size={14} />
                      <span>{rundownActive ? 'Matikan Siaran Live' : 'Nyalakan Siaran Live'}</span>
                    </button>
                  </div>
                </div>

                {/* Broadcast Inputs & 1-Click Presets */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
                  {/* Left (5 cols): Active Custom Inputs */}
                  <div className="lg:col-span-5 flex flex-col gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Nama Agenda / Sesi Saat Ini
                      </label>
                      <input
                        type="text"
                        value={rundownCurrentEvent}
                        onChange={(e) => setRundownCurrentEvent(e.target.value)}
                        placeholder="Contoh: Prasmanan Resepsi Telah Dibuka"
                        className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-sage"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Waktu / Durasi
                        </label>
                        <input
                          type="text"
                          value={rundownCurrentTime}
                          onChange={(e) => setRundownCurrentTime(e.target.value)}
                          placeholder="Contoh: 11:30 - 13:30"
                          className="w-full bg-gray-800/80 border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Aksi Cepat
                        </label>
                        <button
                          type="button"
                          disabled={isBroadcastingRundown}
                          onClick={() => handleBroadcastRundown({ active: true })}
                          className="w-full bg-sage-dark hover:bg-sage text-white py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <Send size={13} />
                          <span>Siarkan Sekarang</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                        Pesan Pengumuman Singkat untuk Tamu (Opsional)
                      </label>
                      <textarea
                        rows={2}
                        value={rundownMessage}
                        onChange={(e) => setRundownMessage(e.target.value)}
                        placeholder="Contoh: Silakan menikmati hidangan utama dan aneka stall di area ballroom..."
                        className="w-full bg-gray-800/80 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder:text-gray-500 resize-none focus:outline-none focus:ring-1 focus:ring-sage"
                      />
                    </div>
                  </div>

                  {/* Right (7 cols): Quick 1-Click Status Presets */}
                  <div className="lg:col-span-7 flex flex-col gap-2.5">
                    <label className="block text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                      Preset 1-Klik Rangkaian Hari-H (Wedding Organizer Fast Switch)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {RUNDOWN_QUICK_PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplyRundownPreset(p)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 group ${
                            rundownCurrentEvent === p.title && rundownActive
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-gray-800/60 hover:bg-gray-800 border-gray-700 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-gray-400 group-hover:text-gray-200">
                              {p.time}
                            </span>
                            {rundownCurrentEvent === p.title && rundownActive && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            )}
                          </div>
                          <span className="text-xs font-bold leading-tight line-clamp-2">
                            {p.title}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 italic mt-1">
                      Klik salah satu preset di atas untuk langsung menyiarkan status agenda hari-H ke floating pill banner di seluruh ponsel tamu undangan tanpa perlu reload halaman.
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Shortcuts Grid */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-3">
                <h3 className="font-heading text-sm font-bold text-text-dark">Aksi Cepat</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveMenu('reception')}
                    className="p-3.5 rounded-xl border border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-100/40 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <QrCode size={18} className="text-amber-700 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Meja Resepsi</span>
                      <span className="text-[11px] text-amber-800/80 font-medium">Scan QR Hari-H</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('seating')}
                    className="p-3.5 rounded-xl border border-blue-200 hover:border-blue-400 bg-blue-50/40 hover:bg-blue-100/40 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <Armchair size={18} className="text-blue-700 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Seating Chart</span>
                      <span className="text-[11px] text-blue-800/80 font-medium">Denah Meja</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('budget')}
                    className="p-3.5 rounded-xl border border-emerald-200 hover:border-emerald-400 bg-emerald-50/40 hover:bg-emerald-100/40 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <Wallet size={18} className="text-emerald-700 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Budget & Vendor</span>
                      <span className="text-[11px] text-emerald-800/80 font-medium">Finansial & Logistik</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('trivia')}
                    className="p-3.5 rounded-xl border border-amber-200 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-100/40 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <Gamepad2 size={18} className="text-amber-700 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Wedding Trivia</span>
                      <span className="text-[11px] text-amber-800/80 font-medium">Soal & Skor Tamu</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.open('/live', '_blank')}
                    className="p-3.5 rounded-xl border border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-100/40 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <Tv size={18} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Layar Panggung</span>
                      <span className="text-[11px] text-indigo-700/80 font-medium">Live Proyektor</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveMenu('generator')}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-sage bg-gray-50/50 hover:bg-sage/5 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <LinkIcon size={18} className="text-sage-dark group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Buat Link Tamu</span>
                      <span className="text-[11px] text-gray-500">Kirim link via WA</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={exportRsvpToCsv}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <Download size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Unduh Rekap CSV</span>
                      <span className="text-[11px] text-gray-500">Cetak data RSVP</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveMenu('config'); setConfigSubTab('events'); }}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-500 bg-gray-50/50 hover:bg-blue-50/20 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <Calendar size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Atur Jadwal Acara</span>
                      <span className="text-[11px] text-gray-500">Akad & Resepsi</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setActiveMenu('config'); setConfigSubTab('gallery'); }}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-purple-500 bg-gray-50/50 hover:bg-purple-50/20 transition-all text-left flex flex-col gap-2 cursor-pointer group"
                  >
                    <ImageIcon size={18} className="text-purple-600 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="block text-xs font-bold text-gray-800">Upload Galeri Foto</span>
                      <span className="text-[11px] text-gray-500">Kelola album foto</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Activity Split View */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent RSVPs */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-sage-dark" />
                      <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider">RSVP Terbaru</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('rsvps')}
                      className="text-xs text-sage-dark hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Lihat Semua</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {rsvps.slice(0, 4).length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">Belum ada respon RSVP masuk.</p>
                    ) : (
                      rsvps.slice(0, 4).map((r) => (
                        <div key={r.id} className="p-2.5 bg-gray-50/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-gray-800 truncate">{r.name}</span>
                            <span className="text-[11px] text-gray-500 truncate italic">{r.notes || 'Tanpa pesan tambahan'}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                            r.attendance === 'hadir' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {r.attendance === 'hadir' ? `Hadir (${r.guestCount})` : 'Tidak Hadir'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent Wishes */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-gold" />
                      <h4 className="text-xs font-bold text-text-dark uppercase tracking-wider">Doa Restu Terbaru</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveMenu('wishes')}
                      className="text-xs text-sage-dark hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Lihat Semua</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {wishes.slice(0, 4).length === 0 ? (
                      <p className="text-xs text-gray-400 py-6 text-center">Belum ada ucapan doa masuk.</p>
                    ) : (
                      wishes.slice(0, 4).map((w) => (
                        <div key={w.id} className="p-2.5 bg-gray-50/80 rounded-xl flex flex-col gap-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-800">{w.name}</span>
                            <span className="text-[10px] text-gray-400">{w.time || 'Baru saja'}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 italic line-clamp-1">"{w.text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MENU 2: MEJA RESEPSI (QR SCANNER & CHECK-IN HARI-H) */}
          {/* ========================================================================= */}
          {activeMenu === 'reception' && (
            <ReceptionCheckin
              guests={guests}
              rsvps={rsvps}
              showToast={showToast}
            />
          )}

          {/* ========================================================================= */}
          {/* MENU: MANAJEMEN MEJA & SEATING CHART BALLROOM */}
          {/* ========================================================================= */}
          {activeMenu === 'seating' && (
            <SeatingChartManager onNotify={(msg, type) => showToast(type, msg)} />
          )}

          {/* ========================================================================= */}
          {/* MENU: GENERATOR & MANAJEMEN TAMU WHATSAPP */}
          {/* ========================================================================= */}
          {activeMenu === 'generator' && (
            <GuestManagerTab
              guests={guests}
              setGuests={setGuests}
              weddingConfig={weddingConfig || {} as any}
              showToast={showToast}
              onRequestDeleteGuest={requestDeleteGuest}
              onRequestResetAllGuests={requestResetAllGuests}
              rsvps={rsvps}
            />
          )}

          {/* ========================================================================= */}
          {/* MENU 3: KELOLA KONTEN UNDANGAN */}
          {/* ========================================================================= */}
          {activeMenu === 'config' && weddingConfig && (
            <ConfigEditorTab
              weddingConfig={weddingConfig}
              updateWeddingConfig={updateWeddingConfig}
              showToast={showToast}
              subTab={configSubTab}
              onSubTabChange={setConfigSubTab}
            />
          )}

          {/* ========================================================================= */}
          {/* MENU 5: WEDDING BUDGET & VENDOR TRACKER */}
          {/* ========================================================================= */}
          {activeMenu === 'budget' && (
            <BudgetVendorTracker onNotify={(msg, type) => showToast(type, msg)} />
          )}

          {/* ========================================================================= */}
          {/* MENU: WEDDING TRIVIA & MINI GAMES */}
          {/* ========================================================================= */}
          {activeMenu === 'trivia' && (
            <TriviaQuizManager onNotify={(msg, type) => showToast(type, msg)} />
          )}

          {/* ========================================================================= */}
          {/* MENU 6: BUKU TAMU & RSVP */}
          {/* ========================================================================= */}
          {activeMenu === 'rsvps' && (
            <RsvpManagerTab
              rsvps={rsvps}
              guests={guests}
              weddingConfig={weddingConfig || {} as any}
              showToast={showToast}
              onRequestDeleteRsvp={requestDeleteRsvp}
            />
          )}

          {/* ========================================================================= */}
          {/* MENU 7: DOA & UCAPAN RESTU */}
          {/* ========================================================================= */}
          {activeMenu === 'wishes' && (
            <WishesManagerTab
              wishes={wishes}
              showToast={showToast}
              onRequestDeleteWish={requestDeleteWish}
            />
          )}
        </main>
      </div>

      {/* Full-Screen Viewport Backdrop Modal: Ubah Password Akun Admin */}
      {isPasswordModalOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200"
          onClick={() => {
            if (!isSubmittingPassword) setIsPasswordModalOpen(false);
          }}
        >
          <div 
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-gray-900">
                    Ubah Password Admin
                  </h3>
                  <p className="text-[11px] text-gray-500">Tersimpan aman di database MySQL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                disabled={isSubmittingPassword}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Password Lama <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                  <input
                    type="password"
                    required
                    value={oldPasswordInput}
                    onChange={(e) => setOldPasswordInput(e.target.value)}
                    placeholder="Masukkan password saat ini (default: password)"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Ulangi Password Baru <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    placeholder="Ketik ulang password baru Anda"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={isSubmittingPassword}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <X size={15} />
                  <span>Batal</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPassword || !oldPasswordInput || !newPasswordInput || !confirmPasswordInput}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSubmittingPassword ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <span>Simpan Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export & Report Center Suite Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onNotify={showToast}
        initialGuests={guests}
        initialRsvps={rsvps}
      />

      {/* SweetAlert2-Style Full-Screen Viewport Confirmation Modal */}
      {deleteModal && (
        <div 
          className="fixed inset-0 w-screen h-screen z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200"
          onClick={() => setDeleteModal(null)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Danger Badge */}
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shadow-xs ring-8 ring-red-50/60">
              <Trash2 size={28} />
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-heading text-xl text-text-dark font-bold">
                {deleteModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs">
                {deleteModal.description}
              </p>
            </div>

            <div className="flex w-full gap-3 mt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <X size={15} />
                <span>Batal</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow"
              >
                <Trash2 size={15} />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Modern Toast Notification */}
      {toastNotification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
          toastNotification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toastNotification.type === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-red-600 shrink-0" />
          )}
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
}

export const AdminPanel = Panel;
