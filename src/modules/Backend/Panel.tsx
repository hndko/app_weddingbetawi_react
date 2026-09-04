import React, { useState, useEffect, useMemo } from 'react';
import { 
  Settings, Link as LinkIcon, Users, MessageSquare, Save, Plus, Trash2, 
  Copy, Check, X, LogOut, Music, Heart, Calendar, Image as ImageIcon, 
  CreditCard, Share2, AlertCircle, Clock, Building, MapPin, 
  Search, RotateCcw, User, KeyRound, Globe, FileText, CheckCircle2, ChevronRight, BookOpen
} from 'lucide-react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { WeddingConfig, RSVPResponse, Wish } from '../../types';
import { Login } from '../Auth/Login';
import { DragDropUpload } from './components/DragDropUpload';

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
  const [activeTab, setActiveTab] = useState<'config' | 'generator' | 'rsvps' | 'wishes'>('generator');

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

  // In-memory live search state (Background search without URL pollution)
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');
  const [wishSearchQuery, setWishSearchQuery] = useState('');

  // Confirmation modal & toast state
  const [deleteModal, setDeleteModal] = useState<{
    type: 'wish' | 'rsvp';
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

  // Route sync
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

  // Prevent background scrolling when SweetAlert modal is open
  useEffect(() => {
    if (deleteModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [deleteModal]);

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

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    try {
      if (deleteModal.type === 'wish') {
        await deleteDoc(doc(db, 'wishes', deleteModal.id));
      } else {
        await deleteDoc(doc(db, 'rsvps', deleteModal.id));
      }
      showToast('success', 'Data berhasil dihapus dari Firestore.');
    } catch (err) {
      console.error('Failed to delete document:', err);
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

  // Generated URL & WA Message
  const baseUrl = window.location.origin;
  const generatedLink = guestName ? `${baseUrl}/?to=${encodeURIComponent(guestName)}` : `${baseUrl}/`;
  const waMessage = `Assalamu'alaikum Wr. Wb.

Kepada Yth. Bapak/Ibu/Saudara/i ${guestName || 'Tamu Undangan'},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${formData.groom.nickname} & ${formData.bride.nickname}*

Berikut link undangan digital kami untuk informasi lebih lengkap:
${generatedLink}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih,
Wassalamu'alaikum Wr. Wb.`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyWaMessage = async () => {
    await navigator.clipboard.writeText(waMessage);
    setCopiedWaText(true);
    setTimeout(() => setCopiedWaText(false), 2000);
  };

  const shareToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
  };

  // Calculations for RSVPs
  const totalAttending = rsvps
    .filter(r => r.attendance === 'hadir')
    .reduce((acc, r) => acc + (Number(r.guestCount) || 1), 0);
  const totalNotAttending = rsvps.filter(r => r.attendance !== 'hadir').length;

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
    <div className="min-h-screen bg-[#F7F9F5] flex flex-col md:py-10 md:px-6">
      <div className="w-full max-w-4xl mx-auto flex-1 bg-white md:rounded-[32px] shadow-2xl overflow-hidden flex flex-col border-0 md:border border-gray-100 relative">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-warm-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-sage/10 text-sage-dark p-2.5 rounded-xl">
              <Settings size={22} />
            </div>
            <div>
              <h2 className="font-heading text-xl text-text-dark font-medium">
                Admin Modules
              </h2>
              <p className="text-xs text-gray-500">
                Kelola undangan, data mempelai & database
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-red-100"
              title="Logout dari Admin"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/') : (window.location.href = '/'))}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              title="Kembali ke Undangan"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex border-b border-gray-100 px-2 sm:px-6 bg-gray-50/50 overflow-x-auto no-scrollbar pt-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`py-3.5 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'generator'
                  ? 'border-sage-dark text-sage-dark font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <LinkIcon size={15} />
              <span>Link Tamu Undangan</span>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-3.5 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'config'
                  ? 'border-sage-dark text-sage-dark font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Settings size={15} />
              <span>Edit Data Website</span>
            </button>
            <button
              onClick={() => setActiveTab('rsvps')}
              className={`py-3.5 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'rsvps'
                  ? 'border-sage-dark text-sage-dark font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Users size={15} />
              <span>RSVP ({rsvps.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`py-3.5 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'wishes'
                  ? 'border-sage-dark text-sage-dark font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <MessageSquare size={15} />
              <span>Ucapan ({wishes.length})</span>
            </button>
          </div>

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* TAB 1: LINK GENERATOR */}
            {activeTab === 'generator' && (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-xs font-semibold text-text-dark mb-1.5">Nama Tamu Undangan</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Contoh: Bapak Budi & Keluarga"
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-dark mb-1.5">Generated Link Undangan</label>
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
                    rows={7}
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
                  <span>Kirim / Bagikan via WhatsApp</span>
                </button>
              </div>
            )}

            {/* TAB 2: EDIT WEBSITE CONFIG */}
            {activeTab === 'config' && (
              <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">
                {/* Groom Info */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 flex flex-col gap-4">
                  <h3 className="font-heading text-sm font-semibold text-text-dark flex items-center gap-2">
                    <Heart size={16} className="text-betawi-red" />
                    <span>Mempelai Pria (Groom)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                      <label className="block text-gray-600 mb-1 font-medium">Nama Lengkap</label>
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
                    <div className="sm:col-span-2">
                      <label className="block text-gray-600 mb-1 font-medium">Nama Orang Tua</label>
                      <div className="relative flex items-center">
                        <Users className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <input
                          type="text"
                          value={formData.groom.parents}
                          onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, parents: e.target.value } })}
                          placeholder="Contoh: Bapak H. Ahmad & Ibu Hj. Siti"
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-600 mb-1 font-medium">Instagram</label>
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
                    <div className="sm:col-span-2">
                      <label className="block text-gray-600 mb-1 font-medium">Foto Mempelai Pria</label>
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

                {/* Bride Info */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 flex flex-col gap-4">
                  <h3 className="font-heading text-sm font-semibold text-text-dark flex items-center gap-2">
                    <Heart size={16} className="text-pink-500" />
                    <span>Mempelai Wanita (Bride)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
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
                      <label className="block text-gray-600 mb-1 font-medium">Nama Lengkap</label>
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
                    <div className="sm:col-span-2">
                      <label className="block text-gray-600 mb-1 font-medium">Nama Orang Tua</label>
                      <div className="relative flex items-center">
                        <Users className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <input
                          type="text"
                          value={formData.bride.parents}
                          onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, parents: e.target.value } })}
                          placeholder="Contoh: Bapak H. Mahmud & Ibu Hj. Aminah"
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-gray-600 mb-1 font-medium">Instagram</label>
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
                    <div className="sm:col-span-2">
                      <label className="block text-gray-600 mb-1 font-medium">Foto Mempelai Wanita</label>
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

                {/* Date & Events */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 flex flex-col gap-4">
                  <h3 className="font-heading text-sm font-semibold text-text-dark flex items-center gap-2">
                    <Calendar size={16} className="text-sage-dark" />
                    <span>Tanggal & Rangkaian Acara</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-1">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Format Tanggal (Tampil)</label>
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <input
                          type="text"
                          value={formData.dateStr}
                          onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                          placeholder="Contoh: Minggu, 20 September 2026"
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Tanggal Countdown ISO</label>
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <input
                          type="text"
                          value={formData.dateISO}
                          onChange={(e) => setFormData({ ...formData, dateISO: e.target.value })}
                          placeholder="Contoh: 2026-09-20T08:00:00+07:00"
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Akad */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-xs text-sage-dark mb-3 flex items-center gap-1.5">
                      <Clock size={14} /> Akad Nikah
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Hari (Contoh: Minggu)"
                          value={formData.events.akad.day}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, akad: { ...formData.events.akad, day: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Tanggal (Contoh: 20 September 2026)"
                          value={formData.events.akad.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, akad: { ...formData.events.akad, date: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Jam (Contoh: 08.00 - 10.00 WIB)"
                          value={formData.events.akad.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, akad: { ...formData.events.akad, time: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <Building className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Nama Tempat (Contoh: Masjid Raya Betawi)"
                          value={formData.events.akad.venue}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, akad: { ...formData.events.akad, venue: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center sm:col-span-2">
                        <MapPin className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Alamat Lengkap (Contoh: Jl. Danau Sunter Utara No. 12)"
                          value={formData.events.akad.address}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, akad: { ...formData.events.akad, address: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center sm:col-span-2">
                        <LinkIcon className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Link Google Maps (https://maps.app.goo.gl/...)"
                          value={formData.events.akad.mapUrl}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, akad: { ...formData.events.akad, mapUrl: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage text-gray-600 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Resepsi */}
                  <div className="p-4 bg-white border border-gray-200 rounded-xl">
                    <h4 className="font-semibold text-xs text-sage-dark mb-3 flex items-center gap-1.5">
                      <Clock size={14} /> Resepsi Pernikahan
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Hari (Contoh: Minggu)"
                          value={formData.events.resepsi.day}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, resepsi: { ...formData.events.resepsi, day: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <Calendar className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Tanggal (Contoh: 20 September 2026)"
                          value={formData.events.resepsi.date}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, resepsi: { ...formData.events.resepsi, date: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <Clock className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Jam (Contoh: 11.00 - 17.00 WIB)"
                          value={formData.events.resepsi.time}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, resepsi: { ...formData.events.resepsi, time: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center">
                        <Building className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Nama Tempat (Contoh: Balai Sarwono Jakarta)"
                          value={formData.events.resepsi.venue}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, resepsi: { ...formData.events.resepsi, venue: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center sm:col-span-2">
                        <MapPin className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Alamat Lengkap (Contoh: Jl. Madrasah No. 14, Cilandak)"
                          value={formData.events.resepsi.address}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, resepsi: { ...formData.events.resepsi, address: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage"
                        />
                      </div>
                      <div className="relative flex items-center sm:col-span-2">
                        <LinkIcon className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                        <input
                          type="text"
                          placeholder="Link Google Maps (https://maps.app.goo.gl/...)"
                          value={formData.events.resepsi.mapUrl}
                          onChange={(e) => setFormData({
                            ...formData,
                            events: { ...formData.events, resepsi: { ...formData.events.resepsi, mapUrl: e.target.value } }
                          })}
                          className="w-full border border-gray-200 rounded-lg pl-8 pr-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sage text-gray-600 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kisah Kami */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 text-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                      <BookOpen size={16} className="text-sage-dark" />
                      <span>Kisah Kami (Love Story)</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, loveStory: [...(formData.loveStory || []), { year: '', title: '', description: '' }] })}
                      className="text-sage-dark hover:text-sage flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Plus size={15} />
                      <span>Tambah Cerita</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {(formData.loveStory || []).map((story, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3.5 flex flex-col gap-2.5 relative shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = [...(formData.loveStory || [])];
                            newArr.splice(idx, 1);
                            setFormData({ ...formData, loveStory: newArr });
                          }}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                          title="Hapus bagian cerita ini"
                          aria-label="Hapus bagian cerita ini"
                        >
                          <Trash2 size={15} />
                        </button>
                        
                        <div className="relative flex items-center pr-8">
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
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage"
                          />
                        </div>
                        <div className="relative flex items-center">
                          <BookOpen className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                          <input
                            type="text"
                            placeholder="Judul Cerita (mis. Dari Teman Menjadi Pasangan)"
                            value={story.title}
                            onChange={(e) => {
                              const newArr = [...(formData.loveStory || [])];
                              newArr[idx] = { ...story, title: e.target.value };
                              setFormData({ ...formData, loveStory: newArr });
                            }}
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage"
                          />
                        </div>
                        <div className="relative flex">
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
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Music */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 text-xs flex flex-col gap-4">
                  <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                    <Music size={16} className="text-sage-dark" />
                    <span>Lagu Latar (YouTube Audio URL)</span>
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Mode Pemutaran</label>
                      <div className="relative flex items-center">
                        <Music className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <select
                          value={formData.music?.mode || 'repeat-all'}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            music: { ...formData.music!, mode: e.target.value as 'repeat-all' | 'repeat-one' | 'shuffle' | 'linear' } 
                          })}
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage cursor-pointer"
                        >
                          <option value="repeat-all">Ulangi Semua (Repeat All)</option>
                          <option value="repeat-one">Ulangi Satu Lagu (Repeat One)</option>
                          <option value="shuffle">Acak (Shuffle)</option>
                          <option value="linear">Sekali Jalan (Linear)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-gray-600 font-medium">Daftar Putar (Playlist)</label>
                        <button
                          type="button"
                          onClick={() => {
                            const newPlaylist = [...(formData.music?.playlist || []), { url: '' }];
                            setFormData({ ...formData, music: { ...formData.music!, mode: formData.music?.mode || 'repeat-all', playlist: newPlaylist } });
                          }}
                          className="text-sage-dark hover:text-sage text-xs flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Tambah Lagu</span>
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
                              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white font-mono text-[11px] focus:outline-none focus:ring-1 focus:ring-sage"
                              placeholder="https://www.youtube.com/watch?v=..."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newPlaylist = (formData.music?.playlist || []).filter((_, i) => i !== idx);
                              setFormData({ ...formData, music: { ...formData.music!, playlist: newPlaylist } });
                            }}
                            className="text-gray-400 hover:text-red-500 p-2 shrink-0 bg-white border border-gray-200 rounded-lg transition-colors cursor-pointer"
                            title="Hapus lagu ini"
                            aria-label="Hapus lagu ini"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bank / QRIS */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 text-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                      <CreditCard size={16} className="text-gold" />
                      <span>Rekening Bank & QRIS Gift</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, banks: [...(formData.banks || (formData.bank ? [formData.bank] : [])), { name: '', account: '', holder: '', isQris: false, qrisImage: '' }] })}
                      className="text-sage-dark hover:text-sage flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <Plus size={15} />
                      <span>Tambah Akun</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(formData.banks || (formData.bank ? [formData.bank] : [])).map((bank, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2.5 relative shadow-2xs">
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = [...(formData.banks || [])];
                            newArr.splice(idx, 1);
                            setFormData({ ...formData, banks: newArr });
                          }}
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                          title="Hapus akun bank ini"
                          aria-label="Hapus akun bank ini"
                        >
                          <Trash2 size={15} />
                        </button>

                        <label className="flex items-center gap-2 mb-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bank.isQris || false}
                            onChange={(e) => {
                              const newArr = [...(formData.banks || [])];
                              newArr[idx] = { ...bank, isQris: e.target.checked };
                              setFormData({ ...formData, banks: newArr });
                            }}
                            className="rounded text-sage focus:ring-sage"
                          />
                          <span className="font-medium text-gray-700">Gunakan QRIS untuk akun ini</span>
                        </label>

                        <div className="relative flex items-center pr-8">
                          <CreditCard className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                          <input
                            type="text"
                            placeholder="Nama Bank / E-Wallet (mis. BCA, Mandiri, QRIS)"
                            value={bank.name}
                            onChange={(e) => {
                              const newArr = [...(formData.banks || [])];
                              newArr[idx] = { ...bank, name: e.target.value };
                              setFormData({ ...formData, banks: newArr });
                            }}
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage"
                          />
                        </div>

                        {!bank.isQris ? (
                          <>
                            <div className="relative flex items-center">
                              <KeyRound className="absolute left-2.5 text-gray-400 pointer-events-none" size={14} />
                              <input
                                type="text"
                                placeholder="No Rekening / No HP (mis. 1234567890)"
                                value={bank.account}
                                onChange={(e) => {
                                  const newArr = [...(formData.banks || [])];
                                  newArr[idx] = { ...bank, account: e.target.value };
                                  setFormData({ ...formData, banks: newArr });
                                }}
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage"
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
                                className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sage"
                              />
                            </div>
                          </>
                        ) : (
                          <DragDropUpload
                            id={`qris-upload-${idx}`}
                            label="Tarik & lepas barcode QRIS, atau klik untuk memilih"
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

                {/* Gallery Drop & Drop */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 text-xs flex flex-col gap-4">
                  <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                    <ImageIcon size={16} className="text-sage-dark" />
                    <span>Galeri Foto Pernikahan ({formData.gallery.length} foto)</span>
                  </h3>
                  <DragDropUpload
                    id="gallery-dropzone"
                    multiple
                    label="Tarik & lepas foto-foto galeri di sini, atau klik untuk memilih"
                    helperText="Bisa memilih beberapa foto sekaligus. Otomatis dikompresi untuk menjaga performa."
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

                {/* SEO Settings */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 text-xs flex flex-col gap-4">
                  <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                    <Globe size={16} className="text-sage-dark" />
                    <span>Pengaturan SEO & Metadata Link Preview</span>
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="relative flex items-center">
                      <Globe className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                      <input
                        type="text"
                        placeholder="Judul Halaman (Browser Tab & Link Preview)"
                        value={formData.seo?.title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { ...formData.seo, title: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-sage"
                      />
                    </div>
                    <div className="relative flex">
                      <FileText className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={15} />
                      <textarea
                        placeholder="Deskripsi Singkat Undangan (Muncul di Link Preview WhatsApp & Media Sosial)"
                        value={formData.seo?.description || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { ...formData.seo, description: e.target.value }
                        })}
                        rows={2}
                        className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-sage"
                      />
                    </div>
                    <div className="relative flex items-center">
                      <Settings className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                      <input
                        type="text"
                        placeholder="Keywords (Opsional, pisahkan dengan koma: nikah, betawi, wedding)"
                        value={formData.seo?.keywords || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          seo: { ...formData.seo, keywords: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Gambar Thumbnail Preview (OpenGraph)</label>
                      <DragDropUpload
                        id="seo-thumbnail-upload"
                        label="Tarik & lepas gambar thumbnail preview, atau klik untuk memilih"
                        value={formData.seo?.image}
                        isUploading={uploadingAvatar === 'seo'}
                        onFileSelect={handleUploadSeo}
                        onRemove={() => setFormData(prev => ({ ...prev, seo: { ...prev.seo, image: '' } }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 border-t border-gray-100 flex items-center justify-between gap-4 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 rounded-b-[32px]">
                  {saveSuccess ? (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Berhasil disimpan ke Firestore!
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Pastikan data sudah sesuai sebelum menyimpan</span>
                  )}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="ml-auto bg-sage-dark text-white px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 hover:bg-sage transition-all disabled:opacity-50 cursor-pointer shadow-md active:scale-98"
                  >
                    <Save size={16} />
                    <span>{isSaving ? 'Menyimpan...' : 'Simpan ke Firestore'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: RSVP DATA */}
            {activeTab === 'rsvps' && (
              <div className="flex flex-col gap-4">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 shadow-2xs">
                    <span className="block text-2xl font-bold text-emerald-700">{totalAttending}</span>
                    <span className="text-[10px] text-emerald-800 uppercase font-semibold tracking-wider">Total Tamu Hadir</span>
                  </div>
                  <div className="bg-red-50 border border-red-200/80 rounded-2xl p-3.5 shadow-2xs">
                    <span className="block text-2xl font-bold text-red-700">{totalNotAttending}</span>
                    <span className="text-[10px] text-red-800 uppercase font-semibold tracking-wider">Tidak Hadir</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3.5 col-span-2 sm:col-span-1 shadow-2xs">
                    <span className="block text-2xl font-bold text-blue-700">{rsvps.length}</span>
                    <span className="text-[10px] text-blue-800 uppercase font-semibold tracking-wider">Total Respon</span>
                  </div>
                </div>

                {/* In-Memory Real-Time Live Search Bar */}
                <div className="relative flex items-center">
                  <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={rsvpSearchQuery}
                    onChange={(e) => setRsvpSearchQuery(e.target.value)}
                    placeholder="Cari nama tamu, status kehadiran, atau catatan RSVP secara live..."
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all placeholder:text-gray-400"
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

                {/* Structured Responsive Data Table */}
                {filteredRsvps.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-2">
                    <Users size={32} className="text-gray-300" />
                    <p className="text-xs text-gray-500 font-medium">
                      {rsvpSearchQuery
                        ? `Tidak ada data RSVP yang cocok dengan "${rsvpSearchQuery}"`
                        : 'Belum ada respon RSVP masuk.'}
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
                          <th className="py-3 px-4">Catatan / Doa</th>
                          <th className="py-3 px-3 text-center w-16">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredRsvps.map((rsvp, idx) => (
                          <tr key={rsvp.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-3.5 text-center text-gray-400 font-medium">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-semibold text-text-dark whitespace-nowrap">
                              {rsvp.name}
                            </td>
                            <td className="py-3 px-3 text-center whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                rsvp.attendance === 'hadir'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {rsvp.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700 font-medium whitespace-nowrap">
                              {rsvp.attendance === 'hadir' ? `${rsvp.guestCount} Orang` : '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-600 max-w-xs truncate italic">
                              {rsvp.notes ? `"${rsvp.notes}"` : '-'}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => requestDeleteRsvp(rsvp)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus respon RSVP ini"
                                aria-label="Hapus respon RSVP ini"
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

            {/* TAB 4: WISHES DATA */}
            {activeTab === 'wishes' && (
              <div className="flex flex-col gap-4">
                {/* In-Memory Real-Time Live Search Bar */}
                <div className="relative flex items-center">
                  <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    value={wishSearchQuery}
                    onChange={(e) => setWishSearchQuery(e.target.value)}
                    placeholder="Cari pengirim atau isi pesan doa ucapan secara live..."
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all placeholder:text-gray-400"
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

                {/* Structured Responsive Data Table */}
                {filteredWishes.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center gap-2">
                    <MessageSquare size={32} className="text-gray-300" />
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
                          <th className="py-3 px-4 w-40">Pengirim</th>
                          <th className="py-3 px-4">Pesan Doa & Ucapan</th>
                          <th className="py-3 px-3 text-center w-28">Waktu</th>
                          <th className="py-3 px-3 text-center w-16">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredWishes.map((w, idx) => (
                          <tr key={w.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-3 px-3.5 text-center text-gray-400 font-medium">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-semibold text-text-dark whitespace-nowrap">
                              {w.name}
                            </td>
                            <td className="py-3 px-4 text-gray-700 leading-relaxed italic">
                              "{w.text}"
                            </td>
                            <td className="py-3 px-3 text-center text-gray-400 text-[11px] whitespace-nowrap">
                              {w.time || '-'}
                            </td>
                            <td className="py-3 px-3 text-center">
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
          </div>
        </div>
      </div>

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
            {/* Pulsing Danger Badge */}
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
