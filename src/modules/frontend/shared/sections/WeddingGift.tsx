import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../../utils/cn';

export function WeddingGift() {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                style={{ color: tokens.accent }}
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
                    onClick={() => handleCopy(bank.account)}
                    className="w-full py-3.5 rounded-full text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-98"
                    style={{
                      backgroundColor: tokens.primary,
                      color: tokens.btnPrimaryText
                    }}
                  >
                    <Copy size={16} />
                    SALIN NOMOR REKENING
                  </button>
                </>
              )}
            </div>
          ))}
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
            Nomor rekening berhasil disalin
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
