import { useState } from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { useThemeTokens } from '../../themes';
import { Map, Armchair } from 'lucide-react';
import { GuestSeatingLookupModal } from '../components/GuestSeatingLookupModal';
import { cn } from '../../../../utils/cn';

export function LocationSection() {
  const { weddingConfig } = useWeddingConfig();
  const { tokens, isDark } = useThemeTokens();
  const [isSeatingModalOpen, setIsSeatingModalOpen] = useState(false);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const guestNameFromUrl = searchParams ? searchParams.get('to') || '' : '';

  return (
    <section 
      className="py-20 px-6 text-center transition-colors duration-500"
      style={{ backgroundColor: tokens.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h3 
          className="font-heading text-3xl mb-8 font-bold"
          style={{ color: tokens.textPrimary }}
        >
          Lokasi Acara
        </h3>
        
        <div 
          className={cn(
            "p-2.5 rounded-[24px] mb-6 overflow-hidden transition-all duration-300",
            isDark ? "shadow-2xl shadow-black/80" : "shadow-sm"
          )}
          style={{
            backgroundColor: tokens.cardBg,
            border: `1px solid ${tokens.cardBorder}`
          }}
        >
          <div className="rounded-[16px] overflow-hidden w-full h-[300px] bg-black/10 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126907.08639207855!2d106.7441865!3d-6.229728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              className="absolute inset-0"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a 
            href={weddingConfig.events.resepsi.mapUrl || "#"}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full text-[13px] font-medium tracking-wide transition-all shadow-sm"
            style={{
              backgroundColor: tokens.cardBg,
              border: `1px solid ${tokens.cardBorder}`,
              color: tokens.textPrimary
            }}
          >
            <Map size={16} style={{ color: tokens.accent }} />
            Buka Google Maps
          </a>

          <button
            type="button"
            onClick={() => setIsSeatingModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 py-3.5 px-7 rounded-full text-[13px] font-semibold tracking-wide transition-all shadow-md cursor-pointer hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: tokens.primary,
              color: tokens.btnPrimaryText
            }}
          >
            <Armchair size={16} />
            Cari Meja & Denah Anda
          </button>
        </div>
      </motion.div>

      {/* Guest Seating Lookup Modal */}
      <GuestSeatingLookupModal
        isOpen={isSeatingModalOpen}
        onClose={() => setIsSeatingModalOpen(false)}
        defaultGuestName={guestNameFromUrl}
      />
    </section>
  );
}
