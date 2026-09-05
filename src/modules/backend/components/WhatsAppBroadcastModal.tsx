import { useState, useMemo, useEffect } from 'react';
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
  UserCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import type { GuestInvitation, WeddingConfig } from '../../../types';

interface WhatsAppBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: GuestInvitation[];
  weddingConfig: WeddingConfig;
  onUpdateGuestStatus: (guestId: string, status: 'pending' | 'sent') => Promise<void>;
  onToast: (msg: string, type: 'success' | 'error') => void;
}

type BroadcastTemplateType = 'invitation' | 'reminder_h3' | 'reminder_h1' | 'custom';

export function WhatsAppBroadcastModal({
  isOpen,
  onClose,
  guests,
  weddingConfig,
  onUpdateGuestStatus,
  onToast,
}: WhatsAppBroadcastModalProps) {
  const [activeTabFilter, setActiveTabFilter] = useState<'all' | 'pending' | 'sent'>('pending');
  const [templateType, setTemplateType] = useState<BroadcastTemplateType>('invitation');
  const [customTemplateText, setCustomTemplateText] = useState<string>(
    'Kepada Yth. *{nama}*,\n\nKami mengundang Anda menghadiri pernikahan *{groom} & {bride}* pada {tanggal} di {venue}.\n\nUndangan personal Anda: {link}\n\nTerima kasih atas doa restunya!'
  );
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  // Prevent background scrolling when modal is open
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

  // Filtered guests based on active tab
  const queueGuests = useMemo(() => {
    if (activeTabFilter === 'pending') {
      return guests.filter((g) => g.status !== 'sent');
    }
    if (activeTabFilter === 'sent') {
      return guests.filter((g) => g.status === 'sent');
    }
    return guests;
  }, [guests, activeTabFilter]);

  // Keep queue index within bounds
  useEffect(() => {
    if (currentQueueIndex >= queueGuests.length && queueGuests.length > 0) {
      setCurrentQueueIndex(0);
    }
  }, [queueGuests.length, currentQueueIndex]);

  const currentGuest: GuestInvitation | undefined = queueGuests[currentQueueIndex];

  // Sent stats
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
      return `Kepada Yth.\n*${guest.name}*\nDi Tempat\n\nAssalamu’alaikum Wr. Wb. / Salam Sejahtera,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri hari bahagia pernikahan kami:\n\n💍 *${groomName} & ${brideName}*\n\n📅 *Hari, Tanggal*: ${eventDate}\n⏰ *Waktu*: ${eventTime}\n📍 *Lokasi*: ${eventVenue}\n\nTautan Undangan Digital Personal Anda:\n🔗 ${link}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu kepada kedua mempelai.\n\nAtas kehadiran dan doa restu Anda, kami ucapkan terima kasih yang tulus.\n\nWassalamu’alaikum Wr. Wb.\nKami yang berbahagia,\n*${groomName} & ${brideName}*`;
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

  // Clean phone number format for WhatsApp link
  const getCleanPhone = (phone?: string): string => {
    if (!phone) return '';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.substring(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  };

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

  const handleSendWhatsApp = async () => {
    if (!currentGuest) return;
    const cleanPhone = getCleanPhone(currentGuest.phone);

    if (!cleanPhone || cleanPhone.length < 9) {
      onToast(`Nomor WhatsApp untuk ${currentGuest.name} belum valid!`, 'error');
      return;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(currentMessageText)}`;
    window.open(waUrl, '_blank');

    // Auto mark as sent in Firestore
    if (currentGuest.id && currentGuest.status !== 'sent') {
      try {
        setIsUpdatingStatus(true);
        await onUpdateGuestStatus(currentGuest.id, 'sent');
        onToast(`Status ${currentGuest.name} diperbarui ke Terkirim!`, 'success');
      } catch {
        onToast('Gagal memperbarui status ke Firestore.', 'error');
      } finally {
        setIsUpdatingStatus(false);
      }
    }

    // Auto advance to next guest if available
    if (currentQueueIndex < queueGuests.length - 1) {
      setCurrentQueueIndex((prev) => prev + 1);
    }
  };

  const handleToggleStatus = async () => {
    if (!currentGuest || !currentGuest.id) return;
    const nextStatus = currentGuest.status === 'sent' ? 'pending' : 'sent';
    try {
      setIsUpdatingStatus(true);
      await onUpdateGuestStatus(currentGuest.id, nextStatus);
      onToast(`Status ${currentGuest.name} diubah menjadi ${nextStatus === 'sent' ? 'Terkirim' : 'Belum'}`, 'success');
    } catch {
      onToast('Gagal memperbarui status.', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 via-white to-white dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
              <Send size={18} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Asisten Broadcast & Pengingat WhatsApp</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold">
                  Queue Runner
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Kirim link undangan dan pengingat RSVP 1-klik langsung ke nomor WhatsApp tamu.
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
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Total Tamu: <strong className="text-gray-900 dark:text-white">{totalCount}</strong>
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
            <span className="font-mono text-xs text-gray-500 font-semibold">
              {sentPercentage}% Selesai
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
              style={{ width: `${sentPercentage}%` }}
            />
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMNS (Left: Settings & Queue, Right: Live Message Preview) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Controls & Guest Card (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveTabFilter('pending');
                  setCurrentQueueIndex(0);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTabFilter === 'pending'
                    ? 'bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Belum ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTabFilter('all');
                  setCurrentQueueIndex(0);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTabFilter === 'all'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Semua ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTabFilter('sent');
                  setCurrentQueueIndex(0);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTabFilter === 'sent'
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                Terkirim ({sentCount})
              </button>
            </div>

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
                  🗺️ 3. Pengingat H-1 (Peta & Petunjuk Lokasi)
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
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                      {currentGuest.name}
                    </h4>
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
                Tidak ada tamu pada tab ini.
              </div>
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
                <span>Pesan siap dikirimkan via WhatsApp Web</span>
                <span className="font-mono">Tamu #{currentQueueIndex + 1}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-semibold cursor-pointer transition-colors"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={!currentGuest || !currentGuest.phone}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={15} />
                <span>Kirim via WhatsApp & Lanjut</span>
                <ExternalLink size={12} className="opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
