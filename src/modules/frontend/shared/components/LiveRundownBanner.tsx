import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ChevronRight, X, Clock, MapPin, Sparkles, Calendar } from 'lucide-react';
import { useWeddingConfig } from '../../../../context/WeddingContext';
import { socket } from '../../../../services/socket';
import { LiveRundownStatus, RundownScheduleItem } from '../../../../types';

export const LiveRundownBanner: React.FC = () => {
  const { weddingConfig } = useWeddingConfig();
  const [liveStatus, setLiveStatus] = useState<LiveRundownStatus>(
    weddingConfig.liveRundown || {
      isActive: false,
      currentEvent: 'Akad Nikah & Ijab Qabul',
      customNote: '',
    }
  );
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  // Sync with weddingConfig updates
  useEffect(() => {
    if (weddingConfig.liveRundown) {
      setLiveStatus(weddingConfig.liveRundown);
    }
  }, [weddingConfig.liveRundown]);

  // Realtime Socket.io listener for instant broadcast
  useEffect(() => {
    const handleRundownUpdate = (updated: LiveRundownStatus) => {
      setLiveStatus(updated);
    };

    socket.on('rundown:updated', handleRundownUpdate);
    return () => {
      socket.off('rundown:updated', handleRundownUpdate);
    };
  }, []);

  const schedule: RundownScheduleItem[] = weddingConfig.rundownSchedule || [
    { id: 'rd-1', time: '08:30 - 09:00', title: 'Penyambutan Tamu & Keluarga', description: 'Registrasi buku tamu digital di meja resepsi', zone: 'Lobi Utama' },
    { id: 'rd-2', time: '09:00 - 10:30', title: 'Akad Nikah & Ijab Qabul', description: 'Prosesi ijab qabul dan doa bersama keluarga inti', zone: 'Area Akad' },
    { id: 'rd-3', time: '11:00 - 12:30', title: 'Prosesi Adat & Temu Pengantin', description: 'Upacara adat budaya dan sungkeman kedua orang tua', zone: 'Pelaminan' },
    { id: 'rd-4', time: '12:30 - 14:00', title: 'Ramah Tamah & Prasmanan Resepsi', description: 'Santap siang prasmanan dan hiburan musik pengiring', zone: 'Ballroom' },
    { id: 'rd-5', time: '14:00 - 15:00', title: 'Sesi Foto Bersama & Penutupan', description: 'Sesi foto VIP, rekan kerja, dan sahabat mempelai', zone: 'Panggung Utama' },
  ];

  if (!liveStatus.isActive) return null;

  return (
    <>
      {/* Floating Pill Banner at Top Center */}
      <motion.aside
        aria-label="Live Wedding Rundown"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 260 }}
        className="fixed top-3 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <button
          type="button"
          onClick={() => setIsOpenDrawer(true)}
          className="pointer-events-auto max-w-sm w-full bg-stone-900/90 hover:bg-stone-900 text-stone-100 backdrop-blur-md px-3.5 py-2 rounded-full border border-amber-500/50 shadow-xl flex items-center justify-between gap-2.5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Live blinking badge */}
            <span className="inline-flex items-center gap-1 bg-red-600/90 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shrink-0 shadow-xs shadow-red-500/50">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </span>

            {/* Current Event Text */}
            <div className="text-left truncate">
              <span className="text-[11px] font-bold text-amber-200 block truncate group-hover:text-amber-300 transition-colors">
                {liveStatus.currentEvent}
              </span>
              {liveStatus.customNote ? (
                <span className="text-[9px] text-stone-400 block truncate">
                  {liveStatus.customNote}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-amber-400 shrink-0 font-medium">
            <span className="hidden xs:inline">Rundown</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </motion.aside>

      {/* Full Rundown Drawer / Modal */}
      <AnimatePresence>
        {isOpenDrawer && (
          <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md my-auto bg-stone-900 text-stone-100 rounded-3xl border border-amber-500/40 shadow-2xl p-6 overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                    <Radio size={16} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-amber-300 tracking-wide uppercase">
                      Live Wedding Rundown
                    </h3>
                    <p className="text-[10px] text-stone-400">
                      Jadwal Siaran Langsung Acara Hari-H
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpenDrawer(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Active Event Highlight Card */}
              <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/70 via-stone-800/80 to-stone-900 border border-amber-500/40 shrink-0">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Sedang Berlangsung Saat Ini</span>
                </div>
                <h4 className="text-base font-bold text-amber-200">
                  {liveStatus.currentEvent}
                </h4>
                {liveStatus.customNote ? (
                  <p className="text-xs text-stone-300 mt-1 italic">
                    "{liveStatus.customNote}"
                  </p>
                ) : null}
              </div>

              {/* Timeline Items List */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar my-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Susunan Rundown Acara Lengkap:
                </span>
                {schedule.map((item, idx) => {
                  const isCurrent = item.title.toLowerCase().trim() === liveStatus.currentEvent.toLowerCase().trim();

                  return (
                    <div
                      key={item.id || idx}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500 text-amber-100 shadow-md shadow-amber-900/20'
                          : 'bg-stone-800/60 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isCurrent && <Sparkles size={13} className="text-amber-400 animate-spin" />}
                          {item.title}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                          isCurrent ? 'bg-amber-500 text-stone-900' : 'bg-stone-700 text-stone-300'
                        }`}>
                          {item.time}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {item.description}
                        </p>
                      ) : null}
                      {item.zone ? (
                        <div className="flex items-center gap-1 text-[10px] text-amber-400/80 mt-1.5">
                          <MapPin size={11} />
                          <span>Lokasi: {item.zone}</span>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-stone-800 shrink-0 text-center">
                <button
                  type="button"
                  onClick={() => setIsOpenDrawer(false)}
                  className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Tutup Rundown
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
