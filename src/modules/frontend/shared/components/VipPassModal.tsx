import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, Download, ShieldCheck, MapPin, Users, Gift, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useGuestName } from '../../../../hooks/useGuestName';
import { GuestTier } from '../../../../types';
import { VipAccessBadge } from './VipAccessBadge';
import { generateQRCodeDataURL, serializeGuestPayload, generateTicketCode } from '../../../../utils/qrGenerator';
import { downloadGuestPassAsImage } from '../../../../utils/digitalPassGenerator';

interface VipPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestId?: string;
  guestTier?: GuestTier;
  tableNumber?: string;
  tableName?: string;
  pax?: number;
  souvenirClaimed?: boolean;
}

export const VipPassModal: React.FC<VipPassModalProps> = ({
  isOpen,
  onClose,
  guestId,
  guestTier = 'regular',
  tableNumber,
  tableName,
  pax = 1,
  souvenirClaimed = false,
}) => {
  const { weddingConfig } = useWeddingConfig();
  const guestName = useGuestName();
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);

  const isVip = guestTier === 'vip' || guestTier === 'vvip';
  const ticketCode = generateTicketCode(guestName, guestId);

  useEffect(() => {
    if (!isOpen) return;

    const payload = serializeGuestPayload({
      id: guestId,
      name: guestName,
      pax,
      code: ticketCode,
    });

    generateQRCodeDataURL(payload, { width: 400, margin: 2 })
      .then(setQrUrl)
      .catch(() => {});
  }, [isOpen, guestName, guestId, pax, ticketCode]);

  // Lock body scroll when modal open
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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadGuestPassAsImage({
        guestName,
        guestPax: pax,
        guestId,
        guestTier,
        tableNumber,
        tableName,
        weddingConfig,
      }, `${guestName.replace(/[^a-zA-Z0-9]/g, '_')}_pass.png`);
    } catch {
      // ignore
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 w-screen h-screen z-9999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm my-auto bg-linear-to-b from-[#1C1917] via-[#292524] to-[#1C1917] text-[#FAF8F5] rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl overflow-hidden p-6"
          >
            {/* Ambient Background Gold Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#B45309]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#FDE68A]">
                  <QrCode size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide uppercase text-[#FDE68A]">
                    Digital Access Pass
                  </h3>
                  <p className="text-[10px] text-stone-400">
                    Kartu Akses Resepsi Resmi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            {/* Couple Banner */}
            <div className="text-center my-3 relative z-10">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                The Wedding Of
              </span>
              <h2 className="text-xl font-heading font-bold text-white mt-0.5">
                {weddingConfig.groom.nickname} &amp; {weddingConfig.bride.nickname}
              </h2>
            </div>

            {/* Guest Identity Card */}
            <div className="bg-stone-900/80 border border-[#D4AF37]/30 rounded-2xl p-4 text-center shadow-inner relative z-10">
              <div className="flex justify-center mb-2">
                <VipAccessBadge tier={guestTier} size="md" />
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest">
                Kepada Yth. Tamu Undangan:
              </p>
              <h4 className="text-base sm:text-lg font-bold text-white capitalize mt-0.5 px-2 line-clamp-2">
                {guestName}
              </h4>
              <p className="text-[10px] font-mono text-[#D4AF37] mt-1">
                KODE: {ticketCode}
              </p>

              {/* QR Code Container */}
              <div className="mt-3.5 mb-2 flex justify-center">
                <div className="p-2.5 bg-white rounded-2xl shadow-md border-2 border-[#D4AF37]/40">
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt={`QR Pass ${guestName}`}
                      className="w-40 h-40 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 flex items-center justify-center text-stone-400">
                      <QrCode size={48} className="animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-stone-400 italic">
                Tunjukkan QR ini ke meja resepsi untuk fast check-in
              </p>
            </div>

            {/* Details Matrix */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs relative z-10">
              {/* Table info */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <MapPin size={14} />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[9px] text-stone-400 block uppercase">Alokasi Meja</span>
                  <span className="font-semibold text-white truncate block text-[11px]">
                    {tableNumber || (isVip ? 'VIP Area' : 'Bebas / Standar')}
                  </span>
                </div>
              </div>

              {/* Pax Quota */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Users size={14} />
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase">Jumlah Tamu</span>
                  <span className="font-semibold text-white block text-[11px]">
                    {pax} Orang
                  </span>
                </div>
              </div>

              {/* Souvenir status */}
              <div className="col-span-2 bg-stone-900/60 border border-stone-800 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${souvenirClaimed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-stone-800 text-stone-400'}`}>
                    <Gift size={14} />
                  </div>
                  <div>
                    <span className="text-[9px] text-stone-400 block uppercase">Status Souvenir</span>
                    <span className="font-semibold text-white text-[11px]">
                      {souvenirClaimed ? 'Sudah Diberikan' : 'Belum Diambil'}
                    </span>
                  </div>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  souvenirClaimed ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {souvenirClaimed ? 'Claimed' : 'Ready'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex gap-2 relative z-10">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-stone-900 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download size={14} />
                <span>{isDownloading ? 'Menyimpan...' : 'Simpan Pass'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
