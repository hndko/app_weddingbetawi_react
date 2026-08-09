import { useState } from 'react';
import { Copy, Check, X, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

export function LinkGenerator() {
  const [isOpen, setIsOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [copied, setCopied] = useState(false);

  const currentUrl = window.location.origin + window.location.pathname;
  const generatedLink = guestName ? `${currentUrl}?to=${encodeURIComponent(guestName)}` : currentUrl;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <>
      {/* Admin Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[100] bg-gray-900/80 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        aria-label="Generate Link"
      >
        <LinkIcon size={20} />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-heading text-text-dark mb-4">Generate Link Undangan</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Nama Tamu</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Contoh: Bapak Budi & Keluarga"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-1">Link (Preview)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-xs text-gray-500 overflow-hidden text-ellipsis"
                  />
                  <button
                    onClick={handleCopy}
                    className="shrink-0 bg-sage text-white px-3 py-2 rounded-lg hover:bg-sage-dark transition-colors flex items-center justify-center"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Masukkan nama tamu untuk membuat link undangan dengan parameter ?to=
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
