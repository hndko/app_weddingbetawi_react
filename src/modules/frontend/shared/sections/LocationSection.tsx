import { useState } from 'react';
import { motion } from 'motion/react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { Map, Armchair } from 'lucide-react';
import { GuestSeatingLookupModal } from '../components/GuestSeatingLookupModal';

export function LocationSection() {
  const { weddingConfig } = useWeddingConfig();
  const [isSeatingModalOpen, setIsSeatingModalOpen] = useState(false);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const guestNameFromUrl = searchParams ? searchParams.get('to') || '' : '';

  return (
    <section className="py-20 px-6 bg-ivory text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="font-heading text-3xl text-text-dark mb-8">Lokasi Acara</h3>
        
        <div className="bg-white p-2 rounded-[24px] shadow-sm mb-6 overflow-hidden">
          <div className="rounded-[16px] overflow-hidden w-full h-[300px] bg-light-gray relative">
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
            ></iframe>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a 
            href={weddingConfig.events.resepsi.mapUrl || "#"}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-sage-dark border border-sage/40 py-3.5 px-7 rounded-full text-[13px] font-medium tracking-wide hover:bg-sage-50 transition-colors shadow-sm"
          >
            <Map size={16} />
            Buka Google Maps
          </a>

          <button
            type="button"
            onClick={() => setIsSeatingModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 px-7 rounded-full text-[13px] font-semibold tracking-wide hover:from-amber-700 hover:to-amber-800 transition-all shadow-sm cursor-pointer"
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
