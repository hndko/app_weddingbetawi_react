import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Copy, Check, QrCode, Sparkles, Wifi } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { playPaymentChime } from '../utils/appleAudio';

export const BentoAppleWallet: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { banks } = weddingConfig;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showQrisModal, setShowQrisModal] = useState<string | null>(null);

  const handleCopy = async (account: string, index: number) => {
    try {
      await navigator.clipboard.writeText(account);
      playPaymentChime();
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full px-4 py-2">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FF9500]/10 flex items-center justify-center text-[#FF9500]">
            <CreditCard size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            WALLET &amp; WEDDING GIFTS
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#FF9500]">Amplop Digital</span>
      </div>

      {/* Intro text */}
      <p className="text-xs text-neutral-500 dark:text-neutral-400 px-1 mb-3">
        Doa restu Anda adalah kado terindah bagi kami. Bagi Anda yang berkenan memberikan tanda kasih, dapat mengirimkan melalui rekening digital di bawah ini:
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {banks && banks.length > 0 ? (
          banks.map((bank, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-[28px] bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#121212] text-white p-5 shadow-[0_12px_28px_rgba(0,0,0,0.3)] border border-white/15 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Apple Pay Subtle Background Card Sheen */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#007AFF]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top Row: EMV Chip & Bank Name */}
              <div className="flex items-center justify-between z-10 mb-4">
                <div className="flex items-center gap-2.5">
                  {/* EMV Chip */}
                  <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#FFE082] via-[#FFD54F] to-[#FFB300] border border-[#B28704] flex items-center justify-center shadow-xs">
                    <div className="w-5 h-3.5 border border-[#8D6E16] rounded-xs opacity-60 grid grid-cols-2 gap-0.5 p-[1px]" />
                  </div>
                  <Wifi size={16} className="text-white/60 rotate-90" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white">
                    {bank.name}
                  </span>
                </div>
              </div>

              {/* Card Middle: Account Number */}
              <div className="z-10 my-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 block mb-0.5">
                  ACCOUNT NUMBER
                </span>
                <p className="font-mono text-lg sm:text-xl font-bold tracking-widest text-white">
                  {bank.account}
                </p>
                <p className="text-xs text-white/70 mt-1 font-medium">
                  a.n {bank.holder}
                </p>
              </div>

              {/* Card Bottom: Copy Button & QRIS Trigger */}
              <div className="flex items-center gap-2 z-10 mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleCopy(bank.account, idx)}
                  className="flex-1 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check size={14} className="text-[#34C759]" />
                      <span className="text-[#34C759]">Tersalin ke Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin No. Rekening</span>
                    </>
                  )}
                </button>

                {bank.isQris && bank.qrisImage && (
                  <button
                    type="button"
                    onClick={() => setShowQrisModal(bank.qrisImage || null)}
                    className="py-2 px-3 rounded-xl bg-[#007AFF] hover:bg-[#0062CC] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Buka QRIS"
                  >
                    <QrCode size={14} />
                    <span>QRIS</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-[28px] bg-white/80 dark:bg-[#1C1C1E]/80 p-5 text-center text-neutral-500 text-xs">
            Informasi amplop digital belum diatur.
          </div>
        )}
      </div>

      {/* QRIS Modal Overlay */}
      {showQrisModal && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowQrisModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-6 max-w-sm w-full text-center border border-white/20 shadow-2xl"
          >
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3">
              QRIS Pembayaran Digital
            </h3>
            <div className="w-56 h-56 mx-auto rounded-2xl overflow-hidden bg-white p-2 border border-neutral-200">
              <img
                src={showQrisModal}
                alt="QRIS Digital Gift"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowQrisModal(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup QRIS
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};
