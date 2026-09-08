import React, { useState, useEffect } from 'react';
import { 
  Palette, Heart, Calendar, ImageIcon, BookOpen, Music, Globe, 
  Crown, Save, CheckCircle2, User, LayoutGrid, ArrowUp, ArrowDown, 
  Trash2, Plus, MessageSquare, Repeat, Repeat1, Shuffle, ListMusic, 
  Volume2, Briefcase, Building, Sparkles, Share2, Phone, CreditCard, 
  FileText, Settings, KeyRound, Gift, Quote, MapPin
} from 'lucide-react';
import { WeddingConfig } from '../../../types';
import { api } from '../../../services/api';
import { THEME_CATALOG } from '../../frontend/themes';
import { ThemeSelector } from './ThemeSelector';
import { EventScheduleEditor } from './EventScheduleEditor';
import { DragDropUpload } from './DragDropUpload';
import { compressImageToFile, compressImageToDataUrl } from '../../../utils/imageCompressor';

export interface ConfigEditorTabProps {
  weddingConfig: WeddingConfig;
  updateWeddingConfig: (newConfig: WeddingConfig) => Promise<void>;
  showToast: (type: 'success' | 'error', message: string) => void;
  subTab?: ConfigSubTab;
  onSubTabChange?: (tab: ConfigSubTab) => void;
}

export type ConfigSubTab = 'theme' | 'couple' | 'events' | 'gallery' | 'story' | 'music_gift' | 'texts' | 'seo' | 'agency';

