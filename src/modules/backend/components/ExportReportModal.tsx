import React, { useState, useEffect } from 'react';
import {
  X, Download, FileSpreadsheet, FileText, CheckCircle2,
  Users, Armchair, Wallet, Sparkles, Loader2, Calendar, MapPin
} from 'lucide-react';
import { api } from '../../../services/api';
import { useWeddingConfig } from '../../../context/WeddingContext';
import {
  GuestInvitation, RSVPResponse, WeddingTable, WeddingExpense
} from '../../../types';
import {
  exportMasterExcel,
  exportMasterPDF,
  exportGuestsExcel,
  exportGuestsPDF,
  exportRsvpsExcel,
  exportSeatingExcel,
  exportSeatingPDF,
  exportBudgetExcel,
  exportBudgetPDF,
  getCoupleLabel,
  getEventDateLabel,
  formatCurrency
} from '../../../utils/reportExporter';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify?: (message: string, type: 'success' | 'error') => void;
  initialGuests?: GuestInvitation[];
  initialRsvps?: RSVPResponse[];
}

export function ExportReportModal({
  isOpen,
  onClose,
  onNotify,
  initialGuests,
  initialRsvps,
}: ExportReportModalProps) {
  const { weddingConfig } = useWeddingConfig();

  const [guests, setGuests] = useState<GuestInvitation[]>(initialGuests || []);
  const [rsvps, setRsvps] = useState<RSVPResponse[]>(initialRsvps || []);
  const [tables, setTables] = useState<WeddingTable[]>([]);
  const [expenses, setExpenses] = useState<WeddingExpense[]>([]);

  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialGuests && initialGuests.length > 0) setGuests(initialGuests);
  }, [initialGuests]);

  useEffect(() => {
    if (initialRsvps && initialRsvps.length > 0) setRsvps(initialRsvps);
  }, [initialRsvps]);

  // Lock body scroll on open & load data if needed
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let isMounted = true;
    const fetchAllData = async () => {
      setIsLoadingData(true);
      try {
        const [fetchedGuests, fetchedRsvps, fetchedTables, fetchedExpenses] = await Promise.all([
          (!initialGuests || initialGuests.length === 0) ? api.getGuests().catch(() => []) : Promise.resolve(initialGuests),
          (!initialRsvps || initialRsvps.length === 0) ? api.getRsvps().catch(() => []) : Promise.resolve(initialRsvps),
          api.getSeating().catch(() => []),
          api.getBudget().catch(() => []),
        ]);

        if (isMounted) {
          setGuests(fetchedGuests || []);
          setRsvps(fetchedRsvps || []);
          setTables(fetchedTables || []);
          setExpenses(fetchedExpenses || []);
        }
      } catch {
        onNotify?.('Gagal memuat sebagian data operasional untuk ekspor', 'error');
      } finally {
        if (isMounted) setIsLoadingData(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // KPIs
  const attendingRsvps = rsvps.filter((r) => r.attendance === 'attending');
  const attendingPax = attendingRsvps.reduce((acc, r) => acc + (Number(r.guestCount) || 1), 0);
  const totalCapacity = tables.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const totalActualCost = expenses.reduce((acc, e) => acc + (Number(e.actualCost) || 0), 0);

  const handleRunExport = async (actionKey: string, runner: () => Promise<void> | void, successMsg: string) => {
    try {
      setIsExporting(actionKey);
      await runner();
      onNotify?.(successMsg, 'success');
    } catch {
      onNotify?.('Terjadi kesalahan saat memproses dokumen ekspor', 'error');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-3xl w-full overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Download size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Pusat Laporan & Ekspor Data</h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {weddingConfig.agencyBranding?.mode === 'white_label' && weddingConfig.agencyBranding.agencyName
                    ? weddingConfig.agencyBranding.agencyName
                    : 'WO Suite'}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>{getCoupleLabel(weddingConfig)}</span>
                <span>•</span>
                <span>{getEventDateLabel(weddingConfig)}</span>
                {weddingConfig.agencyBranding?.mode === 'co_branded' && weddingConfig.agencyBranding.agencyName && (
                  <>
                    <span>•</span>
                    <span className="text-amber-300">by {weddingConfig.agencyBranding.agencyName}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                <Users size={14} className="text-blue-500" />
                <span>Total Tamu</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                {isLoadingData ? <Loader2 size={16} className="animate-spin mx-auto text-slate-400" /> : `${guests.length} Tamu`}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>RSVP Hadir</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                {isLoadingData ? <Loader2 size={16} className="animate-spin mx-auto text-slate-400" /> : `${attendingPax} Pax`}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                <Armchair size={14} className="text-purple-500" />
                <span>Susunan Meja</span>
              </div>
              <div className="text-base font-bold text-slate-800">
                {isLoadingData ? <Loader2 size={16} className="animate-spin mx-auto text-slate-400" /> : `${tables.length} Meja`}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs mb-1">
                <Wallet size={14} className="text-amber-500" />
                <span>Realisasi Biaya</span>
              </div>
              <div className="text-base font-bold text-slate-800 truncate" title={formatCurrency(totalActualCost)}>
                {isLoadingData ? <Loader2 size={16} className="animate-spin mx-auto text-slate-400" /> : formatCurrency(totalActualCost)}
              </div>
            </div>
          </div>

          {/* Section 1: 1-Click Master All-in-One Exports */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  Master Export All-in-One (Paket Lengkap)
                </h4>
                <p className="text-xs text-slate-500">
                  Unduh seluruh modul operasional pernikahan sekaligus dalam 1 berkas terpadu.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Master Excel */}
              <div className="border-2 border-emerald-100 bg-emerald-50/40 hover:border-emerald-300 rounded-2xl p-4.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <FileSpreadsheet size={18} />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      4 Worksheets
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mb-1">Master Excel (.xlsx)</h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Workbook terstruktur rapi: Sheet Ringkasan Eksekutif, Buku Tamu & RSVP, Susunan Meja (WO), dan Rincian Anggaran.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleRunExport('master-excel', () => {
                      exportMasterExcel({ config: weddingConfig, guests, rsvps, tables, expenses });
                    }, 'Master Excel berhasil diunduh!')
                  }
                  disabled={isLoadingData || isExporting !== null}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm shadow-emerald-200 transition-colors disabled:opacity-50"
                >
                  {isExporting === 'master-excel' ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <FileSpreadsheet size={15} />
                  )}
                  <span>Unduh Master Excel (.xlsx)</span>
                </button>
              </div>

              {/* Card 2: Master PDF */}
              <div className="border-2 border-amber-100 bg-amber-50/40 hover:border-amber-300 rounded-2xl p-4.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shadow-sm">
                      <FileText size={18} />
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Print-Ready A4
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm mb-1">Master Dokumen WO (.pdf)</h5>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Layout A4 resmi Wedding Organizer dengan kop mempelai, KPI summary cards, tabel denah meja, buku tamu, dan rekap keuangan.
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleRunExport('master-pdf', () => {
                      exportMasterPDF({ config: weddingConfig, guests, rsvps, tables, expenses });
                    }, 'Master Dokumen WO PDF berhasil diunduh!')
                  }
                  disabled={isLoadingData || isExporting !== null}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                >
                  {isExporting === 'master-pdf' ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <FileText size={15} className="text-amber-400" />
                  )}
                  <span>Unduh Master PDF (Print-Ready)</span>
                </button>
              </div>

            </div>
          </div>

          {/* Section 2: Modular Per-Module Exports */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Ekspor Modular Spesifik (Per Modul)
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Unduh lembaran dokumen terpisah sesuai kebutuhan divisi lapangan atau vendor terkait.
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              
              {/* Row 1: Buku Tamu & Registrasi */}
              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Buku Tamu & Undangan</div>
                    <div className="text-[11px] text-slate-500">
                      {guests.length} tamu terdaftar • Status WA, RSVP & Check-in
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() =>
                      handleRunExport('guests-excel', () => {
                        exportGuestsExcel(guests, rsvps, weddingConfig);
                      }, 'Daftar Tamu Excel berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() =>
                      handleRunExport('guests-pdf', () => {
                        exportGuestsPDF(guests, rsvps, weddingConfig);
                      }, 'Buku Tamu Registrasi PDF berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileText size={13} />
                    <span>PDF Registrasi</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Konfirmasi RSVP */}
              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Konfirmasi RSVP & Doa</div>
                    <div className="text-[11px] text-slate-500">
                      {rsvps.length} respon masuk • {attendingPax} estimasi pax hadir
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() =>
                      handleRunExport('rsvps-excel', () => {
                        exportRsvpsExcel(rsvps, weddingConfig);
                      }, 'Rekap RSVP Excel berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Excel RSVP</span>
                  </button>
                </div>
              </div>

              {/* Row 3: Susunan Meja */}
              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                    <Armchair size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Susunan Meja & Denah (WO)</div>
                    <div className="text-[11px] text-slate-500">
                      {tables.length} meja • Kapasitas {totalCapacity} kursi tamu
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() =>
                      handleRunExport('seating-excel', () => {
                        exportSeatingExcel(tables, weddingConfig);
                      }, 'Susunan Meja Excel berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() =>
                      handleRunExport('seating-pdf', () => {
                        exportSeatingPDF(tables, weddingConfig);
                      }, 'Panduan Meja Usher PDF berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileText size={13} />
                    <span>PDF Usher</span>
                  </button>
                </div>
              </div>

              {/* Row 4: Anggaran & Vendor */}
              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                    <Wallet size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Anggaran & Pembayaran Vendor</div>
                    <div className="text-[11px] text-slate-500">
                      {expenses.length} pos anggaran • Realisasi {formatCurrency(totalActualCost)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() =>
                      handleRunExport('budget-excel', () => {
                        exportBudgetExcel(expenses, weddingConfig);
                      }, 'Rekap Anggaran Excel berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileSpreadsheet size={13} />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() =>
                      handleRunExport('budget-pdf', () => {
                        exportBudgetPDF(expenses, weddingConfig);
                      }, 'Laporan Anggaran & Vendor PDF berhasil diunduh!')
                    }
                    disabled={isExporting !== null}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileText size={13} />
                    <span>PDF Keuangan</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-500" />
            <span>Sintesis dokumen diproses instan 100% di browser Anda (Zero Server Overhead).</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
