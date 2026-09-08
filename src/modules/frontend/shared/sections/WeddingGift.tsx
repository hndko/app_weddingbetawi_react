import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { Copy, CheckCircle2, Gift, MapPin, Phone, User as UserIcon } from 'lucide-react';
import { cn } from '../../../../utils/cn';

export function WeddingGift() {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();
  const [copied, setCopied] = useState(false);
  const [copyToastText, setCopyToastText] = useState('Nomor rekening berhasil disalin');

  const handleCopy = (text: string, toastLabel = 'Nomor rekening berhasil disalin') => {
    navigator.clipboard.writeText(text);
    setCopyToastText(toastLabel);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const banks = weddingConfig.banks || (weddingConfig.bank ? [weddingConfig.bank] : []);

  return (
    <section 
      className="py-24 px-6 text-center relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 
          className="font-heading text-4xl mb-6 font-bold"
          style={{ color: tokens.textPrimary }}
        >
          Wedding Gift
        </h3>
        <p 
          className="text-xs max-w-[280px] mx-auto leading-relaxed mb-10"
          style={{ color: tokens.textMuted }}
        >
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun apabila memberi adalah ungkapan tanda kasih, Anda dapat memberikan hadiah secara cashless.
        </p>

        <div className="flex flex-col gap-6 max-w-[340px] mx-auto">
          {banks.map((bank, index) => (
            <div 
              key={index} 
              className={cn(
                "rounded-[28px] p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300",
                isDark ? "shadow-2xl shadow-black/80" : "shadow-sm"
              )}
              style={{
                backgroundColor: tokens.cardBg,
                border: `1px solid ${tokens.cardBorder}`
              }}
            >
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] pointer-events-none opacity-10"
                style={{ backgroundColor: tokens.accent }}
              />
              
              <h4 
                className="font-heading text-xl font-bold mb-4"
                style={{ color: tokens.isDark ? tokens.accent : tokens.primary }}
              >
                {bank.name}
              </h4>
              
              {bank.isQris && bank.qrisImage ? (
                <div className="mb-6 flex justify-center">
                  <img 
                    src={bank.qrisImage} 
                    alt={`QRIS ${bank.name}`} 
                    className="w-48 h-48 object-contain rounded-2xl bg-white p-2 border" 
                    style={{ borderColor: tokens.cardBorder }}
                  />
                </div>
              ) : null}

              {(!bank.isQris || bank.account !== '-') && (
                <>
                  <p 
                    className="text-2xl font-body font-bold tracking-wider mb-2"
                    style={{ color: tokens.textPrimary }}
                  >
                    {bank.account}
                  </p>
                  <p 
                    className="text-xs uppercase tracking-widest mb-8 font-medium"
                    style={{ color: tokens.textMuted }}
                  >
                    a.n. {bank.holder}
                  </p>
                  
                    <button 
                    type="button"
                    onClick={() => handleCopy(bank.account, `Nomor rekening ${bank.name} berhasil disalin`)}
                    aria-label={`Salin nomor rekening ${bank.name} ${bank.account}`}
                    className="w-full py-3.5 rounded-full text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-98 focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                    style={{
                      backgroundColor: tokens.primary,
                      color: tokens.btnPrimaryText
                    }}
                  >
                    <Copy size={16} aria-hidden="true" />
                    SALIN NOMOR REKENING
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Physical Gift / Kirim Kado Fisik Card */}
          {weddingConfig.physicalGift?.enabled && (
            <div 
              className={cn(
                "rounded-[28px] p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300 text-left",
                isDark ? "shadow-2xl shadow-black/80" : "shadow-sm"
              )}
              style={{
                backgroundColor: tokens.cardBg,
                border: `1px solid ${tokens.cardBorder}`
              }}
            >
              <div 
                className="absolute top-0 right-0 w-24 h-24 rounded-bl-[100px] pointer-events-none opacity-10"
                style={{ backgroundColor: tokens.accent }}
              />

              <div className="flex items-center gap-2.5 mb-4">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${tokens.primary}20`,
                    color: tokens.primary
                  }}
                >
                  <Gift size={18} />
                </div>
                <div>
                  <h4 
                    className="font-heading text-lg font-bold"
                    style={{ color: tokens.isDark ? tokens.accent : tokens.primary }}
                  >
                    Kirim Kado Fisik
                  </h4>
                  <p className="text-[11px] font-medium" style={{ color: tokens.textMuted }}>
                    Alamat Pengiriman Hadiah
                  </p>
                </div>
              </div>

              {weddingConfig.physicalGift.recipientName && (
                <div className="flex items-start gap-2 text-xs mb-2.5" style={{ color: tokens.textPrimary }}>
                  <UserIcon size={14} className="shrink-0 mt-0.5 opacity-70" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider block font-semibold" style={{ color: tokens.textMuted }}>Penerima</span>
                    <span className="font-semibold">{weddingConfig.physicalGift.recipientName}</span>
                  </div>
                </div>
              )}

              {weddingConfig.physicalGift.phone && (
                <div className="flex items-start gap-2 text-xs mb-2.5" style={{ color: tokens.textPrimary }}>
                  <Phone size={14} className="shrink-0 mt-0.5 opacity-70" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider block font-semibold" style={{ color: tokens.textMuted }}>Telepon / WhatsApp</span>
                    <span>{weddingConfig.physicalGift.phone}</span>
                  </div>
                </div>
              )}

              {weddingConfig.physicalGift.address && (
                <div className="flex items-start gap-2 text-xs mb-3" style={{ color: tokens.textPrimary }}>
                  <MapPin size={14} className="shrink-0 mt-0.5 opacity-70" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider block font-semibold" style={{ color: tokens.textMuted }}>Alamat Lengkap</span>
                    <p className="leading-relaxed whitespace-pre-line mt-0.5">{weddingConfig.physicalGift.address}</p>
                  </div>
                </div>
              )}

              {weddingConfig.physicalGift.notes && (
                <div 
                  className="p-3 rounded-xl text-[11px] mb-6 leading-relaxed"
                  style={{
                    backgroundColor: `${tokens.cardBorder}40`,
                    color: tokens.textMuted
                  }}
                >
                  <span className="font-semibold">Catatan Kurir: </span>
                  {weddingConfig.physicalGift.notes}
                </div>
              )}

              {weddingConfig.physicalGift.address && (
                <button 
                  type="button"
                  onClick={() => handleCopy(
                    `${weddingConfig.physicalGift?.recipientName ? `Penerima: ${weddingConfig.physicalGift.recipientName}\n` : ''}${weddingConfig.physicalGift?.phone ? `No. HP: ${weddingConfig.physicalGift.phone}\n` : ''}Alamat:\n${weddingConfig.physicalGift?.address}${weddingConfig.physicalGift?.notes ? `\n(Catatan: ${weddingConfig.physicalGift.notes})` : ''}`,
                    'Alamat pengiriman kado berhasil disalin'
                  )}
                  aria-label="Salin alamat lengkap pengiriman kado"
                  className="w-full py-3.5 rounded-full text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-98 focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                  style={{
                    backgroundColor: tokens.primary,
                    color: tokens.btnPrimaryText
                  }}
                >
                  <Copy size={16} aria-hidden="true" />
                  SALIN ALAMAT LENGKAP
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-[140px] left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-[13px] flex items-center gap-2 shadow-2xl z-50 whitespace-nowrap"
            style={{
              backgroundColor: tokens.isDark ? '#222222' : '#292925',
              color: '#FFFFFF',
              border: `1px solid ${tokens.cardBorder}`
            }}
          >
            <CheckCircle2 size={16} style={{ color: tokens.accent }} />
            {copyToastText}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
