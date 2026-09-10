import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import {
  WeddingConfig,
  GuestInvitation,
  RSVPResponse,
  WeddingTable,
  WeddingExpense,
  CheckInRecord,
  ExpenseCategory,
  TableZone
} from '../types';

export interface ExportMasterData {
  config: WeddingConfig;
  guests: GuestInvitation[];
  rsvps: RSVPResponse[];
  tables: WeddingTable[];
  expenses: WeddingExpense[];
  checkins?: CheckInRecord[];
}

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  venue: 'Tempat & Gedung (Venue)',
  catering: 'Katering & Konsumsi',
  attire_mua: 'Busana & Tata Rias (MUA)',
  decoration: 'Dekorasi & Panggung',
  photography: 'Dokumentasi (Foto & Video)',
  entertainment_mc: 'Hiburan & Pembawa Acara (MC)',
  invitation_souvenir: 'Undangan & Souvenir',
  rings_dowry: 'Cincin & Mahar / Seserahan',
  logistics_other: 'Logistik & Lain-lain',
};

const ZONE_LABELS: Record<TableZone, string> = {
  vip_front: 'Depan (VIP & Pejabat)',
  family_center: 'Tengah (Keluarga Inti)',
  regular_left: 'Sayap Kiri (Teman & Sahabat)',
  regular_right: 'Sayap Kanan (Kolega & Rekan)',
};

export const formatCurrency = (amount: number): string => {
  return `Rp ${(amount || 0).toLocaleString('id-ID')}`;
};

export const getCoupleLabel = (config: WeddingConfig): string => {
  const groom = config.groom?.nickname || config.groom?.fullName || 'Pengantin Pria';
  const bride = config.bride?.nickname || config.bride?.fullName || 'Pengantin Wanita';
  return `${groom} & ${bride}`;
};

export const getEventDateLabel = (config: WeddingConfig): string => {
  if (config.dateStr) return config.dateStr;
  if (config.events?.resepsi?.date) return config.events.resepsi.date;
  if (config.events?.akad?.date) return config.events.akad.date;
  return 'Hari Bahagia';
};

