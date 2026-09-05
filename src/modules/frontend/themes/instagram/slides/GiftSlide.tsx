import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Copy, Check, QrCode, Sparkles } from 'lucide-react';
import { useWeddingConfig } from '../../../../../context/WeddingContext';
import { playHeartChime } from '../utils/instagramAudio';

export const GiftSlide: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const { banks } = weddingConfig;
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [qrisModal, setQrisModal] = useState<string | null>(null);

  const handleCopy = async (account: string, index: number) => {
    try {
      await navigator.clipboard.writeText(account);
      playHeartChime();
      setCopiedIdx(index);
      setTimeout(() => setCopiedIdx(null), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-5 text-white select-none bg-gradient-to-b from-[#181818] via-[#121212] to-[#0A0A0A] overflow-y-auto no-scrollbar">
      {/* Top Header Tag */}
      <div className="relative z-10 pt-10 text-center">
        <span className="text-[10px] tracking-[0.25em] font-extrabold uppercase text-[#FFD600] bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
          DIGITAL GIFT • TANDA KASIH
        </span>
      </div>

      {/* Center Gift Cards */}
      <div className="relative z-10 my-auto flex flex-col gap-3 max-w-[320px] mx-auto w-full py-3">
        <p className="text-[11px] text-white/70 text-center px-2 mb-1">
          Doa restu Anda adalah kado terindah bagi kami. Bagi yang berkenan memberikan tanda kasih:
        </p>

        {banks && banks.length > 0 ? (
          banks.map((bank, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-4 shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-white">
                  {bank.name}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/15 font-bold uppercase text-white/80">
                  Transfer Bank
                </span>
              </div>

              <div className="my-2">
                <p className="font-mono text-base font-bold tracking-widest text-white">
                  {bank.account}
                </p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  a.n {bank.holder}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleCopy(bank.account, idx)}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF0069] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check size={14} className="text-white" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin Rekening</span>
                    </>
                  )}
                </button>

                {bank.isQris && bank.qrisImage && (
                  <button
                    type="button"
                    onClick={() => setQrisModal(bank.qrisImage || null)}
                    className="py-1.5 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <QrCode size={14} />
                    <span>QRIS</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-2xl bg-white/5 p-4 text-center text-xs text-white/60">
            Rekening tanda kasih belum diatur.
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pb-8 text-center">
        <span className="text-[10px] text-white/60">
          Ketuk kanan untuk konfirmasi RSVP &amp; Doa
        </span>
      </div>

      {/* QRIS Modal */}
      {qrisModal && (
        <div
          className="fixed inset-0 w-screen h-screen z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setQrisModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-900 border border-white/20 rounded-3xl p-5 max-w-xs w-full text-center"
          >
            <h4 className="text-sm font-bold text-white mb-3">QRIS Tanda Kasih</h4>
            <div className="w-52 h-52 mx-auto bg-white rounded-2xl p-2">
              <img src={qrisModal} alt="QRIS" className="w-full h-full object-contain" />
            </div>
            <button
              type="button"
              onClick={() => setQrisModal(null)}
              className="mt-4 w-full py-2 rounded-xl bg-white text-neutral-900 text-xs font-bold cursor-pointer"
            >
              Tutup QRIS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
