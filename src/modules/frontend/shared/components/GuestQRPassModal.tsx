import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, QrCode, CheckCircle2, Calendar, MapPin, Users, Loader2, FileText } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { generateTicketCode, serializeGuestPayload, generateQRCodeDataURL } from '../../../../utils/qrGenerator';
import { renderGuestPassCanvas, downloadPassImage, downloadPassPDF } from '../../../../utils/digitalPassGenerator';
import type { WeddingTable } from '../../../../types';

interface GuestQRPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  guestPax?: number;
  guestId?: string;
  tableNumber?: string;
}

export function GuestQRPassModal({
  isOpen,
  onClose,
  guestName,
  guestPax = 1,
  guestId,
  tableNumber,
}: GuestQRPassModalProps) {
  const { weddingConfig } = useWeddingConfig();
  const { tokens } = useThemeTokens();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'png' | 'pdf' | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  const displayName = (guestName && guestName.trim() !== '' && guestName !== 'Tamu Undangan')
    ? guestName.trim()
    : 'Tamu Terhormat';

  const ticketCode = generateTicketCode(displayName, guestId);
  const coupleText = `${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
  const eventDate = weddingConfig.events.resepsi.date || weddingConfig.dateStr || 'Hari Bahagia';
  const eventVenue = weddingConfig.events.resepsi.venue || 'Ballroom Resepsi';

  // Generate QR Code image when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGenerating(true);

    const payload = serializeGuestPayload({
      id: guestId,
      name: displayName,
      pax: guestPax,
      code: ticketCode,
    });

    generateQRCodeDataURL(payload, { width: 400, margin: 2 })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, displayName, guestPax, guestId, ticketCode]);

  // Seating table lookup from wedding_tables
  const [assignedTable, setAssignedTable] = useState<{ number: string; name: string } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const q = query(collection(db, 'wedding_tables'));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as WeddingTable);
        const norm = displayName.toLowerCase().trim();
        const found = list.find((t) =>
          (t.assignedGuests || []).some(
            (g) =>
              (g.name && g.name.toLowerCase().trim() === norm) ||
              (guestId && g.id === guestId)
          )
        );
        if (found) {
          setAssignedTable({ number: found.number, name: found.name });
        } else if (tableNumber) {
          const matchByNum = list.find((t) => t.number.toLowerCase() === tableNumber.toLowerCase());
          setAssignedTable({
            number: tableNumber,
            name: matchByNum ? matchByNum.name : 'Meja Khusus',
          });
        } else {
          setAssignedTable(null);
        }
      },
      () => {
        if (tableNumber) {
          setAssignedTable({ number: tableNumber, name: 'Meja Tamu' });
        }
      }
    );

    return () => unsub();
  }, [isOpen, displayName, guestId, tableNumber]);

  // Lock body scroll when modal is open
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

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Unified pass export handler (PNG HD or PDF)
  const handleExportPass = async (format: 'png' | 'pdf') => {
    if (downloadingFormat || isGenerating) return;
    setDownloadingFormat(format);

    try {
      const canvas = await renderGuestPassCanvas({
        guestName: displayName,
        guestPax,
        guestId,
        tableNumber: assignedTable?.number || tableNumber,
        tableName: assignedTable?.name,
        weddingConfig,
        themeTokens: tokens,
      });

      const sanitizedFilename = `Pass-${displayName.replace(/[^a-zA-Z0-9]/g, '_')}`;

      if (format === 'png') {
        downloadPassImage(canvas, sanitizedFilename, 'png');
      } else {
        await downloadPassPDF(canvas, sanitizedFilename, {
          guestName: displayName,
          coupleText,
        });
      }
    } catch (err) {
      console.warn('Failed to export guest pass:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop click to dismiss */}
          <div className="fixed inset-0" onClick={onClose} />

          {/* Modal Content */}
          <motion.div
            ref={ticketRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-[360px] bg-white rounded-[28px] border border-[#D4AF37]/40 shadow-2xl overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative accent */}
            <div className="bg-gradient-to-r from-[#8C7851] via-[#D4AF37] to-[#8C7851] h-2.5 w-full" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-text-dark/60 hover:text-text-dark transition-all cursor-pointer"
              title="Tutup Tiket"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>

            {/* Ticket Card Body */}
            <div className="p-6 text-center">
              {/* Badge & Title */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE] border border-[#D4AF37]/30 text-[#8C7851] text-[10px] font-semibold tracking-wider uppercase mb-2">
                <QrCode size={12} />
                <span>Guest Pass Resepsi</span>
              </div>

              <h3 className="font-heading text-xl text-text-dark font-bold tracking-wide mb-1">
                {coupleText}
              </h3>
              <p className="text-[11px] text-text-dark/50 mb-4">
                Walimatul Ursy Digital Pass
              </p>

              {/* Perforated edge divider with cutouts */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute -left-9 w-6 h-6 rounded-full bg-black/70" />
                <div className="w-full border-t-2 border-dashed border-[#D4AF37]/40" />
                <div className="absolute -right-9 w-6 h-6 rounded-full bg-black/70" />
              </div>

              {/* Guest Details */}
              <div className="my-2">
                <p className="text-[10px] uppercase tracking-widest text-[#8C7851] font-medium mb-1">
                  Nama Tamu
                </p>
                <h4 className="text-lg font-bold text-text-dark px-2 line-clamp-2">
                  {displayName}
                </h4>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-[11px] font-mono font-medium text-text-dark/80">
                  <span>{ticketCode}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-sage-dark" />
                    {guestPax} Pax
                  </span>
                </div>

                {/* Table Seating Badge */}
                {assignedTable && (
                  <div className="mt-2.5 flex items-center justify-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-xs">
                      <MapPin size={12} className="text-amber-700 shrink-0" />
                      <span>Meja: <strong className="font-bold">{assignedTable.number}</strong> ({assignedTable.name})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* QR Code Container */}
              <div className="my-4 flex flex-col items-center justify-center min-h-[210px] bg-gradient-to-b from-[#FBF9F6] to-white rounded-2xl p-4 border border-gold-soft/30 shadow-inner">
                {isGenerating || !qrDataUrl ? (
                  <div className="flex flex-col items-center gap-2 py-10 text-sage-dark">
                    <Loader2 size={32} className="animate-spin" />
                    <span className="text-xs text-text-dark/60 font-medium">Menyiapkan QR Pass...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                      <img
                        src={qrDataUrl}
                        alt={`QR Code Pass ${displayName}`}
                        className="w-[180px] h-[180px] object-contain select-none"
                      />
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#8C7851] font-medium">
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span>Terverifikasi Sistem Resepsi</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Event Snippet */}
              <div className="bg-[#FAF8F5] rounded-xl p-3 text-left border border-gray-100 mb-5 text-[11px] space-y-1.5">
                <div className="flex items-center gap-2 text-text-dark/70">
                  <Calendar size={13} className="text-[#8C7851] shrink-0" />
                  <span className="truncate">{eventDate}</span>
                </div>
                <div className="flex items-center gap-2 text-text-dark/70">
                  <MapPin size={13} className="text-[#8C7851] shrink-0" />
                  <span className="truncate">{eventVenue}</span>
                </div>
              </div>

              {/* Instructions */}
              <p className="text-[10px] text-text-dark/50 leading-relaxed mb-5">
                Tunjukkan QR Code ini kepada resepsionis saat memasuki ballroom resepsi.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleExportPass('png')}
                  disabled={downloadingFormat !== null || isGenerating || !qrDataUrl}
                  className="w-full bg-sage text-white py-2.5 px-4 rounded-full text-xs font-semibold hover:bg-sage-dark transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  style={{
                    backgroundColor: tokens.primary,
                    color: tokens.btnPrimaryText || '#ffffff',
                  }}
                >
                  {downloadingFormat === 'png' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Memproses Gambar HD...</span>
                    </>
                  ) : (
                    <>
                      <Download size={15} />
                      <span>Simpan Gambar HD (PNG)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleExportPass('pdf')}
                  disabled={downloadingFormat !== null || isGenerating || !qrDataUrl}
                  className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-700 py-2.5 px-4 rounded-full text-xs font-semibold hover:bg-gray-50 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {downloadingFormat === 'pdf' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Menyiapkan Dokumen PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={15} className="text-red-500" />
                      <span>Unduh Tiket PDF (Siap Cetak)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-gray-100 text-text-dark/70 py-2 px-4 rounded-full text-xs font-medium hover:bg-gray-200 transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-1"
                >
                  <X size={14} />
                  <span>Tutup</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
