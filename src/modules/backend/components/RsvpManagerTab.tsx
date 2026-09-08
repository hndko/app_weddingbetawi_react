import React, { useState, useMemo } from 'react';
import { 
  Users, Trash2, Search, RotateCcw, X, FileSpreadsheet, Download, FileText 
} from 'lucide-react';
import { RSVPResponse, GuestInvitation, WeddingConfig } from '../../../types';
import { exportRsvpsExcel, exportGuestsPDF } from '../../../utils/reportExporter';

export interface RsvpManagerTabProps {
  rsvps: RSVPResponse[];
  guests: GuestInvitation[];
  weddingConfig: WeddingConfig;
  showToast: (type: 'success' | 'error', message: string) => void;
  onRequestDeleteRsvp: (rsvp: RSVPResponse) => void;
}

export function RsvpManagerTab({
  rsvps,
  guests,
  weddingConfig,
  showToast,
  onRequestDeleteRsvp,
}: RsvpManagerTabProps) {
  const [rsvpSearchQuery, setRsvpSearchQuery] = useState('');

  // Hitung metrik kehadiran
  const totalAttending = useMemo(() => {
    return rsvps
      .filter((r) => r.attendance === 'hadir')
      .reduce((sum, r) => sum + (r.guestCount || 1), 0);
  }, [rsvps]);

  const totalNotAttending = useMemo(() => {
    return rsvps.filter((r) => r.attendance === 'tidak_hadir').length;
  }, [rsvps]);

  // Saring data secara real-time in-memory (Pilar 5: Zero URL Pollution)
  const filteredRsvps = useMemo(() => {
    if (!rsvpSearchQuery.trim()) return rsvps;
    const q = rsvpSearchQuery.toLowerCase().trim();
    return rsvps.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.attendance?.toLowerCase().includes(q) ||
        r.notes?.toLowerCase().includes(q)
    );
  }, [rsvps, rsvpSearchQuery]);

  // Export CSV lokal
  const exportRsvpToCsv = () => {
    if (rsvps.length === 0) {
      showToast('error', 'Tidak ada data RSVP untuk diekspor');
      return;
    }

    const headers = ['No', 'Nama Tamu', 'Kehadiran', 'Jumlah Tamu', 'Catatan / Ucapan', 'Waktu RSVP'];
    const rows = rsvps.map((r, idx) => [
      idx + 1,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      r.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir',
      r.attendance === 'hadir' ? (r.guestCount || 1) : 0,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      r.createdAt ? new Date(r.createdAt as string).toLocaleString('id-ID') : '-',
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap-rsvp-${weddingConfig.groom.nickname}-${weddingConfig.bride.nickname}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('success', 'Rekap CSV RSVP berhasil diunduh!');
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Export Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-text-dark">Buku Tamu Konfirmasi Kehadiran</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Rekap data kehadiran tamu undangan ({totalAttending} Hadir &bull; {totalNotAttending} Tidak Hadir)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              exportRsvpsExcel(rsvps, weddingConfig);
              showToast('success', 'Rekap RSVP (.xlsx) berhasil diunduh!');
            }}
            disabled={rsvps.length === 0}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            title="Download Rekap RSVP ke format Excel (.xlsx)"
          >
            <FileSpreadsheet size={14} />
            <span>Ekspor Excel</span>
          </button>

          <button
            type="button"
            onClick={exportRsvpToCsv}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all cursor-pointer active:scale-98"
            title="Download format CSV"
          >
            <Download size={14} />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={() => {
              exportGuestsPDF(guests, rsvps, weddingConfig);
              showToast('success', 'Buku Tamu Registrasi (.pdf) berhasil diunduh!');
            }}
            disabled={guests.length === 0 && rsvps.length === 0}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            title="Cetak lembar buku tamu PDF untuk Wedding Organizer"
          >
            <FileText size={14} />
            <span>Cetak PDF WO</span>
          </button>
        </div>
      </div>

      {/* In-Memory Live Search Bar */}
      <div className="relative flex items-center">
        <Search size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={rsvpSearchQuery}
          onChange={(e) => setRsvpSearchQuery(e.target.value)}
          placeholder="Cari nama tamu, status kehadiran, atau catatan RSVP..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all placeholder:text-gray-400 shadow-2xs"
        />
        {rsvpSearchQuery && (
          <button
            type="button"
            onClick={() => setRsvpSearchQuery('')}
            className="absolute right-3 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            title="Hapus filter pencarian"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Responsive Data Table */}
      {filteredRsvps.length === 0 ? (
        <div className="text-center py-14 bg-white border border-dashed border-gray-200 rounded-3xl flex flex-col items-center gap-2 shadow-2xs">
          <Users size={36} className="text-gray-300" />
          <p className="text-xs text-gray-500 font-medium">
            {rsvpSearchQuery
              ? `Tidak ada data RSVP yang cocok dengan "${rsvpSearchQuery}"`
              : 'Belum ada data konfirmasi RSVP masuk.'}
          </p>
          {rsvpSearchQuery && (
            <button
              type="button"
              onClick={() => setRsvpSearchQuery('')}
              className="text-xs text-sage-dark hover:underline flex items-center gap-1 font-semibold mt-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Pencarian</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/90 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 text-center w-12">#</th>
                <th className="py-3 px-4">Nama Tamu</th>
                <th className="py-3 px-3 text-center">Kehadiran</th>
                <th className="py-3 px-3 text-center">Jumlah</th>
                <th className="py-3 px-4">Pesan / Catatan</th>
                <th className="py-3 px-3 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRsvps.map((rsvp, idx) => (
                <tr key={rsvp.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-3.5 text-center text-gray-400 font-medium">
                    {idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-text-dark whitespace-nowrap">
                    {rsvp.name}
                  </td>
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      rsvp.attendance === 'hadir'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rsvp.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center text-gray-700 font-medium whitespace-nowrap">
                    {rsvp.attendance === 'hadir' ? `${rsvp.guestCount} Orang` : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate italic">
                    {rsvp.notes ? `"${rsvp.notes}"` : '-'}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRequestDeleteRsvp(rsvp)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Hapus data RSVP ini"
                      aria-label="Hapus data RSVP ini"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
