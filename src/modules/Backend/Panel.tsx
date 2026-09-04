import React, { useState, useEffect } from 'react';
import { 
  Settings, Link as LinkIcon, Users, MessageSquare, Save, Plus, Trash2, 
  Copy, Check, X, Lock, LogOut, Music, Heart, Calendar, Image as ImageIcon, CreditCard, Share2, Upload, Loader2, BookOpen, AlertCircle
} from 'lucide-react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { WeddingConfig, RSVPResponse, Wish } from '../../types';
import { Login } from '../Auth/Login';

export interface PanelProps {
  currentRoute?: 'login' | 'modules';
  onNavigate?: (path: string) => void;
  onReplace?: (path: string) => void;
}

export type AdminPanelProps = PanelProps;

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

  const [uploadingGallery, setUploadingGallery] = useState<{[key: number]: boolean}>({});
  const [uploadingAvatar, setUploadingAvatar] = useState<'groom' | 'bride' | null>(null);

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

  // Sinkronisasi rute jika belum login atau sudah login
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
      title: 'Hapus Ucapan',
      description: `Apakah Anda yakin ingin menghapus ucapan dari "${wish.name}"? Tindakan ini permanen.`,
    });
  };

  const requestDeleteRsvp = (rsvp: RSVPResponse) => {
    if (!rsvp.id) return;
    setDeleteModal({
      type: 'rsvp',
      id: rsvp.id,
      title: 'Hapus Data RSVP',
      description: `Apakah Anda yakin ingin menghapus respon RSVP dari "${rsvp.name}"? Tindakan ini permanen.`,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'groom' | 'bride' | 'gallery', index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'groom' || type === 'bride') {
      setUploadingAvatar(type);
    } else if (type === 'gallery' && index !== undefined) {
      setUploadingGallery(prev => ({ ...prev, [index]: true }));
    }

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
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
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);

          if (type === 'groom') {
            setFormData(prev => ({ ...prev, groom: { ...prev.groom, image: dataUrl } }));
          } else if (type === 'bride') {
            setFormData(prev => ({ ...prev, bride: { ...prev.bride, image: dataUrl } }));
          } else if (type === 'gallery' && index !== undefined) {
            setFormData(prev => {
              const newGallery = [...prev.gallery];
              newGallery[index] = dataUrl;
              return { ...prev, gallery: newGallery };
            });
          }
          resetUploadState(type, index);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      showToast('error', 'Gagal memproses dan mengunggah foto.');
      resetUploadState(type, index);
    }
  };

  const resetUploadState = (type: string, index?: number) => {
    if (type === 'groom' || type === 'bride') setUploadingAvatar(null);
    if (type === 'gallery' && index !== undefined) {
      setUploadingGallery(prev => ({ ...prev, [index]: false }));
    }
  };

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
                Kelola undangan & database
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              title="Logout dari Admin"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('/') : (window.location.href = '/'))}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              title="Kembali ke Undangan"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Tabs Bar */}
            <div className="flex border-b border-gray-100 px-2 sm:px-6 bg-gray-50/50 overflow-x-auto no-scrollbar pt-2">
              <button
                onClick={() => setActiveTab('generator')}
                className={`py-4 px-4 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'generator'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <LinkIcon size={15} />
                      Link Tamu Undangan
                    </button>
                    <button
                      onClick={() => setActiveTab('config')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'config'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Settings size={15} />
                      Edit Data Website
                    </button>
                    <button
                      onClick={() => setActiveTab('rsvps')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'rsvps'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <Users size={15} />
                      RSVP ({rsvps.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('wishes')}
                      className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                        activeTab === 'wishes'
                          ? 'border-sage-dark text-sage-dark font-semibold'
                          : 'border-transparent text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      <MessageSquare size={15} />
                      Ucapan ({wishes.length})
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {/* TAB 1: LINK GENERATOR */}
                    {activeTab === 'generator' && (
                      <div className="flex flex-col gap-6">
                        <div>
                          <label className="block text-xs font-semibold text-text-dark mb-1">Nama Tamu Undangan</label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="Contoh: Bapak Budi & Keluarga"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-text-dark mb-1">Generated Link Undangan</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={generatedLink}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-600 overflow-hidden text-ellipsis"
                            />
                            <button
                              onClick={copyLink}
                              className="bg-sage text-white px-4 py-2.5 rounded-xl hover:bg-sage-dark transition-colors flex items-center gap-1.5 text-xs font-medium shrink-0 cursor-pointer"
                            >
                              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                              {copiedLink ? 'Tersalin' : 'Salin URL'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-semibold text-text-dark">Template Pesan WhatsApp</label>
                            <div className="flex gap-2">
                              <button
                                onClick={copyWaMessage}
                                className="text-xs text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                {copiedWaText ? <Check size={13} /> : <Copy size={13} />}
                                {copiedWaText ? 'Teks Tersalin' : 'Salin Teks WA'}
                              </button>
                            </div>
                          </div>
                          <textarea
                            readOnly
                            rows={7}
                            value={waMessage}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700 font-mono resize-none"
                          />
                        </div>

                        <button
                          onClick={shareToWhatsapp}
                          className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                        >
                          <Share2 size={16} />
                          Kirim / Bagikan via WhatsApp
                        </button>
                      </div>
                    )}

                    {/* TAB 2: EDIT WEBSITE CONFIG */}
                    {activeTab === 'config' && (
                      <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">
                        {/* Groom Info */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                          <h3 className="font-heading text-sm font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <Heart size={16} className="text-betawi-red" /> Mempelai Pria (Groom)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Panggilan</label>
                              <input
                                type="text"
                                value={formData.groom.nickname}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, nickname: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Lengkap</label>
                              <input
                                type="text"
                                value={formData.groom.fullName}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, fullName: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-gray-600 mb-1">Nama Orang Tua</label>
                              <input
                                type="text"
                                value={formData.groom.parents}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, parents: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Instagram</label>
                              <input
                                type="text"
                                value={formData.groom.instagram}
                                onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, instagram: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-gray-600 mb-1">Foto Mempelai Pria</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={formData.groom.image}
                                  onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, image: e.target.value } })}
                                  className="w-full border rounded-lg p-2 bg-white"
                                  placeholder="URL atau upload foto..."
                                />
                                <label className="bg-sage text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sage-dark transition-colors shrink-0 relative overflow-hidden">
                                  {uploadingAvatar === 'groom' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, 'groom')} 
                                    className="absolute inset-0 opacity-0 cursor-pointer hidden" 
                                    id="groom-upload"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bride Info */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                          <h3 className="font-heading text-sm font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <Heart size={16} className="text-pink-500" /> Mempelai Wanita (Bride)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Panggilan</label>
                              <input
                                type="text"
                                value={formData.bride.nickname}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, nickname: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Nama Lengkap</label>
                              <input
                                type="text"
                                value={formData.bride.fullName}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, fullName: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-gray-600 mb-1">Nama Orang Tua</label>
                              <input
                                type="text"
                                value={formData.bride.parents}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, parents: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Instagram</label>
                              <input
                                type="text"
                                value={formData.bride.instagram}
                                onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, instagram: e.target.value } })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-gray-600 mb-1">Foto Mempelai Wanita</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={formData.bride.image}
                                  onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, image: e.target.value } })}
                                  className="w-full border rounded-lg p-2 bg-white"
                                  placeholder="URL atau upload foto..."
                                />
                                <label className="bg-sage text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sage-dark transition-colors shrink-0 relative overflow-hidden">
                                  {uploadingAvatar === 'bride' ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, 'bride')} 
                                    className="absolute inset-0 opacity-0 cursor-pointer hidden" 
                                    id="bride-upload"
                                  />
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Date & Events */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                          <h3 className="font-heading text-sm font-semibold text-text-dark mb-3 flex items-center gap-2">
                            <Calendar size={16} className="text-sage-dark" /> Tanggal & Acara
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
                            <div>
                              <label className="block text-gray-600 mb-1">Format Tanggal (Tampil)</label>
                              <input
                                type="text"
                                value={formData.dateStr}
                                onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-600 mb-1">Tanggal Countdown ISO</label>
                              <input
                                type="text"
                                value={formData.dateISO}
                                onChange={(e) => setFormData({ ...formData, dateISO: e.target.value })}
                                className="w-full border rounded-lg p-2 bg-white"
                              />
                            </div>
                          </div>

                          {/* Akad */}
                          <div className="p-3 bg-white border rounded-xl mb-3">
                            <h4 className="font-semibold text-xs text-sage-dark mb-2">Akad Nikah</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder="Hari (Contoh: Minggu)"
                                value={formData.events.akad.day}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, day: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Tanggal (Contoh: 20 September 2026)"
                                value={formData.events.akad.date}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, date: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Jam"
                                value={formData.events.akad.time}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, time: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Nama Tempat"
                                value={formData.events.akad.venue}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, venue: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Alamat Lengkap"
                                value={formData.events.akad.address}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, address: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Link Google Maps"
                                value={formData.events.akad.mapUrl}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, akad: { ...formData.events.akad, mapUrl: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                            </div>
                          </div>

                          {/* Resepsi */}
                          <div className="p-3 bg-white border rounded-xl">
                            <h4 className="font-semibold text-xs text-sage-dark mb-2">Resepsi</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <input
                                type="text"
                                placeholder="Hari (Contoh: Minggu)"
                                value={formData.events.resepsi.day}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, day: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Tanggal (Contoh: 20 September 2026)"
                                value={formData.events.resepsi.date}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, date: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Jam"
                                value={formData.events.resepsi.time}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, time: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Nama Tempat"
                                value={formData.events.resepsi.venue}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, venue: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Alamat Lengkap"
                                value={formData.events.resepsi.address}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, address: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                              <input
                                type="text"
                                placeholder="Link Google Maps"
                                value={formData.events.resepsi.mapUrl}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  events: { ...formData.events, resepsi: { ...formData.events.resepsi, mapUrl: e.target.value } }
                                })}
                                className="border rounded p-1.5"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Kisah Kami */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 text-xs">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                              <BookOpen size={15} className="text-sage-dark" /> Kisah Kami
                            </h3>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, loveStory: [...(formData.loveStory || []), { year: '', title: '', description: '' }] })}
                              className="text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={14} /> Tambah Cerita
                            </button>
                          </div>
                          <div className="flex flex-col gap-4">
                            {(formData.loveStory || []).map((story, idx) => (
                              <div key={idx} className="bg-white border rounded-xl p-3 flex flex-col gap-2 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newArr = [...(formData.loveStory || [])];
                                    newArr.splice(idx, 1);
                                    setFormData({ ...formData, loveStory: newArr });
                                  }}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                                
                                <input
                                  type="text"
                                  placeholder="Tahun / Momen (mis. 2021 atau Pertemuan)"
                                  value={story.year}
                                  onChange={(e) => {
                                    const newArr = [...(formData.loveStory || [])];
                                    newArr[idx] = { ...story, year: e.target.value };
                                    setFormData({ ...formData, loveStory: newArr });
                                  }}
                                  className="w-full border rounded-lg p-1.5 bg-gray-50 pr-8"
                                />
                                <input
                                  type="text"
                                  placeholder="Judul Cerita"
                                  value={story.title}
                                  onChange={(e) => {
                                    const newArr = [...(formData.loveStory || [])];
                                    newArr[idx] = { ...story, title: e.target.value };
                                    setFormData({ ...formData, loveStory: newArr });
                                  }}
                                  className="w-full border rounded-lg p-1.5 bg-gray-50"
                                />
                                <textarea
                                  placeholder="Deskripsi cerita..."
                                  value={story.description}
                                  onChange={(e) => {
                                    const newArr = [...(formData.loveStory || [])];
                                    newArr[idx] = { ...story, description: e.target.value };
                                    setFormData({ ...formData, loveStory: newArr });
                                  }}
                                  rows={3}
                                  className="w-full border rounded-lg p-1.5 bg-gray-50 resize-none"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Music */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 text-xs">
                          <h3 className="font-heading font-semibold text-text-dark mb-3 flex items-center gap-1.5">
                            <Music size={15} className="text-sage-dark" /> Lagu Latar (YouTube URL)
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-gray-600 mb-1 font-medium">Mode Pemutaran</label>
                              <select
                                value={formData.music?.mode || 'repeat-all'}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  music: { ...formData.music!, mode: e.target.value as any } 
                                })}
                                className="w-full border rounded-lg p-2 bg-white"
                              >
                                <option value="repeat-all">Ulangi Semua (Repeat All)</option>
                                <option value="repeat-one">Ulangi Satu Lagu (Repeat One)</option>
                                <option value="shuffle">Acak (Shuffle)</option>
                                <option value="linear">Sekali Jalan (Linear)</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="block text-gray-600 font-medium">Daftar Putar (Playlist)</label>
                              {(formData.music?.playlist || (formData.musicUrl ? [{url: formData.musicUrl}] : [])).map((track, idx) => (
                                <div key={idx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={track.url}
                                    onChange={(e) => {
                                      const newPlaylist = [...(formData.music?.playlist || [])];
                                      newPlaylist[idx] = { url: e.target.value };
                                      setFormData({ ...formData, music: { ...formData.music!, playlist: newPlaylist } });
                                    }}
                                    className="flex-1 border rounded-lg p-2 bg-white"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newPlaylist = formData.music!.playlist.filter((_, i) => i !== idx);
                                      setFormData({ ...formData, music: { ...formData.music!, playlist: newPlaylist } });
                                    }}
                                    className="text-red-500 hover:text-red-700 p-2 shrink-0 bg-white border rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const newPlaylist = [...(formData.music?.playlist || []), { url: '' }];
                                  setFormData({ ...formData, music: { ...formData.music!, mode: formData.music?.mode || 'repeat-all', playlist: newPlaylist } });
                                }}
                                className="text-sage-dark text-xs flex items-center gap-1 font-medium hover:underline mt-1"
                              >
                                <Plus size={14} /> Tambah Lagu
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Bank / QRIS */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 text-xs">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                              <CreditCard size={15} className="text-gold" /> Rekening / QRIS Gift
                            </h3>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, banks: [...(formData.banks || (formData.bank ? [formData.bank] : [])), { name: '', account: '', holder: '', isQris: false, qrisImage: '' }] })}
                              className="text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={14} /> Tambah Akun
                            </button>
                          </div>
                          <div className="flex flex-col gap-4">
                            {(formData.banks || (formData.bank ? [formData.bank] : [])).map((bank, idx) => (
                              <div key={idx} className="bg-white border rounded-xl p-3 flex flex-col gap-2 relative">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newArr = [...(formData.banks || [])];
                                    newArr.splice(idx, 1);
                                    setFormData({ ...formData, banks: newArr });
                                  }}
                                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                                >
                                  <Trash2 size={14} />
                                </button>
                                <label className="flex items-center gap-2 mb-1">
                                  <input
                                    type="checkbox"
                                    checked={bank.isQris || false}
                                    onChange={(e) => {
                                      const newArr = [...(formData.banks || [])];
                                      newArr[idx] = { ...bank, isQris: e.target.checked };
                                      setFormData({ ...formData, banks: newArr });
                                    }}
                                  />
                                  <span>Gunakan QRIS untuk akun ini</span>
                                </label>

                                <input
                                  type="text"
                                  placeholder="Nama Bank / E-Wallet (mis. BCA, OVO, QRIS)"
                                  value={bank.name}
                                  onChange={(e) => {
                                    const newArr = [...(formData.banks || [])];
                                    newArr[idx] = { ...bank, name: e.target.value };
                                    setFormData({ ...formData, banks: newArr });
                                  }}
                                  className="w-full border rounded-lg p-1.5 bg-gray-50"
                                />

                                {!bank.isQris && (
                                  <>
                                    <input
                                      type="text"
                                      placeholder="No Rekening / No HP"
                                      value={bank.account}
                                      onChange={(e) => {
                                        const newArr = [...(formData.banks || [])];
                                        newArr[idx] = { ...bank, account: e.target.value };
                                        setFormData({ ...formData, banks: newArr });
                                      }}
                                      className="w-full border rounded-lg p-1.5 bg-gray-50"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Atas Nama"
                                      value={bank.holder}
                                      onChange={(e) => {
                                        const newArr = [...(formData.banks || [])];
                                        newArr[idx] = { ...bank, holder: e.target.value };
                                        setFormData({ ...formData, banks: newArr });
                                      }}
                                      className="w-full border rounded-lg p-1.5 bg-gray-50"
                                    />
                                  </>
                                )}

                                {bank.isQris && (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={bank.qrisImage || ''}
                                      placeholder="Data Gambar QRIS..."
                                      readOnly
                                      className="w-full border rounded-lg p-1.5 bg-gray-50 text-gray-400"
                                    />
                                    <label className="bg-sage text-white px-3 py-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sage-dark shrink-0">
                                      <Upload size={14} className="mr-1" /> Pilih QRIS
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (!file) return;
                                          const reader = new FileReader();
                                          reader.onload = (event) => {
                                            const newArr = [...(formData.banks || [])];
                                            newArr[idx] = { ...bank, qrisImage: event.target?.result as string, account: '-', holder: '-' };
                                            setFormData({ ...formData, banks: newArr });
                                          };
                                          reader.readAsDataURL(file);
                                        }} 
                                        className="hidden" 
                                      />
                                    </label>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gallery URLs */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 text-xs">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-heading font-semibold text-text-dark flex items-center gap-1.5">
                              <ImageIcon size={15} className="text-sage-dark" /> Galeri Foto ({formData.gallery.length})
                            </h3>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ''] })}
                              className="text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Plus size={14} /> Tambah Foto
                            </button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {formData.gallery.map((url, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={url}
                                  onChange={(e) => {
                                    const newArr = [...formData.gallery];
                                    newArr[idx] = e.target.value;
                                    setFormData({ ...formData, gallery: newArr });
                                  }}
                                  placeholder="URL foto atau upload file..."
                                  className="w-full border rounded-lg p-1.5 bg-white"
                                />
                                <label className="bg-sage text-white px-3 py-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sage-dark transition-colors shrink-0 relative overflow-hidden">
                                  {uploadingGallery[idx] ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(e, 'gallery', idx)} 
                                    className="absolute inset-0 opacity-0 cursor-pointer hidden" 
                                    id={`gallery-upload-${idx}`}
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== idx) })}
                                  className="text-red-500 hover:text-red-700 p-1 cursor-pointer shrink-0"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* SEO Settings */}
                        <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 text-xs">
                          <h3 className="font-heading font-semibold text-text-dark mb-3 flex items-center gap-1.5">
                            <Settings size={15} className="text-sage-dark" /> Pengaturan SEO & Metadata Link
                          </h3>
                          <div className="flex flex-col gap-3">
                            <input
                              type="text"
                              placeholder="Judul Halaman (Browser Tab & Link Preview)"
                              value={formData.seo?.title || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                seo: { ...formData.seo, title: e.target.value }
                              })}
                              className="w-full border rounded-lg p-2 bg-white font-medium"
                            />
                            <textarea
                              placeholder="Deskripsi Singkat (Muncul di Link Preview)"
                              value={formData.seo?.description || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                seo: { ...formData.seo, description: e.target.value }
                              })}
                              rows={2}
                              className="w-full border rounded-lg p-2 bg-white resize-none"
                            />
                            <input
                              type="text"
                              placeholder="Keywords (Opsional, pisahkan dengan koma)"
                              value={formData.seo?.keywords || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                seo: { ...formData.seo, keywords: e.target.value }
                              })}
                              className="w-full border rounded-lg p-2 bg-white"
                            />
                            <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="URL Gambar Thumbnail Preview (Rekomendasi 1200x630)"
                                  value={formData.seo?.image || ''}
                                  onChange={(e) => setFormData({
                                    ...formData,
                                    seo: { ...formData.seo, image: e.target.value }
                                  })}
                                  className="flex-1 border rounded-lg p-2 bg-white"
                                />
                                <label className="bg-sage text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-sage-dark transition-colors shrink-0 relative overflow-hidden">
                                  {uploadingGallery[-1] ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                      // Reuse image upload logic but map to seo image
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      const reader = new FileReader();
                                      reader.onload = (event) => {
                                        setFormData({ ...formData, seo: { ...formData.seo, image: event.target?.result as string } });
                                      };
                                      reader.readAsDataURL(file);
                                    }} 
                                    className="absolute inset-0 opacity-0 cursor-pointer hidden" 
                                  />
                                </label>
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="sticky bottom-0 bg-white p-3 border-t flex items-center justify-between gap-4">
                          {saveSuccess && (
                            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                              <Check size={14} /> Berhasil disimpan ke Firestore!
                            </span>
                          )}
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="ml-auto bg-sage-dark text-white px-6 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 hover:bg-sage transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                          >
                            <Save size={16} />
                            {isSaving ? 'Menyimpan...' : 'Simpan ke Firestore'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* TAB 3: RSVP DATA */}
                    {activeTab === 'rsvps' && (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
                            <span className="block text-2xl font-bold text-emerald-700">{totalAttending}</span>
                            <span className="text-[10px] text-emerald-800 uppercase font-medium">Total Tamu Hadir</span>
                          </div>
                          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
                            <span className="block text-2xl font-bold text-red-700">{totalNotAttending}</span>
                            <span className="text-[10px] text-red-800 uppercase font-medium">Tidak Hadir</span>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 col-span-2 sm:col-span-1">
                            <span className="block text-2xl font-bold text-blue-700">{rsvps.length}</span>
                            <span className="text-[10px] text-blue-800 uppercase font-medium">Total Respon</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                          {rsvps.length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-8">Belum ada respon RSVP masuk.</p>
                          ) : (
                            rsvps.map((rsvp) => (
                              <div key={rsvp.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-start justify-between gap-3 text-xs">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-text-dark text-sm">{rsvp.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                      rsvp.attendance === 'hadir' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                      {rsvp.attendance === 'hadir' ? `Hadir (${rsvp.guestCount} org)` : 'Tidak Hadir'}
                                    </span>
                                  </div>
                                  {rsvp.notes && (
                                    <p className="text-gray-600 text-xs italic">"{rsvp.notes}"</p>
                                  )}
                                </div>
                                <button
                                  onClick={() => requestDeleteRsvp(rsvp)}
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                  title="Hapus"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: WISHES DATA */}
                    {activeTab === 'wishes' && (
                      <div className="flex flex-col gap-3">
                        {wishes.length === 0 ? (
                          <p className="text-xs text-gray-500 text-center py-8">Belum ada ucapan masuk.</p>
                        ) : (
                          wishes.map((w) => (
                            <div key={w.id} className="p-3.5 bg-gray-50 border border-gray-100 rounded-xl flex items-start justify-between gap-3 text-xs">
                              <div className="flex-1">
                                <span className="font-semibold text-sage-dark block mb-1">{w.name}</span>
                                <p className="text-gray-700 italic">"{w.text}"</p>
                              </div>
                              <button
                                onClick={() => requestDeleteWish(w)}
                                className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                                title="Hapus ucapan"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
      </div>

      {/* Modern Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-heading text-xl text-text-dark font-semibold mb-1">{deleteModal.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{deleteModal.description}</p>
            </div>
            <div className="flex gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastNotification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
          toastNotification.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toastNotification.type === 'success' ? (
            <Check size={16} className="text-emerald-600 shrink-0" />
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