const formatTimestamp = (ts: unknown): string => {
  if (!ts) return '-';
  try {
    if (typeof ts === 'string') {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      return ts;
    }
    if (ts instanceof Date) {
      return ts.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
    if (typeof ts === 'object' && ts !== null && 'toDate' in ts && typeof (ts as { toDate: () => Date }).toDate === 'function') {
      return (ts as { toDate: () => Date }).toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  } catch {
    return '-';
  }
  return '-';
};

export const isAttending = (attendance?: string): boolean => {
  if (!attendance) return false;
  const val = attendance.toLowerCase().trim();
  return val === 'hadir' || val === 'attending' || val === 'yes';
};

export const isDeclined = (attendance?: string): boolean => {
  if (!attendance) return false;
  const val = attendance.toLowerCase().trim();
  return val === 'tidak_hadir' || val === 'tidak hadir' || val === 'declined' || val === 'no';
};

export const isMaybe = (attendance?: string): boolean => {
  if (!attendance) return false;
  const val = attendance.toLowerCase().trim();
  return val === 'ragu' || val === 'masih_ragu' || val === 'maybe';
};

export const getAttendanceLabel = (attendance?: string): string => {
  if (isAttending(attendance)) return 'Hadir';
  if (isDeclined(attendance)) return 'Tidak Hadir';
  if (isMaybe(attendance)) return 'Masih Ragu';
  return 'Belum Konfirmasi';
};

/* =========================================================================
   EXCEL (.XLSX) GENERATOR SUITE
   ========================================================================= */

/**
 * Trigger file download from XLSX workbook
 */
function downloadWorkbook(workbook: XLSX.WorkBook, filename: string): void {
  const cleanName = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, cleanName);
}

/**
 * Generate Sheet: Ringkasan Eksekutif
 */
function createExecutiveSummarySheet(data: ExportMasterData): XLSX.WorkSheet {
  const { config, guests, rsvps, tables, expenses, checkins = [] } = data;

  const totalGuests = guests.length;
  const sentGuests = guests.filter((g) => g.status === 'sent').length;
  const totalRsvps = rsvps.length;
  const attendingRsvps = rsvps.filter((r) => isAttending(r.attendance));
  const attendingPax = attendingRsvps.reduce((acc, r) => acc + (Number(r.guestCount) || 1), 0);
  const declinedRsvpsCount = rsvps.filter((r) => isDeclined(r.attendance)).length;
  const maybeRsvpsCount = rsvps.filter((r) => isMaybe(r.attendance)).length;
  const checkedInGuests = guests.filter((g) => g.checkedIn).length || checkins.length;

  const totalCapacity = tables.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const totalAssignedPax = tables.reduce(
    (acc, t) => acc + (t.assignedGuests || []).reduce((sum, g) => sum + (Number(g.pax) || 1), 0),
    0
  );

  const totalEstimatedCost = expenses.reduce((acc, e) => acc + (Number(e.estimatedCost) || 0), 0);
  const totalActualCost = expenses.reduce((acc, e) => acc + (Number(e.actualCost) || 0), 0);
  const totalPaidAmount = expenses.reduce((acc, e) => acc + (Number(e.paidAmount) || 0), 0);
  const totalRemainingDebt = Math.max(0, (totalActualCost || totalEstimatedCost) - totalPaidAmount);

  const isWhiteLabel = config.agencyBranding?.mode === 'white_label' && Boolean(config.agencyBranding.agencyName);
  const isCoBranded = config.agencyBranding?.mode === 'co_branded' && Boolean(config.agencyBranding.agencyName);
  const agencyName = config.agencyBranding?.agencyName || '';

  const systemFooter = isWhiteLabel
    ? `Dicetak secara otomatis via ${agencyName} Management System`
    : isCoBranded
    ? `Dicetak via ${agencyName} in partnership with Mari Partner System`
    : 'Dicetak secara otomatis via Mari Partner Wedding System';

  const rows = [
    [isWhiteLabel ? `${agencyName.toUpperCase()} - LAPORAN REKAPITULASI OPERASIONAL` : 'LAPORAN REKAPITULASI OPERASIONAL PERNIKAHAN'],
    [isWhiteLabel ? `${agencyName.toUpperCase()} WEDDING EXECUTIVE SUMMARY` : 'WEDDING ORGANIZER EXECUTIVE SUMMARY'],
    [],
    ['Mempelai', getCoupleLabel(config)],
    ['Tanggal Pernikahan', getEventDateLabel(config)],
    ['Tempat Resepsi', config.events?.resepsi?.venue || '-'],
    ['Alamat Resepsi', config.events?.resepsi?.address || '-'],
    ['Waktu Cetak Laporan', new Date().toLocaleString('id-ID')],
    [],
    ['1. REKAPITULASI TAMU & KEHADIRAN (RSVP)'],
    ['Total Tamu Terdaftar', totalGuests],
    ['Tamu Undangan Terkirim (WA)', sentGuests],
    ['Tamu Belum Terkirim', totalGuests - sentGuests],
    ['Total Respon RSVP Masuk', totalRsvps],
    ['Konfirmasi Hadir (Responses)', attendingRsvps.length],
    ['Estimasi Total Pax Hadir', attendingPax],
    ['Konfirmasi Berhalangan Hadir', declinedRsvpsCount],
    ['Konfirmasi Masih Ragu', maybeRsvpsCount],
    ['Total Tamu Sudah Check-In di Lokasi', checkedInGuests],
    [],
    ['2. REKAPITULASI SUSUNAN MEJA & KURSI'],
    ['Jumlah Meja Tersedia', tables.length],
    ['Total Kapasitas Kursi', totalCapacity],
    ['Kursi Sudah Terisi (Assigned)', totalAssignedPax],
    ['Kursi Masih Tersedia (Available)', Math.max(0, totalCapacity - totalAssignedPax)],
    ['Tingkat Keterisian Meja', `${totalCapacity > 0 ? Math.round((totalAssignedPax / totalCapacity) * 100) : 0}%`],
    [],
    ['3. REKAPITULASI KEUANGAN & ANGGARAN'],
    ['Total Estimasi Anggaran Awal', formatCurrency(totalEstimatedCost)],
    ['Total Realisasi Biaya Aktual', formatCurrency(totalActualCost)],
    ['Total Pembayaran Telah Diselesaikan', formatCurrency(totalPaidAmount)],
    ['Total Sisa Pembayaran Belum Lunas', formatCurrency(totalRemainingDebt)],
    ['Status Realisasi', totalActualCost > totalEstimatedCost ? 'Over Budget' : 'On Track / Sesuai Rencana'],
    [],
    [systemFooter]
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 38 }, { wch: 45 }];
  return ws;
}

/**
 * Generate Sheet: Daftar Tamu & Undangan
 */
