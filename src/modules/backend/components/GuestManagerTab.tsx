import React, { useState, useMemo } from 'react';
import { 
  Users, Search, RotateCcw, X, Plus, Upload, UserPlus, 
  FileSpreadsheet, Phone, Send, Clock4, Filter, CheckCheck, 
  Copy, Check, Share2, Download, FileText, CheckCircle2, 
  Crown, Armchair, User, Trash2, Link as LinkIcon, Radio, Save
} from 'lucide-react';
import { GuestInvitation, GuestTier, WeddingConfig, RSVPResponse } from '../../../types';
import { api } from '../../../services/api';
import { VipAccessBadge } from '../../frontend/shared/components/VipAccessBadge';
import { WhatsAppBroadcastModal } from './WhatsAppBroadcastModal';
import { exportGuestsExcel, exportGuestsPDF } from '../../../utils/reportExporter';
import { renderGuestPassCanvas, downloadPassImage, downloadPassPDF } from '../../../utils/digitalPassGenerator';

export interface GuestManagerTabProps {
  guests: GuestInvitation[];
  setGuests: React.Dispatch<React.SetStateAction<GuestInvitation[]>>;
  weddingConfig: WeddingConfig;
  showToast: (type: 'success' | 'error', message: string) => void;
  onRequestDeleteGuest: (guest: GuestInvitation) => void;
  onRequestResetAllGuests?: () => void;
  rsvps?: RSVPResponse[];
}

