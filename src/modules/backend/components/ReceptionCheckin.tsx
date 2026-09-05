import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Users,
  Clock,
  Download,
  Trash2,
  X,
  Plus,
  Minus,
  Hash,
  MapPin,
  Check,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import jsQR from 'jsqr';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { playSuccessBeep, playWarningBeep } from '../../../utils/audioBeep';
import { parseGuestPayload, generateTicketCode } from '../../../utils/qrGenerator';
import type { GuestInvitation, RSVPResponse, CheckInRecord, WeddingTable } from '../../../types';

interface ReceptionCheckinProps {
  guests: GuestInvitation[];
  rsvps: RSVPResponse[];
  showToast: (type: 'success' | 'error', message: string) => void;
}

interface PendingCheckinData {
  guestId?: string;
  name: string;
  actualPax: number;
  souvenirClaimed: boolean;
  tableNumber: string;
  source: 'qr_scan' | 'manual';
  code: string;
  isDuplicate: boolean;
  previousCheckInTime?: string;
}

export function ReceptionCheckin({ guests, rsvps, showToast }: ReceptionCheckinProps) {
  // Check-in records synced from Firestore
  const [checkins, setCheckins] = useState<CheckInRecord[]>([]);
  // Wedding tables synced from Firestore for live seating resolution
  const [tables, setTables] = useState<WeddingTable[]>([]);

  // Camera & Scanner States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const lastScannedCodeRef = useRef<string | null>(null);
  const lastScanTimestampRef = useRef<number>(0);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [historySearchQuery, setHistorySearchQuery] = useState<string>('');

  // Confirmation Modal State
  const [pendingCheckin, setPendingCheckin] = useState<PendingCheckinData | null>(null);
  const [isSubmittingCheckin, setIsSubmittingCheckin] = useState<boolean>(false);

  // SweetAlert-style Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<CheckInRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Real-time sync for checkins and wedding_tables collection
  useEffect(() => {
    const qCheckins = query(collection(db, 'checkins'), orderBy('createdAt', 'desc'));
    const unsubCheckins = onSnapshot(
      qCheckins,
      (snapshot) => {
        const records = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as CheckInRecord[];
        setCheckins(records);
      },
      () => {}
    );

    const qTables = query(collection(db, 'wedding_tables'), orderBy('number', 'asc'));
    const unsubTables = onSnapshot(
      qTables,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as WeddingTable[];
        setTables(list);
      },
      () => {}
    );

    return () => {
      unsubCheckins();
      unsubTables();
    };
  }, []);

  // Stop camera media stream
  const stopCameraStream = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start camera media stream
  const startCameraStream = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch {
      setCameraError('Gagal mengakses kamera. Harap izinkan akses kamera pada browser Anda.');
      setIsCameraActive(false);
    }
  }, [cameraFacing, stopCameraStream]);

  // Handle scanned raw string
  const handleDecodedQR = useCallback(
    (rawText: string) => {
      const now = Date.now();
      // Debounce duplicate scans within 2.5 seconds
      if (lastScannedCodeRef.current === rawText && now - lastScanTimestampRef.current < 2500) {
        return;
      }
      lastScannedCodeRef.current = rawText;
      lastScanTimestampRef.current = now;

      const parsed = parseGuestPayload(rawText);
      const guestNameClean = parsed.name.trim();

      // Check if guest has already checked in
      const existingCheckin = checkins.find(
        (c) =>
          c.name.toLowerCase() === guestNameClean.toLowerCase() ||
          (parsed.id && c.guestId === parsed.id)
      );

      // Find matched RSVP or Guest record
      const matchedGuest = guests.find(
        (g) =>
          (parsed.id && g.id === parsed.id) ||
          g.name.toLowerCase() === guestNameClean.toLowerCase()
      );
      const matchedRsvp = rsvps.find(
        (r) => r.name.toLowerCase() === guestNameClean.toLowerCase()
      );

      const resolvedPax = matchedRsvp?.guestCount || parsed.pax || 1;
      const matchedTableFromCollection = tables.find((t) =>
        (t.assignedGuests || []).some(
          (ag) =>
            ag.name?.toLowerCase().trim() === guestNameClean.toLowerCase() ||
            (matchedGuest?.id && ag.id === matchedGuest.id)
        )
      );
      const resolvedTable = matchedGuest?.tableNumber || matchedRsvp?.tableNumber || matchedTableFromCollection?.number || '';

      if (existingCheckin) {
        playWarningBeep();
        setPendingCheckin({
          guestId: existingCheckin.guestId || matchedGuest?.id,
          name: existingCheckin.name,
          actualPax: existingCheckin.actualPax || resolvedPax,
          souvenirClaimed: existingCheckin.souvenirClaimed ?? true,
          tableNumber: existingCheckin.tableNumber || resolvedTable,
          source: 'qr_scan',
          code: parsed.code,
          isDuplicate: true,
          previousCheckInTime: existingCheckin.checkInTime,
        });
      } else {
        playSuccessBeep();
        setPendingCheckin({
          guestId: matchedGuest?.id,
          name: guestNameClean,
          actualPax: resolvedPax,
          souvenirClaimed: true, // Default souvenir true upon arrival
          tableNumber: resolvedTable,
          source: 'qr_scan',
          code: parsed.code,
          isDuplicate: false,
        });
      }
    },
    [checkins, guests, rsvps]
  );

  // Scanner frame processing loop
  useEffect(() => {
    if (!isCameraActive) return;

    let isActive = true;

    const scanFrame = () => {
      if (!isActive) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        const width = video.videoWidth;
        const height = video.videoHeight;

        if (width > 0 && height > 0) {
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (ctx) {
            ctx.drawImage(video, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'dontInvert',
            });

            if (code && code.data) {
              handleDecodedQR(code.data);
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      isActive = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive, handleDecodedQR]);

  // Clean up media streams on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, [stopCameraStream]);

  // Toggle Camera Facing
  const handleSwitchCamera = () => {
    setCameraFacing((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  useEffect(() => {
    if (isCameraActive) {
      startCameraStream();
    }
  }, [cameraFacing, isCameraActive, startCameraStream]);

  // Save / Update Check-In
  const handleConfirmCheckin = async () => {
    if (!pendingCheckin) return;
    setIsSubmittingCheckin(true);

    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      // 1. Check if record exists in checkins collection
      const existing = checkins.find(
        (c) =>
          c.name.toLowerCase() === pendingCheckin.name.toLowerCase() ||
          (pendingCheckin.guestId && c.guestId === pendingCheckin.guestId)
      );

      if (existing && existing.id) {
        // Update existing record
        await updateDoc(doc(db, 'checkins', existing.id), {
          actualPax: pendingCheckin.actualPax,
          souvenirClaimed: pendingCheckin.souvenirClaimed,
          tableNumber: pendingCheckin.tableNumber,
          notes: `Diperbarui pada ${timeStr}`,
        });
      } else {
        // Insert new checkin
        await addDoc(collection(db, 'checkins'), {
          guestId: pendingCheckin.guestId || '',
          name: pendingCheckin.name,
          checkInTime: timeStr,
          actualPax: pendingCheckin.actualPax,
          souvenirClaimed: pendingCheckin.souvenirClaimed,
          tableNumber: pendingCheckin.tableNumber || '',
          source: pendingCheckin.source,
          createdAt: serverTimestamp(),
        });
      }

      // 2. Also update matching guest doc if exists
      if (pendingCheckin.guestId) {
        try {
          await updateDoc(doc(db, 'guests', pendingCheckin.guestId), {
            checkedIn: true,
            checkInTime: timeStr,
            actualPax: pendingCheckin.actualPax,
            souvenirClaimed: pendingCheckin.souvenirClaimed,
            tableNumber: pendingCheckin.tableNumber || '',
          });
        } catch {
          // Safe fallback
        }
      }

      // 3. Also update matching RSVP doc if exists
      const matchedRsvp = rsvps.find(
        (r) => r.name.toLowerCase() === pendingCheckin.name.toLowerCase()
      );
      if (matchedRsvp && matchedRsvp.id) {
        try {
          await updateDoc(doc(db, 'rsvps', matchedRsvp.id), {
            checkedIn: true,
            checkInTime: timeStr,
            actualPax: pendingCheckin.actualPax,
            souvenirClaimed: pendingCheckin.souvenirClaimed,
            tableNumber: pendingCheckin.tableNumber || '',
          });
        } catch {
          // Safe fallback
        }
      }

      showToast(
        'success',
        `Check-in tamu "${pendingCheckin.name}" (${pendingCheckin.actualPax} Pax) berhasil disimpan!`
      );
      setPendingCheckin(null);
    } catch {
      showToast('error', 'Gagal menyimpan check-in ke Firestore.');
    } finally {
      setIsSubmittingCheckin(false);
    }
  };

  // Delete / Cancel Check-In
  const handleDeleteCheckin = async () => {
    if (!deleteTarget || !deleteTarget.id) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'checkins', deleteTarget.id));
      showToast('success', `Check-in "${deleteTarget.name}" berhasil dibatalkan.`);
      setDeleteTarget(null);
    } catch {
      showToast('error', 'Gagal membatalkan check-in.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Manual Check-In trigger from search list
  const handleInitiateManualCheckin = (guestItem: { id?: string; name: string; pax?: number; tableNumber?: string }) => {
    const existing = checkins.find(
      (c) =>
        c.name.toLowerCase() === guestItem.name.toLowerCase() ||
        (guestItem.id && c.guestId === guestItem.id)
    );

    if (existing) {
      playWarningBeep();
      setPendingCheckin({
        guestId: existing.guestId || guestItem.id,
        name: existing.name,
        actualPax: existing.actualPax || guestItem.pax || 1,
        souvenirClaimed: existing.souvenirClaimed ?? true,
        tableNumber: existing.tableNumber || guestItem.tableNumber || '',
        source: 'manual',
        code: generateTicketCode(existing.name, existing.guestId),
        isDuplicate: true,
        previousCheckInTime: existing.checkInTime,
      });
    } else {
      playSuccessBeep();
      setPendingCheckin({
        guestId: guestItem.id,
        name: guestItem.name,
        actualPax: guestItem.pax || 1,
        souvenirClaimed: true,
        tableNumber: guestItem.tableNumber || '',
        source: 'manual',
        code: generateTicketCode(guestItem.name, guestItem.id),
        isDuplicate: false,
      });
    }
  };

  // KPI Calculations
  const totalCheckinsCount = checkins.length;
  const totalPaxInBallroom = checkins.reduce((sum, item) => sum + (Number(item.actualPax) || 1), 0);
  const totalSouvenirsGiven = checkins.filter((c) => c.souvenirClaimed).length;
  const totalExpectedGuests = Math.max(guests.length, rsvps.length);
  const pendingArrivals = Math.max(0, totalExpectedGuests - totalCheckinsCount);

  // Filtered guest list for manual search
  const filteredManualGuests = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const qLower = searchQuery.toLowerCase().trim();

    const resolveTableForGuest = (name: string, id?: string) => {
      const norm = name.toLowerCase().trim();
      const matched = tables.find((t) =>
        (t.assignedGuests || []).some(
          (ag) =>
            ag.name?.toLowerCase().trim() === norm ||
            (id && ag.id === id)
        )
      );
      return matched ? matched.number : undefined;
    };

    // Map unique guests by name
    const map = new Map<string, { id?: string; name: string; phone?: string; pax?: number; tableNumber?: string; isCheckedIn: boolean }>();

    guests.forEach((g) => {
      const isChecked = checkins.some((c) => c.name.toLowerCase() === g.name.toLowerCase() || (g.id && c.guestId === g.id));
      map.set(g.name.toLowerCase(), {
        id: g.id,
        name: g.name,
        phone: g.phone,
        pax: g.actualPax || 1,
        tableNumber: g.tableNumber || resolveTableForGuest(g.name, g.id),
        isCheckedIn: isChecked,
      });
    });

    rsvps.forEach((r) => {
      const existing = map.get(r.name.toLowerCase());
      const isChecked = checkins.some((c) => c.name.toLowerCase() === r.name.toLowerCase());
      if (existing) {
        existing.pax = r.guestCount || existing.pax || 1;
        if (!existing.tableNumber) {
          existing.tableNumber = r.tableNumber || resolveTableForGuest(r.name);
        }
      } else {
        map.set(r.name.toLowerCase(), {
          name: r.name,
          pax: r.guestCount || 1,
          tableNumber: r.tableNumber || resolveTableForGuest(r.name),
          isCheckedIn: isChecked,
        });
      }
    });

    return Array.from(map.values())
      .filter((item) => item.name.toLowerCase().includes(qLower) || (item.phone && item.phone.includes(qLower)))
      .slice(0, 10);
  }, [guests, rsvps, checkins, tables, searchQuery]);

  // Filtered attendance records for history table
  const filteredCheckins = useMemo(() => {
    if (!historySearchQuery.trim()) return checkins;
    const qLower = historySearchQuery.toLowerCase().trim();
    return checkins.filter(
      (c) =>
        c.name.toLowerCase().includes(qLower) ||
        (c.tableNumber && c.tableNumber.toLowerCase().includes(qLower)) ||
        (c.checkInTime && c.checkInTime.includes(qLower))
    );
  }, [checkins, historySearchQuery]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (checkins.length === 0) {
      showToast('error', 'Belum ada data check-in tamu untuk diekspor.');
      return;
    }

    const headers = ['No', 'Waktu Masuk', 'Nama Tamu', 'Pax Hadir', 'Suvenir', 'Nomor Meja', 'Metode'];
    const rows = checkins.map((item, index) => [
      index + 1,
      `"${item.checkInTime || '-'}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      item.actualPax || 1,
      item.souvenirClaimed ? 'Ya' : 'Belum',
      `"${item.tableNumber || '-'}"`,
      item.source === 'qr_scan' ? 'Scan QR' : 'Manual',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-meja-resepsi-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Rekapitulasi meja resepsi berhasil diunduh dalam format CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sage/15 via-white to-sage/5 rounded-2xl p-6 border border-sage/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/20 text-sage-dark text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Operasional Hari-H</span>
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-dark">
            Meja Resepsi & Check-in Tamu
          </h2>
          <p className="text-xs text-text-dark/60 mt-1 max-w-xl leading-relaxed">
            Pindai QR Pass tamu secara instan, catat jumlah pax fisik yang hadir, kelola distribusi suvenir, dan pantau statistik ballroom secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-gray-200 text-text-dark/80 hover:text-text-dark hover:border-gray-300 rounded-xl text-xs font-semibold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} />
            <span>Unduh CSV Rekap</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-text-dark/60 mb-2">
            <span className="text-xs font-medium">Tamu Check-In</span>
            <div className="w-8 h-8 rounded-xl bg-sage/10 text-sage flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-text-dark">{totalCheckinsCount}</p>
          <p className="text-[11px] text-text-dark/50 mt-1">Undangan tiba di lokasi</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-text-dark/60 mb-2">
            <span className="text-xs font-medium">Total Pax Hadir</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-text-dark">{totalPaxInBallroom}</p>
          <p className="text-[11px] text-text-dark/50 mt-1">Orang fisik di ballroom</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-text-dark/60 mb-2">
            <span className="text-xs font-medium">Suvenir Diberikan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Gift size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-text-dark">{totalSouvenirsGiven}</p>
          <p className="text-[11px] text-text-dark/50 mt-1">Paket suvenir diserahkan</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-text-dark/60 mb-2">
            <span className="text-xs font-medium">Belum Hadir</span>
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-text-dark">{pendingArrivals}</p>
          <p className="text-[11px] text-text-dark/50 mt-1">Estimasi tamu tersisa</p>
        </div>
      </div>

      {/* Main Grid: Scanner Box + Manual Search Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Camera Scanner (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera size={18} className="text-sage" />
              <h3 className="font-bold text-sm text-text-dark">Pemindai QR Pass Kamera</h3>
            </div>

            <div className="flex items-center gap-2">
              {isCameraActive && (
                <button
                  type="button"
                  onClick={handleSwitchCamera}
                  className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-text-dark/70 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Ganti Kamera Depan / Belakang"
                >
                  <RefreshCw size={13} />
                  <span>Kamera {cameraFacing === 'environment' ? 'Belakang' : 'Depan'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (isCameraActive) {
                    stopCameraStream();
                    setIsCameraActive(false);
                  } else {
                    startCameraStream();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isCameraActive
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-sage text-white hover:bg-sage-dark'
                }`}
              >
                {isCameraActive ? (
                  <>
                    <CameraOff size={14} />
                    <span>Matikan Kamera</span>
                  </>
                ) : (
                  <>
                    <Camera size={14} />
                    <span>Nyalakan Kamera</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Scanner Viewport Container */}
          <div className="relative w-full aspect-video md:aspect-[4/3] bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center border border-gray-200">
            {/* Hidden canvas used by jsQR */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Video stream */}
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${!isCameraActive && 'hidden'}`}
              playsInline
              muted
            />

            {/* Inactive State Overlay */}
            {!isCameraActive && (
              <div className="flex flex-col items-center justify-center text-center p-6 text-white/80">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                  <Camera size={26} className="text-white/60" />
                </div>
                <h4 className="font-semibold text-sm text-white mb-1">Kamera Dinonaktifkan</h4>
                <p className="text-xs text-white/50 max-w-xs mb-4">
                  Nyalakan kamera untuk memindai QR Pass tamu di meja resepsi.
                </p>
                <button
                  type="button"
                  onClick={startCameraStream}
                  className="px-4 py-2 bg-sage hover:bg-sage-dark text-white rounded-full text-xs font-semibold shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Camera size={14} />
                  <span>Aktifkan Scanner</span>
                </button>
                {cameraError && (
                  <p className="text-xs text-red-400 mt-3 max-w-xs">{cameraError}</p>
                )}
              </div>
            )}

            {/* Active Scanning Target Overlay with Laser Animation */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Darkened corner mask */}
                <div className="relative w-64 h-64 border-2 border-dashed border-white/60 rounded-2xl flex items-center justify-center shadow-2xl">
                  {/* Golden frame corners */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#D4AF37] rounded-br-lg" />

                  {/* Animated laser scanline */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_#ef4444] animate-pulse" />

                  <span className="text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs font-medium">
                    Arahkan QR Pass ke Kotak
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Manual Search & Fast Check-In (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-xs p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Search size={18} className="text-sage" />
            <h3 className="font-bold text-sm text-text-dark">Pencarian & Check-in Manual</h3>
          </div>
          <p className="text-xs text-text-dark/50 mb-3">
            Gunakan fitur ini jika tamu tidak membawa ponsel atau QR Pass tidak terbaca.
          </p>

          {/* Search Input with Icon Group */}
          <div className="relative flex items-center mb-3">
            <Search size={15} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama tamu atau nomor WhatsApp..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-xs text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sage focus:border-sage transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Reset Pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Results List */}
          <div className="flex-1 overflow-y-auto max-h-[290px] space-y-2 pr-1">
            {searchQuery.trim() === '' ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                Ketik nama tamu untuk mencari data undangan...
              </div>
            ) : filteredManualGuests.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                Tidak ditemukan tamu dengan nama "{searchQuery}".
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleInitiateManualCheckin({
                        name: searchQuery.trim(),
                        pax: 1,
                      })
                    }
                    className="px-3 py-1.5 bg-sage text-white rounded-lg text-xs font-semibold hover:bg-sage-dark transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus size={13} />
                    <span>Check-in Tamu Baru "{searchQuery.trim()}"</span>
                  </button>
                </div>
              </div>
            ) : (
              filteredManualGuests.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 hover:bg-gray-100/80 rounded-xl border border-gray-200/70 flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-text-dark truncate">{item.name}</h4>
                      {item.isCheckedIn && (
                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                          <Check size={10} />
                          Sudah Masuk
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-text-dark/50 mt-1">
                      <span>{item.pax || 1} Pax</span>
                      {item.phone && <span>• {item.phone}</span>}
                      {item.tableNumber && <span>• Meja: {item.tableNumber}</span>}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInitiateManualCheckin(item)}
                    className="shrink-0 px-3 py-1.5 bg-sage text-white hover:bg-sage-dark rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <UserCheck size={13} />
                    <span>{item.isCheckedIn ? 'Edit' : 'Check-in'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-sage" />
            <h3 className="font-bold text-sm text-text-dark">
              Riwayat Kedatangan Tamu ({filteredCheckins.length})
            </h3>
          </div>

          <div className="relative flex items-center w-full sm:w-64">
            <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              placeholder="Cari di log riwayat..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sage"
            />
            {historySearchQuery && (
              <button
                type="button"
                onClick={() => setHistorySearchQuery('')}
                className="absolute right-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                title="Reset"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-text-dark/60 font-semibold uppercase tracking-wider text-[10px] bg-gray-50/50">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3">Waktu Masuk</th>
                <th className="py-3 px-3">Nama Tamu</th>
                <th className="py-3 px-3 text-center">Pax</th>
                <th className="py-3 px-3 text-center">Suvenir</th>
                <th className="py-3 px-3">Nomor Meja</th>
                <th className="py-3 px-3 text-center">Metode</th>
                <th className="py-3 px-3 text-center w-16">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCheckins.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-dark/40 text-xs">
                    Belum ada riwayat kedatangan tamu yang tercatat.
                  </td>
                </tr>
              ) : (
                filteredCheckins.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-mono font-medium text-text-dark/50">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 font-mono text-text-dark/70 whitespace-nowrap">
                      {item.checkInTime || '-'}
                    </td>
                    <td className="py-3 px-3 font-bold text-text-dark whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px]">
                        <Users size={11} />
                        {item.actualPax || 1}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.souvenirClaimed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 size={11} />
                          Sudah
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium text-[11px]">
                          Belum
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-text-dark/70">
                      {item.tableNumber ? (
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <MapPin size={11} className="text-sage" />
                          {item.tableNumber}
                        </span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-text-dark/50 bg-gray-100 px-2 py-0.5 rounded">
                        {item.source === 'qr_scan' ? 'Scan QR' : 'Manual'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus / Batalkan Check-in"
                        aria-label="Hapus check-in"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Check-In (SweetAlert-style) */}
      <AnimatePresence>
        {pendingCheckin && (
          <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setPendingCheckin(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Status Bar */}
              <div
                className={`p-5 text-center ${
                  pendingCheckin.isDuplicate
                    ? 'bg-amber-500/10 text-amber-800 border-b border-amber-200'
                    : 'bg-sage/15 text-sage-dark border-b border-sage/20'
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-2.5 ${
                    pendingCheckin.isDuplicate ? 'bg-amber-100 text-amber-600' : 'bg-sage/20 text-sage'
                  }`}
                >
                  {pendingCheckin.isDuplicate ? (
                    <AlertTriangle size={28} />
                  ) : (
                    <CheckCircle2 size={28} />
                  )}
                </div>
                <h3 className="font-heading text-lg font-bold">
                  {pendingCheckin.isDuplicate ? 'Peringatan: Tamu Sudah Check-In!' : 'Konfirmasi Check-In Hadir'}
                </h3>
                {pendingCheckin.isDuplicate && pendingCheckin.previousCheckInTime && (
                  <p className="text-xs text-amber-700 mt-1">
                    Tamu ini tercatat telah masuk sebelumnya pada pukul{' '}
                    <strong>{pendingCheckin.previousCheckInTime}</strong>.
                  </p>
                )}
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
                    Nama Tamu
                  </label>
                  <p className="text-base font-bold text-text-dark bg-gray-50 px-3.5 py-2.5 rounded-xl border border-gray-200">
                    {pendingCheckin.name}
                  </p>
                </div>

                {/* Pax Stepper Counter */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
                    Jumlah Pax Fisik yang Masuk
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setPendingCheckin((prev) =>
                          prev ? { ...prev, actualPax: Math.max(1, prev.actualPax - 1) } : null
                        )
                      }
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-text-dark transition-colors cursor-pointer active:scale-95"
                    >
                      <Minus size={16} />
                    </button>
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 text-center">
                      <span className="text-xl font-bold font-heading text-text-dark">
                        {pendingCheckin.actualPax}
                      </span>
                      <span className="text-xs text-text-dark/50 ml-1.5">Orang</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingCheckin((prev) =>
                          prev ? { ...prev, actualPax: prev.actualPax + 1 } : null
                        )
                      }
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-text-dark transition-colors cursor-pointer active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Souvenir Claim Toggle */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
                    Status Paket Suvenir
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setPendingCheckin((prev) =>
                        prev ? { ...prev, souvenirClaimed: !prev.souvenirClaimed } : null
                      )
                    }
                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      pendingCheckin.souvenirClaimed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Gift size={18} className={pendingCheckin.souvenirClaimed ? 'text-emerald-600' : 'text-gray-400'} />
                      <span className="text-xs font-semibold">
                        {pendingCheckin.souvenirClaimed
                          ? 'Paket Suvenir Diserahkan'
                          : 'Belum Menyerahkan Suvenir'}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        pendingCheckin.souvenirClaimed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {pendingCheckin.souvenirClaimed && <Check size={13} strokeWidth={3} />}
                    </div>
                  </button>
                </div>

                {/* Table Number input */}
                <div>
                  <label className="block text-[11px] font-semibold text-text-dark/70 uppercase tracking-wider mb-1">
                    Nomor / Zona Meja (Opsional)
                  </label>
                  <div className="relative flex items-center">
                    <Hash size={15} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={pendingCheckin.tableNumber}
                      onChange={(e) =>
                        setPendingCheckin((prev) =>
                          prev ? { ...prev, tableNumber: e.target.value } : null
                        )
                      }
                      placeholder="Contoh: Meja VIP 2 / Meja 5"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-text-dark placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-sage"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setPendingCheckin(null)}
                    disabled={isSubmittingCheckin}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-text-dark/70 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X size={15} />
                    <span>Batal</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmCheckin}
                    disabled={isSubmittingCheckin}
                    className="flex-1 py-3 px-4 rounded-xl bg-sage hover:bg-sage-dark text-white text-xs font-semibold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{pendingCheckin.isDuplicate ? 'Perbarui Data' : 'Konfirmasi Hadir'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete / Cancel Check-in Confirmation Modal (SweetAlert-style) */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 w-screen h-screen z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="fixed inset-0" onClick={() => setDeleteTarget(null)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} />
              </div>
              <h4 className="font-heading font-bold text-lg text-text-dark mb-1">
                Batalkan Check-in?
              </h4>
              <p className="text-xs text-text-dark/60 mb-6 leading-relaxed">
                Anda yakin ingin menghapus catatan check-in untuk tamu{' '}
                <strong>"{deleteTarget.name}"</strong>? Data counter akan otomatis disesuaikan kembali.
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-text-dark/70 hover:bg-gray-50 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X size={15} />
                  <span>Batal</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCheckin}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5 active:scale-98 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  <span>Ya, Hapus</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