export function ConfigEditorTab({
  weddingConfig,
  updateWeddingConfig,
  showToast,
  subTab,
  onSubTabChange,
}: ConfigEditorTabProps) {
  const [internalSubTab, setInternalSubTab] = useState<ConfigSubTab>('theme');
  const configSubTab = subTab ?? internalSubTab;
  const setConfigSubTab = (tab: ConfigSubTab) => {
    setInternalSubTab(tab);
    onSubTabChange?.(tab);
  };
  const [formData, setFormData] = useState<WeddingConfig>(weddingConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<'groom' | 'bride' | 'seo' | 'agency' | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Sync internal form data whenever external weddingConfig updates
  useEffect(() => {
    setFormData(weddingConfig);
  }, [weddingConfig]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateWeddingConfig(formData);
      setSaveSuccess(true);
      showToast('success', 'Perubahan berhasil disimpan ke database!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      showToast('error', 'Gagal menyimpan perubahan konfigurasi.');
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

  // Upload handlers dengan kompresi otomatis client-side (WebP/JPEG ~150-250KB)
  const handleUploadGroom = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('groom');
    try {
      const compressed = await compressImageToFile(files[0], { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const res = await api.uploadFile(compressed);
      setFormData(prev => ({ ...prev, groom: { ...prev.groom, image: res.url } }));
      showToast('success', 'Foto mempelai pria berhasil diunggah (teroptimasi WebP)!');
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(files[0], { maxWidth: 1000, maxHeight: 1000, quality: 0.75 });
        setFormData(prev => ({ ...prev, groom: { ...prev.groom, image: dataUrl } }));
        showToast('success', 'Foto mempelai pria berhasil disimpan!');
      } catch {
        showToast('error', 'Gagal memproses foto mempelai pria.');
      }
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleUploadBride = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('bride');
    try {
      const compressed = await compressImageToFile(files[0], { maxWidth: 1200, maxHeight: 1200, quality: 0.82 });
      const res = await api.uploadFile(compressed);
      setFormData(prev => ({ ...prev, bride: { ...prev.bride, image: res.url } }));
      showToast('success', 'Foto mempelai wanita berhasil diunggah (teroptimasi WebP)!');
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(files[0], { maxWidth: 1000, maxHeight: 1000, quality: 0.75 });
        setFormData(prev => ({ ...prev, bride: { ...prev.bride, image: dataUrl } }));
        showToast('success', 'Foto mempelai wanita berhasil disimpan!');
      } catch {
        showToast('error', 'Gagal memproses foto mempelai wanita.');
      }
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleUploadSeo = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('seo');
    try {
      const compressed = await compressImageToFile(files[0], { maxWidth: 1200, maxHeight: 630, quality: 0.82 });
      const res = await api.uploadFile(compressed);
      setFormData(prev => ({ ...prev, seo: { ...prev.seo, image: res.url } }));
      showToast('success', 'Foto thumbnail preview SEO berhasil diunggah (teroptimasi)!');
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(files[0], { maxWidth: 1200, maxHeight: 630, quality: 0.75 });
        setFormData(prev => ({ ...prev, seo: { ...prev.seo, image: dataUrl } }));
        showToast('success', 'Foto thumbnail preview SEO berhasil disimpan!');
      } catch {
        showToast('error', 'Gagal memproses thumbnail SEO.');
      }
    } finally {
      setUploadingAvatar(null);
    }
  };

  const handleUploadGallery = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingGallery(true);
    try {
      const compressedFiles = await Promise.all(
        files.map(f => compressImageToFile(f, { maxWidth: 1400, maxHeight: 1400, quality: 0.82 }))
      );
      const res = await api.uploadMultipleFiles(compressedFiles);
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...res.urls]
      }));
      showToast('success', `${res.urls.length} foto berhasil ditambahkan ke galeri (teroptimasi WebP)!`);
    } catch {
      try {
        const compressedList = await Promise.all(files.map(f => compressImageToDataUrl(f)));
        setFormData(prev => ({
          ...prev,
          gallery: [...prev.gallery, ...compressedList]
        }));
        showToast('success', `${compressedList.length} foto berhasil ditambahkan ke galeri!`);
      } catch {
        showToast('error', 'Gagal mengunggah foto galeri.');
      }
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleUploadQris = async (files: File[], bankIdx: number) => {
    if (!files[0]) return;
    try {
      const compressed = await compressImageToFile(files[0], { maxWidth: 1000, maxHeight: 1000, quality: 0.85 });
      const res = await api.uploadFile(compressed);
      setFormData(prev => {
        const newBanks = [...(prev.banks || (prev.bank ? [prev.bank] : []))];
        newBanks[bankIdx] = {
          ...newBanks[bankIdx],
          qrisImage: res.url,
          isQris: true,
          account: '-',
          holder: '-',
        };
        return { ...prev, banks: newBanks };
      });
      showToast('success', 'Gambar barcode QRIS berhasil diunggah (teroptimasi)!');
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(files[0]);
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
        showToast('success', 'Gambar barcode QRIS berhasil disimpan!');
      } catch {
        showToast('error', 'Gagal mengunggah gambar QRIS.');
      }
    }
  };

  const handleUploadAgencyLogo = async (files: File[]) => {
    if (!files[0]) return;
    setUploadingAvatar('agency');
    try {
      const compressed = await compressImageToFile(files[0], { maxWidth: 800, maxHeight: 800, quality: 0.85 });
      const res = await api.uploadFile(compressed);
      setFormData(prev => ({
        ...prev,
        agencyBranding: {
          ...(prev.agencyBranding || { mode: 'disabled' }),
          agencyLogoUrl: res.url,
        },
      }));
      showToast('success', 'Logo Wedding Organizer berhasil diunggah (teroptimasi WebP)!');
    } catch {
      try {
        const dataUrl = await compressImageToDataUrl(files[0], { maxWidth: 600, maxHeight: 600, quality: 0.8 });
        setFormData(prev => ({
          ...prev,
          agencyBranding: {
            ...(prev.agencyBranding || { mode: 'disabled' }),
            agencyLogoUrl: dataUrl,
          },
        }));
        showToast('success', 'Logo Wedding Organizer berhasil disimpan!');
      } catch {
        showToast('error', 'Gagal memproses logo Wedding Organizer.');
      }
    } finally {
      setUploadingAvatar(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-Pills Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setConfigSubTab('theme')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            configSubTab === 'theme'
              ? 'bg-sage-dark text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Palette size={14} />
          <span>Tema Desain</span>
        </button>

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
          onClick={() => setConfigSubTab('texts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            configSubTab === 'texts'
              ? 'bg-sage-dark text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <FileText size={14} />
          <span>Teks & Salam</span>
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

        <button
          type="button"
          onClick={() => setConfigSubTab('agency')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            configSubTab === 'agency'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Crown size={14} className="text-amber-400" />
          <span>Agensi & White-Label</span>
        </button>
      </div>

      {/* Form Content Container */}
      <form onSubmit={handleSaveConfig} className="flex flex-col gap-6">
        {/* SUB-PILL 0: TEMA DESAIN */}
        {configSubTab === 'theme' && (
          <ThemeSelector
            currentThemeId={formData.theme || 'betawi'}
            onSelectTheme={(themeId) => {
              setFormData({ ...formData, theme: themeId });
              const selectedMeta = THEME_CATALOG.find((t) => t.id === themeId);
              const themeName = selectedMeta?.name || themeId;
              showToast(
                'success',
                `Tema berhasil dipilih: ${themeName}! Tekan tombol Simpan Perubahan di bawah.`
              );
            }}
          />
        )}

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
                      placeholder="Contoh: Muhammad Ali, S.Kom"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Nama Orang Tua</label>
                  <input
                    type="text"
                    value={formData.groom.parents}
                    onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, parents: e.target.value } })}
                    placeholder="Contoh: Putra dari Bapak H. Ahmad & Ibu Hj. Siti"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Instagram (tanpa @)</label>
                  <input
                    type="text"
                    value={formData.groom.instagram}
                    onChange={(e) => setFormData({ ...formData, groom: { ...formData.groom, instagram: e.target.value } })}
                    placeholder="Contoh: muhammadali"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                  />
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
                <Heart size={16} className="text-betawi-red fill-betawi-red" />
                <span>Mempelai Wanita (Bride)</span>
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Nama Panggilan</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
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
                    <User className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                    <input
                      type="text"
                      value={formData.bride.fullName}
                      onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, fullName: e.target.value } })}
                      placeholder="Contoh: Siti Fatimah, S.Pd"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Nama Orang Tua</label>
                  <input
                    type="text"
                    value={formData.bride.parents}
                    onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, parents: e.target.value } })}
                    placeholder="Contoh: Putri dari Bapak H. Mansur & Ibu Hj. Rogayah"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1 font-medium">Instagram (tanpa @)</label>
                  <input
                    type="text"
                    value={formData.bride.instagram}
                    onChange={(e) => setFormData({ ...formData, bride: { ...formData.bride, instagram: e.target.value } })}
                    placeholder="Contoh: sitifatimah"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                  />
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
          <div className="flex flex-col gap-6">
            {/* Visual Card Selector: Pilihan Konsep Layout Galeri */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3.5">
                <div>
                  <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2">
                    <LayoutGrid size={16} className="text-sage-dark" />
                    <span>Pilihan Konsep & Tata Letak Galeri (Layout Style)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Pilih gaya presentasi foto yang akan ditampilkan pada seksi Galeri Bahagia undangan tamu.
                  </p>
                </div>
                <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-sage/15 text-sage-dark text-[11px] font-semibold">
                  Aktif: {(formData.galleryLayout || 'editorial').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[
                  {
                    id: 'editorial' as const,
                    title: 'Editorial Asymmetric',
                    subtitle: 'Gaya Majalah Elegan',
                    badge: 'Default Populer',
                    description: 'Irama dinamis: 1 portrait besar, 2 kotak berdampingan, dan 1 landscape sinematik berulang.',
                    renderWireframe: () => (
                      <div className="w-full h-24 bg-gray-100/80 rounded-xl p-2.5 flex flex-col gap-1.5 overflow-hidden">
                        <div className="w-full h-9 bg-sage/35 rounded-md" />
                        <div className="flex gap-1.5 h-6">
                          <div className="w-1/2 h-full bg-sage/45 rounded-md" />
                          <div className="w-1/2 h-full bg-sage/45 rounded-md" />
                        </div>
                        <div className="w-full h-5 bg-sage/25 rounded-md" />
                      </div>
                    ),
                  },
                  {
                    id: 'masonry' as const,
                    title: 'Modern Masonry',
                    subtitle: 'Pinterest Staggered Grid',
                    badge: 'Rekomendasi',
                    description: '2 kolom bertingkat natural yang mempertahankan aspek rasio foto asli tanpa pemotongan.',
                    renderWireframe: () => (
                      <div className="w-full h-24 bg-gray-100/80 rounded-xl p-2.5 flex gap-1.5 overflow-hidden">
                        <div className="w-1/2 flex flex-col gap-1.5">
                          <div className="w-full h-11 bg-sage/45 rounded-md" />
                          <div className="w-full h-7 bg-sage/25 rounded-md" />
                        </div>
                        <div className="w-1/2 flex flex-col gap-1.5">
                          <div className="w-full h-7 bg-sage/25 rounded-md" />
                          <div className="w-full h-11 bg-sage/45 rounded-md" />
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'carousel' as const,
                    title: 'Interactive Carousel',
                    subtitle: 'Slider Geser Hemat Ruang',
                    badge: 'Interaktif',
                    description: 'Slider horizontal swipeable dengan kartu aktif membesar, navigasi panah, dots, dan thumbnail strip.',
                    renderWireframe: () => (
                      <div className="w-full h-24 bg-gray-100/80 rounded-xl p-2 flex flex-col items-center justify-between overflow-hidden">
                        <div className="flex items-center gap-1.5 w-full justify-center pt-1.5">
                          <div className="w-3.5 h-11 bg-gray-300/60 rounded-sm opacity-40 scale-85" />
                          <div className="w-20 h-14 bg-sage/55 rounded-md shadow-xs flex items-center justify-center text-white text-[9px] font-bold tracking-wider">
                            SWIPE
                          </div>
                          <div className="w-3.5 h-11 bg-gray-300/60 rounded-sm opacity-40 scale-85" />
                        </div>
                        <div className="flex gap-1 pb-1">
                          <div className="w-4 h-1 bg-sage rounded-full" />
                          <div className="w-1.5 h-1 bg-gray-300 rounded-full" />
                          <div className="w-1.5 h-1 bg-gray-300 rounded-full" />
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: 'polaroid' as const,
                    title: 'Polaroid Stack',
                    subtitle: 'Nostalgic Scrapbook',
                    badge: 'Artistik',
                    description: 'Bingkai kartu foto polaroid putih dengan bayangan realistis, kemiringan acak manis, dan aksen pita.',
                    renderWireframe: () => (
                      <div className="w-full h-24 bg-gray-100/80 rounded-xl p-2 flex items-center justify-center gap-2.5 overflow-hidden">
                        <div className="w-11 h-16 bg-white p-1 pb-2 shadow-sm rounded-xs -rotate-6 border border-gray-200/80 flex flex-col">
                          <div className="w-full h-9 bg-sage/40 rounded-2xs" />
                          <div className="w-6 h-1 bg-gray-300 rounded-full mt-auto mx-auto" />
                        </div>
                        <div className="w-11 h-16 bg-white p-1 pb-2 shadow-sm rounded-xs rotate-6 border border-gray-200/80 flex flex-col">
                          <div className="w-full h-9 bg-sage/50 rounded-2xs" />
                          <div className="w-6 h-1 bg-gray-300 rounded-full mt-auto mx-auto" />
                        </div>
                      </div>
                    ),
                  },
                ].map((layout) => {
                  const isSelected = (formData.galleryLayout || 'editorial') === layout.id;
                  return (
                    <div
                      key={layout.id}
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          galleryLayout: layout.id,
                        }));
                      }}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col gap-3 relative text-left ${
                        isSelected
                          ? 'border-2 border-sage-dark bg-sage/5 shadow-sm ring-2 ring-sage/15'
                          : 'border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70 hover:shadow-2xs'
                      }`}
                    >
                      {/* Header Badges & Indicator */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isSelected 
                            ? 'bg-sage text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {layout.badge}
                        </span>
                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckCircle2 size={18} className="text-sage-dark" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                          )}
                        </div>
                      </div>

                      {/* Wireframe Mini-Preview */}
                      {layout.renderWireframe()}

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-bold text-xs text-text-dark flex items-center justify-between">
                          <span>{layout.title}</span>
                        </h4>
                        <p className="text-[11px] font-medium text-sage-dark mt-0.5">
                          {layout.subtitle}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-3">
                          {layout.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DragDropUpload Galeri Foto */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-4">
              <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                <ImageIcon size={16} className="text-sage-dark" />
                <span>Unggah Foto Galeri Bahagia</span>
              </h3>
              <DragDropUpload
                id="gallery-multiple-upload"
                label="Tarik & lepas banyak foto sekaligus ke sini, atau klik untuk memilih file"
                multiple
                isUploading={isUploadingGallery}
                onFileSelect={handleUploadGallery}
              />

              {/* Gallery Grid List with Remove & Reorder */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-700">Foto Terpasang ({formData.gallery.length})</span>
                  <span className="text-[11px] text-gray-400">Gunakan tombol panah untuk mengatur urutan</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formData.gallery.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200 bg-gray-100">
                      <img src={imgUrl} alt={`Galeri ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            if (idx === 0) return;
                            const newGal = [...formData.gallery];
                            const temp = newGal[idx];
                            newGal[idx] = newGal[idx - 1];
                            newGal[idx - 1] = temp;
                            setFormData({ ...formData, gallery: newGal });
                          }}
                          className="p-1 rounded bg-white/80 hover:bg-white text-gray-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Geser ke kiri"
                          aria-label={`Geser foto ${idx + 1} ke kiri`}
                        >
                          <ArrowUp size={12} className="-rotate-90" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === formData.gallery.length - 1}
                          onClick={() => {
                            if (idx === formData.gallery.length - 1) return;
                            const newGal = [...formData.gallery];
                            const temp = newGal[idx];
                            newGal[idx] = newGal[idx + 1];
                            newGal[idx + 1] = temp;
                            setFormData({ ...formData, gallery: newGal });
                          }}
                          className="p-1 rounded bg-white/80 hover:bg-white text-gray-700 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                          title="Geser ke kanan"
                          aria-label={`Geser foto ${idx + 1} ke kanan`}
                        >
                          <ArrowDown size={12} className="-rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newGal = formData.gallery.filter((_, i) => i !== idx);
                            setFormData({ ...formData, gallery: newGal });
                            showToast('success', 'Foto berhasil dihapus dari galeri');
                          }}
                          className="p-1 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          title="Hapus foto"
                          aria-label={`Hapus foto ${idx + 1}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-PILL 4: KISAH KAMI */}
        {configSubTab === 'story' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2">
                  <BookOpen size={16} className="text-sage-dark" />
                  <span>Kisah Cinta (Love Story Timeline)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Atur momen perjalanan cinta Anda. Gunakan tombol panah untuk memindahkan urutan cerita.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newArr = [...(formData.loveStory || []), { year: '', title: '', description: '' }];
                  setFormData({ ...formData, loveStory: newArr });
                }}
                className="px-3 py-1.5 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} /> Tambah Momen
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {(formData.loveStory || []).map((story, idx) => {
                const totalStories = (formData.loveStory || []).length;
                return (
                  <div key={idx} className="p-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl flex flex-col gap-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sage-dark flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-sage/20 text-sage-dark flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        Momen #{idx + 1}
                      </span>
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

              {/* Audio Playback Mode */}
              <div className="flex flex-col gap-2">
                <label className="block text-gray-600 font-medium">Mode Pemutaran Audio</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-sage-dark pointer-events-none flex items-center">
                    {(formData.music?.mode || 'repeat-all') === 'repeat-all' && <Repeat size={15} />}
                    {(formData.music?.mode || 'repeat-all') === 'repeat-one' && <Repeat1 size={15} />}
                    {(formData.music?.mode || 'repeat-all') === 'shuffle' && <Shuffle size={15} />}
                    {(formData.music?.mode || 'repeat-all') === 'linear' && <ListMusic size={15} />}
                  </div>
                  <select
                    value={formData.music?.mode || 'repeat-all'}
                    onChange={(e) => {
                      const newMode = e.target.value as 'repeat-all' | 'repeat-one' | 'shuffle' | 'linear';
                      const currentList = formData.music?.playlist?.length 
                        ? formData.music.playlist 
                        : (formData.musicUrl ? [{ url: formData.musicUrl }] : (weddingConfig.music?.playlist || []));
                      setFormData({ 
                        ...formData, 
                        music: { 
                          mode: newMode,
                          playlist: currentList,
                        },
                        musicUrl: currentList[0]?.url || formData.musicUrl || '',
                      });
                    }}
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:ring-2 focus:ring-sage cursor-pointer text-xs font-medium"
                  >
                    <option value="repeat-all">Ulangi Semua (Repeat All)</option>
                    <option value="repeat-one">Ulangi Satu Lagu (Repeat One)</option>
                    <option value="shuffle">Acak (Shuffle)</option>
                    <option value="linear">Sekali Jalan (Linear)</option>
                  </select>
                </div>

                {/* Interactive Mode Explanation Card */}
                <div className="rounded-xl border border-sage/30 bg-sage/5 p-3 text-[11px] text-gray-600 flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-sage/20 text-sage-dark shrink-0 mt-0.5">
                    {(formData.music?.mode || 'repeat-all') === 'repeat-all' && <Repeat size={14} />}
                    {(formData.music?.mode || 'repeat-all') === 'repeat-one' && <Repeat1 size={14} />}
                    {(formData.music?.mode || 'repeat-all') === 'shuffle' && <Shuffle size={14} />}
                    {(formData.music?.mode || 'repeat-all') === 'linear' && <ListMusic size={14} />}
                  </div>
                  <div className="flex-1 leading-relaxed">
                    <div className="font-semibold text-text-dark flex items-center gap-1.5">
                      <span>
                        {(formData.music?.mode || 'repeat-all') === 'repeat-all' && 'Ulangi Semua (Repeat All)'}
                        {(formData.music?.mode || 'repeat-all') === 'repeat-one' && 'Ulangi Satu Lagu (Repeat One)'}
                        {(formData.music?.mode || 'repeat-all') === 'shuffle' && 'Acak (Shuffle)'}
                        {(formData.music?.mode || 'repeat-all') === 'linear' && 'Sekali Jalan (Linear)'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-sage/20 text-sage-dark font-mono">Aktif</span>
                    </div>
                    <p className="mt-0.5 text-gray-500">
                      {(formData.music?.mode || 'repeat-all') === 'repeat-all' && 'Memutar seluruh daftar lagu secara berurutan, lalu otomatis berulang kembali ke lagu pertama tanpa henti.'}
                      {(formData.music?.mode || 'repeat-all') === 'repeat-one' && 'Memutar dan mengulang satu lagu yang sedang aktif terus menerus tanpa berganti ke lagu lain.'}
                      {(formData.music?.mode || 'repeat-all') === 'shuffle' && 'Memutar lagu-lagu dalam playlist secara acak terus menerus untuk pengalaman audio yang bervariasi.'}
                      {(formData.music?.mode || 'repeat-all') === 'linear' && 'Memutar daftar lagu berurutan satu kali dari awal hingga akhir, kemudian berhenti otomatis setelah lagu terakhir selesai.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Default Music Volume Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-gray-600 font-medium flex items-center gap-1.5">
                    <Volume2 size={15} className="text-sage-dark" />
                    <span>Volume Bawaan Undangan</span>
                  </label>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-sage/10 text-sage-dark">
                    {formData.music?.defaultVolume ?? 75}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={formData.music?.defaultVolume ?? 75}
                  onChange={(e) => {
                    const newVol = Number(e.target.value);
                    setFormData({
                      ...formData,
                      music: {
                        mode: formData.music?.mode || 'repeat-all',
                        playlist: formData.music?.playlist || (formData.musicUrl ? [{ url: formData.musicUrl }] : []),
                        defaultVolume: newVol,
                      },
                    });
                  }}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-sage-dark"
                />
                <p className="text-[11px] text-gray-500">
                  Tingkat volume awal saat tamu pertama kali membuka sampul undangan (0% = hening, 100% = maksimal).
                </p>
              </div>

              {/* Playlist Tracks */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="block text-gray-600 font-medium">Daftar Link Lagu YouTube & Audio</label>
                  <button
                    type="button"
                    onClick={() => {
                      const currentList = formData.music?.playlist?.length 
                        ? formData.music.playlist 
                        : (formData.musicUrl ? [{ url: formData.musicUrl }] : []);
                      const newPlaylist = [...currentList, { url: '', title: '' }];
                      setFormData({ 
                        ...formData, 
                        music: { 
                          mode: formData.music?.mode || 'repeat-all', 
                          playlist: newPlaylist,
                          defaultVolume: formData.music?.defaultVolume ?? 75,
                        },
                        musicUrl: newPlaylist[0]?.url || formData.musicUrl || '',
                      });
                    }}
                    className="text-sage-dark hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Plus size={13} /> Tambah Lagu
                  </button>
                </div>

                {(formData.music?.playlist || (formData.musicUrl ? [{ url: formData.musicUrl }] : [])).map((track, idx) => {
                  const currentPlaylist = (formData.music?.playlist || (formData.musicUrl ? [{ url: formData.musicUrl }] : []));
                  return (
                    <div key={idx} className="p-3 bg-gray-50/80 border border-gray-200/80 rounded-xl flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-sage-dark uppercase tracking-wider">
                          #{idx + 1} Lagu {idx === 0 ? '(Utama)' : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          {/* Tombol Geser Naik */}
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              if (idx === 0) return;
                              const updated = [...currentPlaylist];
                              const [moved] = updated.splice(idx, 1);
                              updated.splice(idx - 1, 0, moved);
                              setFormData({
                                ...formData,
                                music: {
                                  mode: formData.music?.mode || 'repeat-all',
                                  playlist: updated,
                                  defaultVolume: formData.music?.defaultVolume ?? 75,
                                },
                                musicUrl: updated[0]?.url || '',
                              });
                            }}
                            className="p-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Pindahkan ke atas"
                            aria-label="Pindahkan ke atas"
                          >
                            <ArrowUp size={13} />
                          </button>

                          {/* Tombol Geser Turun */}
                          <button
                            type="button"
                            disabled={idx === currentPlaylist.length - 1}
                            onClick={() => {
                              if (idx === currentPlaylist.length - 1) return;
                              const updated = [...currentPlaylist];
                              const [moved] = updated.splice(idx, 1);
                              updated.splice(idx + 1, 0, moved);
                              setFormData({
                                ...formData,
                                music: {
                                  mode: formData.music?.mode || 'repeat-all',
                                  playlist: updated,
                                  defaultVolume: formData.music?.defaultVolume ?? 75,
                                },
                                musicUrl: updated[0]?.url || '',
                              });
                            }}
                            className="p-1 rounded bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                            title="Pindahkan ke bawah"
                            aria-label="Pindahkan ke bawah"
                          >
                            <ArrowDown size={13} />
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = currentPlaylist.filter((_, i) => i !== idx);
                              setFormData({ 
                                ...formData, 
                                music: { 
                                  mode: formData.music?.mode || 'repeat-all', 
                                  playlist: updated,
                                  defaultVolume: formData.music?.defaultVolume ?? 75,
                                },
                                musicUrl: updated[0]?.url || '',
                              });
                            }}
                            className="p-1 rounded bg-white hover:bg-red-50 border border-gray-200 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Hapus lagu ini"
                            aria-label="Hapus lagu ini"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Input Judul Lagu */}
                        <div className="relative flex items-center">
                          <FileText className="absolute left-2.5 text-gray-400 pointer-events-none" size={13} />
                          <input
                            type="text"
                            value={track.title || ''}
                            onChange={(e) => {
                              const updated = [...currentPlaylist];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({ 
                                ...formData, 
                                music: { 
                                  mode: formData.music?.mode || 'repeat-all',
                                  playlist: updated,
                                  defaultVolume: formData.music?.defaultVolume ?? 75,
                                },
                              });
                            }}
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white font-medium text-[11px] focus:ring-1 focus:ring-sage"
                            placeholder="Judul Lagu (misal: Kidung Asmaradana)"
                          />
                        </div>

                        {/* Input URL Lagu */}
                        <div className="relative flex items-center">
                          <Music className="absolute left-2.5 text-gray-400 pointer-events-none" size={13} />
                          <input
                            type="text"
                            value={track.url}
                            onChange={(e) => {
                              const updated = [...currentPlaylist];
                              updated[idx] = { ...updated[idx], url: e.target.value };
                              setFormData({ 
                                ...formData, 
                                music: { 
                                  mode: formData.music?.mode || 'repeat-all',
                                  playlist: updated,
                                  defaultVolume: formData.music?.defaultVolume ?? 75,
                                },
                                musicUrl: updated[0]?.url || '',
                              });
                            }}
                            className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 bg-white font-mono text-[11px] focus:ring-1 focus:ring-sage"
                            placeholder="https://www.youtube.com/watch?v=..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
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

              {/* Alamat Pengiriman Kado Fisik Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4 text-xs mt-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2">
                    <Gift size={16} className="text-sage-dark" />
                    <span>Alamat Pengiriman Kado Fisik</span>
                    {formData.physicalGift?.enabled && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        Aktif
                      </span>
                    )}
                  </h3>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.physicalGift?.enabled || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        physicalGift: {
                          ...(formData.physicalGift || { recipientName: '', phone: '', address: '', notes: '' }),
                          enabled: e.target.checked
                        }
                      })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span className="text-[11px] font-semibold text-gray-700">Aktifkan Kado Fisik</span>
                  </label>
                </div>

                {formData.physicalGift?.enabled && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Nama Penerima Paket</label>
                      <div className="relative flex items-center">
                        <User className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <input
                          type="text"
                          placeholder="Contoh: Cecep Pratama & Ipeh Putri"
                          value={formData.physicalGift?.recipientName || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            physicalGift: {
                              ...(formData.physicalGift || { enabled: true, phone: '', address: '' }),
                              recipientName: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Nomor Telepon / WhatsApp Penerima</label>
                      <div className="relative flex items-center">
                        <Phone className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                        <input
                          type="text"
                          placeholder="Contoh: +6281234567890"
                          value={formData.physicalGift?.phone || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            physicalGift: {
                              ...(formData.physicalGift || { enabled: true, recipientName: '', address: '' }),
                              phone: e.target.value
                            }
                          })}
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Alamat Pengiriman Lengkap</label>
                      <div className="relative flex">
                        <MapPin className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={15} />
                        <textarea
                          placeholder="Tuliskan nama jalan, RT/RW, kelurahan, kecamatan, kota, provinsi, dan kode pos lengkap..."
                          value={formData.physicalGift?.address || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            physicalGift: {
                              ...(formData.physicalGift || { enabled: true, recipientName: '', phone: '' }),
                              address: e.target.value
                            }
                          })}
                          rows={3}
                          className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-sage"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Catatan Tambahan untuk Kurir (Opsional)</label>
                      <input
                        type="text"
                        placeholder="Contoh: Titipkan ke pos sekuriti atau hubungi WA sebelum antar"
                        value={formData.physicalGift?.notes || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          physicalGift: {
                            ...(formData.physicalGift || { enabled: true, recipientName: '', phone: '', address: '' }),
                            notes: e.target.value
                          }
                        })}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUB-PILL: TEKS, SALAM & QUOTES */}
        {configSubTab === 'texts' && (
          <div className="flex flex-col gap-6">
            {/* Quick Religion & Culture Presets */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  <h3 className="font-heading text-sm font-bold text-text-dark">
                    Pilihan Cepat Template Salam & Doa (Quick Presets)
                  </h3>
                </div>
                <span className="text-[11px] text-gray-500">
                  Klik tombol untuk mengisi otomatis teks salam, doa, dan penutup sesuai tradisi/agama.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                {[
                  {
                    name: 'Muslim / Islam',
                    preset: {
                      greeting: {
                        salutation: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
                        introText: "Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i pada acara resepsi pernikahan kami.",
                      },
                      quote: {
                        enabled: true,
                        source: "QS. Ar-Rum: 21",
                        text: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
                        arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً",
                      },
                      closing: {
                        thankText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.",
                        salutation: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
                      }
                    }
                  },
                  {
                    name: 'Kristen Protestan',
                    preset: {
                      greeting: {
                        salutation: "Salam Sejahtera dalam Kasih Tuhan Yesus Kristus",
                        introText: "Dengan mengucap syukur atas kasih dan anugerah Tuhan Yang Maha Esa, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri pemberkatan dan resepsi pernikahan kami:",
                      },
                      quote: {
                        enabled: true,
                        source: "1 Korintus 13:4-7",
                        text: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Kasih menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu.",
                        arabic: "",
                      },
                      closing: {
                        thankText: "Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i sekalian, kami sekeluarga mengucapkan terima kasih yang sebesar-besarnya. Kiranya berkat dan damai sejahtera Tuhan senantiasa menyertai kita.",
                        salutation: "Tuhan Memberkati Kita Semua",
                      }
                    }
                  },
                  {
                    name: 'Katolik',
                    preset: {
                      greeting: {
                        salutation: "Salam Damai Sejahtera Kristus",
                        introText: "Atas berkat dan kemurahan Allah Bapa, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan merayakan Sakramen Pernikahan putra-putri kami:",
                      },
                      quote: {
                        enabled: true,
                        source: "Kolose 3:14",
                        text: "Dan di atas semuanya itu: kenakanlah kasih, sebagai pengikat yang mempersatukan dan menyempurnakan.",
                        arabic: "",
                      },
                      closing: {
                        thankText: "Merupakan suatu sukacita besar bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi keluarga baru kami.",
                        salutation: "Salam Hangat dan Berkat Melimpah",
                      }
                    }
                  },
                  {
                    name: 'Hindu / Bali',
                    preset: {
                      greeting: {
                        salutation: "Om Swastiastu",
                        introText: "Atas asung kerta wara nugraha Ida Sang Hyang Widhi Wasa, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri Upacara Pawiwahan (Pernikahan) putra-putri kami:",
                      },
                      quote: {
                        enabled: true,
                        source: "Rg Veda X.85.42",
                        text: "Tinggallah di sini bersama, jangan pernah terpisahkan, capailah usia penuh, bergembira bersama anak dan cucumu, bersukacitalah di rumahmu yang tenteram dan penuh bahagia.",
                        arabic: "",
                      },
                      closing: {
                        thankText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.",
                        salutation: "Om Shanti Shanti Shanti Om",
                      }
                    }
                  },
                  {
                    name: 'Modern / Netral',
                    preset: {
                      greeting: {
                        salutation: "Salam Hangat & Penuh Sukacita",
                        introText: "Tanpa mengurangi rasa hormat, dengan penuh kebahagiaan kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk merayakan hari istimewa pernikahan kami:",
                      },
                      quote: {
                        enabled: true,
                        source: "Kahlil Gibran",
                        text: "Cinta tidak saling memiliki dan tidak pula dimiliki, sebab cinta telah cukup bagi cinta itu sendiri.",
                        arabic: "",
                      },
                      closing: {
                        thankText: "Kehadiran dan doa restu Anda merupakan karunia yang sangat berarti bagi kami dalam mengawali langkah baru kehidupan bersama.",
                        salutation: "Dengan Penuh Rasa Syukur & Hormat Kami",
                      }
                    }
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        greeting: { ...prev.greeting, ...item.preset.greeting },
                        quote: { ...prev.quote, ...item.preset.quote },
                        closing: { ...prev.closing, ...item.preset.closing },
                      }));
                      showToast('success', `Template ${item.name} berhasil dimuat!`);
                    }}
                    className="p-2.5 rounded-xl border border-gray-200 hover:border-sage bg-gray-50/70 hover:bg-sage/10 text-gray-700 font-semibold text-xs text-center transition-all cursor-pointer active:scale-98 shadow-2xs"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 2 Kolom: Kiri = Cover & Salam, Kanan = Quote & Penutup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* Kolom Kiri 1: Cover Depan Undangan */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                  <FileText size={16} className="text-sage-dark" />
                  <span>Teks Halaman Cover Depan (Opening Cover)</span>
                </h3>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Judul Cover Depan</label>
                    <input
                      type="text"
                      placeholder="Contoh: The Wedding Of / Walimatul Ursy / Pawiwahan"
                      value={formData.cover?.title || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        cover: { ...(formData.cover || { salutation: 'Kepada Yth. Bapak/Ibu/Saudara/i', buttonText: 'Buka Undangan' }), title: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                    <p className="text-[10.5px] text-gray-400 mt-1">Teks di atas nama kedua mempelai pada layar sampul amplop digital.</p>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Sapaan Hormat Tamu (Salutation)</label>
                    <input
                      type="text"
                      placeholder="Contoh: Kepada Yth. Bapak/Ibu/Saudara/i"
                      value={formData.cover?.salutation || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        cover: { ...(formData.cover || { title: 'The Wedding Of', buttonText: 'Buka Undangan' }), salutation: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                    <p className="text-[10.5px] text-gray-400 mt-1">Muncul tepat di atas nama tamu undangan.</p>
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Teks Tombol Buka Undangan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Buka Undangan / Open Invitation / Buka Serat Ulem"
                      value={formData.cover?.buttonText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        cover: { ...(formData.cover || { title: 'The Wedding Of', salutation: 'Kepada Yth. Bapak/Ibu/Saudara/i' }), buttonText: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Kiri 2: Salam Pembuka & Pengantar */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                  <MessageSquare size={16} className="text-sage-dark" />
                  <span>Salam Pembuka & Teks Pengantar</span>
                </h3>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Salam Pembuka</label>
                    <input
                      type="text"
                      placeholder="Contoh: Assalamu'alaikum Warahmatullahi Wabarakatuh"
                      value={formData.greeting?.salutation || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        greeting: { ...(formData.greeting || {}), salutation: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Teks Kalimat Pengantar Undangan</label>
                    <textarea
                      placeholder="Tuliskan kalimat hormat mengundang tamu..."
                      value={formData.greeting?.introText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        greeting: { ...(formData.greeting || {}), introText: e.target.value }
                      })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-sage leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Kanan 1: Ayat Suci / Kutipan Doa & Mutiara Cinta */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2">
                    <Quote size={16} className="text-sage-dark" />
                    <span>Ayat Suci / Kutipan Cinta (Quote)</span>
                  </h3>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.quote?.enabled !== false}
                      onChange={(e) => setFormData({
                        ...formData,
                        quote: { ...(formData.quote || {}), enabled: e.target.checked }
                      })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span className="text-[11px] font-semibold text-gray-700">Tampilkan Kutipan</span>
                  </label>
                </div>

                {formData.quote?.enabled !== false && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Sumber Kutipan / Surah / Tokoh</label>
                      <input
                        type="text"
                        placeholder="Contoh: QS. Ar-Rum: 21 / 1 Korintus 13:4-7 / Kahlil Gibran"
                        value={formData.quote?.source || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          quote: { ...(formData.quote || {}), source: e.target.value }
                        })}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Isi Teks Terjemahan / Kutipan Mutiara</label>
                      <textarea
                        placeholder="Tuliskan isi ayat, doa, atau kata mutiara cinta..."
                        value={formData.quote?.text || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          quote: { ...(formData.quote || {}), text: e.target.value }
                        })}
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-sage leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 mb-1 font-medium">Teks Tulisan Arab / Kitab Suci Asli (Opsional)</label>
                      <textarea
                        placeholder="Tempelkan tulisan kaligrafi teks arab (opsional)..."
                        dir="rtl"
                        value={formData.quote?.arabic || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          quote: { ...(formData.quote || {}), arabic: e.target.value }
                        })}
                        rows={2}
                        className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-sage font-serif leading-loose"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Kolom Kanan 2: Teks Penutup & Ucapan Terima Kasih */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
                <h3 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                  <CheckCircle2 size={16} className="text-sage-dark" />
                  <span>Teks Penutup & Ucapan Terima Kasih</span>
                </h3>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Ucapan Terima Kasih & Doa Restu</label>
                    <textarea
                      placeholder="Tuliskan ucapan rasa syukur atas doa restu tamu..."
                      value={formData.closing?.thankText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        closing: { ...(formData.closing || {}), thankText: e.target.value }
                      })}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-sage leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-600 mb-1 font-medium">Salam Penutup</label>
                    <input
                      type="text"
                      placeholder="Contoh: Wassalamu'alaikum Warahmatullahi Wabarakatuh"
                      value={formData.closing?.salutation || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        closing: { ...(formData.closing || {}), salutation: e.target.value }
                      })}
                      className="w-full border border-gray-300 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage font-medium"
                    />
                  </div>
                </div>
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

        {/* SUB-PILL 7: AGENSI & WHITE-LABEL (WO LUXURY SUITE) */}
        {configSubTab === 'agency' && (
          <div className="flex flex-col gap-6">
            {/* Header Card */}
            <div className="bg-linear-to-r from-amber-500/15 via-white to-amber-500/5 rounded-3xl p-6 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                  <Crown size={13} className="text-amber-600" />
                  <span>White-Label Agency Suite</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-text-dark">
                  Pengaturan Agensi & Mode White-Label
                </h3>
                <p className="text-xs text-text-dark/60 mt-1 max-w-xl leading-relaxed">
                  Ubah branding undangan menjadi milik Wedding Organizer / Agensi Anda seutuhnya. Pasang logo WO, tagline kemewahan, media sosial, dan nomor kontak resmi Anda.
                </p>
              </div>
            </div>

            {/* Mode Selector Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-4">
              <h4 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                <Briefcase size={16} className="text-amber-600" />
                <span>Mode Lisensi & Visibilitas Brand</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Option 1: Disabled */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      agencyBranding: {
                        ...(formData.agencyBranding || { mode: 'disabled' }),
                        mode: 'disabled',
                        hideMariPartnerBranding: false,
                      },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    (formData.agencyBranding?.mode || 'disabled') === 'disabled'
                      ? 'bg-sage/10 border-sage-dark ring-2 ring-sage/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-dark">Standard Default</span>
                    {(formData.agencyBranding?.mode || 'disabled') === 'disabled' && (
                      <CheckCircle2 size={16} className="text-sage-dark" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Menggunakan identitas resmi Mari Partner Digital Invitation pada footer dan dokumen ekspor.
                  </p>
                </button>

                {/* Option 2: Co-Branded */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      agencyBranding: {
                        ...(formData.agencyBranding || { mode: 'co_branded' }),
                        mode: 'co_branded',
                        hideMariPartnerBranding: false,
                      },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    formData.agencyBranding?.mode === 'co_branded'
                      ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-dark">Co-Branded Mode</span>
                    {formData.agencyBranding?.mode === 'co_branded' && (
                      <CheckCircle2 size={16} className="text-blue-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    "Dipersembahkan oleh [Nama WO] & Mari Partner". Menampilkan logo dan link agensi bersama partner teknologi.
                  </p>
                </button>

                {/* Option 3: 100% Pure White Label */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      agencyBranding: {
                        ...(formData.agencyBranding || { mode: 'white_label' }),
                        mode: 'white_label',
                        hideMariPartnerBranding: true,
                      },
                    })
                  }
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                    formData.agencyBranding?.mode === 'white_label'
                      ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Crown size={14} className="text-amber-600" /> 100% Pure White-Label
                    </span>
                    {formData.agencyBranding?.mode === 'white_label' && (
                      <CheckCircle2 size={16} className="text-amber-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Seluruh jejak pengembang dihilangkan 100%. WO terlihat memiliki platform teknologi dan divisi IT eksklusif sendiri.
                  </p>
                </button>
              </div>
            </div>

            {/* Agency Profile Details Form */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-5">
              <h4 className="font-heading text-sm font-bold text-text-dark flex items-center gap-2 border-b border-gray-100 pb-3">
                <Building size={16} className="text-sage" />
                <span>Profil & Informasi Wedding Organizer</span>
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nama Agensi / Wedding Organizer
                  </label>
                  <div className="relative flex items-center">
                    <Building className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                    <input
                      type="text"
                      value={formData.agencyBranding?.agencyName || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agencyBranding: {
                            ...(formData.agencyBranding || { mode: 'disabled' }),
                            agencyName: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: Royal Heritage Wedding Planner"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Tagline Kemewahan WO
                  </label>
                  <div className="relative flex items-center">
                    <Sparkles className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                    <input
                      type="text"
                      value={formData.agencyBranding?.agencyTagline || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agencyBranding: {
                            ...(formData.agencyBranding || { mode: 'disabled' }),
                            agencyTagline: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: Exquisite Traditional & Luxury Wedding Specialist"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Website Resmi Agensi
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                    <input
                      type="url"
                      value={formData.agencyBranding?.agencyWebsite || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agencyBranding: {
                            ...(formData.agencyBranding || { mode: 'disabled' }),
                            agencyWebsite: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: https://royalheritage.id"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Akun Instagram Resmi
                  </label>
                  <div className="relative flex items-center">
                    <Share2 className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                    <input
                      type="text"
                      value={formData.agencyBranding?.agencyInstagram || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agencyBranding: {
                            ...(formData.agencyBranding || { mode: 'disabled' }),
                            agencyInstagram: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: @royalheritage.wo"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Nomor WhatsApp Konsultasi / CS
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                    <input
                      type="text"
                      value={formData.agencyBranding?.agencyWhatsapp || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          agencyBranding: {
                            ...(formData.agencyBranding || { mode: 'disabled' }),
                            agencyWhatsapp: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: 081234567890"
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Logo Resmi Wedding Organizer
                  </label>
                  <DragDropUpload
                    id="agency-logo-upload"
                    label="Tarik & lepas logo WO (format PNG transparan dianjurkan)"
                    value={formData.agencyBranding?.agencyLogoUrl || ''}
                    isUploading={uploadingAvatar === 'agency'}
                    onFileSelect={handleUploadAgencyLogo}
                    onRemove={() =>
                      setFormData({
                        ...formData,
                        agencyBranding: {
                          ...(formData.agencyBranding || { mode: 'disabled' }),
                          agencyLogoUrl: '',
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Save Action Bar */}
        <div className="sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200/90 shadow-lg flex items-center justify-between gap-4">
          <div>
            {saveSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Perubahan berhasil disimpan!
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
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
