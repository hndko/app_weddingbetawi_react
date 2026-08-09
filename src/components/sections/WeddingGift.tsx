import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useWeddingConfig } from '../../context/WeddingContext';
import { Copy, CheckCircle2 } from 'lucide-react';

export function WeddingGift() {
  const { weddingConfig } = useWeddingConfig();
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const banks = weddingConfig.banks || (weddingConfig.bank ? [weddingConfig.bank] : []);

  return (
    <section className="py-24 px-6 bg-warm-white text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="font-heading text-4xl text-text-dark mb-6">Wedding Gift</h3>
        <p className="text-xs text-text-dark/70 max-w-[280px] mx-auto leading-relaxed mb-10">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun apabila memberi adalah ungkapan tanda kasih, Anda dapat memberikan hadiah secara cashless.
        </p>

        <div className="flex flex-col gap-6 max-w-[340px] mx-auto">
          {banks.map((bank, index) => (
            <div key={index} className="bg-white rounded-[24px] p-8 border border-sage/10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sage/5 rounded-bl-[100px] pointer-events-none"></div>
              
              <h4 className="font-heading text-xl text-sage-dark mb-4">{bank.name}</h4>
              
              {bank.isQris && bank.qrisImage ? (
                <div className="mb-6 flex justify-center">
                  <img src={bank.qrisImage} alt={`QRIS ${bank.name}`} className="w-48 h-48 object-contain rounded-xl border border-gray-100" />
                </div>
              ) : null}

              {(!bank.isQris || bank.account !== '-') && (
                <>
                  <p className="text-2xl font-body font-medium text-text-dark tracking-wider mb-2">{bank.account}</p>
                  <p className="text-xs text-text-dark/60 uppercase tracking-widest mb-8">a.n. {bank.holder}</p>
                  
                  <button 
                    onClick={() => handleCopy(bank.account)}
                    className="w-full bg-sage-50 text-sage-dark border border-sage/30 py-3.5 rounded-full text-[13px] font-medium tracking-wide flex items-center justify-center gap-2 hover:bg-sage hover:text-white transition-colors"
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
            className="fixed bottom-[140px] left-1/2 -translate-x-1/2 bg-text-dark text-white px-6 py-3 rounded-full text-[13px] flex items-center gap-2 shadow-lg z-50 whitespace-nowrap"
          >
            <CheckCircle2 size={16} className="text-sage-soft" />
            Nomor rekening berhasil disalin
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
