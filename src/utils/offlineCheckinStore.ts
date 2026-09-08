import type { CheckInRecord, GuestInvitation, WeddingTable } from '../types';

const DB_NAME = 'mari_partner_offline_v1';
const DB_VERSION = 1;

const STORES = {
  PENDING_CHECKINS: 'pending_checkins',
  CACHED_GUESTS: 'cached_guests',
  CACHED_TABLES: 'cached_tables',
} as const;

/**
 * Inisialisasi koneksi IndexedDB dengan skema objek store
 */
export function openOfflineDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB tidak didukung pada lingkungan ini'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.PENDING_CHECKINS)) {
        db.createObjectStore(STORES.PENDING_CHECKINS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.CACHED_GUESTS)) {
        db.createObjectStore(STORES.CACHED_GUESTS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.CACHED_TABLES)) {
        db.createObjectStore(STORES.CACHED_TABLES, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Gagal membuka IndexedDB'));
    };
  });
}

/**
 * Simpan antrean check-in luring ke IndexedDB
 */
export async function saveOfflineCheckin(record: CheckInRecord): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_CHECKINS, 'readwrite');
      const store = tx.objectStore(STORES.PENDING_CHECKINS);
      
      const recordToSave = {
        ...record,
        id: record.id || `offline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      };

      const request = store.put(recordToSave);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('[OfflineStore] Gagal menyimpan offline check-in:', err);
    throw err;
  }
}

/**
 * Ambil seluruh antrean check-in yang belum tersinkronisasi
 */
export async function getPendingCheckins(): Promise<CheckInRecord[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_CHECKINS, 'readonly');
      const store = tx.objectStore(STORES.PENDING_CHECKINS);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result as CheckInRecord[]) || []);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('[OfflineStore] Gagal mengambil antrean offline check-in:', err);
    return [];
  }
}

/**
 * Hapus record check-in tertentu dari antrean (misal setelah berhasil di-sync)
 */
export async function removePendingCheckin(id: string): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_CHECKINS, 'readwrite');
      const store = tx.objectStore(STORES.PENDING_CHECKINS);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('[OfflineStore] Gagal menghapus record antrean:', err);
  }
}

/**
 * Kosongkan seluruh antrean check-in setelah sinkronisasi massal berhasil
 */
export async function clearPendingCheckins(): Promise<void> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PENDING_CHECKINS, 'readwrite');
      const store = tx.objectStore(STORES.PENDING_CHECKINS);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('[OfflineStore] Gagal membersihkan antrean offline:', err);
  }
}

/**
 * Simpan snapshot daftar tamu dan tabel untuk pencarian offline saat hari-H
 */
export async function cacheOfflineGuestsAndTables(
  guests: GuestInvitation[],
  tables: WeddingTable[]
): Promise<void> {
  try {
    const db = await openOfflineDB();
    
    // Cache Guests
    if (guests && guests.length > 0) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.CACHED_GUESTS, 'readwrite');
        const store = tx.objectStore(STORES.CACHED_GUESTS);
        store.clear();
        guests.forEach((g) => {
          if (g.id) store.put(g);
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    // Cache Tables
    if (tables && tables.length > 0) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORES.CACHED_TABLES, 'readwrite');
        const store = tx.objectStore(STORES.CACHED_TABLES);
        store.clear();
        tables.forEach((t) => {
          if (t.id) store.put(t);
        });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    }

    db.close();
  } catch (err) {
    console.warn('[OfflineStore] Gagal menyimpan cache tamu & meja luring:', err);
  }
}

/**
 * Ambil cache daftar tamu luring
 */
export async function getCachedOfflineGuests(): Promise<GuestInvitation[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CACHED_GUESTS, 'readonly');
      const store = tx.objectStore(STORES.CACHED_GUESTS);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result as GuestInvitation[]) || []);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('[OfflineStore] Gagal memuat snapshot tamu luring:', err);
    return [];
  }
}

/**
 * Ambil cache daftar meja luring
 */
export async function getCachedOfflineTables(): Promise<WeddingTable[]> {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.CACHED_TABLES, 'readonly');
      const store = tx.objectStore(STORES.CACHED_TABLES);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result as WeddingTable[]) || []);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn('[OfflineStore] Gagal memuat snapshot meja luring:', err);
    return [];
  }
}

/**
 * Sinkronisasi otomatis antrean check-in ke server REST API
 */
export async function syncOfflineCheckinsToServer(
  syncApiCall: (records: CheckInRecord[]) => Promise<{ success: boolean; syncedCount: number }>
): Promise<{ syncedCount: number; remainingCount: number }> {
  const pending = await getPendingCheckins();
  if (pending.length === 0) {
    return { syncedCount: 0, remainingCount: 0 };
  }

  try {
    const res = await syncApiCall(pending);
    if (res && res.success) {
      await clearPendingCheckins();
      return { syncedCount: res.syncedCount || pending.length, remainingCount: 0 };
    }
  } catch (err) {
    console.warn('[OfflineStore] Percobaan sinkronisasi gagal, antrean dipertahankan:', err);
  }

  const remaining = await getPendingCheckins();
  return { syncedCount: 0, remainingCount: remaining.length };
}
