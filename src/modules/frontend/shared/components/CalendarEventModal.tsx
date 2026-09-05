import React, { useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, ExternalLink, Download, X, Bell, CheckCircle2,
  Share2
} from 'lucide-react';
import { EventDetail, WeddingConfig } from '../../../../types';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../../../../lib/calendar';

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetail | null;
  weddingConfig: WeddingConfig;
}

export function CalendarEventModal({ isOpen, onClose, event, weddingConfig }: CalendarEventModalProps) {
  // Prevent background scrolling and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const googleCalendarUrl = generateGoogleCalendarUrl(event, weddingConfig);

  const handleDownloadIcs = () => {
    downloadIcsFile(event, weddingConfig);
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-800/80 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Calendar size={20} />
            </div>
            <div>
              <h3 id="calendar-modal-title" className="text-base font-bold text-white tracking-wide">
                Simpan ke Kalender
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Pilih aplikasi kalender favorit di perangkat Anda
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/80 transition-colors cursor-pointer"
            aria-label="Tutup Dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Event Preview Summary Card */}
          <div className="bg-stone-950/70 border border-stone-800/90 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {event.title}
              </span>
              <span className="text-[11px] text-stone-400 font-medium flex items-center gap-1">
                <Bell size={12} className="text-amber-400" />
                <span>Alarm H-1 & H-1 Jam</span>
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 text-stone-300">
                <Calendar size={14} className="text-stone-400 mt-0.5 shrink-0" />
                <span>
                  <strong>{event.day}</strong>, {event.date}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-300">
                <Clock size={14} className="text-stone-400 mt-0.5 shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-start gap-2.5 text-stone-300">
                <MapPin size={14} className="text-stone-400 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-white">{event.venue}</div>
                  <div className="text-[11px] text-stone-400 leading-relaxed mt-0.5 line-clamp-2">
                    {event.address}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Options */}
          <div className="space-y-2.5">
            {/* Option 1: Google Calendar */}
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/70 hover:border-blue-500/50 text-white transition-all group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ExternalLink size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                    Buka di Google Calendar
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Otomatis sinkron ke akun Google di browser / HP
                  </div>
                </div>
              </div>
              <span className="text-stone-500 group-hover:text-stone-300 transition-colors text-xs font-semibold">
                Buka &rarr;
              </span>
            </a>

            {/* Option 2: Apple Calendar / iCal (.ics) */}
            <button
              type="button"
              onClick={() => {
                handleDownloadIcs();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/80 hover:bg-stone-800 border border-stone-700/70 hover:border-amber-500/50 text-white transition-all group cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Download size={18} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Apple Calendar / iCal (.ics)
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Unduh file untuk iPhone, iPad, Mac & Outlook
                  </div>
                </div>
              </div>
              <span className="text-stone-500 group-hover:text-stone-300 transition-colors text-xs font-semibold">
                Unduh &darr;
              </span>
            </button>

            {/* Option 3: Petunjuk Rute Google Maps (Opsional jika mapUrl tersedia) */}
            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-800/40 hover:bg-stone-800/70 border border-stone-700/50 hover:border-emerald-500/40 text-white transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Petunjuk Arah (Google Maps)
                    </div>
                    <div className="text-[11px] text-stone-400">
                      Buka rute navigasi perjalanan ke venue
                    </div>
                  </div>
                </div>
                <span className="text-stone-500 group-hover:text-stone-300 transition-colors text-xs font-semibold">
                  Rute &rarr;
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800/80 bg-stone-950/40 flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Format iCalendar RFC 5545</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white font-medium hover:underline transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
