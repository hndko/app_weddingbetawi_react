import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Send,
  X,
  CheckCircle2,
  Clock,
  Phone,
  Copy,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Zap,
  Play,
  Square,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Server,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import type { GuestInvitation, WeddingConfig, RSVPResponse, GuestTier } from '../../../types';
import { api } from '../../../services/api';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: GuestInvitation[];
  weddingConfig: WeddingConfig;
  onUpdateGuestStatus: (guestId: string, status: 'pending' | 'sent') => Promise<void>;
  onToast: (msg: string, type: 'success' | 'error') => void;
  rsvps?: RSVPResponse[];
}

type BroadcastTemplateType = 'invitation' | 'reminder_h3' | 'reminder_h1' | 'custom';

export function WhatsAppBroadcastModal({
  isOpen,
  onClose,
  guests,
  weddingConfig,
  onUpdateGuestStatus,
  onToast,
  rsvps = [],
}: WhatsAppBroadcastModalProps) {
  // Category & Recipient Filters
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<'all' | 'pending' | 'sent'>('pending');
  const [tierFilter, setTierFilter] = useState<'all' | GuestTier>('all');
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'pending' | 'hadir' | 'tidak_hadir'>('all');
  const [checkinFilter, setCheckinFilter] = useState<'all' | 'checked_in' | 'not_checked_in'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Template States
  const [templateType, setTemplateType] = useState<BroadcastTemplateType>('invitation');
  const [customTemplateText, setCustomTemplateText] = useState<string>(
    'Kepada Yth. *{nama}*,\n\nKami mengundang Anda menghadiri pernikahan *{groom} & {bride}* pada {tanggal} di {venue}.\n\nUndangan personal Anda: {link}\n\nTerima kasih atas doa restunya!'
  );
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [isSendingSingle, setIsSendingSingle] = useState<boolean>(false);

  // Automated Queue Broadcast States
  const [isAutoBroadcasting, setIsAutoBroadcasting] = useState<boolean>(false);
  const [autoSentCount, setAutoSentCount] = useState<number>(0);
  const [autoFailedCount, setAutoFailedCount] = useState<number>(0);
  const [autoCurrentTarget, setAutoCurrentTarget] = useState<string>('');
  const [autoCountdown, setAutoCountdown] = useState<number>(0);
  const stopBroadcastRef = useRef<boolean>(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      stopBroadcastRef.current = true;
      setIsAutoBroadcasting(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Map RSVPs by name for fast lookup
  const rsvpMap = useMemo(() => {
    const map = new Map<string, string>();
    rsvps.forEach((r) => {
      map.set(r.name.toLowerCase().trim(), r.attendance.toLowerCase());
    });
    return map;
  }, [rsvps]);

  // Clean phone number format for WhatsApp link with international preservation
  const getCleanPhone = (phone?: string): string => {
    if (!phone) return '';
    const trimmed = phone.trim();
    const startsWithPlus = trimmed.startsWith('+');
    let clean = trimmed.replace(/[^0-9]/g, '');
    if (!clean) return '';

    if (startsWithPlus) {
      return clean;
    }

    if (clean.startsWith('0')) {
      clean = '62' + clean.substring(1);
    } else if (clean.startsWith('8') && clean.length >= 9 && clean.length <= 13) {
      clean = '62' + clean;
    }
    return clean;
  };

  // Filtered queue guests based on multi-dimensional filters
  const queueGuests = useMemo(() => {
    return guests.filter((g) => {
      // 1. Delivery status filter
      if (deliveryStatusFilter === 'pending' && g.status === 'sent') return false;
      if (deliveryStatusFilter === 'sent' && g.status !== 'sent') return false;

      // 2. Tier filter
      if (tierFilter !== 'all' && (g.tier || 'regular') !== tierFilter) return false;

      // 3. RSVP status filter
      if (rsvpFilter !== 'all') {
        const attendance = rsvpMap.get(g.name.toLowerCase().trim());
        if (rsvpFilter === 'pending' && attendance) return false;
        if (rsvpFilter === 'hadir' && attendance !== 'hadir') return false;
        if (rsvpFilter === 'tidak_hadir' && attendance !== 'tidak_hadir') return false;
      }

      // 4. Check-in status filter
      if (checkinFilter === 'checked_in' && !g.checkedIn) return false;
      if (checkinFilter === 'not_checked_in' && g.checkedIn) return false;

      // 5. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = g.name.toLowerCase().includes(q);
        const matchPhone = g.phone ? g.phone.includes(q) : false;
        if (!matchName && !matchPhone) return false;
      }

      return true;
    });
  }, [guests, deliveryStatusFilter, tierFilter, rsvpFilter, checkinFilter, searchQuery, rsvpMap]);

  // Reset queue index if out of range
  useEffect(() => {
    if (currentQueueIndex >= queueGuests.length && queueGuests.length > 0) {
      setCurrentQueueIndex(0);
    }
  }, [queueGuests.length, currentQueueIndex]);

  const currentGuest: GuestInvitation | undefined = queueGuests[currentQueueIndex];

  // Global sent stats
  const totalCount = guests.length;
  const sentCount = useMemo(() => guests.filter((g) => g.status === 'sent').length, [guests]);
  const pendingCount = totalCount - sentCount;
  const sentPercentage = totalCount > 0 ? Math.round((sentCount / totalCount) * 100) : 0;

  // Variables for template replacement
  const groomName = weddingConfig.groom.nickname || weddingConfig.groom.fullName || 'Mempelai Pria';
  const brideName = weddingConfig.bride.nickname || weddingConfig.bride.fullName || 'Mempelai Wanita';
  const eventDate = weddingConfig.events.resepsi.date || weddingConfig.dateStr || 'Hari Bahagia';
  const eventTime = weddingConfig.events.resepsi.time || '10:00 WIB';
  const eventVenue = weddingConfig.events.resepsi.venue || 'Gedung Resepsi';
  const mapUrl = weddingConfig.events.resepsi.mapUrl || '';

  const getPersonalLink = (guestName: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/?to=${encodeURIComponent(guestName)}`;
  };

  // Generate rendered message text for a specific guest
  const generateMessageText = (guest: GuestInvitation, tpl: BroadcastTemplateType): string => {
    const link = getPersonalLink(guest.name);

    if (tpl === 'invitation') {
      const salutation = weddingConfig.greeting?.salutation || "Assalamu’alaikum Wr. Wb. / Salam Sejahtera";
      const coverSalutation = weddingConfig.cover?.salutation || "Kepada Yth.";
      const intro = weddingConfig.greeting?.introText || "Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:";
      const thank = weddingConfig.closing?.thankText || "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kedua mempelai.";
      const closingSalutation = weddingConfig.closing?.salutation || "Wassalamu’alaikum Wr. Wb.";

      return `${coverSalutation}\n*${guest.name}*\nDi Tempat\n\n${salutation},\n\n${intro}\n\n💍 *${groomName} & ${brideName}*\n\n📅 *Hari, Tanggal*: ${eventDate}\n⏰ *Waktu*: ${eventTime}\n📍 *Lokasi*: ${eventVenue}\n\nTautan Undangan Digital Personal Anda:\n🔗 ${link}\n\n${thank}\n\nAtas kehadiran dan doa restu Anda, kami ucapkan terima kasih yang tulus.\n\n${closingSalutation}\nKami yang berbahagia,\n*${groomName} & ${brideName}*`;
    }

    if (tpl === 'reminder_h3') {
      return `Halo *${guest.name}*,\n\nSemoga selalu dalam lindungan Tuhan YME. Mengingatkan kembali bahwa hari bahagia pernikahan kami (*${groomName} & ${brideName}*) tinggal *3 hari lagi*:\n\n📅 ${eventDate}\n⏰ ${eventTime}\n📍 ${eventVenue}\n\nMohon kesediaannya untuk melakukan konfirmasi kehadiran (RSVP) melalui link undangan personal Anda:\n🔗 ${link}\n\nDoa restu dan kehadiran Anda sangat berarti bagi kami. Sampai jumpa di hari bahagia nanti! ❤️`;
    }

    if (tpl === 'reminder_h1') {
      return `Bismillah,\n\nYth. *${guest.name}*,\n\nBesok adalah hari bahagia pernikahan kami:\n💍 *${groomName} & ${brideName}*\n\nBerikut ringkasan jadwal dan lokasi acara:\n📅 *Tanggal*: ${eventDate}\n⏰ *Waktu*: ${eventTime}\n📍 *Tempat*: ${eventVenue}\n${mapUrl ? `🗺️ *Petunjuk Maps*: ${mapUrl}\n` : ''}\nBuka kartu undangan & QR Check-in resepsi Anda di:\n🔗 ${link}\n\nKami sangat menantikan kehadiran Anda besok. Terima kasih banyak! 🙏`;
    }

    // Custom template
    return customTemplateText
      .replace(/{nama}/g, guest.name)
      .replace(/{groom}/g, groomName)
      .replace(/{bride}/g, brideName)
      .replace(/{mempelai}/g, `${groomName} & ${brideName}`)
      .replace(/{tanggal}/g, eventDate)
      .replace(/{waktu}/g, eventTime)
      .replace(/{venue}/g, eventVenue)
      .replace(/{mapUrl}/g, mapUrl)
      .replace(/{link}/g, link);
  };

  const currentMessageText = currentGuest ? generateMessageText(currentGuest, templateType) : '';

  const activeProvider = weddingConfig.whatsappGateway?.provider || 'manual';
  const isGatewayActive = activeProvider !== 'manual';

  const handleCopyText = async () => {
    if (!currentMessageText) return;
    try {
      await navigator.clipboard.writeText(currentMessageText);
      onToast('Teks pesan WhatsApp berhasil disalin!', 'success');
    } catch {
      onToast('Gagal menyalin teks ke clipboard.', 'error');
    }
  };

  const handleCopyLink = async () => {
    if (!currentGuest) return;
    try {
      await navigator.clipboard.writeText(getPersonalLink(currentGuest.name));
      onToast('Link personal berhasil disalin!', 'success');
    } catch {
      onToast('Gagal menyalin tautan.', 'error');
    }
  };

  // Single Manual Send (wa.me)
  const handleSendManual = async () => {
    if (!currentGuest) return;
    const cleanPhone = getCleanPhone(currentGuest.phone);

    if (!cleanPhone || cleanPhone.length < 9) {
      onToast(`Nomor WhatsApp untuk ${currentGuest.name} belum valid!`, 'error');
      return;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(currentMessageText)}`;
    window.open(waUrl, '_blank');

    // Auto mark as sent in database
    if (currentGuest.id && currentGuest.status !== 'sent') {
      try {
        setIsUpdatingStatus(true);
        await onUpdateGuestStatus(currentGuest.id, 'sent');
        onToast(`Status ${currentGuest.name} diperbarui ke Terkirim!`, 'success');
      } catch {
        onToast('Gagal memperbarui status ke database.', 'error');
      } finally {
        setIsUpdatingStatus(false);
      }
    }

    // Advance to next guest
    if (currentQueueIndex < queueGuests.length - 1) {
      setCurrentQueueIndex((prev) => prev + 1);
    }
  };

  // Single Send via Active Gateway
  const handleSendViaGateway = async () => {
    if (!currentGuest) return;
    const cleanPhone = getCleanPhone(currentGuest.phone);

    if (!cleanPhone || cleanPhone.length < 9) {
      onToast(`Nomor WhatsApp untuk ${currentGuest.name} belum valid!`, 'error');
      return;
    }

    setIsSendingSingle(true);
    try {
      const res = await api.sendWhatsAppMessage({
        to: cleanPhone,
        message: currentMessageText,
        config: weddingConfig.whatsappGateway,
      });

      if (res.success) {
        if (currentGuest.id && currentGuest.status !== 'sent') {
          await onUpdateGuestStatus(currentGuest.id, 'sent');
        }
        onToast(`Pesan ke ${currentGuest.name} berhasil terkirim via ${activeProvider.toUpperCase()}!`, 'success');

        // Advance to next guest
        if (currentQueueIndex < queueGuests.length - 1) {
          setCurrentQueueIndex((prev) => prev + 1);
        }
      } else {
        onToast(`Gagal mengirim via gateway: ${res.message || 'Error'}`, 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan gateway.';
      onToast(`Gagal: ${msg}`, 'error');
    } finally {
      setIsSendingSingle(false);
    }
  };

  // Toggle guest sent status manually
  const handleToggleStatus = async () => {
    if (!currentGuest || !currentGuest.id) return;
    const nextStatus = currentGuest.status === 'sent' ? 'pending' : 'sent';
    try {
      setIsUpdatingStatus(true);
      await onUpdateGuestStatus(currentGuest.id, nextStatus);
      onToast(`Status ${currentGuest.name} diubah menjadi ${nextStatus === 'sent' ? 'Terkirim' : 'Belum'}`, 'success');
    } catch {
      onToast('Gagal mengubah status tamu.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Automated Queue Broadcast with safe anti-spam delay jitter
  const handleStartAutoBroadcast = async () => {
    if (!isGatewayActive) {
      onToast('Pilih dan atur WhatsApp Gateway terlebih dahulu pada menu pengaturan.', 'error');
      return;
    }

    const targets = queueGuests.filter((g) => {
      const p = getCleanPhone(g.phone);
      return p && p.length >= 9 && g.status !== 'sent';
    });

    if (targets.length === 0) {
      onToast('Tidak ada tamu belum terkirim dengan nomor valid pada antrean ini.', 'error');
      return;
    }

    setIsAutoBroadcasting(true);
    stopBroadcastRef.current = false;
    setAutoSentCount(0);
    setAutoFailedCount(0);

    for (let i = 0; i < targets.length; i++) {
      if (stopBroadcastRef.current) break;

      const guest = targets[i];
      const cleanPhone = getCleanPhone(guest.phone);
      const text = generateMessageText(guest, templateType);

      setAutoCurrentTarget(`${guest.name} (+${cleanPhone}) [${i + 1}/${targets.length}]`);

      try {
        const res = await api.sendWhatsAppMessage({
          to: cleanPhone,
          message: text,
          config: weddingConfig.whatsappGateway,
        });

        if (res.success) {
          if (guest.id) {
            await onUpdateGuestStatus(guest.id, 'sent');
          }
          setAutoSentCount((prev) => prev + 1);
        } else {
          setAutoFailedCount((prev) => prev + 1);
        }
      } catch {
        setAutoFailedCount((prev) => prev + 1);
      }

      // Safe Jitter Delay between 2.5s and 4.0s (Anti-Spam WhatsApp Guard)
      if (i < targets.length - 1 && !stopBroadcastRef.current) {
        const jitterDelay = Math.floor(Math.random() * 1500) + 2500;
        const delaySeconds = Math.ceil(jitterDelay / 1000);
        for (let sec = delaySeconds; sec > 0; sec--) {
          if (stopBroadcastRef.current) break;
          setAutoCountdown(sec);
          await new Promise((r) => setTimeout(r, 1000));
        }
        setAutoCountdown(0);
      }
    }

    setIsAutoBroadcasting(false);
    onToast('Sesi broadcast antrean telah selesai!', 'success');
  };

  const handleStopAutoBroadcast = () => {
    stopBroadcastRef.current = true;
    setIsAutoBroadcasting(false);
    setAutoCountdown(0);
    onToast('Pengiriman broadcast dihentikan.', 'error');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
        {/* HEADER BAR */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Asisten Broadcast &amp; Pengingat WhatsApp
                </h3>
                {/* Gateway Provider Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                    activeProvider === 'manual'
                      ? 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                  }`}
                >
                  Provider: {activeProvider}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kirim pesan personal, pengingat H-3 / H-1, atau broadcast otomatis via gateway.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* PROGRESS & SUMMARY BAR */}
        <div className="px-6 py-2.5 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Total Database: <strong className="text-gray-900 dark:text-white">{totalCount}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={13} />
              <span>Terkirim: {sentCount}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Clock size={13} />
              <span>Belum: {pendingCount}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                style={{ width: `${sentPercentage}%` }}
              />
            </div>
            <span className="font-mono text-xs text-gray-600 dark:text-gray-300 font-semibold">
              {sentPercentage}% Selesai
            </span>
          </div>
        </div>

        {/* RECIPIENT CATEGORY FILTERS BAR */}
        <div className="px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Delivery Filter Pills */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryStatusFilter('pending');
                    setCurrentQueueIndex(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    deliveryStatusFilter === 'pending'
                      ? 'bg-white dark:bg-gray-700 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  Belum Terkirim ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryStatusFilter('sent');
                    setCurrentQueueIndex(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    deliveryStatusFilter === 'sent'
                      ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  Sudah Terkirim ({sentCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryStatusFilter('all');
                    setCurrentQueueIndex(0);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    deliveryStatusFilter === 'all'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                  }`}
                >
                  Semua ({totalCount})
                </button>
              </div>

              {/* Tier Filter Dropdown */}
              <select
                value={tierFilter}
                onChange={(e) => {
                  setTierFilter(e.target.value as any);
                  setCurrentQueueIndex(0);
                }}
                className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
              >
                <option value="all">Semua Kategori/Tier</option>
                <option value="vvip">👑 VVIP</option>
                <option value="vip">⭐ VIP</option>
                <option value="family">👨‍👩‍👧 Keluarga</option>
                <option value="regular">Tamu Reguler</option>
              </select>

              {/* RSVP Status Dropdown */}
              <select
                value={rsvpFilter}
                onChange={(e) => {
                  setRsvpFilter(e.target.value as any);
                  setCurrentQueueIndex(0);
                }}
                className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
              >
                <option value="all">Semua Status RSVP</option>
                <option value="pending">Belum RSVP</option>
                <option value="hadir">Konfirmasi Hadir</option>
                <option value="tidak_hadir">Tidak Hadir</option>
              </select>

              {/* Check-in Dropdown */}
              <select
                value={checkinFilter}
                onChange={(e) => {
                  setCheckinFilter(e.target.value as any);
                  setCurrentQueueIndex(0);
                }}
                className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
              >
                <option value="all">Semua Kehadiran Hari-H</option>
                <option value="checked_in">Sudah Hadir (Checked-in)</option>
                <option value="not_checked_in">Belum Hadir</option>
              </select>
            </div>

            {/* Quick Search Input */}
            <div className="relative flex items-center w-full sm:w-56">
              <Search size={14} className="absolute left-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentQueueIndex(0);
                }}
                placeholder="Cari nama atau telepon..."
                className="w-full text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-8 pr-3 py-1.5 text-gray-800 dark:text-gray-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>
              Menampilkan <strong>{queueGuests.length}</strong> tamu tersaring dalam antrean pengiriman.
            </span>
            {isGatewayActive && queueGuests.length > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Zap size={12} /> Broadcast otomatis siap digunakan
              </span>
            )}
          </div>
        </div>

        {/* AUTOMATED BROADCAST OVERLAY MODAL */}
        {isAutoBroadcasting && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/60 flex flex-col gap-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-emerald-600 animate-spin" />
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                  Pengiriman Otomatis WhatsApp Gateway Berjalan
                </h4>
              </div>
              <button
                type="button"
                onClick={handleStopAutoBroadcast}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Square size={12} />
                <span>Hentikan Broadcast</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-emerald-800 dark:text-emerald-300 truncate">
                Target: <strong>{autoCurrentTarget}</strong>
              </span>
              <div className="flex items-center gap-3 font-semibold">
                <span className="text-emerald-700">Terkirim: {autoSentCount}</span>
                <span className="text-red-600">Gagal: {autoFailedCount}</span>
                {autoCountdown > 0 && (
                  <span className="text-amber-700 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                    Jeda Anti-Spam: {autoCountdown}s
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY: 2 COLUMNS (Left: Settings & Queue, Right: Live Message Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Controls & Guest Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Template Selector */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 flex flex-col gap-2.5">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" />
                <span>Pilih Template Broadcast</span>
              </label>

              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={() => setTemplateType('invitation')}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    templateType === 'invitation'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs'
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ✉️ 1. Undangan Resmi (Formal Invitation)
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('reminder_h3')}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    templateType === 'reminder_h3'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs'
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ⏰ 2. Pengingat H-3 (Konfirmasi RSVP)
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('reminder_h1')}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    templateType === 'reminder_h1'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs'
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  🗺️ 3. Pengingat H-1 (Peta &amp; Petunjuk Lokasi)
                </button>

                <button
                  type="button"
                  onClick={() => setTemplateType('custom')}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                    templateType === 'custom'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs'
                      : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  ✏️ 4. Template Kustom
                </button>
              </div>

              {templateType === 'custom' && (
                <div className="mt-2">
                  <textarea
                    rows={4}
                    value={customTemplateText}
                    onChange={(e) => setCustomTemplateText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tulis format template Anda..."
                  />
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">
                    Variabel: {'{nama}'}, {'{groom}'}, {'{bride}'}, {'{tanggal}'}, {'{venue}'}, {'{link}'}
                  </p>
                </div>
              )}
            </div>

            {/* Current Guest Queue Card */}
            {currentGuest ? (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-gray-500 dark:text-gray-400">
                    Antrean #{currentQueueIndex + 1} dari {queueGuests.length}
                  </span>

                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={isUpdatingStatus}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      currentGuest.status === 'sent'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                    }`}
                  >
                    {currentGuest.status === 'sent' ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>Terkirim</span>
                      </>
                    ) : (
                      <>
                        <Clock size={12} />
                        <span>Belum Terkirim</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold font-heading flex items-center justify-center text-lg shrink-0">
                    {currentGuest.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                        {currentGuest.name}
                      </h4>
                      {currentGuest.tier && currentGuest.tier !== 'regular' && (
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300">
                          {currentGuest.tier}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      {currentGuest.phone ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-mono">
                          <Phone size={11} />
                          <span>+{currentGuest.phone}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-[11px]">
                          <AlertTriangle size={11} />
                          <span>Nomor HP belum diisi</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    disabled={currentQueueIndex === 0}
                    onClick={() => setCurrentQueueIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-medium flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Sebelumnya</span>
                  </button>

                  <button
                    type="button"
                    disabled={currentQueueIndex >= queueGuests.length - 1}
                    onClick={() => setCurrentQueueIndex((prev) => Math.min(queueGuests.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-xs font-medium flex items-center gap-1 disabled:opacity-30 cursor-pointer"
                  >
                    <span>Berikutnya</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 text-xs">
                Tidak ada tamu yang sesuai dengan filter yang dipilih.
              </div>
            )}

            {/* Bulk Automated Broadcast Button */}
            {isGatewayActive && queueGuests.length > 0 && (
              <button
                type="button"
                onClick={handleStartAutoBroadcast}
                disabled={isAutoBroadcasting}
                className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                <Zap size={16} />
                <span>🚀 Kirim Otomatis Antrean ({queueGuests.filter(g => g.status !== 'sent').length} Tamu)</span>
              </button>
            )}
          </div>

          {/* RIGHT COLUMN: Live Message Preview (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <MessageSquare size={14} className="text-emerald-600" />
                <span>Pratinjau Pesan WhatsApp Tamu</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={!currentGuest}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  title="Salin tautan personal saja"
                >
                  <Copy size={12} />
                  <span>Salin Link</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={!currentGuest}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  title="Salin seluruh format pesan"
                >
                  <Copy size={12} />
                  <span>Salin Pesan</span>
                </button>
              </div>
            </div>

            {/* WhatsApp Chat Bubble Mockup */}
            <div className="flex-1 bg-[#EFEAE2] dark:bg-[#0b141a] p-4 sm:p-5 rounded-2xl border border-gray-300 dark:border-gray-800 overflow-y-auto max-h-[380px] shadow-inner relative flex flex-col justify-between">
              {currentGuest ? (
                <div className="bg-white dark:bg-[#1f2c34] text-gray-900 dark:text-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm max-w-lg border border-gray-200/50 dark:border-white/5 text-xs whitespace-pre-wrap leading-relaxed select-text font-sans">
                  {currentMessageText}
                </div>
              ) : (
                <div className="m-auto text-center text-gray-500 text-xs">
                  Pilih tamu dari antrean untuk melihat pratinjau pesan.
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-300/60 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
                <span>
                  Mode Pengiriman: <strong>{activeProvider.toUpperCase()}</strong>
                </span>
                <span className="font-mono">Tamu #{currentQueueIndex + 1}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer transition-colors"
              >
                Tutup
              </button>

              {/* Tombol Fallback wa.me */}
              <button
                type="button"
                onClick={handleSendManual}
                disabled={!currentGuest || !currentGuest.phone}
                className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                title="Buka percakapan manual via wa.me di tab baru"
              >
                <ExternalLink size={13} />
                <span>Buka wa.me</span>
              </button>

              {/* Tombol Kirim via Gateway Aktif */}
              {isGatewayActive ? (
                <button
                  type="button"
                  onClick={handleSendViaGateway}
                  disabled={!currentGuest || !currentGuest.phone || isSendingSingle}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingSingle ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                  <span>Kirim via {activeProvider.toUpperCase()}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendManual}
                  disabled={!currentGuest || !currentGuest.phone}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                  <span>Kirim via WhatsApp &amp; Lanjut</span>
                  <ExternalLink size={12} className="opacity-70" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
