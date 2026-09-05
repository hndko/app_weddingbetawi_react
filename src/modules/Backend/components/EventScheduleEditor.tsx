import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Building, MapPin, Link as LinkIcon, 
  Sparkles, SlidersHorizontal, Check, Copy, CheckCircle2
} from 'lucide-react';
import { WeddingConfig } from '../../../types';

export const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const INDONESIAN_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export const formatYmdToIndonesian = (ymd: string) => {
  if (!ymd) return null;
  const parts = ymd.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const d = new Date(year, month, day);
  if (isNaN(d.getTime())) return null;

  const dayName = INDONESIAN_DAYS[d.getDay()];
  const dateFormatted = `${day} ${INDONESIAN_MONTHS[month]} ${year}`;
  const fullDateStr = `${dayName}, ${dateFormatted}`;

  return { dayName, dateFormatted, fullDateStr, ymd };
};

export const indonesianDateToYmd = (indoDateStr: string): string => {
  if (!indoDateStr) return '';
  const trimmed = indoDateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const withoutDay = trimmed.replace(/^[A-Za-z]+,\s*/, '').trim();
  const parts = withoutDay.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const monthIdx = INDONESIAN_MONTHS.findIndex(m => m.toLowerCase() === monthName);
    if (monthIdx !== -1 && !isNaN(day) && !isNaN(year)) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${year}-${pad(monthIdx + 1)}-${pad(day)}`;
    }
  }
  return '';
};

export const isoToDatetimeLocal = (iso: string): string => {
  if (!iso) return '';
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);
  if (match) {
    return `${match[1]}T${match[2]}`;
  }
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const datetimeLocalToIso = (localStr: string, tzOffset: string = '+07:00'): string => {
  if (!localStr) return '';
  return `${localStr}:00${tzOffset}`;
};

export interface ParsedTimeState {
  startTime: string;
  endTime: string;
  isUntilFinished: boolean;
  timezone: 'WIB' | 'WITA' | 'WIT';
  isCustomManual: boolean;
}

export const parseTimeString = (timeStr: string): ParsedTimeState => {
  const defaultState: ParsedTimeState = {
    startTime: '08:00',
    endTime: '10:00',
    isUntilFinished: false,
    timezone: 'WIB',
    isCustomManual: false,
  };
  if (!timeStr) return defaultState;

  let tz: 'WIB' | 'WITA' | 'WIT' = 'WIB';
  if (timeStr.includes('WITA')) tz = 'WITA';
  else if (timeStr.includes('WIT')) tz = 'WIT';

  const isUntil = /selesai/i.test(timeStr);
  const matches = timeStr.match(/(\d{1,2})[.:](\d{2})/g);

  if (!matches || matches.length === 0) {
    return {
      ...defaultState,
      isCustomManual: true,
    };
  }

  const padTime = (t: string) => {
    const parts = t.split(/[.:]/);
    return `${parts[0].padStart(2, '0')}:${parts[1]}`;
  };

  const start = padTime(matches[0]);
  let end = '10:00';
  if (matches.length >= 2 && !isUntil) {
    end = padTime(matches[1]);
  }

  return {
    startTime: start,
    endTime: end,
    isUntilFinished: isUntil,
    timezone: tz,
    isCustomManual: false,
  };
};

export const formatTimeToString = (
  startTime: string,
  endTime: string,
  isUntilFinished: boolean,
  timezone: string
): string => {
  if (!startTime) return '';
  if (isUntilFinished) {
    return `${startTime} ${timezone} - Selesai`;
  }
  if (endTime) {
    return `${startTime} - ${endTime} ${timezone}`;
  }
  return `${startTime} ${timezone}`;
};

export interface EventScheduleEditorProps {
  formData: WeddingConfig;
  setFormData: React.Dispatch<React.SetStateAction<WeddingConfig>>;
  showToast: (type: 'success' | 'error', message: string) => void;
}

export function EventScheduleEditor({ formData, setFormData, showToast }: EventScheduleEditorProps) {
  // Local state for interactive time controls
  const [akadTimeState, setAkadTimeState] = useState<ParsedTimeState>(() => 
    parseTimeString(formData.events.akad.time)
  );
  const [resepsiTimeState, setResepsiTimeState] = useState<ParsedTimeState>(() => 
    parseTimeString(formData.events.resepsi.time)
  );

  // Manual customization toggles
  const [showAkadCustomDate, setShowAkadCustomDate] = useState(false);
  const [showResepsiCustomDate, setShowResepsiCustomDate] = useState(false);
  const [copiedIso, setCopiedIso] = useState(false);

  // Synchronize time state when formData from props updates externally
  useEffect(() => {
    setAkadTimeState(parseTimeString(formData.events.akad.time));
  }, [formData.events.akad.time]);

  useEffect(() => {
    setResepsiTimeState(parseTimeString(formData.events.resepsi.time));
  }, [formData.events.resepsi.time]);

  // Handle Target Countdown Change
  const handleCountdownChange = (datetimeLocalVal: string) => {
    const newIso = datetimeLocalToIso(datetimeLocalVal, '+07:00');
    setFormData(prev => ({
      ...prev,
      dateISO: newIso
    }));
  };

  // Sync Countdown Target to dateStr and Akad
  const handleApplyCountdownToAll = () => {
    const localVal = isoToDatetimeLocal(formData.dateISO);
    if (!localVal) {
      showToast('error', 'Pilih tanggal countdown terlebih dahulu!');
      return;
    }
    const [datePart, timePart] = localVal.split('T');
    const indoInfo = formatYmdToIndonesian(datePart);
    if (!indoInfo) {
      showToast('error', 'Format tanggal tidak valid');
      return;
    }

    const formattedTime = timePart ? `${timePart} - 10:00 WIB` : '08:00 - 10:00 WIB';

    setFormData(prev => ({
      ...prev,
      dateStr: indoInfo.fullDateStr,
      events: {
        ...prev.events,
        akad: {
          ...prev.events.akad,
          day: indoInfo.dayName,
          date: indoInfo.dateFormatted,
          time: formattedTime
        }
      }
    }));

    showToast('success', 'Tanggal Tampil & Jadwal Akad berhasil diselaraskan dengan Countdown!');
  };

  // Handle Akad Date Change
  const handleAkadDateChange = (ymd: string) => {
    const indoInfo = formatYmdToIndonesian(ymd);
    if (indoInfo) {
      setFormData(prev => ({
        ...prev,
        events: {
          ...prev.events,
          akad: {
            ...prev.events.akad,
            day: indoInfo.dayName,
            date: indoInfo.dateFormatted
          }
        }
      }));
    }
  };

  // Handle Resepsi Date Change
  const handleResepsiDateChange = (ymd: string) => {
    const indoInfo = formatYmdToIndonesian(ymd);
    if (indoInfo) {
      setFormData(prev => ({
        ...prev,
        events: {
          ...prev.events,
          resepsi: {
            ...prev.events.resepsi,
            day: indoInfo.dayName,
            date: indoInfo.dateFormatted
          }
        }
      }));
    }
  };

  // Handle Akad Time Field Change
  const updateAkadTime = (updated: Partial<ParsedTimeState>) => {
    const next = { ...akadTimeState, ...updated };
    setAkadTimeState(next);
    if (!next.isCustomManual) {
      const formatted = formatTimeToString(next.startTime, next.endTime, next.isUntilFinished, next.timezone);
      setFormData(prev => ({
        ...prev,
        events: {
          ...prev.events,
          akad: {
            ...prev.events.akad,
            time: formatted
          }
        }
      }));
    }
  };

  // Handle Resepsi Time Field Change
  const updateResepsiTime = (updated: Partial<ParsedTimeState>) => {
    const next = { ...resepsiTimeState, ...updated };
    setResepsiTimeState(next);
    if (!next.isCustomManual) {
      const formatted = formatTimeToString(next.startTime, next.endTime, next.isUntilFinished, next.timezone);
      setFormData(prev => ({
        ...prev,
        events: {
          ...prev.events,
          resepsi: {
            ...prev.events.resepsi,
            time: formatted
          }
        }
      }));
    }
  };

  // Copy Akad Venue & Date to Resepsi
  const handleSyncResepsiWithAkad = () => {
    setFormData(prev => ({
      ...prev,
      events: {
        ...prev.events,
        resepsi: {
          ...prev.events.resepsi,
          day: prev.events.akad.day,
          date: prev.events.akad.date,
          venue: prev.events.akad.venue,
          address: prev.events.akad.address,
          mapUrl: prev.events.akad.mapUrl
        }
      }
    }));
    showToast('success', 'Tanggal dan Lokasi Resepsi berhasil disamakan dengan Akad!');
  };

  const handleCopyIso = () => {
    if (formData.dateISO) {
      navigator.clipboard.writeText(formData.dateISO);
      setCopiedIso(true);
      setTimeout(() => setCopiedIso(false), 2000);
      showToast('success', 'Format ISO berhasil disalin ke clipboard');
    }
  };

  const currentCountdownLocal = isoToDatetimeLocal(formData.dateISO);
  const akadDateYmd = indonesianDateToYmd(formData.events.akad.date);
  const resepsiDateYmd = indonesianDateToYmd(formData.events.resepsi.date);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h3 className="font-heading text-base font-bold text-text-dark flex items-center gap-2">
            <Calendar size={18} className="text-sage-dark" />
            <span>Jadwal Akad & Resepsi Pernikahan</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Konfigurasi waktu acara, target hitung mundur otomatis, dan pemetaan lokasi sesi pernikahan.
          </p>
        </div>
      </div>

      {/* SECTION 1: COUNTDOWN TARGET & TANGGAL UTAMA */}
      <div className="p-5 bg-sage-50/40 border border-sage-200/60 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sage-200/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sage/20 text-sage-dark flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-sage-dark uppercase tracking-wider">
                Target Countdown & Tanggal Tampil Utama
              </h4>
              <p className="text-[11px] text-gray-500">
                Menentukan waktu kalkulasi live countdown pada banner dan penanggalan cover undangan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleApplyCountdownToAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sage/10 text-sage-dark border border-sage-300 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            title="Terapkan tanggal countdown ini ke Tanggal Tampil dan Jadwal Akad"
          >
            <Sparkles size={13} className="text-sage-dark" />
            <span>Salin ke Tanggal Tampil & Akad</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Target Countdown Picker */}
          <div>
            <label className="block text-gray-700 mb-1.5 font-semibold flex items-center justify-between">
              <span>Waktu Target Countdown (Kalender & Jam)</span>
              <span className="text-[10px] text-sage-dark bg-sage/10 px-2 py-0.5 rounded-full font-medium">
                WIB (UTC+7)
              </span>
            </label>
            <div className="relative flex items-center">
              <Clock className="absolute left-3 text-gray-400 pointer-events-none" size={16} />
              <input
                type="datetime-local"
                value={currentCountdownLocal}
                onChange={(e) => handleCountdownChange(e.target.value)}
                className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-sage shadow-xs cursor-pointer"
              />
            </div>
            {/* Raw ISO preview badge */}
            <div className="mt-2 flex items-center justify-between bg-white border border-gray-200/80 rounded-lg px-2.5 py-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-500 overflow-hidden text-ellipsis">
                <span className="font-semibold text-gray-700">ISO:</span>
                <code className="font-mono text-[10.5px] text-sage-dark truncate">
                  {formData.dateISO || '2026-09-20T08:00:00+07:00'}
                </code>
              </div>
              <button
                type="button"
                onClick={handleCopyIso}
                className="text-gray-400 hover:text-sage-dark p-1 rounded transition-colors cursor-pointer"
                title="Salin string ISO"
              >
                {copiedIso ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          {/* Format Tanggal Tampil */}
          <div>
            <label className="block text-gray-700 mb-1.5 font-semibold flex items-center justify-between">
              <span>Format Teks Tanggal Tampil</span>
              <span className="text-[10px] text-gray-400 font-normal">
                Ditampilkan di Cover & Hero
              </span>
            </label>
            <div className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <Calendar className="absolute left-3 text-gray-400 pointer-events-none" size={16} />
                <input
                  type="text"
                  value={formData.dateStr}
                  onChange={(e) => setFormData({ ...formData, dateStr: e.target.value })}
                  placeholder="Contoh: Minggu, 20 September 2026"
                  className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage shadow-xs"
                />
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 bg-white/70 p-2 rounded-lg border border-gray-200/60">
                <span className="text-gray-600 font-medium">Bantu pilih tanggal:</span>
                <input
                  type="date"
                  value={indonesianDateToYmd(formData.dateStr)}
                  onChange={(e) => {
                    const info = formatYmdToIndonesian(e.target.value);
                    if (info) {
                      setFormData(prev => ({ ...prev, dateStr: info.fullDateStr }));
                    }
                  }}
                  className="border border-gray-200 rounded px-2 py-0.5 text-xs bg-white focus:ring-1 focus:ring-sage cursor-pointer"
                  title="Pilih tanggal untuk memperbarui format teks di atas"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SESI AKAD NIKAH */}
      <div className="p-5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-amber-700" /> Sesi Akad Nikah
              </h4>
              <p className="text-[11px] text-gray-500">
                Pengaturan tanggal, waktu, dan tempat berlangsungnya prosesi ijab kabul.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} />
              <span>{formData.events.akad.day}, {formData.events.akad.date}</span>
            </span>
          </div>
        </div>

        {/* Date & Time Pickers for Akad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Tanggal Akad via Date Picker */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-sage-dark" />
                <span>Tanggal Acara Akad</span>
              </label>
              <button
                type="button"
                onClick={() => setShowAkadCustomDate(!showAkadCustomDate)}
                className="text-[11px] text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal size={12} />
                <span>{showAkadCustomDate ? 'Tutup Kustom' : 'Sunting Teks'}</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
              <input
                type="date"
                value={akadDateYmd}
                onChange={(e) => handleAkadDateChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-sage cursor-pointer"
              />
            </div>

            {/* Auto formatted preview chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px]">
                Hari: <strong className="text-gray-900">{formData.events.akad.day || 'Minggu'}</strong>
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px]">
                Tanggal: <strong className="text-gray-900">{formData.events.akad.date || '20 September 2026'}</strong>
              </span>
            </div>

            {/* Optional manual text fields for edge cases */}
            {showAkadCustomDate && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-200">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Nama Hari (Kustom)</label>
                  <input
                    type="text"
                    value={formData.events.akad.day}
                    onChange={(e) => setFormData({
                      ...formData,
                      events: { ...formData.events, akad: { ...formData.events.akad, day: e.target.value } }
                    })}
                    placeholder="Contoh: Minggu"
                    className="w-full border border-gray-200 rounded px-2 py-1 bg-white text-xs focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Format Tanggal (Kustom)</label>
                  <input
                    type="text"
                    value={formData.events.akad.date}
                    onChange={(e) => setFormData({
                      ...formData,
                      events: { ...formData.events, akad: { ...formData.events.akad, date: e.target.value } }
                    })}
                    placeholder="Contoh: 20 September 2026"
                    className="w-full border border-gray-200 rounded px-2 py-1 bg-white text-xs focus:ring-1 focus:ring-sage"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Jam Akad via Time Picker */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Clock size={14} className="text-sage-dark" />
                <span>Waktu / Jam Sesi Akad</span>
              </label>
              <button
                type="button"
                onClick={() => updateAkadTime({ isCustomManual: !akadTimeState.isCustomManual })}
                className="text-[11px] text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal size={12} />
                <span>{akadTimeState.isCustomManual ? 'Gunakan Picker' : 'Mode Teks Bebas'}</span>
              </button>
            </div>

            {!akadTimeState.isCustomManual ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      value={akadTimeState.startTime}
                      onChange={(e) => updateAkadTime({ startTime: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-sage cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Jam Selesai</label>
                    <input
                      type="time"
                      value={akadTimeState.endTime}
                      disabled={akadTimeState.isUntilFinished}
                      onChange={(e) => updateAkadTime({ endTime: e.target.value })}
                      className={`w-full border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-sage ${
                        akadTimeState.isUntilFinished ? 'opacity-40 cursor-not-allowed bg-gray-100' : 'cursor-pointer'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={akadTimeState.isUntilFinished}
                      onChange={(e) => updateAkadTime({ isUntilFinished: e.target.checked })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span>Sampai Selesai</span>
                  </label>

                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-gray-500">Zona:</span>
                    <select
                      value={akadTimeState.timezone}
                      onChange={(e) => updateAkadTime({ timezone: e.target.value as 'WIB' | 'WITA' | 'WIT' })}
                      className="border border-gray-300 rounded px-1.5 py-0.5 bg-white text-xs focus:ring-1 focus:ring-sage cursor-pointer"
                    >
                      <option value="WIB">WIB</option>
                      <option value="WITA">WITA</option>
                      <option value="WIT">WIT</option>
                    </select>
                  </div>
                </div>

                {/* Real-time formatted result */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Hasil Format:</span>
                  <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {formData.events.akad.time || '08:00 - 10:00 WIB'}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Teks Jam Bebas (Contoh: Ba'da Maghrib)</label>
                <input
                  type="text"
                  value={formData.events.akad.time}
                  onChange={(e) => setFormData({
                    ...formData,
                    events: { ...formData.events, akad: { ...formData.events.akad, time: e.target.value } }
                  })}
                  placeholder="Contoh: 08:00 - 10:00 WIB"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-xs focus:ring-1 focus:ring-sage"
                />
              </div>
            )}
          </div>
        </div>

        {/* Venue & Location for Akad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="relative flex items-center sm:col-span-2">
            <Building className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Nama Gedung / Masjid (Contoh: Masjid Raya Betawi)"
              value={formData.events.akad.venue}
              onChange={(e) => setFormData({
                ...formData,
                events: { ...formData.events, akad: { ...formData.events.akad, venue: e.target.value } }
              })}
              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-sage shadow-2xs"
            />
          </div>
          <div className="relative flex items-center sm:col-span-2">
            <MapPin className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Alamat Lengkap Venue (Contoh: Jl. Danau Sunter Barat No. 1, Jakarta Utara)"
              value={formData.events.akad.address}
              onChange={(e) => setFormData({
                ...formData,
                events: { ...formData.events, akad: { ...formData.events.akad, address: e.target.value } }
              })}
              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-sage shadow-2xs"
            />
          </div>
          <div className="relative flex items-center sm:col-span-2">
            <LinkIcon className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Link Google Maps (https://maps.app.goo.gl/...)"
              value={formData.events.akad.mapUrl}
              onChange={(e) => setFormData({
                ...formData,
                events: { ...formData.events, akad: { ...formData.events.akad, mapUrl: e.target.value } }
              })}
              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-sage font-mono text-[11px] shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: SESI RESEPSI PERNIKAHAN */}
      <div className="p-5 bg-gray-50/80 border border-gray-200 rounded-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-purple-700" /> Sesi Resepsi Pernikahan
              </h4>
              <p className="text-[11px] text-gray-500">
                Pengaturan tanggal, waktu jamuan, dan gedung perayaan pesta pernikahan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSyncResepsiWithAkad}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
            title="Salin tanggal, nama gedung, alamat, dan link maps dari Sesi Akad"
          >
            <Sparkles size={13} className="text-purple-600" />
            <span>Samakan Tanggal & Tempat dengan Akad</span>
          </button>
        </div>

        {/* Date & Time Pickers for Resepsi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Tanggal Resepsi via Date Picker */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-sage-dark" />
                <span>Tanggal Acara Resepsi</span>
              </label>
              <button
                type="button"
                onClick={() => setShowResepsiCustomDate(!showResepsiCustomDate)}
                className="text-[11px] text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal size={12} />
                <span>{showResepsiCustomDate ? 'Tutup Kustom' : 'Sunting Teks'}</span>
              </button>
            </div>

            <div className="relative flex items-center">
              <Calendar className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
              <input
                type="date"
                value={resepsiDateYmd}
                onChange={(e) => handleResepsiDateChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-sage cursor-pointer"
              />
            </div>

            {/* Auto formatted preview chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px]">
                Hari: <strong className="text-gray-900">{formData.events.resepsi.day || 'Minggu'}</strong>
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px]">
                Tanggal: <strong className="text-gray-900">{formData.events.resepsi.date || '20 September 2026'}</strong>
              </span>
            </div>

            {/* Optional manual text fields for edge cases */}
            {showResepsiCustomDate && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-200">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Nama Hari (Kustom)</label>
                  <input
                    type="text"
                    value={formData.events.resepsi.day}
                    onChange={(e) => setFormData({
                      ...formData,
                      events: { ...formData.events, resepsi: { ...formData.events.resepsi, day: e.target.value } }
                    })}
                    placeholder="Contoh: Minggu"
                    className="w-full border border-gray-200 rounded px-2 py-1 bg-white text-xs focus:ring-1 focus:ring-sage"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Format Tanggal (Kustom)</label>
                  <input
                    type="text"
                    value={formData.events.resepsi.date}
                    onChange={(e) => setFormData({
                      ...formData,
                      events: { ...formData.events, resepsi: { ...formData.events.resepsi, date: e.target.value } }
                    })}
                    placeholder="Contoh: 20 September 2026"
                    className="w-full border border-gray-200 rounded px-2 py-1 bg-white text-xs focus:ring-1 focus:ring-sage"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Jam Resepsi via Time Picker */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Clock size={14} className="text-sage-dark" />
                <span>Waktu / Jam Sesi Resepsi</span>
              </label>
              <button
                type="button"
                onClick={() => updateResepsiTime({ isCustomManual: !resepsiTimeState.isCustomManual })}
                className="text-[11px] text-sage-dark hover:underline flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal size={12} />
                <span>{resepsiTimeState.isCustomManual ? 'Gunakan Picker' : 'Mode Teks Bebas'}</span>
              </button>
            </div>

            {!resepsiTimeState.isCustomManual ? (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Jam Mulai</label>
                    <input
                      type="time"
                      value={resepsiTimeState.startTime}
                      onChange={(e) => updateResepsiTime({ startTime: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-sage cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Jam Selesai</label>
                    <input
                      type="time"
                      value={resepsiTimeState.endTime}
                      disabled={resepsiTimeState.isUntilFinished}
                      onChange={(e) => updateResepsiTime({ endTime: e.target.value })}
                      className={`w-full border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-medium focus:ring-1 focus:ring-sage ${
                        resepsiTimeState.isUntilFinished ? 'opacity-40 cursor-not-allowed bg-gray-100' : 'cursor-pointer'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-gray-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={resepsiTimeState.isUntilFinished}
                      onChange={(e) => updateResepsiTime({ isUntilFinished: e.target.checked })}
                      className="rounded text-sage focus:ring-sage"
                    />
                    <span>Sampai Selesai</span>
                  </label>

                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-gray-500">Zona:</span>
                    <select
                      value={resepsiTimeState.timezone}
                      onChange={(e) => updateResepsiTime({ timezone: e.target.value as 'WIB' | 'WITA' | 'WIT' })}
                      className="border border-gray-300 rounded px-1.5 py-0.5 bg-white text-xs focus:ring-1 focus:ring-sage cursor-pointer"
                    >
                      <option value="WIB">WIB</option>
                      <option value="WITA">WITA</option>
                      <option value="WIT">WIT</option>
                    </select>
                  </div>
                </div>

                {/* Real-time formatted result */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">Hasil Format:</span>
                  <span className="font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {formData.events.resepsi.time || '11:00 - 17:00 WIB'}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Teks Jam Bebas (Contoh: Ba'da Isya)</label>
                <input
                  type="text"
                  value={formData.events.resepsi.time}
                  onChange={(e) => setFormData({
                    ...formData,
                    events: { ...formData.events, resepsi: { ...formData.events.resepsi, time: e.target.value } }
                  })}
                  placeholder="Contoh: 11:00 - 17:00 WIB"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-xs focus:ring-1 focus:ring-sage"
                />
              </div>
            )}
          </div>
        </div>

        {/* Venue & Location for Resepsi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="relative flex items-center sm:col-span-2">
            <Building className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Nama Gedung / Tempat (Contoh: Balai Sarwono)"
              value={formData.events.resepsi.venue}
              onChange={(e) => setFormData({
                ...formData,
                events: { ...formData.events, resepsi: { ...formData.events.resepsi, venue: e.target.value } }
              })}
              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-sage shadow-2xs"
            />
          </div>
          <div className="relative flex items-center sm:col-span-2">
            <MapPin className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Alamat Lengkap Resepsi (Contoh: Jl. Madrasah No. 14, Jeruk Purut, Jakarta Selatan)"
              value={formData.events.resepsi.address}
              onChange={(e) => setFormData({
                ...formData,
                events: { ...formData.events, resepsi: { ...formData.events.resepsi, address: e.target.value } }
              })}
              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-sage shadow-2xs"
            />
          </div>
          <div className="relative flex items-center sm:col-span-2">
            <LinkIcon className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
            <input
              type="text"
              placeholder="Link Google Maps (https://maps.app.goo.gl/...)"
              value={formData.events.resepsi.mapUrl}
              onChange={(e) => setFormData({
                ...formData,
                events: { ...formData.events, resepsi: { ...formData.events.resepsi, mapUrl: e.target.value } }
              })}
              className="w-full border border-gray-300 rounded-xl pl-9 pr-3 py-2.5 bg-white text-gray-800 focus:ring-1 focus:ring-sage font-mono text-[11px] shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