function createGuestsSheet(guests: GuestInvitation[], rsvps: RSVPResponse[]): XLSX.WorkSheet {
  const rsvpMap = new Map<string, RSVPResponse>();
  rsvps.forEach((r) => {
    if (r.name) rsvpMap.set(r.name.trim().toLowerCase(), r);
  });

  const getTierLabel = (tier?: string) => {
    switch (tier) {
      case 'vvip': return 'VVIP Kehormatan';
      case 'vip': return 'VIP Guest';
      case 'family': return 'Keluarga Besar';
      default: return 'Reguler';
    }
  };

  const header = [
    '#',
    'Nama Tamu',
    'Tier Akses',
    'Nomor WhatsApp',
    'Status Pengiriman WA',
    'Status Konfirmasi RSVP',
    'Pax Konfirmasi',
    'Plot Nomor Meja',
    'Status Check-in Resepsi',
    'Waktu Check-in',
    'Souvenir Diambil',
    'Catatan VIP / Protokol',
    'Pesan / Doa Restu'
  ];

  const dataRows = guests.map((g, idx) => {
    const rsvp = rsvpMap.get((g.name || '').trim().toLowerCase());
    const rsvpStatus = !rsvp ? 'Belum Konfirmasi' : getAttendanceLabel(rsvp.attendance);
    const guestPax = rsvp ? (rsvp.guestCount || (isAttending(rsvp.attendance) ? 1 : 0)) : (g.actualPax || 1);
    const checkinTime = g.checkedInAt || g.checkInTime;

    return [
      idx + 1,
      g.name || '-',
      getTierLabel(g.tier),
      g.phone || '-',
      g.status === 'sent' ? 'Terkirim' : 'Pending (Belum)',
      rsvpStatus,
      guestPax,
      g.tableNumber || '-',
      g.checkedIn ? 'Sudah Hadir' : 'Belum',
      checkinTime ? formatTimestamp(checkinTime) : '-',
      g.souvenirClaimed ? 'Sudah' : 'Belum',
      g.vipNotes || '-',
      rsvp?.notes || '-'
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 24 },
    { wch: 15 },
    { wch: 18 },
    { wch: 24 },
    { wch: 22 },
    { wch: 18 },
    { wch: 30 },
    { wch: 45 }
  ];
  return ws;
}

/**
 * Generate Sheet: Rekap RSVP
 */
function createRsvpsSheet(rsvps: RSVPResponse[]): XLSX.WorkSheet {
  const header = [
    '#',
    'Nama Pengirim',
    'Status Kehadiran',
    'Jumlah Pax',
    'Pesan Doa & Ucapan',
    'Waktu Konfirmasi Masuk'
  ];

  const dataRows = rsvps.map((r, idx) => {
    const attendanceLabel = getAttendanceLabel(r.attendance);

    return [
      idx + 1,
      r.name || '-',
      attendanceLabel,
      isAttending(r.attendance) ? (r.guestCount || 1) : 0,
      r.notes || '-',
      formatTimestamp(r.createdAt)
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 55 },
    { wch: 24 }
  ];
  return ws;
}

/**
 * Generate Sheet: Susunan Meja
 */
function createSeatingSheet(tables: WeddingTable[]): XLSX.WorkSheet {
  const header = [
    '#',
    'Nomor Meja',
    'Nama Meja / Kelompok',
    'Zona Penempatan',
    'Bentuk Meja',
    'Kapasitas Kursi',
    'Terisi (Pax)',
    'Sisa Kursi',
    'Daftar Tamu Terplot',
    'Catatan Khusus Meja'
  ];

  const dataRows = tables.map((t, idx) => {
    const filled = (t.assignedGuests || []).reduce((acc, g) => acc + (Number(g.pax) || 1), 0);
    const guestNames = (t.assignedGuests || []).map((g) => `${g.name} (${g.pax || 1}pax)`).join(', ');
    const shape = t.shape === 'round' ? 'Bundar' : t.shape === 'long' ? 'Panjang' : 'Panggung VIP';

    return [
      idx + 1,
      t.number || `Meja ${idx + 1}`,
      t.name || '-',
      ZONE_LABELS[t.zone] || t.zone,
      shape,
      t.capacity || 0,
      filled,
      Math.max(0, (t.capacity || 0) - filled),
      guestNames || '(Belum ada tamu diplot)',
      t.notes || '-'
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 28 },
    { wch: 30 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 12 },
    { wch: 60 },
    { wch: 35 }
  ];
  return ws;
}

/**
 * Generate Sheet: Anggaran & Pengeluaran
 */
function createBudgetSheet(expenses: WeddingExpense[]): XLSX.WorkSheet {
  const header = [
    '#',
    'Kategori Pos Biaya',
    'Nama Kebutuhan / Item',
    'Nama Vendor',
    'No. Kontak Vendor',
    'Estimasi Biaya',
    'Biaya Aktual',
    'Jumlah Terbayar',
    'Sisa Pembayaran',
    'Status Pembayaran',
    'Jatuh Tempo',
    'Catatan'
  ];

  const dataRows = expenses.map((e, idx) => {
    const actual = Number(e.actualCost) || Number(e.estimatedCost) || 0;
    const paid = Number(e.paidAmount) || 0;
    const remaining = Math.max(0, actual - paid);
    const statusLabel =
      e.paymentStatus === 'paid'
        ? 'LUNAS'
        : e.paymentStatus === 'partial'
        ? 'DP / Sebagian'
        : 'BELUM DIBAYAR';

    return [
      idx + 1,
      CATEGORY_LABELS[e.category] || e.category,
      e.title || '-',
      e.vendorName || '-',
      e.vendorPhone || '-',
      formatCurrency(e.estimatedCost),
      formatCurrency(e.actualCost),
      formatCurrency(e.paidAmount),
      formatCurrency(remaining),
      statusLabel,
      e.dueDate || '-',
      e.notes || '-'
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([header, ...dataRows]);
  ws['!cols'] = [
    { wch: 6 },
    { wch: 30 },
    { wch: 30 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 35 }
  ];
  return ws;
}

/**
 * Export 1-Click Master Excel with 5 complete worksheets
 */
export function exportMasterExcel(data: ExportMasterData): void {
  const wb = XLSX.utils.book_new();

  const wsSummary = createExecutiveSummarySheet(data);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Eksekutif');

  const wsGuests = createGuestsSheet(data.guests, data.rsvps);
  XLSX.utils.book_append_sheet(wb, wsGuests, 'Daftar Tamu & Kehadiran');

  const wsRsvps = createRsvpsSheet(data.rsvps);
  XLSX.utils.book_append_sheet(wb, wsRsvps, 'Konfirmasi RSVP');

  const wsSeating = createSeatingSheet(data.tables);
  XLSX.utils.book_append_sheet(wb, wsSeating, 'Susunan Meja (WO)');

  const wsBudget = createBudgetSheet(data.expenses);
  XLSX.utils.book_append_sheet(wb, wsBudget, 'Rincian Anggaran & Vendor');

  const cleanCouple = getCoupleLabel(data.config).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Rekap_Master_Pernikahan_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  downloadWorkbook(wb, filename);
}

/**
 * Export Individual: Guests Only
 */
export function exportGuestsExcel(guests: GuestInvitation[], rsvps: RSVPResponse[], config: WeddingConfig): void {
  const wb = XLSX.utils.book_new();
  const ws = createGuestsSheet(guests, rsvps);
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tamu');
  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  downloadWorkbook(wb, `Buku_Tamu_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Export Individual: RSVPs Only
 */
export function exportRsvpsExcel(rsvps: RSVPResponse[], config: WeddingConfig): void {
  const wb = XLSX.utils.book_new();
  const ws = createRsvpsSheet(rsvps);
  XLSX.utils.book_append_sheet(wb, ws, 'Konfirmasi RSVP');
  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  downloadWorkbook(wb, `Rekap_RSVP_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Export Individual: Seating Chart Only
 */
export function exportSeatingExcel(tables: WeddingTable[], config: WeddingConfig): void {
  const wb = XLSX.utils.book_new();
  const ws = createSeatingSheet(tables);
  XLSX.utils.book_append_sheet(wb, ws, 'Susunan Meja');
  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  downloadWorkbook(wb, `Susunan_Meja_WO_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * Export Individual: Budget Only
 */
export function exportBudgetExcel(expenses: WeddingExpense[], config: WeddingConfig): void {
  const wb = XLSX.utils.book_new();
  const ws = createBudgetSheet(expenses);
  XLSX.utils.book_append_sheet(wb, ws, 'Anggaran Pernikahan');
  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  downloadWorkbook(wb, `Rekap_Anggaran_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/* =========================================================================
   PDF GENERATOR SUITE (PRINT-READY A4 FOR WEDDING ORGANIZER)
   ========================================================================= */

interface PdfTableColumn {
  header: string;
  width: number; // width in mm
  align?: 'left' | 'center' | 'right';
}

/**
 * Helper to draw Wedding Organizer letterhead
 */
function drawHeader(
  doc: jsPDF,
  config: WeddingConfig,
  reportTitle: string,
  subtitle?: string
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const isWhiteLabel = config.agencyBranding?.mode === 'white_label' && Boolean(config.agencyBranding.agencyName);
  const isCoBranded = config.agencyBranding?.mode === 'co_branded' && Boolean(config.agencyBranding.agencyName);
  const agencyName = config.agencyBranding?.agencyName || '';

  // Header background badge
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, 12, pageWidth - margin * 2, 26, 'F');

  // Decorative gold left accent bar
  doc.setFillColor(217, 119, 6); // amber-600
  doc.rect(margin, 12, 3.5, 26, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(30, 41, 59); // slate-800
  const renderedTitle = isWhiteLabel ? `${agencyName.toUpperCase()} — ${reportTitle.toUpperCase()}` : reportTitle.toUpperCase();
  doc.text(renderedTitle, margin + 8, 20);

  // Couple names & Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // slate-600
  const coupleText = `Pernikahan: ${getCoupleLabel(config)} • Tanggal: ${getEventDateLabel(config)}`;
  doc.text(coupleText, margin + 8, 26);

  // Subtitle / Venue
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // slate-500
  const defaultSub = `Lokasi: ${config.events?.resepsi?.venue || '-'} • Waktu Cetak: ${new Date().toLocaleString('id-ID')}`;
  const subText = subtitle ? subtitle : isCoBranded ? `${defaultSub} • Powered by ${agencyName} & Mari Partner` : defaultSub;
  doc.text(subText, margin + 8, 32);

  // Horizontal line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.4);
  doc.line(margin, 42, pageWidth - margin, 42);

  return 46; // next Y position
}

/**
 * Helper to draw footer page numbering
 */
function applyPageNumbers(doc: jsPDF, config?: WeddingConfig): void {
  const totalPages = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  const isWhiteLabel = config?.agencyBranding?.mode === 'white_label' && Boolean(config?.agencyBranding?.agencyName);
  const isCoBranded = config?.agencyBranding?.mode === 'co_branded' && Boolean(config?.agencyBranding?.agencyName);
  const agencyName = config?.agencyBranding?.agencyName || '';

  const footerBrand = isWhiteLabel
    ? `${agencyName} • Dokumen Resmi Wedding Organizer`
    : isCoBranded
    ? `${agencyName} & Mari Partner • Dokumen Resmi Wedding Organizer`
    : 'Mari Partner Wedding System • Dokumen Resmi Wedding Organizer';

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    // Left info
    doc.text(footerBrand, margin, pageHeight - 7);

    // Right page number
    const pageText = `Halaman ${i} dari ${totalPages}`;
    doc.text(pageText, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }
}

/**
 * Render structured table on jsPDF with auto-pagination & zebra stripes
 */
function drawPdfTable(
  doc: jsPDF,
  startY: number,
  columns: PdfTableColumn[],
  rows: string[][],
  config: WeddingConfig,
  reportTitle: string
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = startY;

  const drawTableHeader = (y: number): number => {
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(margin, y, pageWidth - margin * 2, 7.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);

    let currentX = margin;
    columns.forEach((col) => {
      let textX = currentX + 2;
      if (col.align === 'center') textX = currentX + col.width / 2;
      else if (col.align === 'right') textX = currentX + col.width - 2;

      doc.text(col.header, textX, y + 5, { align: col.align || 'left' });
      currentX += col.width;
    });

    return y + 7.5;
  };

  currentY = drawTableHeader(currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  rows.forEach((row, rowIdx) => {
    // Determine row height by finding maximum text wrapping across all columns
    let maxLines = 1;
    row.forEach((cellText, colIdx) => {
      const col = columns[colIdx];
      if (!col) return;
      const lines = doc.splitTextToSize(String(cellText || '-'), col.width - 4);
      if (lines.length > maxLines) maxLines = lines.length;
    });

    const rowHeight = Math.max(6.5, maxLines * 4.2 + 2);

    // Check page overflow
    if (currentY + rowHeight > pageHeight - 18) {
      doc.addPage();
      currentY = drawHeader(doc, config, reportTitle, '(Lanjutan)');
      currentY = drawTableHeader(currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
    }

    // Zebra striping
    if (rowIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(margin, currentY, pageWidth - margin * 2, rowHeight, 'F');
    }

    // Border line bottom
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + rowHeight, pageWidth - margin, currentY + rowHeight);

    // Render cells
    let currentX = margin;
    row.forEach((cellText, colIdx) => {
      const col = columns[colIdx];
      if (!col) return;

      doc.setTextColor(51, 65, 85); // slate-700
      const lines = doc.splitTextToSize(String(cellText || '-'), col.width - 4);

      let textX = currentX + 2;
      if (col.align === 'center') textX = currentX + col.width / 2;
      else if (col.align === 'right') textX = currentX + col.width - 2;

      doc.text(lines, textX, currentY + 4, { align: col.align || 'left' });
      currentX += col.width;
    });

    currentY += rowHeight;
  });

  return currentY;
}

/**
 * Export Master WO PDF Report (Executive Overview, Seating, RSVPs & Guests)
 */
export function exportMasterPDF(data: ExportMasterData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { config, guests, rsvps, tables, expenses } = data;
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Page 1: Kop & Ringkasan Eksekutif KPI
  let currentY = drawHeader(
    doc,
    config,
    'LAPORAN OPERASIONAL WEDDING ORGANIZER',
    'Dokumen Induk Manajemen Tamu, Meja, dan Keuangan Pernikahan'
  );

  // KPI Grid
  const totalGuests = guests.length;
  const attendingRsvps = rsvps.filter((r) => isAttending(r.attendance));
  const attendingPax = attendingRsvps.reduce((acc, r) => acc + (Number(r.guestCount) || 1), 0);
  const totalCapacity = tables.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0);
  const assignedPax = tables.reduce(
    (acc, t) => acc + (t.assignedGuests || []).reduce((sum, g) => sum + (Number(g.pax) || 1), 0),
    0
  );
  const totalActualCost = expenses.reduce((acc, e) => acc + (Number(e.actualCost) || 0), 0);
  const totalPaid = expenses.reduce((acc, e) => acc + (Number(e.paidAmount) || 0), 0);

  const kpis = [
    { label: 'Total Tamu Undangan', val: `${totalGuests} Tamu` },
    { label: 'Konfirmasi Hadir (Pax)', val: `${attendingPax} Orang` },
    { label: 'Kapasitas Meja Duduk', val: `${assignedPax} / ${totalCapacity} Kursi` },
    { label: 'Realisasi Anggaran', val: formatCurrency(totalActualCost || 0) },
  ];

  const cardW = (pageWidth - margin * 2 - 9) / 4;
  kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardW + 3);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(cardX, currentY, cardW, 16, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, cardX + cardW / 2, currentY + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, cardX + cardW / 2, currentY + 12, { align: 'center' });
  });

  currentY += 22;

  // Section 1 on Master: Ringkasan Susunan Meja
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text('I. SUSUNAN MEJA RESEPSI (PANDUAN USHER & WO)', margin, currentY);
  currentY += 4;

  const seatingCols: PdfTableColumn[] = [
    { header: 'No', width: 8, align: 'center' },
    { header: 'Meja', width: 18 },
    { header: 'Nama Meja', width: 38 },
    { header: 'Zona', width: 34 },
    { header: 'Kursi', width: 14, align: 'center' },
    { header: 'Terisi', width: 14, align: 'center' },
    { header: 'Daftar Tamu Duduk', width: 56 },
  ];

  const seatingRows = tables.slice(0, 15).map((t, idx) => {
    const filled = (t.assignedGuests || []).reduce((acc, g) => acc + (Number(g.pax) || 1), 0);
    const guestNames = (t.assignedGuests || []).map((g) => `${g.name}`).join(', ');
    return [
      String(idx + 1),
      t.number || `M-${idx + 1}`,
      t.name || '-',
      ZONE_LABELS[t.zone] || t.zone,
      String(t.capacity || 0),
      String(filled),
      guestNames || '(Kosong)',
    ];
  });

  currentY = drawPdfTable(doc, currentY, seatingCols, seatingRows, config, 'LAPORAN MASTER WO - SUSUNAN MEJA');

  // Page 2: Daftar Tamu & Undangan
  doc.addPage();
  currentY = drawHeader(doc, config, 'LAPORAN BUKU TAMU & REGISTRASI', 'Daftar Tamu Undangan dan Status Check-in');

  const getTierShortLabel = (tier?: string) => {
    switch (tier) {
      case 'vvip': return 'VVIP';
      case 'vip': return 'VIP';
      case 'family': return 'Family';
      default: return 'Reguler';
    }
  };

  const guestCols: PdfTableColumn[] = [
    { header: 'No', width: 7, align: 'center' },
    { header: 'Nama Tamu', width: 40 },
    { header: 'Tier', width: 16, align: 'center' },
    { header: 'No WhatsApp', width: 25 },
    { header: 'Status WA', width: 18, align: 'center' },
    { header: 'RSVP', width: 16, align: 'center' },
    { header: 'Pax', width: 10, align: 'center' },
    { header: 'Meja', width: 16, align: 'center' },
    { header: 'Check-in', width: 18, align: 'center' },
    { header: 'Suvenir', width: 16, align: 'center' },
  ];

  const rsvpMap = new Map<string, RSVPResponse>();
  rsvps.forEach((r) => {
    if (r.name) rsvpMap.set(r.name.trim().toLowerCase(), r);
  });

  const guestRows = guests.map((g, idx) => {
    const rsvp = rsvpMap.get((g.name || '').trim().toLowerCase());
    const rsvpStatus = !rsvp
      ? 'Belum'
      : isAttending(rsvp.attendance)
      ? 'Hadir'
      : isDeclined(rsvp.attendance)
      ? 'Tidak'
      : 'Ragu';
    const guestPax = rsvp ? (rsvp.guestCount || (isAttending(rsvp.attendance) ? 1 : 0)) : (g.actualPax || 1);

    return [
      String(idx + 1),
      g.name || '-',
      getTierShortLabel(g.tier),
      g.phone || '-',
      g.status === 'sent' ? 'Terkirim' : 'Pending',
      rsvpStatus,
      String(guestPax),
      g.tableNumber || '-',
      g.checkedIn ? 'Hadir' : 'Belum',
      g.souvenirClaimed ? 'Sudah' : 'Belum',
    ];
  });

  currentY = drawPdfTable(doc, currentY, guestCols, guestRows, config, 'BUKU TAMU & REGISTRASI');

  // Page 3: Rekap Keuangan & Vendor
  doc.addPage();
  currentY = drawHeader(
    doc,
    config,
    'LAPORAN ANGGARAN & VENDOR PERNIKAHAN',
    `Total Biaya: ${formatCurrency(totalActualCost)} • Terbayar: ${formatCurrency(totalPaid)} • Sisa: ${formatCurrency(Math.max(0, totalActualCost - totalPaid))}`
  );

  const budgetCols: PdfTableColumn[] = [
    { header: 'No', width: 8, align: 'center' },
    { header: 'Kategori', width: 34 },
    { header: 'Pos Pengeluaran', width: 36 },
    { header: 'Vendor', width: 26 },
    { header: 'Estimasi', width: 26, align: 'right' },
    { header: 'Aktual', width: 26, align: 'right' },
    { header: 'Status', width: 26, align: 'center' },
  ];

  const budgetRows = expenses.map((e, idx) => {
    const statusLabel =
      e.paymentStatus === 'paid'
        ? 'Lunas'
        : e.paymentStatus === 'partial'
        ? 'DP'
        : 'Belum';

    return [
      String(idx + 1),
      CATEGORY_LABELS[e.category] || e.category,
      e.title || '-',
      e.vendorName || '-',
      formatCurrency(e.estimatedCost),
      formatCurrency(e.actualCost),
      statusLabel,
    ];
  });

  drawPdfTable(doc, currentY, budgetCols, budgetRows, config, 'ANGGARAN & VENDOR');

  applyPageNumbers(doc, config);

  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Laporan_Master_WO_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Export Individual: Guests Only PDF
 */
export function exportGuestsPDF(guests: GuestInvitation[], rsvps: RSVPResponse[], config: WeddingConfig): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let currentY = drawHeader(doc, config, 'BUKU TAMU & LEMBAR REGISTRASI RESEPSI');

  const getTierShortLabel = (tier?: string) => {
    switch (tier) {
      case 'vvip': return 'VVIP';
      case 'vip': return 'VIP';
      case 'family': return 'Family';
      default: return 'Reguler';
    }
  };

  const guestCols: PdfTableColumn[] = [
    { header: 'No', width: 7, align: 'center' },
    { header: 'Nama Tamu', width: 42 },
    { header: 'Tier', width: 16, align: 'center' },
    { header: 'No WhatsApp', width: 25 },
    { header: 'Status WA', width: 18, align: 'center' },
    { header: 'RSVP', width: 16, align: 'center' },
    { header: 'Pax', width: 10, align: 'center' },
    { header: 'Meja', width: 16, align: 'center' },
    { header: 'Suvenir', width: 14, align: 'center' },
    { header: 'Paraf Tamu', width: 18, align: 'center' },
  ];

  const rsvpMap = new Map<string, RSVPResponse>();
  rsvps.forEach((r) => {
    if (r.name) rsvpMap.set(r.name.trim().toLowerCase(), r);
  });

  const guestRows = guests.map((g, idx) => {
    const rsvp = rsvpMap.get((g.name || '').trim().toLowerCase());
    const rsvpStatus = !rsvp
      ? 'Belum'
      : isAttending(rsvp.attendance)
      ? 'Hadir'
      : isDeclined(rsvp.attendance)
      ? 'Tidak'
      : 'Ragu';
    const guestPax = rsvp ? (rsvp.guestCount || (isAttending(rsvp.attendance) ? 1 : 0)) : (g.actualPax || 1);

    return [
      String(idx + 1),
      g.name || '-',
      getTierShortLabel(g.tier),
      g.phone || '-',
      g.status === 'sent' ? 'Terkirim' : 'Pending',
      rsvpStatus,
      String(guestPax),
      g.tableNumber || '-',
      g.souvenirClaimed ? 'Sudah' : 'Belum',
      '', // blank for physical signature
    ];
  });

  drawPdfTable(doc, currentY, guestCols, guestRows, config, 'BUKU TAMU RESEPSI');
  applyPageNumbers(doc, config);

  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Buku_Tamu_Resepsi_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Export Individual: Seating Chart PDF
 */
export function exportSeatingPDF(tables: WeddingTable[], config: WeddingConfig): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  let currentY = drawHeader(doc, config, 'PANDUAN DENAH & PENEMPATAN MEJA (USHER WO)');

  const seatingCols: PdfTableColumn[] = [
    { header: 'No', width: 8, align: 'center' },
    { header: 'Meja', width: 18 },
    { header: 'Nama Kelompok Meja', width: 40 },
    { header: 'Zona', width: 34 },
    { header: 'Kapasitas', width: 16, align: 'center' },
    { header: 'Terisi', width: 14, align: 'center' },
    { header: 'Daftar Tamu Terplot', width: 52 },
  ];

  const seatingRows = tables.map((t, idx) => {
    const filled = (t.assignedGuests || []).reduce((acc, g) => acc + (Number(g.pax) || 1), 0);
    const guestNames = (t.assignedGuests || []).map((g) => `${g.name} (${g.pax || 1})`).join(', ');
    return [
      String(idx + 1),
      t.number || `M-${idx + 1}`,
      t.name || '-',
      ZONE_LABELS[t.zone] || t.zone,
      String(t.capacity || 0),
      String(filled),
      guestNames || '(Belum ada)',
    ];
  });

  drawPdfTable(doc, currentY, seatingCols, seatingRows, config, 'PANDUAN PENEMPATAN MEJA');
  applyPageNumbers(doc, config);

  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Panduan_Meja_WO_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

/**
 * Export Individual: Budget & Vendor PDF
 */
export function exportBudgetPDF(expenses: WeddingExpense[], config: WeddingConfig): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const totalActual = expenses.reduce((acc, e) => acc + (Number(e.actualCost) || 0), 0);
  const totalPaid = expenses.reduce((acc, e) => acc + (Number(e.paidAmount) || 0), 0);

  let currentY = drawHeader(
    doc,
    config,
    'REKAPITULASI ANGGARAN & PEMBAYARAN VENDOR',
    `Total Biaya: ${formatCurrency(totalActual)} • Terbayar: ${formatCurrency(totalPaid)} • Sisa: ${formatCurrency(Math.max(0, totalActual - totalPaid))}`
  );

  const budgetCols: PdfTableColumn[] = [
    { header: 'No', width: 8, align: 'center' },
    { header: 'Kategori', width: 34 },
    { header: 'Pos Pengeluaran', width: 36 },
    { header: 'Vendor', width: 26 },
    { header: 'Biaya Aktual', width: 26, align: 'right' },
    { header: 'Terbayar', width: 26, align: 'right' },
    { header: 'Status', width: 26, align: 'center' },
  ];

  const budgetRows = expenses.map((e, idx) => {
    const statusLabel =
      e.paymentStatus === 'paid'
        ? 'LUNAS'
        : e.paymentStatus === 'partial'
        ? 'DP'
        : 'BELUM';

    return [
      String(idx + 1),
      CATEGORY_LABELS[e.category] || e.category,
      e.title || '-',
      e.vendorName || '-',
      formatCurrency(e.actualCost),
      formatCurrency(e.paidAmount),
      statusLabel,
    ];
  });

  drawPdfTable(doc, currentY, budgetCols, budgetRows, config, 'ANGGARAN & VENDOR');
  applyPageNumbers(doc, config);

  const cleanCouple = getCoupleLabel(config).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Laporan_Anggaran_Vendor_${cleanCouple}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