export function GuestManagerTab({
  guests,
  setGuests,
  weddingConfig,
  showToast,
  onRequestDeleteGuest,
  onRequestResetAllGuests,
  rsvps = [],
}: GuestManagerTabProps) {
  // Navigation & View Mode
  const [guestViewMode, setGuestViewMode] = useState<'list' | 'single'>('list');
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [guestStatusFilter, setGuestStatusFilter] = useState<'all' | 'pending' | 'sent'>('all');
  const [guestTierFilter, setGuestTierFilter] = useState<'all' | GuestTier>('all');

  // Quick single generator state
  const [singleGuestName, setSingleGuestName] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWaText, setCopiedWaText] = useState(false);

  // Add guest modal state
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestTier, setNewGuestTier] = useState<GuestTier>('regular');
  const [newGuestTableNumber, setNewGuestTableNumber] = useState('');
  const [newGuestVipNotes, setNewGuestVipNotes] = useState('');
  const [isSubmittingGuest, setIsSubmittingGuest] = useState(false);

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importActiveTab, setImportActiveTab] = useState<'file' | 'text'>('file');
  const [importTextContent, setImportTextContent] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [isProcessingImport, setIsProcessingImport] = useState(false);
  const [parsedGuestsPreview, setParsedGuestsPreview] = useState<Array<{ name: string; phone?: string; isValid: boolean; errorReason?: string }>>([]);

  // WhatsApp broadcast modal state
  const [isWhatsAppBroadcastModalOpen, setIsWhatsAppBroadcastModalOpen] = useState(false);

  // Phone number sanitizer
  const sanitizePhoneNumber = (rawPhone: string): string => {
    const cleaned = rawPhone.replace(/[^\d+]/g, '');
    if (!cleaned) return '';
    if (cleaned.startsWith('+62')) return '62' + cleaned.slice(3);
    if (cleaned.startsWith('62')) return cleaned;
    if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
    if (cleaned.startsWith('8')) return '62' + cleaned;
    return cleaned;
  };

  const getGuestInvitationUrl = (name: string): string => {
    const base = window.location.origin;
    return name ? `${base}/?to=${encodeURIComponent(name)}` : `${base}/`;
  };

  const getGuestWaMessage = (name: string, link: string): string => {
    return `Assalamu'alaikum Wr. Wb.

Kepada Yth. Bapak/Ibu/Saudara/i ${name || 'Tamu Undangan'},

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}*

Berikut link undangan digital kami untuk informasi lebih lengkap:
${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Terima kasih,
Wassalamu'alaikum Wr. Wb.`;
  };

  // KPI Metrics
  const totalGuestsCount = guests.length;
  const sentGuestsCount = useMemo(() => guests.filter(g => g.status === 'sent').length, [guests]);
  const pendingGuestsCount = totalGuestsCount - sentGuestsCount;

  // Filtered Guests
  const filteredGuests = useMemo(() => {
    let result = guests;
    if (guestStatusFilter !== 'all') {
      result = result.filter(g => g.status === guestStatusFilter);
    }
    if (guestTierFilter !== 'all') {
      result = result.filter(g => (g.tier || 'regular') === guestTierFilter);
    }
    const q = guestSearchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) ||
        (g.phone && g.phone.includes(q)) ||
        (g.tableNumber && g.tableNumber.toLowerCase().includes(q)) ||
        (g.tier && g.tier.toLowerCase().includes(q)) ||
        (g.vipNotes && g.vipNotes.toLowerCase().includes(q))
      );
    }
    return result;
  }, [guests, guestStatusFilter, guestTierFilter, guestSearchQuery]);

  // Actions
  const handleSendGuestWhatsapp = async (guest: GuestInvitation) => {
    const link = getGuestInvitationUrl(guest.name);
    const msg = getGuestWaMessage(guest.name, link);
    const phone = guest.phone ? sanitizePhoneNumber(guest.phone) : '';

    if (guest.id && guest.status !== 'sent') {
      try {
        await api.updateGuest(guest.id, { status: 'sent' });
        setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, status: 'sent' } : g));
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
      await api.updateGuest(guest.id, { status: newStatus });
      setGuests(prev => prev.map(g => g.id === guest.id ? { ...g, status: newStatus } : g));
      showToast('success', `Status ${guest.name} diubah ke ${newStatus === 'sent' ? 'Sudah Terkirim' : 'Belum Terkirim'}`);
    } catch {
      showToast('error', 'Gagal memperbarui status pengiriman.');
    }
  };

  const handleToggleGuestSouvenir = async (guest: GuestInvitation) => {
    if (!guest.id) return;
    const newStatus = !guest.souvenirClaimed;
    setGuests(prev =>
      prev.map(g =>
        g.id === guest.id
          ? { ...g, souvenirClaimed: newStatus, souvenirClaimedAt: newStatus ? new Date().toISOString() : undefined }
          : g
      )
    );

    try {
      await api.claimGuestSouvenir(guest.id, newStatus);
      showToast(
        'success',
        `Status suvenir tamu "${guest.name}" ${newStatus ? 'berhasil diserahkan' : 'dibatalkan'}!`
      );
    } catch {
      setGuests(prev =>
        prev.map(g => (g.id === guest.id ? { ...g, souvenirClaimed: !newStatus } : g))
      );
      showToast('error', 'Gagal memperbarui status suvenir tamu.');
    }
  };

  const copyGuestLink = async (guest: GuestInvitation) => {
    const link = getGuestInvitationUrl(guest.name);
    await navigator.clipboard.writeText(link);
    showToast('success', `Link untuk "${guest.name}" berhasil disalin!`);
  };

  const handleDownloadGuestPass = async (guest: { name: string; actualPax?: number; id?: string; tableNumber?: string }, format: 'png' | 'pdf' = 'png') => {
    try {
      const canvas = await renderGuestPassCanvas({
        guestName: guest.name,
        guestPax: guest.actualPax || 1,
        guestId: guest.id,
        tableNumber: guest.tableNumber,
        weddingConfig,
      });

      const sanitizedFilename = `Pass-${guest.name.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (format === 'png') {
        downloadPassImage(canvas, sanitizedFilename, 'png');
      } else {
        await downloadPassPDF(canvas, sanitizedFilename, {
          guestName: guest.name,
          coupleText: `${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`,
        });
      }
      showToast('success', `Tiket Pass ${guest.name} (${format.toUpperCase()}) berhasil diunduh!`);
    } catch (err) {
      console.warn('Failed to download guest pass:', err);
      showToast('error', 'Gagal membuat kartu pass digital.');
    }
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
      const res = await api.createGuest({
        name: trimmedName,
        phone: cleanedPhone,
        tier: newGuestTier,
        tableNumber: newGuestTableNumber.trim() || undefined,
        vipNotes: newGuestVipNotes.trim() || undefined,
      });
      if (res.data) {
        setGuests(prev => [res.data, ...prev]);
      }
      showToast('success', `Tamu "${trimmedName}" (${newGuestTier.toUpperCase()}) berhasil ditambahkan!`);
      setNewGuestName('');
      setNewGuestPhone('');
      setNewGuestTier('regular');
      setNewGuestTableNumber('');
      setNewGuestVipNotes('');
      setIsAddGuestModalOpen(false);
    } catch {
      showToast('error', 'Gagal menambahkan tamu ke database.');
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
        const XLSX = await import('xlsx');
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
      const formatted = validGuests.map((item) => ({
        name: item.name.trim(),
        phone: item.phone ? sanitizePhoneNumber(item.phone) : '',
        status: 'pending' as const,
      }));

      await api.importGuests(formatted);
      const updated = await api.getGuests();
      setGuests(updated);

      showToast('success', `Berhasil mengimpor ${validGuests.length} tamu ke database!`);
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

  // Quick Single Link Generation
  const singleGeneratedLink = singleGuestName ? getGuestInvitationUrl(singleGuestName) : `${window.location.origin}/`;
  const singleWaMessage = getGuestWaMessage(singleGuestName, singleGeneratedLink);

  const copySingleLink = async () => {
    await navigator.clipboard.writeText(singleGeneratedLink);
    setCopiedLink(true);
    showToast('success', 'URL undangan berhasil disalin!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copySingleWaMessage = async () => {
    await navigator.clipboard.writeText(singleWaMessage);
    setCopiedWaText(true);
    showToast('success', 'Pesan template WhatsApp berhasil disalin!');
    setTimeout(() => setCopiedWaText(false), 2000);
  };

  const shareSingleToWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(singleWaMessage)}`;
    window.open(url, '_blank');
  };

  return (
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
                <CheckCheck size={20} />
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddGuestModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-98"
              >
                <UserPlus size={15} />
                <span>Tambah Tamu</span>
              </button>

              <button
                type="button"
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all cursor-pointer active:scale-98"
              >
                <Upload size={15} />
                <span>Impor Excel / CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWhatsAppBroadcastModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all cursor-pointer active:scale-98"
              >
                <Radio size={15} />
                <span>Asisten Broadcast WA</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  exportGuestsExcel(guests, rsvps, weddingConfig);
                  showToast('success', 'Daftar tamu Excel (.xlsx) berhasil diunduh!');
                }}
                disabled={guests.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <FileSpreadsheet size={14} />
                <span>Unduh Excel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exportGuestsPDF(guests, rsvps, weddingConfig);
                  showToast('success', 'Buku Tamu Registrasi PDF berhasil diunduh!');
                }}
                disabled={guests.length === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <FileText size={14} />
                <span>Cetak PDF WO</span>
              </button>

              {guests.length > 0 && onRequestResetAllGuests && (
                <button
                  type="button"
                  onClick={onRequestResetAllGuests}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 text-xs font-semibold transition-all cursor-pointer"
                  title="Kosongkan seluruh daftar tamu"
                >
                  <Trash2 size={14} />
                  <span>Reset Semua</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative flex items-center">
              <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={guestSearchQuery}
                onChange={(e) => setGuestSearchQuery(e.target.value)}
                placeholder="Cari nama tamu, nomor WA, tier, atau meja..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400 shadow-2xs"
              />
              {guestSearchQuery && (
                <button
                  type="button"
                  onClick={() => setGuestSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="sm:col-span-3 flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-2xs">
              <Filter size={14} className="text-gray-400 shrink-0" />
              <select
                value={guestStatusFilter}
                onChange={(e) => setGuestStatusFilter(e.target.value as 'all' | 'pending' | 'sent')}
                className="w-full text-xs bg-transparent border-none focus:outline-none text-gray-700 py-1.5"
              >
                <option value="all">Semua Status Pengiriman</option>
                <option value="pending">Belum Terkirim</option>
                <option value="sent">Sudah Terkirim</option>
              </select>
            </div>

            <div className="sm:col-span-3 flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1 shadow-2xs">
              <Crown size={14} className="text-amber-500 shrink-0" />
              <select
                value={guestTierFilter}
                onChange={(e) => setGuestTierFilter(e.target.value as 'all' | GuestTier)}
                className="w-full text-xs bg-transparent border-none focus:outline-none text-gray-700 py-1.5"
              >
                <option value="all">Semua Tier Tamu</option>
                <option value="vvip">👑 VVIP Kehormatan</option>
                <option value="vip">🌟 VIP Guest</option>
                <option value="family">🤝 Keluarga Besar</option>
                <option value="regular">Reguler</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {filteredGuests.length === 0 ? (
            <div className="text-center py-14 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-2 shadow-2xs">
              <Users size={36} className="text-gray-300" />
              <p className="text-xs text-gray-500 font-medium">
                {guestSearchQuery || guestStatusFilter !== 'all' || guestTierFilter !== 'all'
                  ? 'Tidak ada tamu yang cocok dengan filter yang dipilih.'
                  : 'Belum ada data tamu undangan.'}
              </p>
              {(guestSearchQuery || guestStatusFilter !== 'all' || guestTierFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setGuestSearchQuery('');
                    setGuestStatusFilter('all');
                    setGuestTierFilter('all');
                  }}
                  className="text-xs text-sage-dark hover:underline flex items-center gap-1 font-semibold mt-1 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3.5 text-center w-12">#</th>
                    <th className="py-3 px-4">Nama Tamu & Tier</th>
                    <th className="py-3 px-3 text-center">Nomor WA</th>
                    <th className="py-3 px-3 text-center">Meja</th>
                    <th className="py-3 px-3 text-center">Kehadiran Hari-H</th>
                    <th className="py-3 px-3 text-center">Suvenir</th>
                    <th className="py-3 px-3 text-center">Status Kirim</th>
                    <th className="py-3 px-3 text-center w-28">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredGuests.map((guest, idx) => (
                    <tr key={guest.id || idx} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-3.5 text-center text-gray-400 font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-text-dark whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-gray-900">{guest.name}</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <VipAccessBadge tier={guest.tier || 'regular'} size="sm" />
                            {guest.vipNotes && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 italic">
                                {guest.vipNotes}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center text-gray-600 whitespace-nowrap font-mono text-[11px]">
                        {guest.phone || '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap font-medium text-gray-700">
                        {guest.tableNumber ? (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
                            {guest.tableNumber}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {guest.checkedIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} />
                            <span>Check-in</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500">
                            Belum
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleGuestSouvenir(guest)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                            guest.souvenirClaimed
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={guest.souvenirClaimed ? 'Klik untuk membatalkan status klaim suvenir' : 'Klik untuk menandai suvenir telah diserahkan'}
                        >
                          {guest.souvenirClaimed ? '🎁 Diambil' : '⚪ Belum'}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleGuestStatus(guest)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                            guest.status === 'sent'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {guest.status === 'sent' ? 'Terkirim' : 'Belum'}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleSendGuestWhatsapp(guest)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Kirim Pesan WhatsApp"
                            aria-label="Kirim WhatsApp"
                          >
                            <Send size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadGuestPass(guest, 'png')}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Unduh E-Ticket Passcard"
                            aria-label="Unduh Pass"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => copyGuestLink(guest)}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Salin Link Undangan"
                            aria-label="Salin Link"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRequestDeleteGuest(guest)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Tamu"
                            aria-label="Hapus Tamu"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: QUICK GENERATOR */}
      {guestViewMode === 'single' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs flex flex-col gap-5 max-w-2xl mx-auto w-full">
          <div>
            <h4 className="font-heading text-base font-bold text-text-dark">Generator Tautan Cepat</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Ketik nama tamu di bawah untuk menghasilkan link dan pesan WhatsApp secara instan tanpa perlu menyimpan ke basis data.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-dark mb-1.5">Nama Tamu Undangan</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                value={singleGuestName}
                onChange={(e) => setSingleGuestName(e.target.value)}
                placeholder="Contoh: Bapak Prof. Dr. Hendra Gunawan"
                className="w-full pl-10 pr-3.5 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-text-dark">URL Undangan Tamu</label>
              <button
                type="button"
                onClick={copySingleLink}
                className="text-xs text-sage-dark hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Tersalin' : 'Salin URL'}</span>
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={singleGeneratedLink}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-700 font-mono focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-text-dark">Template Pesan WhatsApp</label>
              <button
                type="button"
                onClick={copySingleWaMessage}
                className="text-xs text-sage-dark hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                {copiedWaText ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedWaText ? 'Teks Tersalin' : 'Salin Teks WA'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={singleWaMessage}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-700 font-mono resize-none focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={shareSingleToWhatsapp}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
          >
            <Share2 size={16} />
            <span>Kirim Langsung ke WhatsApp Tamu</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => handleDownloadGuestPass({ name: singleGuestName }, 'png')}
              className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs cursor-pointer"
            >
              <Download size={15} />
              <span>Unduh Digital Pass HD (PNG)</span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadGuestPass({ name: singleGuestName }, 'pdf')}
              className="w-full bg-indigo-50 border border-indigo-200 text-indigo-700 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all shadow-2xs cursor-pointer"
            >
              <FileText size={15} />
              <span>Unduh E-Ticket PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: Tambah Tamu Baru */}
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
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-sage/15 text-sage-dark flex items-center justify-center">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-gray-900">Tambah Tamu Undangan</h3>
                  <p className="text-[11px] text-gray-500">Tersimpan langsung ke database MySQL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddGuestModalOpen(false)}
                disabled={isSubmittingGuest}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Tier Akses & Prioritas</label>
                <div className="relative flex items-center">
                  <Crown className="absolute left-3 text-amber-500 pointer-events-none" size={15} />
                  <select
                    value={newGuestTier}
                    onChange={(e) => setNewGuestTier(e.target.value as GuestTier)}
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-sage focus:border-sage bg-white text-gray-700"
                  >
                    <option value="regular">Tamu Reguler</option>
                    <option value="family">Keluarga Besar (Family Pass)</option>
                    <option value="vip">VIP Guest (Prioritas)</option>
                    <option value="vvip">👑 VVIP Kehormatan (Gold Badge + Prioritas Utama)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Nomor / Zona Meja <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <div className="relative flex items-center">
                  <Armchair className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
                  <input
                    type="text"
                    value={newGuestTableNumber}
                    onChange={(e) => setNewGuestTableNumber(e.target.value)}
                    placeholder="Contoh: Meja VIP 1, Baris Depan, atau Meja A2"
                    className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Catatan Protokoler / Khusus <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  rows={2}
                  value={newGuestVipNotes}
                  onChange={(e) => setNewGuestVipNotes(e.target.value)}
                  placeholder="Contoh: Pejabat walikota / dikawal ajudan / dampingi ke ruang holding VIP..."
                  className="w-full border border-gray-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sage focus:border-sage placeholder:text-gray-400 resize-none"
                />
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

      {/* Modal: Impor Tamu (Excel / CSV / Multiline Text) */}
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
                    Mendukung file Excel (.xlsx, .xls), CSV (.csv), dan salin-tempel teks baris.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                disabled={isProcessingImport}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

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

            {/* Pratinjau List */}
            {parsedGuestsPreview.length > 0 && (
              <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-dark flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    <span>{parsedGuestsPreview.filter(p => p.isValid).length} Tamu Siap Diimpor</span>
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    Total dibaca: {parsedGuestsPreview.length} baris
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-2xl divide-y divide-gray-100 text-xs">
                  {parsedGuestsPreview.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between gap-3 hover:bg-gray-50/70">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[11px] w-5 text-right">{idx + 1}.</span>
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        {item.phone && (
                          <span className="text-[11px] text-gray-500 font-mono">({item.phone})</span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Valid
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setIsImportModalOpen(false);
                  setParsedGuestsPreview([]);
                  setImportTextContent('');
                  setImportFileName('');
                }}
                disabled={isProcessingImport}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={isProcessingImport || parsedGuestsPreview.filter(p => p.isValid).length === 0}
                className="px-5 py-2.5 rounded-xl bg-sage hover:bg-sage-dark disabled:bg-gray-300 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {isProcessingImport ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengimpor Massal...</span>
                  </>
                ) : (
                  <>
                    <CheckCheck size={16} />
                    <span>Simpan {parsedGuestsPreview.filter(p => p.isValid).length} Tamu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Broadcast Modal */}
      <WhatsAppBroadcastModal
        isOpen={isWhatsAppBroadcastModalOpen}
        onClose={() => setIsWhatsAppBroadcastModalOpen(false)}
        guests={guests}
        weddingConfig={weddingConfig}
        onUpdateGuestStatus={async (guestId: string, status: 'pending' | 'sent') => {
          try {
            await api.updateGuest(guestId, { status });
            setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status } : g));
          } catch {
            // ignore
          }
        }}
        onToast={showToast}
      />
    </div>
  );
}
