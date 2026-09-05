import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, Link as LinkIcon, Users, UserX, MessageSquare, MessageSquareHeart, 
  Save, Plus, Trash2, Copy, Check, X, LogOut, Music, Heart, Calendar, 
  Image as ImageIcon, CreditCard, Share2, AlertCircle, Clock, Building, 
  MapPin, Search, RotateCcw, User, KeyRound, Globe, FileText, CheckCircle2, 
  Download, ExternalLink, Menu, LayoutDashboard, SlidersHorizontal, 
  ArrowUpRight, ShieldCheck, Sparkles, BookOpen, Upload, UserPlus, 
  FileSpreadsheet, Phone, Send, Clock4, Filter, CheckCheck, ArrowUp, ArrowDown
} from 'lucide-react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, updateDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { WeddingConfig, RSVPResponse, Wish, GuestInvitation } from '../../types';
import { Login } from '../Auth/Login';
import { DragDropUpload } from './components/DragDropUpload';
import { EventScheduleEditor } from './components/EventScheduleEditor';
import * as XLSX from 'xlsx';

export interface PanelProps {
  currentRoute?: 'login' | 'modules';
  onNavigate?: (path: string) => void;
  onReplace?: (path: string) => void;
}

export type AdminPanelProps = PanelProps;

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas foto'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        resolve(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

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
  const [activeMenu, setActiveMenu] = useState<'overview' | 'generator' | 'config' | 'rsvps' | 'wishes'>('overview');
  const [configSubTab, setConfigSubTab] = useState<'couple' | 'events' | 'gallery' | 'story' | 'music_gift' | 'seo'>('couple');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Form state for config
  const [formData, setFormData] = useState<WeddingConfig>(weddingConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Link generator state
  const [guestName, setGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Firestore live data state
  const [rsvps, setRsvps] = useState<RSVPResponse[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [guests, setGuests] = useState<GuestInvitation[]>([]);

  // In-memory live search state (Zero URL Pollution)
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');
  const [wishSearchQuery, setWishSearchQuery] = useState('');
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [guestStatusFilter, setGuestStatusFilter] = useState<'all' | 'pending' | 'sent'>('all');
  const [guestViewMode, setGuestViewMode] = useState<'list' | 'single'>('list');

  // Add guest modal state
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importActiveTab, setImportActiveTab] = useState<'file' | 'text'>('file');
  const [importTextContent, setImportTextContent] = useState('');
  const [parsedGuestsPreview, setParsedGuestsPreview] = useState<Array<{ name: string; phone?: string; isValid: boolean; errorReason?: string }>>([]);
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const [importFileName, setImportFileName] = useState('');

  // Confirmation modal & toast state
  const [deleteModal, setDeleteModal] = useState<{
    type: 'wish' | 'rsvp' | 'guest' | 'all_guests';
    id: string;
    title: string;
    description: string;
  } | null>(null);

  const [toastNotification, setToastNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToastNotification({ type, message });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Upload loading state
  const [uploadingAvatar, setUploadingAvatar] = useState<'groom' | 'bride' | 'seo' | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Countdown timer calculation for overview widget
  const [countdownLeft, setCountdownLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (weddingConfig) {
      setFormData(weddingConfig);
    }
  }, [weddingConfig]);

  // Sync RSVPs from Firestore
  useEffect(() => {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RSVPResponse));
      setRsvps(docs);
    });
    return () => unsubscribe();
  }, []);

  // Sync Wishes from Firestore
  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wish));
      setWishes(docs);
    });
    return () => unsubscribe();
  }, []);

  // Sync Guests from Firestore
  useEffect(() => {
    const q = query(collection(db, 'guests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GuestInvitation));
      setGuests(docs);
    }, () => {
      // Safe fallback for permission/connection
    });
    return () => unsubscribe();
  }, []);

  // Calculate live countdown
  useEffect(() => {
    const calculateCountdown = () => {
      const targetTime = new Date(formData.dateISO || '2026-09-20T08:00:00+07:00').getTime();
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
  }, [formData.dateISO]);

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
    if (deleteModal || isMobileSidebarOpen || isImportModalOpen || isAddGuestModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [deleteModal, isMobileSidebarOpen, isImportModalOpen, isAddGuestModalOpen]);

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('admin_authenticated');
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

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWeddingConfig(formData);
      setSaveSuccess(true);
      showToast('success', 'Perubahan berhasil disimpan ke Firestore!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save config:', err);
      showToast('error', 'Gagal menyimpan perubahan ke Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveStory = (idx: number, direction: 'up' | 'down') => {
    const list = [...(formData.loveStory || [])];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setFormData({ ...formData, loveStory: list });
    showToast('success', `Momen cerita dipindahkan ke posisi #${targetIdx + 1}`);
  };

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
        await deleteDoc(doc(db, 'wishes', deleteModal.id));
        showToast('success', 'Data ucapan berhasil dihapus dari Firestore.');
      } else if (deleteModal.type === 'rsvp') {
        await deleteDoc(doc(db, 'rsvps', deleteModal.id));
        showToast('success', 'Data RSVP berhasil dihapus dari Firestore.');
      } else if (deleteModal.type === 'guest') {
        await deleteDoc(doc(db, 'guests', deleteModal.id));
        showToast('success', 'Data tamu berhasil dihapus dari Firestore.');
      } else if (deleteModal.type === 'all_guests') {
        const CHUNK_SIZE = 450;
        for (let i = 0; i < guests.length; i += CHUNK_SIZE) {
          const chunk = guests.slice(i, i + CHUNK_SIZE);
          const batch = writeBatch(db);
          for (const g of chunk) {
            if (g.id) batch.delete(doc(db, 'guests', g.id));
          }
          await batch.commit();
        }
        showToast('success', 'Seluruh data tamu berhasil direset.');
      }
    } catch {
      showToast('error', 'Gagal menghapus data dari Firestore.');
    } finally {
      setDeleteModal(null);
    }
  };

  // Upload handlers
  const handleUploadGroom = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('groom');
    try {
      const dataUrl = await compressImageFile(files[0]);
      setFormData(prev => ({ ...prev, groom: { ...prev.groom, image: dataUrl } }));
      showToast('success', 'Foto mempelai pria berhasil diunggah!');
    } catch {
      showToast('error', 'Gagal memproses foto mempelai pria.');
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleUploadBride = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('bride');
    try {
      const dataUrl = await compressImageFile(files[0]);
      setFormData(prev => ({ ...prev, bride: { ...prev.bride, image: dataUrl } }));
      showToast('success', 'Foto mempelai wanita berhasil diunggah!');
    } catch {
      showToast('error', 'Gagal memproses foto mempelai wanita.');
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleUploadSeo = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('seo');
    try {
      const dataUrl = await compressImageFile(files[0]);
      setFormData(prev => ({ ...prev, seo: { ...prev.seo, image: dataUrl } }));
      showToast('success', 'Foto thumbnail preview SEO berhasil diunggah!');
    } catch {
      showToast('error', 'Gagal memproses thumbnail SEO.');
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleUploadGallery = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const compressedList = await Promise.all(files.map(f => compressImageFile(f)));
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...compressedList]
      }));
      showToast('success', `${compressedList.length} foto berhasil ditambahkan ke galeri!`);
    } catch {
      showToast('error', 'Gagal mengunggah foto galeri.');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleUploadQris = async (files: File[], bankIdx: number) => {
    if (!files[0]) return;
    try {
      const dataUrl = await compressImageFile(files[0]);
      setFormData(prev => {
        const newBanks = [...(prev.banks || (prev.bank ? [prev.bank] : []))];
        newBanks[bankIdx] = {
          ...newBanks[bankIdx],
          qrisImage: dataUrl,
          isQris: true,
          account: '-',
          holder: '-',
        };
        return { ...prev, banks: newBanks };
      });
      showToast('success', 'Gambar barcode QRIS berhasil diunggah!');
    } catch {
      showToast('error', 'Gagal mengunggah gambar QRIS.');
    }
  };

  // Live in-memory filtered RSVP & Wishes
  const filteredRsvps = useMemo(() => {
    const q = rsvpSearchQuery.trim().toLowerCase();
    if (!q) return rsvps;
    return rsvps.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        r.attendance.toLowerCase().includes(q)
    );
  }, [rsvps, rsvpSearchQuery]);

  const filteredWishes = useMemo(() => {
    const q = wishSearchQuery.trim().toLowerCase();
    if (!q) return wishes;
    return wishes.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.text.toLowerCase().includes(q)
    );
  }, [wishes, wishSearchQuery]);

  // Calculations for RSVPs
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

  // CSV Export for RSVP data
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

  // Phone number sanitizer for Indonesian phone numbers
  const sanitizePhoneNumber = (rawPhone: string): string => {
    const cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (!cleaned) return '';
    if (cleaned.startsWith('+62')) {
      return '62' + cleaned.slice(3);
    }
    if (cleaned.startsWith('62')) {
      return cleaned;
    }
    if (cleaned.startsWith('0')) {
      return '62' + cleaned.slice(1);
    }
    if (cleaned.startsWith('8')) {
      return '62' + cleaned;
    }
    return cleaned;
  };

  // Helper generators for WhatsApp URLs and personalized message texts
  const getGuestInvitationUrl = (name: string): string => {
    const base = window.location.origin;
    return name ? `${base}/?to=${encodeURIComponent(name)}` : `${base}/`;
  };

  const getGuestWaMessage = (name: string, link: string): string => {
    return `Assalamu'alaikum Wr. Wb.

Kepada Yth. Bapak/Ibu/Saudara/i ${name || 'Tamu Undangan'},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${formData.groom.nickname} & ${formData.bride.nickname}*

Berikut link undangan digital kami untuk informasi lebih lengkap:
${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih,
Wassalamu'alaikum Wr. Wb.`;
  };

  // Filtered guest list for live search and tab filtering
  const filteredGuests = useMemo(() => {
    let result = guests;
    if (guestStatusFilter !== 'all') {
      result = result.filter(g => g.status === guestStatusFilter);
    }
    const q = guestSearchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) ||
        (g.phone && g.phone.includes(q))
      );
    }
    return result;
  }, [guests, guestStatusFilter, guestSearchQuery]);

  const totalGuestsCount = guests.length;
  const sentGuestsCount = useMemo(() => guests.filter(g => g.status === 'sent').length, [guests]);
  const pendingGuestsCount = totalGuestsCount - sentGuestsCount;

  // Single Guest Actions
  const handleSendGuestWhatsapp = async (guest: GuestInvitation) => {
    const link = getGuestInvitationUrl(guest.name);
    const msg = getGuestWaMessage(guest.name, link);
    const phone = guest.phone ? sanitizePhoneNumber(guest.phone) : '';

    if (guest.id && guest.status !== 'sent') {
      try {
        await updateDoc(doc(db, 'guests', guest.id), {
          status: 'sent',
          sentAt: serverTimestamp(),
        });
      } catch {
        // Continue opening WhatsApp
      }
    }

    let waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    if (phone && phone.length >= 9) {
      waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    }
    window.open(waUrl, '_blank');
    showToast('success', `Membuka WhatsApp untuk ${guest.name}`);
  };

  const handleToggleGuestStatus = async (guest: GuestInvitation) => {
    if (!guest.id) return;
    const newStatus = guest.status === 'sent' ? 'pending' : 'sent';
    try {
      await updateDoc(doc(db, 'guests', guest.id), {
        status: newStatus,
        sentAt: newStatus === 'sent' ? serverTimestamp() : null,
      });
      showToast('success', `Status ${guest.name} diubah ke ${newStatus === 'sent' ? 'Sudah Terkirim' : 'Belum Terkirim'}`);
    } catch {
      showToast('error', 'Gagal memperbarui status pengiriman.');
    }
  };

  const copyGuestLink = async (guest: GuestInvitation) => {
    const link = getGuestInvitationUrl(guest.name);
    await navigator.clipboard.writeText(link);
    showToast('success', `Link untuk "${guest.name}" berhasil disalin!`);
  };

  const copyGuestWaMessage = async (guest: GuestInvitation) => {
    const link = getGuestInvitationUrl(guest.name);
    const msg = getGuestWaMessage(guest.name, link);
    await navigator.clipboard.writeText(msg);
    showToast('success', `Pesan WhatsApp untuk "${guest.name}" berhasil disalin!`);
  };

  // Add Single Guest Form Handler
  const handleAddSingleGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newGuestName.trim();
    if (!trimmedName) {
      showToast('error', 'Nama tamu tidak boleh kosong.');
      return;
    }
    setIsSubmittingGuest(true);
    try {
      const cleanedPhone = newGuestPhone ? sanitizePhoneNumber(newGuestPhone) : '';
      await addDoc(collection(db, 'guests'), {
        name: trimmedName,
        phone: cleanedPhone,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      showToast('success', `Tamu "${trimmedName}" berhasil ditambahkan!`);
      setNewGuestName('');
      setNewGuestPhone('');
      setIsAddGuestModalOpen(false);
    } catch {
      showToast('error', 'Gagal menambahkan tamu ke Firestore.');
    } finally {
      setIsSubmittingGuest(false);
    }
  };

  // Multiline Text Parser
  const parseMultilineGuestText = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const parsed: Array<{ name: string; phone?: string; isValid: boolean; errorReason?: string }> = [];

    for (const line of lines) {
      let name = '';
      let phone = '';

      if (line.includes(';') || line.includes('\t') || line.includes(',')) {
        const delimiter = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
        const parts = line.split(delimiter).map(p => p.trim());
        name = parts[0] || '';
        phone = parts[1] || '';
      } else if (line.includes(' - ')) {
        const parts = line.split(' - ').map(p => p.trim());
        name = parts[0] || '';
        phone = parts[1] || '';
      } else {
        name = line;
      }

      if (!name) {
        parsed.push({ name: line, isValid: false, errorReason: 'Nama tidak boleh kosong' });
        continue;
      }

      const sanitizedPhone = phone ? sanitizePhoneNumber(phone) : '';
      parsed.push({
        name,
        phone: sanitizedPhone,
        isValid: true,
      });
    }

    return parsed;
  };

  const handleProcessTextImport = () => {
    if (!importTextContent.trim()) {
      showToast('error', 'Silakan ketik atau tempel daftar nama tamu.');
      return;
    }
    const result = parseMultilineGuestText(importTextContent);
    setParsedGuestsPreview(result);
  };

  const handleFileSelectedForImport = async (file: File) => {
    setImportFileName(file.name);
    const extension = file.name.split('.').pop()?.toLowerCase();

    try {
      if (extension === 'csv' || extension === 'txt') {
        const text = await file.text();
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) {
          setParsedGuestsPreview([]);
          return;
        }
        let startIndex = 0;
        const firstLineLower = lines[0].toLowerCase();
        if (firstLineLower.includes('nama') || firstLineLower.includes('name')) {
          startIndex = 1;
        }
        const dataLines = lines.slice(startIndex).join('\n');
        const parsed = parseMultilineGuestText(dataLines);
        setParsedGuestsPreview(parsed);
      } else if (extension === 'xlsx' || extension === 'xls') {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

        if (rows.length === 0) {
          setParsedGuestsPreview([]);
          return;
        }

        const row0 = (rows[0] || []).map(cell => String(cell || '').toLowerCase().trim());
        let nameColIdx = 0;
        let phoneColIdx = 1;
        let startRow = 0;

        const detectedNameIdx = row0.findIndex(c => c.includes('nama') || c.includes('name'));
        const detectedPhoneIdx = row0.findIndex(c => c.includes('wa') || c.includes('phone') || c.includes('nomor') || c.includes('telp') || c.includes('hp'));

        if (detectedNameIdx !== -1) {
          nameColIdx = detectedNameIdx;
          startRow = 1;
        }
        if (detectedPhoneIdx !== -1) {
          phoneColIdx = detectedPhoneIdx;
          startRow = 1;
        }

        const parsed: Array<{ name: string; phone?: string; isValid: boolean; errorReason?: string }> = [];
        for (let i = startRow; i < rows.length; i++) {
          const row = rows[i] || [];
          const rawName = String(row[nameColIdx] || '').trim();
          const rawPhone = String(row[phoneColIdx] || '').trim();

          if (!rawName) continue;

          const sanitizedPhone = rawPhone ? sanitizePhoneNumber(rawPhone) : '';
          parsed.push({
            name: rawName,
            phone: sanitizedPhone,
            isValid: true,
          });
        }
        setParsedGuestsPreview(parsed);
      } else {
        showToast('error', 'Format berkas tidak didukung. Harap unggah .xlsx, .xls, atau .csv');
      }
    } catch {
      showToast('error', 'Gagal membaca berkas spreadsheet.');
    }
  };

  const handleCommitImport = async () => {
    const validGuests = parsedGuestsPreview.filter(p => p.isValid && p.name.trim().length > 0);
    if (validGuests.length === 0) {
      showToast('error', 'Tidak ada data tamu valid yang dapat diimpor.');
      return;
    }

    setIsProcessingImport(true);
    try {
      const CHUNK_SIZE = 450;
      for (let i = 0; i < validGuests.length; i += CHUNK_SIZE) {
        const chunk = validGuests.slice(i, i + CHUNK_SIZE);
        const batch = writeBatch(db);
        for (const item of chunk) {
          const docRef = doc(collection(db, 'guests'));
          batch.set(docRef, {
            name: item.name.trim(),
            phone: item.phone ? sanitizePhoneNumber(item.phone) : '',
            status: 'pending',
            createdAt: serverTimestamp(),
          });
        }
        await batch.commit();
      }

      showToast('success', `Berhasil mengimpor ${validGuests.length} tamu ke Firestore!`);
      setIsImportModalOpen(false);
      setParsedGuestsPreview([]);
      setImportTextContent('');
      setImportFileName('');
    } catch {
      showToast('error', 'Terjadi kesalahan saat menyimpan data tamu.');
    } finally {
      setIsProcessingImport(false);
    }
  };

  const downloadGuestTemplate = () => {
    const headers = ['Nama Tamu', 'Nomor WhatsApp'];
    const sampleRows = [
      ['Bapak Dr. H. Faisal, M.Si & Keluarga', '081234567890'],
      ['Ibu Hj. Siti Rahmawati', '085712345678'],
      ['Budi Santoso & Rekan', '081987654321'],
      ['Ahmad Fauzi', ''],
    ];
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...sampleRows.map(r => `"${r[0].replace(/"/g, '""')}","${r[1]}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template-daftar-tamu.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Template CSV berhasil diunduh!');
  };

  // Quick single link generation state
  const baseUrl = window.location.origin;
  const generatedLink = guestName ? getGuestInvitationUrl(guestName) : `${baseUrl}/`;
  const waMessage = getGuestWaMessage(guestName, generatedLink);

  const copyLink = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    showToast('success', 'URL undangan berhasil disalin!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyWaMessage = async () => {
    await navigator.clipboard.writeText(waMessage);
    setCopiedWaText(true);
    showToast('success', 'Pesan template WhatsApp berhasil disalin!');
    setTimeout(() => setCopiedWaText(false), 2000);
  };

  const shareToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
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
                {activeMenu === 'generator' && 'WhatsApp Link Generator'}
                {activeMenu === 'config' && 'Kelola Konten Undangan'}
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
            <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-warm-white to-gray-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-gold/30 flex items-center justify-center text-sage-dark shadow-xs">
                  <Sparkles size={20} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-bold text-text-dark tracking-tight">
                    Betawi Heritage
                  </h2>
                  <p className="text-[11px] text-gray-500 font-medium">Panel Pengelola</p>
                </div>
              </div>

              {/* Active Couple Banner Card */}
              <div className="mt-3.5 p-2.5 bg-sage/10 border border-sage/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={14} className="text-betawi-red shrink-0 fill-betawi-red" />
                  <span className="text-xs font-semibold text-sage-dark truncate">
                    {formData.groom.nickname} & {formData.bride.nickname}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-gold px-1.5 py-0.5 rounded bg-white shadow-2xs">
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
              <span className="font-mono font-semibold px-2 py-0.5 bg-white border border-gray-200 rounded-md">v1.6.1</span>
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
                    <span className="font-heading font-bold text-sm">Betawi Heritage</span>
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
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeMenu === 'config' ? 'bg-sage-dark text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <SlidersHorizontal size={16} />
                    <span>Kelola Undangan</span>
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
                <span className="text-gray-500 font-medium">Betawi SPA v1.6.1</span>
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
              <div className="bg-gradient-to-r from-sage-dark via-[#435334] to-[#2C3E2D] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
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
                      {formData.groom.nickname} & {formData.bride.nickname}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                      {formData.dateStr || 'Minggu, 20 September 2026'} &bull; {formData.events.akad.venue || 'Masjid Raya Betawi'}
                    </p>
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

              {/* Quick Action Shortcuts Grid */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-3">
                <h3 className="font-heading text-sm font-bold text-text-dark">Aksi Cepat</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
          {/* MENU 2: GENERATOR & BUKU TAMU WHATSAPP (IMPORT & BULK SPREADSHEET) */}
          {/* ========================================================================= */}
          {activeMenu === 'generator' && (
            <div className="flex flex-col gap-6">
              {/* Header & Mode Switcher Bar */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-dark flex items-center gap-2">
                    <LinkIcon size={20} className="text-sage-dark" />
                    <span>Generator & Manajemen Tamu WhatsApp</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Kelola daftar undangan, impor file Excel/CSV, pantau status terkirim, dan bagikan pesan personal.
                  </p>
                </div>

                {/* Dual Mode Switcher */}
                <div className="flex items-center bg-gray-100 p-1 rounded-2xl shrink-0">
                  <button
                    type="button"
                    onClick={() => setGuestViewMode('list')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      guestViewMode === 'list'
                        ? 'bg-white text-sage-dark shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users size={14} />
                    <span>Daftar Tamu ({totalGuestsCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuestViewMode('single')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      guestViewMode === 'single'
                        ? 'bg-white text-sage-dark shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Send size={14} />
                    <span>Generator Cepat</span>
                  </button>
                </div>
              </div>

              {/* VIEW MODE 1: DAFTAR TAMU & BULK IMPORT */}
              {guestViewMode === 'list' && (
                <div className="flex flex-col gap-6">
                  {/* 3 Mini KPI Summary Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Tamu</span>
                        <span className="text-2xl font-bold text-gray-800 mt-0.5">{totalGuestsCount}</span>
                        <span className="text-[11px] text-gray-500">Tercatat di sistem</span>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
                        <Users size={20} />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Belum Terkirim</span>
                        <span className="text-2xl font-bold text-amber-700 mt-0.5">{pendingGuestsCount}</span>
                        <span className="text-[11px] text-amber-600 font-medium">Perlu dikirimkan</span>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
                        <Clock4 size={20} />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Sudah Terkirim</span>
                        <span className="text-2xl font-bold text-emerald-700 mt-0.5">{sentGuestsCount}</span>
                        <span className="text-[11px] text-emerald-600 font-medium">Undangan dibagikan</span>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Table Control Toolbar */}
                  <div className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                      {/* Status Filter Pills */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                        <button
                          type="button"
                          onClick={() => setGuestStatusFilter('all')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            guestStatusFilter === 'all'
                              ? 'bg-sage-dark text-white shadow-2xs'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
                          }`}
                        >
                          Semua ({totalGuestsCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuestStatusFilter('pending')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            guestStatusFilter === 'pending'
                              ? 'bg-amber-600 text-white shadow-2xs'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100/70 border border-amber-200/60'
                          }`}
                        >
                          Belum Terkirim ({pendingGuestsCount})
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuestStatusFilter('sent')}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                            guestStatusFilter === 'sent'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border border-emerald-200/60'
                          }`}
                        >
                          Sudah Terkirim ({sentGuestsCount})
                        </button>
                      </div>

                      {/* Toolbar Action Buttons (Icon + Text) */}
                      <div className="flex items-center flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setParsedGuestsPreview([]);
                            setImportTextContent('');
                            setImportFileName('');
                            setIsImportModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                        >
                          <Upload size={14} />
                          <span>Impor Tamu</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setNewGuestName('');
                            setNewGuestPhone('');
                            setIsAddGuestModalOpen(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200/80 text-gray-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                        >
                          <UserPlus size={14} />
                          <span>Tambah Manual</span>
                        </button>

                        <button
                          type="button"
                          onClick={downloadGuestTemplate}
                          className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/80 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                          title="Unduh format template CSV contoh"
                        >
                          <FileSpreadsheet size={14} />
                          <span className="hidden sm:inline">Template CSV</span>
                        </button>

                        {guests.length > 0 && (
                          <button
                            type="button"
                            onClick={requestResetAllGuests}
                            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200/80 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                            title="Kosongkan seluruh daftar tamu"
                          >
                            <Trash2 size={14} />
                            <span className="hidden sm:inline">Reset Semua</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Live Search Input (Zero URL Pollution) */}
                    <div className="relative flex items-center">
                      <Search className="absolute left-3.5 text-gray-400 pointer-events-none" size={15} />
                      <input
                        type="text"
                        value={guestSearchQuery}
                        onChange={(e) => setGuestSearchQuery(e.target.value)}
                        placeholder="Cari berdasarkan nama tamu atau nomor WhatsApp..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-xs text-text-dark focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400 transition-all"
                      />
                      {guestSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setGuestSearchQuery('')}
                          className="absolute right-3 text-gray-400 hover:text-gray-600 p-0.5 rounded cursor-pointer"
                          title="Hapus pencarian"
                        >
                          <RotateCcw size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Guest Table Container */}
                  <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
                    {filteredGuests.length === 0 ? (
                      <div className="py-14 px-4 text-center flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                          <Users size={28} />
                        </div>
                        <div className="max-w-sm">
                          <h4 className="text-sm font-bold text-gray-700">
                            {guestSearchQuery || guestStatusFilter !== 'all' 
                              ? 'Tamu Tidak Ditemukan' 
                              : 'Belum Ada Daftar Tamu'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {guestSearchQuery || guestStatusFilter !== 'all'
                              ? 'Tidak ada data tamu yang cocok dengan filter atau kata kunci pencarian Anda.'
                              : 'Unggah file Excel/CSV atau tambahkan tamu satu per satu untuk mulai membuat link undangan personal.'}
                          </p>
                        </div>
                        {!(guestSearchQuery || guestStatusFilter !== 'all') && (
                          <button
                            type="button"
                            onClick={() => {
                              setParsedGuestsPreview([]);
                              setImportTextContent('');
                              setImportFileName('');
                              setIsImportModalOpen(true);
                            }}
                            className="mt-1 px-4 py-2 bg-sage hover:bg-sage-dark text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Upload size={14} />
                            <span>Impor File Sekarang</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                              <th className="py-3 px-3.5 text-center w-12">#</th>
                              <th className="py-3 px-4">Nama Tamu Undangan</th>
                              <th className="py-3 px-4 w-44">WhatsApp</th>
                              <th className="py-3 px-4 hidden md:table-cell">Tautan Personal</th>
                              <th className="py-3 px-3 text-center w-36">Status</th>
                              <th className="py-3 px-3 text-center w-36">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filteredGuests.map((guest, idx) => {
                              const personalLink = getGuestInvitationUrl(guest.name);
                              const hasPhone = Boolean(guest.phone && guest.phone.trim().length >= 8);

                              return (
                                <tr key={guest.id || idx} className="hover:bg-gray-50/70 transition-colors">
                                  {/* # Auto 1-indexed */}
                                  <td className="py-3.5 px-3.5 text-center text-gray-400 font-medium">
                                    {idx + 1}
                                  </td>

                                  {/* Nama Tamu */}
                                  <td className="py-3.5 px-4 font-semibold text-text-dark whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-lg bg-sage/10 text-sage-dark flex items-center justify-center font-bold text-xs shrink-0">
                                        {guest.name.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="truncate max-w-xs">{guest.name}</span>
                                    </div>
                                  </td>

                                  {/* WhatsApp Number */}
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    {hasPhone ? (
                                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/70 font-mono text-[11px]">
                                        <Phone size={11} className="text-emerald-600" />
                                        <span>+{guest.phone}</span>
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 italic text-[11px]">-</span>
                                    )}
                                  </td>

                                  {/* Tautan Personal */}
                                  <td className="py-3.5 px-4 hidden md:table-cell">
                                    <div className="flex items-center gap-1.5 max-w-xs">
                                      <span className="text-gray-500 font-mono text-[11px] truncate select-all">
                                        {personalLink}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => copyGuestLink(guest)}
                                        className="p-1 text-gray-400 hover:text-sage-dark hover:bg-gray-100 rounded transition-colors cursor-pointer shrink-0"
                                        title="Salin Tautan"
                                        aria-label="Salin Tautan"
                                      >
                                        <Copy size={13} />
                                      </button>
                                    </div>
                                  </td>

                                  {/* Status Badge */}
                                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                    {guest.status === 'sent' ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                        <CheckCheck size={12} className="text-emerald-600" />
                                        <span>Sudah Dikirim</span>
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                                        <Clock4 size={12} className="text-amber-600" />
                                        <span>Belum Dikirim</span>
                                      </span>
                                    )}
                                  </td>

                                  {/* Table Action Buttons (Icon-Only Rule) */}
                                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1">
                                      {/* Kirim WhatsApp */}
                                      <button
                                        type="button"
                                        onClick={() => handleSendGuestWhatsapp(guest)}
                                        className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                        title={hasPhone ? `Kirim WA ke +${guest.phone}` : 'Kirim WA (Pilih Kontak)'}
                                        aria-label="Kirim via WhatsApp"
                                      >
                                        <Share2 size={15} />
                                      </button>

                                      {/* Salin Pesan WA */}
                                      <button
                                        type="button"
                                        onClick={() => copyGuestWaMessage(guest)}
                                        className="p-1.5 text-gray-500 hover:text-sage-dark hover:bg-sage/10 rounded-lg transition-colors cursor-pointer"
                                        title="Salin Teks Pesan WhatsApp"
                                        aria-label="Salin Pesan WA"
                                      >
                                        <Copy size={15} />
                                      </button>

                                      {/* Toggle Status Terkirim */}
                                      <button
                                        type="button"
                                        onClick={() => handleToggleGuestStatus(guest)}
                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                          guest.status === 'sent' 
                                            ? 'text-amber-600 hover:bg-amber-50' 
                                            : 'text-emerald-600 hover:bg-emerald-50'
                                        }`}
                                        title={guest.status === 'sent' ? 'Tandai Belum Terkirim' : 'Tandai Sudah Terkirim'}
                                        aria-label="Ubah Status Pengiriman"
                                      >
                                        <CheckCircle2 size={15} />
                                      </button>

                                      {/* Hapus Tamu */}
                                      <button
                                        type="button"
                                        onClick={() => requestDeleteGuest(guest)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Hapus tamu ini"
                                        aria-label="Hapus tamu"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: GENERATOR TUNGGAL CEPAT (SINGLE LINK GENERATOR) */}
              {guestViewMode === 'single' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-6 max-w-3xl">
                  <div>
                    <h3 className="font-heading text-base font-bold text-text-dark">Generator Cepat Satu Tamu</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Buat link undangan personal dadakan untuk satu nama tamu dan salin tautan atau pesan secara instan.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-dark mb-1.5">Nama Tamu Undangan</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Contoh: Bapak Budi Santoso & Rekan"
                        className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-dark mb-1.5">Tautan Undangan Personal</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1 flex items-center">
                        <LinkIcon className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
                        <input
                          type="text"
                          readOnly
                          value={generatedLink}
                          placeholder="Link undangan akan otomatis terbuat..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-600 overflow-hidden text-ellipsis placeholder:text-gray-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={copyLink}
                        className="bg-sage text-white px-4 py-2.5 rounded-xl hover:bg-sage-dark transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0 cursor-pointer shadow-xs"
                      >
                        {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copiedLink ? 'Tersalin' : 'Salin URL'}</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-text-dark">Template Pesan WhatsApp</label>
                      <button
                        type="button"
                        onClick={copyWaMessage}
                        className="text-xs text-sage-dark hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        {copiedWaText ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedWaText ? 'Teks Tersalin' : 'Salin Teks WA'}</span>
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={8}
                      value={waMessage}
                      placeholder="Template pesan WhatsApp..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 font-mono resize-none focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={shareToWhatsapp}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <Share2 size={16} />
                    <span>Kirim Langsung ke WhatsApp Tamu</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* MENU 3: KELOLA KONTEN UNDANGAN (ORGANIZED SUB-PILLS) */}
          {/* ========================================================================= */}
          {activeMenu === 'config' && (
            <div className="flex flex-col gap-6">
              {/* Sub-Pills Navigation Bar */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  type="button"
                  onClick={() => setConfigSubTab('couple')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    configSubTab === 'couple'
                      ? 'bg-sage-dark text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Heart size={14} />
                  <span>Profil Mempelai</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfigSubTab('events')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    configSubTab === 'events'
                      ? 'bg-sage-dark text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Calendar size={14} />
                  <span>Acara & Lokasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfigSubTab('gallery')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    configSubTab === 'gallery'
                      ? 'bg-sage-dark text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Galeri Foto ({formData.gallery.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfigSubTab('story')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    configSubTab === 'story'
                      ? 'bg-sage-dark text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>Kisah Kami</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfigSubTab('music_gift')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    configSubTab === 'music_gift'
                      ? 'bg-sage-dark text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Music size={14} />
                  <span>Musik & Hadiah</span>
                </button>

                <button
                  type="button"
                  onClick={() => setConfigSubTab('seo')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    configSubTab === 'seo'
                      ? 'bg-sage-dark text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <Globe size={14} />
                  <span>SEO & Metadata</span>
                </button>
              </div>

              {/* Form Content Container */}
              <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">
                {/* SUB-PILL 1: PROFIL MEMPELAI */}
                {configSubTab === 'couple' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Groom */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                      <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Heart size={16} className="text-betawi-red fill-betawi-red" />
                        <span>Mempelai Pria (Groom)</span>
                      </h3>
                      <div className="flex flex-col gap-3 text-xs">
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Nama Panggilan</label>
                          <div className="relative flex items-center">
                            <User className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.groom.nickname}
                              onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, nickname: e.target.value } })}
                              placeholder="Contoh: Ali"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Nama Lengkap & Gelar</label>
                          <div className="relative flex items-center">
                            <User className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.groom.fullName}
                              onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, fullName: e.target.value } })}
                              placeholder="Contoh: Ali bin Fulan, S.Kom"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Nama Orang Tua</label>
                          <div className="relative flex items-center">
                            <Users className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.groom.parents}
                              onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, parents: e.target.value } })}
                              placeholder="Contoh: Putra dari Bapak H. Ahmad & Ibu Hj. Siti"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Akun Instagram</label>
                          <div className="relative flex items-center">
                            <Share2 className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.groom.instagram}
                              onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, instagram: e.target.value } })}
                              placeholder="Contoh: @ali_betawi"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Foto Profil Mempelai Pria</label>
                          <DragDropUpload
                            id="groom-avatar-upload"
                            label="Tarik & lepas foto mempelai pria, atau klik untuk memilih"
                            value={formData.groom.image}
                            isUploading={uploadingAvatar === 'groom'}
                            onFileSelect={handleUploadGroom}
                            onRemove={() => setFormData(prev => ({ ...prev, groom: { ...prev.groom, image: '' } }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bride */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                      <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Heart size={16} className="text-pink-500 fill-pink-500" />
                        <span>Mempelai Wanita (Bride)</span>
                      </h3>
                      <div className="flex flex-col gap-3 text-xs">
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Nama Panggilan</label>
                          <div className="relative flex items-center">
                            <Heart className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.bride.nickname}
                              onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, nickname: e.target.value } })}
                              placeholder="Contoh: Fatimah"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Nama Lengkap & Gelar</label>
                          <div className="relative flex items-center">
                            <Heart className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.bride.fullName}
                              onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, fullName: e.target.value } })}
                              placeholder="Contoh: Fatimah Azzahra, S.Pd"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Nama Orang Tua</label>
                          <div className="relative flex items-center">
                            <Users className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.bride.parents}
                              onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, parents: e.target.value } })}
                              placeholder="Contoh: Putri dari Bapak H. Mahmud & Ibu Hj. Aminah"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Akun Instagram</label>
                          <div className="relative flex items-center">
                            <Share2 className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                            <input
                              type="text"
                              value={formData.bride.instagram}
                              onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, instagram: e.target.value } })}
                              placeholder="Contoh: @fatimah_betawi"
                              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-600 mb-1 font-medium">Foto Profil Mempelai Wanita</label>
                          <DragDropUpload
                            id="bride-avatar-upload"
                            label="Tarik & lepas foto mempelai wanita, atau klik untuk memilih"
                            value={formData.bride.image}
                            isUploading={uploadingAvatar === 'bride'}
                            onFileSelect={handleUploadBride}
                            onRemove={() => setFormData(prev => ({ ...prev, bride: { ...prev.bride, image: '' } }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-PILL 2: ACARA & LOKASI */}
                {configSubTab === 'events' && (
                  <EventScheduleEditor
                    formData={formData}
                    setFormData={setFormData}
                    showToast={showToast}
                  />
                )}

                {/* SUB-PILL 3: GALERI FOTO */}
                {configSubTab === 'gallery' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                    <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                      <ImageIcon size={16} className="text-sage-dark" />
                      <span>Album Galeri Foto Pernikahan ({formData.gallery.length} foto)</span>
                    </h3>
                    <DragDropUpload
                      id="gallery-dropzone-dashboard"
                      multiple
                      label="Tarik & lepas foto-foto galeri di sini, atau klik untuk memilih"
                      helperText="Pilih beberapa foto sekaligus. Otomatis dikompresi (Zero Storage Cost)."
                      value={formData.gallery}
                      isUploading={isUploadingGallery}
                      onFileSelect={handleUploadGallery}
                      onRemove={(idx) => {
                        if (idx === undefined) return;
                        setFormData(prev => ({
                          ...prev,
                          gallery: prev.gallery.filter((_, i) => i !== idx)
                        }));
                      }}
                    />
                  </div>
                )}

                {/* SUB-PILL 4: KISAH KAMI */}
                {configSubTab === 'story' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2">
                        <BookOpen size={16} className="text-sage-dark" />
                        <span>Timeline Perjalanan Kisah Cinta</span>
                      </h3>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, loveStory: [...(formData.loveStory || []), { year: '', title: '', description: '' }] })}
                        className="text-sage-dark hover:text-sage flex items-center gap-1 font-semibold text-xs cursor-pointer"
                      >
                        <Plus size={14} />
                        <span>Tambah Cerita</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-3">
                      {(formData.loveStory || []).map((story, idx) => {
                        const totalStories = (formData.loveStory || []).length;
                        return (
                          <div key={idx} className="bg-gray-50/70 border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 relative shadow-2xs">
                            {/* Card Header with Reorder buttons & Delete button */}
                            <div className="flex items-center justify-between border-b border-gray-200/80 pb-2.5">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-sage/20 text-sage-dark font-bold text-xs flex items-center justify-center">
                                  #{idx + 1}
                                </span>
                                <span className="text-xs font-semibold text-gray-700">
                                  {story.title ? story.title : `Momen Cerita #${idx + 1}`}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                {/* Button Move Up */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveStory(idx, 'up')}
                                  disabled={idx === 0}
                                  className={`p-1.5 rounded-lg border border-gray-200 bg-white transition-colors ${
                                    idx === 0
                                      ? 'opacity-30 cursor-not-allowed text-gray-300'
                                      : 'text-gray-600 hover:text-sage-dark hover:border-sage/50 cursor-pointer shadow-2xs'
                                  }`}
                                  title="Pindahkan ke atas (sebelumnya)"
                                  aria-label={`Pindahkan cerita #${idx + 1} ke atas`}
                                >
                                  <ArrowUp size={13} />
                                </button>

                                {/* Button Move Down */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveStory(idx, 'down')}
                                  disabled={idx === totalStories - 1}
                                  className={`p-1.5 rounded-lg border border-gray-200 bg-white transition-colors ${
                                    idx === totalStories - 1
                                      ? 'opacity-30 cursor-not-allowed text-gray-300'
                                      : 'text-gray-600 hover:text-sage-dark hover:border-sage/50 cursor-pointer shadow-2xs'
                                  }`}
                                  title="Pindahkan ke bawah (berikutnya)"
                                  aria-label={`Pindahkan cerita #${idx + 1} ke bawah`}
                                >
                                  <ArrowDown size={13} />
                                </button>

                                {/* Button Delete */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newArr = [...(formData.loveStory || [])];
                                    newArr.splice(idx, 1);
                                    setFormData({ ...formData, loveStory: newArr });
                                    showToast('success', 'Momen cerita berhasil dihapus');
                                  }}
                                  className="p-1.5 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer shadow-2xs ml-1"
                                  title="Hapus bagian cerita ini"
                                  aria-label={`Hapus cerita #${idx + 1}`}
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <div className="relative flex items-center text-xs">
                              <Calendar className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                              <input
                                type="text"
                                placeholder="Tahun / Momen (mis. 2021 atau Pertemuan Pertama)"
                                value={story.year}
                                onChange={(e) => {
                                  const newArr = [...(formData.loveStory || [])];
                                  newArr[idx] = { ...story, year: e.target.value };
                                  setFormData({ ...formData, loveStory: newArr });
                                }}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:ring-1 focus:ring-sage"
                              />
                            </div>
                            <div className="relative flex items-center text-xs">
                              <BookOpen className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                              <input
                                type="text"
                                placeholder="Judul Momen (mis. Awal Berjumpa)"
                                value={story.title}
                                onChange={(e) => {
                                  const newArr = [...(formData.loveStory || [])];
                                  newArr[idx] = { ...story, title: e.target.value };
                                  setFormData({ ...formData, loveStory: newArr });
                                }}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:ring-1 focus:ring-sage font-medium"
                              />
                            </div>
                            <div className="relative flex text-xs">
                              <MessageSquare className="absolute left-2.5 top-2 text-gray-400 pointer-events-none" size={14} />
                              <textarea
                                placeholder="Tuliskan deskripsi cerita singkat..."
                                value={story.description}
                                onChange={(e) => {
                                  const newArr = [...(formData.loveStory || [])];
                                  newArr[idx] = { ...story, description: e.target.value };
                                  setFormData({ ...formData, loveStory: newArr });
                                }}
                                rows={3}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:ring-1 focus:ring-sage resize-none"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SUB-PILL 5: MUSIK & HADIAH */}
                {configSubTab === 'music_gift' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Audio Settings */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4 text-xs">
                      <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                        <Music size={16} className="text-sage-dark" />
                        <span>Lagu Latar & Playlist</span>
                      </h3>

                      <div>
                        <label className="block text-gray-600 mb-1 font-medium">Mode Pemutaran Audio</label>
                        <select
                          value={formData.music?.mode || 'repeat-all'}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            music: { ...formData.music!, mode: e.target.value as 'repeat-all' | 'repeat-one' | 'shuffle' | 'linear' } 
                          })}
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-sage cursor-pointer"
                        >
                          <option value="repeat-all">Ulangi Semua (Repeat All)</option>
                          <option value="repeat-one">Ulangi Satu Lagu (Repeat One)</option>
                          <option value="shuffle">Acak (Shuffle)</option>
                          <option value="linear">Sekali Jalan (Linear)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-gray-600 font-medium">Daftar Link Lagu YouTube</label>
                          <button
                            type="button"
                            onClick={() => {
                              const newPlaylist = [...(formData.music?.playlist || []), { url: '' }];
                              setFormData({ ...formData, music: { ...formData.music!, mode: formData.music?.mode || 'repeat-all', playlist: newPlaylist } });
                            }}
                            className="text-sage-dark hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Plus size={13} /> Tambah Lagu
                          </button>
                        </div>

                        {(formData.music?.playlist || (formData.musicUrl ? [{url: formData.musicUrl}] : [])).map((track, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <div className="relative flex-1 flex items-center">
                              <Music className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                              <input
                                type="text"
                                value={track.url}
                                onChange={(e) => {
                                  const newPlaylist = [...(formData.music?.playlist || [])];
                                  newPlaylist[idx] = { url: e.target.value };
                                  setFormData({ ...formData, music: { ...formData.music!, playlist: newPlaylist } });
                                }}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white font-mono text-[11px] focus:ring-1 focus:ring-sage"
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newPlaylist = (formData.music?.playlist || []).filter((_, i) => i !== idx);
                                setFormData({ ...formData, music: { ...formData.music!, playlist: newPlaylist } });
                              }}
                              className="text-gray-400 hover:text-red-500 p-2 shrink-0 bg-gray-50 hover:bg-red-50 border border-gray-200 rounded-lg transition-colors cursor-pointer"
                              title="Hapus lagu ini"
                              aria-label="Hapus lagu ini"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bank / QRIS Gift */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4 text-xs">
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2">
                          <CreditCard size={16} className="text-gold" />
                          <span>Rekening Hadiah & QRIS</span>
                        </h3>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, banks: [...(formData.banks || (formData.bank ? [formData.bank] : [])), { name: '', account: '', holder: '', isQris: false, qrisImage: '' }] })}
                          className="text-sage-dark hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Plus size={13} /> Tambah Akun
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {(formData.banks || (formData.bank ? [formData.bank] : [])).map((bank, idx) => (
                          <div key={idx} className="p-3.5 bg-gray-50/70 border border-gray-200 rounded-xl flex flex-col gap-2 relative">
                            <button
                              type="button"
                              onClick={() => {
                                const newArr = [...(formData.banks || [])];
                                newArr.splice(idx, 1);
                                setFormData({ ...formData, banks: newArr });
                              }}
                              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-600 p-1"
                              title="Hapus akun ini"
                              aria-label="Hapus akun ini"
                            >
                              <Trash2 size={14} />
                            </button>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={bank.isQris || false}
                                onChange={(e) => {
                                  const newArr = [...(formData.banks || [])];
                                  newArr[idx] = { ...bank, isQris: e.target.checked };
                                  setFormData({ ...formData, banks: newArr });
                                }}
                                className="rounded text-sage"
                              />
                              <span className="font-semibold text-gray-700">Akun ini menggunakan QRIS</span>
                            </label>

                            <div className="relative flex items-center pr-8">
                              <CreditCard className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                              <input
                                type="text"
                                placeholder="Nama Bank / E-Wallet (mis. BCA, Mandiri)"
                                value={bank.name}
                                onChange={(e) => {
                                  const newArr = [...(formData.banks || [])];
                                  newArr[idx] = { ...bank, name: e.target.value };
                                  setFormData({ ...formData, banks: newArr });
                                }}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:ring-1 focus:ring-sage"
                              />
                            </div>

                            {!bank.isQris ? (
                              <>
                                <div className="relative flex items-center">
                                  <KeyRound className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                                  <input
                                    type="text"
                                    placeholder="Nomor Rekening / No HP"
                                    value={bank.account}
                                    onChange={(e) => {
                                      const newArr = [...(formData.banks || [])];
                                      newArr[idx] = { ...bank, account: e.target.value };
                                      setFormData({ ...formData, banks: newArr });
                                    }}
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:ring-1 focus:ring-sage"
                                  />
                                </div>
                                <div className="relative flex items-center">
                                  <User className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                                  <input
                                    type="text"
                                    placeholder="Atas Nama Pemilik Rekening"
                                    value={bank.holder}
                                    onChange={(e) => {
                                      const newArr = [...(formData.banks || [])];
                                      newArr[idx] = { ...bank, holder: e.target.value };
                                      setFormData({ ...formData, banks: newArr });
                                    }}
                                    className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white focus:ring-1 focus:ring-sage"
                                  />
                                </div>
                              </>
                            ) : (
                              <DragDropUpload
                                id={`qris-dropzone-${idx}`}
                                label="Upload gambar barcode QRIS"
                                value={bank.qrisImage}
                                onFileSelect={(files) => handleUploadQris(files, idx)}
                                onRemove={() => {
                                  const newArr = [...(formData.banks || [])];
                                  newArr[idx] = { ...bank, qrisImage: '' };
                                  setFormData({ ...formData, banks: newArr });
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB-PILL 6: SEO & METADATA */}
                {configSubTab === 'seo' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-4 text-xs">
                    <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                      <Globe size={16} className="text-sage-dark" />
                      <span>Pengaturan Metadata SEO & Link Preview WhatsApp</span>
                    </h3>

                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-gray-600 mb-1 font-medium">Judul Halaman (Browser Title & OpenGraph)</label>
                        <div className="relative flex items-center">
                          <Globe className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                          <input
                            type="text"
                            placeholder="Judul Halaman Undangan"
                            value={formData.seo?.title || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              seo: { ...formData.seo, title: e.target.value }
                            })}
                            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white font-semibold focus:ring-2 focus:ring-sage"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1 font-medium">Deskripsi Ringkas (Muncul di Preview Chat)</label>
                        <div className="relative flex">
                          <FileText className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={15} />
                          <textarea
                            placeholder="Deskripsi undangan pernikahan..."
                            value={formData.seo?.description || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              seo: { ...formData.seo, description: e.target.value }
                            })}
                            rows={3}
                            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white resize-none focus:ring-2 focus:ring-sage"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1 font-medium">Keywords Pencarian</label>
                        <div className="relative flex items-center">
                          <Settings className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                          <input
                            type="text"
                            placeholder="Contoh: wedding, undangan, nikah betawi"
                            value={formData.seo?.keywords || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              seo: { ...formData.seo, keywords: e.target.value }
                            })}
                            className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:ring-2 focus:ring-sage"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-600 mb-1 font-medium">Foto Thumbnail Pratinjau (1200x630)</label>
                        <DragDropUpload
                          id="seo-upload-dashboard"
                          label="Upload gambar thumbnail preview sosial media"
                          value={formData.seo?.image}
                          isUploading={uploadingAvatar === 'seo'}
                          onFileSelect={handleUploadSeo}
                          onRemove={() => setFormData(prev => ({ ...prev, seo: { ...prev.seo, image: '' } }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Floating Save Action Bar */}
                <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200/90 shadow-lg flex items-center justify-between gap-4">
                  <div>
                    {saveSuccess ? (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 size={16} /> Perubahan berhasil disimpan ke Firestore!
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 font-medium">
                        Simpan seluruh konfigurasi setelah selesai mengedit
                      </span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-sage-dark hover:bg-sage text-white px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-98 shrink-0"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Firestore'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MENU 4: BUKU TAMU & RSVP */}
          {/* ========================================================================= */}
          {activeMenu === 'rsvps' && (
            <div className="flex flex-col gap-5">
              {/* Header & Export Toolbar */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-dark">Buku Tamu Konfirmasi Kehadiran</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Rekap data kehadiran tamu undangan ({totalAttending} Hadir &bull; {totalNotAttending} Tidak Hadir)
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={exportRsvpToCsv}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer w-full sm:w-auto active:scale-98"
                    title="Download Rekap Tamu ke format Excel / CSV"
                  >
                    <Download size={15} />
                    <span>Ekspor CSV</span>
                  </button>
                </div>
              </div>

              {/* In-Memory Live Search Bar */}
              <div className="relative flex items-center">
                <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={rsvpSearchQuery}
                  onChange={(e) => setRsvpSearchQuery(e.target.value)}
                  placeholder="Cari nama tamu, status kehadiran, atau catatan RSVP..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all placeholder:text-gray-400 shadow-2xs"
                />
                {rsvpSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setRsvpSearchQuery('')}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title="Hapus filter pencarian"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Responsive Data Table */}
              {filteredRsvps.length === 0 ? (
                <div className="text-center py-14 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-2 shadow-2xs">
                  <Users size={36} className="text-gray-300" />
                  <p className="text-xs text-gray-500 font-medium">
                    {rsvpSearchQuery
                      ? `Tidak ada data RSVP yang cocok dengan "${rsvpSearchQuery}"`
                      : 'Belum ada data konfirmasi RSVP masuk.'}
                  </p>
                  {rsvpSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRsvpSearchQuery('')}
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
                        <th className="py-3 px-4">Nama Tamu</th>
                        <th className="py-3 px-3 text-center">Kehadiran</th>
                        <th className="py-3 px-3 text-center">Jumlah</th>
                        <th className="py-3 px-4">Pesan / Catatan</th>
                        <th className="py-3 px-3 text-center w-16">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredRsvps.map((rsvp, idx) => (
                        <tr key={rsvp.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-3.5 px-3.5 text-center text-gray-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-text-dark whitespace-nowrap">
                            {rsvp.name}
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              rsvp.attendance === 'hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {rsvp.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-center text-gray-700 font-medium whitespace-nowrap">
                            {rsvp.attendance === 'hadir' ? `${rsvp.guestCount} Orang` : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate italic">
                            {rsvp.notes ? `"${rsvp.notes}"` : '-'}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => requestDeleteRsvp(rsvp)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Hapus data RSVP ini"
                              aria-label="Hapus data RSVP ini"
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
          )}

          {/* ========================================================================= */}
          {/* MENU 5: DOA & UCAPAN RESTU */}
          {/* ========================================================================= */}
          {activeMenu === 'wishes' && (
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-heading text-lg font-bold text-text-dark">Moderasi Doa & Ucapan Restu</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Daftar seluruh kiriman doa dan restu dari tamu undangan ({wishes.length} ucapan masuk)
                  </p>
                </div>
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
                              onClick={() => requestDeleteWish(w)}
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
          )}
        </main>
      </div>

      {/* Full-Screen Viewport Backdrop Modal: Impor Tamu (Excel / CSV / Multiline Text) */}
      {isImportModalOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200 overflow-y-auto"
          onClick={() => {
            if (!isProcessingImport) setIsImportModalOpen(false);
          }}
        >
          <div 
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col gap-5 my-auto animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sage/15 text-sage-dark flex items-center justify-center">
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-text-dark">
                    Impor Daftar Tamu Undangan
                  </h3>
                  <p className="text-xs text-gray-500">
                    Mendukung unggah file Excel (.xlsx, .xls), CSV (.csv), dan salin-tempel teks baris.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isProcessingImport}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Import Mode Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setImportActiveTab('file')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  importActiveTab === 'file'
                    ? 'bg-white text-sage-dark shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileSpreadsheet size={15} />
                <span>Unggah File Excel / CSV</span>
              </button>
              <button
                type="button"
                onClick={() => setImportActiveTab('text')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  importActiveTab === 'text'
                    ? 'bg-white text-sage-dark shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText size={15} />
                <span>Salin-Tempel Teks (Multiline)</span>
              </button>
            </div>

            {/* TAB 1: FILE UPLOAD DROPZONE */}
            {importActiveTab === 'file' && (
              <div className="flex flex-col gap-3">
                <div 
                  className="border-2 border-dashed border-gray-300 hover:border-sage rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 bg-gray-50/50 hover:bg-sage/5 transition-colors cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv, .txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelectedForImport(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-sage/10 text-sage-dark flex items-center justify-center">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      {importFileName ? `File Terpilih: ${importFileName}` : 'Klik atau Tarik File Excel / CSV ke Sini'}
                    </span>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      Mendukung format .xlsx, .xls, .csv, dan .txt
                    </span>
                  </div>
                </div>

                {/* Helper / Template Tip */}
                <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span>Kolom wajib: <strong>Nama Tamu</strong>. Kolom opsional: <strong>Nomor WhatsApp</strong>.</span>
                  <button
                    type="button"
                    onClick={downloadGuestTemplate}
                    className="text-sage-dark font-semibold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Download size={13} />
                    <span>Download Template</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: MULTILINE TEXT INPUT */}
            {importActiveTab === 'text' && (
              <div className="flex flex-col gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5 text-xs">
                    <label className="font-semibold text-text-dark">Ketik atau Tempel Daftar Tamu</label>
                    <span className="text-gray-400 text-[11px]">Format: Nama, Nomor WA (atau Nama saja)</span>
                  </div>
                  <textarea
                    rows={6}
                    value={importTextContent}
                    onChange={(e) => setImportTextContent(e.target.value)}
                    placeholder={`Bapak Dr. H. Faisal, M.Si, 081234567890\nIbu Hj. Siti Rahmawati, 085712345678\nBudi Santoso & Rekan\nAhmad Fauzi`}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-text-dark font-mono resize-none focus:outline-none focus:ring-2 focus:ring-sage focus:bg-white transition-all"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleProcessTextImport}
                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-black text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Check size={14} />
                    <span>Periksa & Tampilkan Pratinjau</span>
                  </button>
                </div>
              </div>
            )}

            {/* PRATINJAU HASIL PEMBACAAN (PREVIEW LIST) */}
            {parsedGuestsPreview.length > 0 && (
              <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-dark flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>{parsedGuestsPreview.filter(p => p.isValid).length} Tamu Siap Diimpor</span>
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    Pastikan nama dan nomor telepon sudah sesuai
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-2xl bg-gray-50/50">
                  {parsedGuestsPreview.map((item, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between text-xs gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 text-center text-gray-400 text-[11px] font-mono">{i + 1}.</span>
                        <span className="font-semibold text-gray-800 truncate">{item.name}</span>
                      </div>
                      <div className="shrink-0">
                        {item.phone ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                            <Phone size={10} />
                            <span>+{item.phone}</span>
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[10px] italic">Tanpa Nomor</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isProcessingImport}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={parsedGuestsPreview.filter(p => p.isValid).length === 0 || isProcessingImport}
                className="px-5 py-2.5 rounded-xl bg-sage hover:bg-sage-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isProcessingImport ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menyimpan ke Cloud...</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>Simpan & Impor {parsedGuestsPreview.filter(p => p.isValid).length} Tamu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Viewport Backdrop Modal: Tambah Tamu Satuan Manual */}
      {isAddGuestModalOpen && (
        <div 
          className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200"
          onClick={() => {
            if (!isSubmittingGuest) setIsAddGuestModalOpen(false);
          }}
        >
          <div 
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sage/15 text-sage-dark flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <h3 className="font-heading text-sm font-bold text-text-dark">
                  Tambah Tamu Undangan
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGuestModalOpen(false)}
                disabled={isSubmittingGuest}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                title="Tutup Modal"
                aria-label="Tutup Modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSingleGuest} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nama Tamu Undangan <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="Contoh: Bapak Ir. H. Bambang & Keluarga"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nomor WhatsApp <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={(e) => setNewGuestPhone(e.target.value)}
                    placeholder="Contoh: 08123456789 atau 628123456789"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Jika diisi, tombol kirim WA akan langsung membuka obrolan ke nomor ini.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddGuestModalOpen(false)}
                  disabled={isSubmittingGuest}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingGuest || !newGuestName.trim()}
                  className="px-4 py-2 rounded-xl bg-sage hover:bg-sage-dark disabled:bg-gray-300 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isSubmittingGuest ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Simpan Tamu</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SweetAlert2-Style Full-Screen Viewport Confirmation Modal */}
      {deleteModal && (
        <div 
          className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200"
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
