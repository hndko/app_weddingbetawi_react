import { describe, it, expect, beforeEach } from 'vitest';
import {
  openOfflineDB,
  getPendingCheckins,
  clearPendingCheckins,
  getCachedOfflineGuests,
  getCachedOfflineTables,
  syncOfflineCheckinsToServer,
} from '../offlineCheckinStore';

describe('offlineCheckinStore Suite', () => {
  it('should return empty list gracefully when IndexedDB is not present', async () => {
    const list = await getPendingCheckins();
    expect(Array.isArray(list)).toBe(true);
  });

  it('should return empty guests & tables gracefully when IndexedDB is empty/absent', async () => {
    const guests = await getCachedOfflineGuests();
    const tables = await getCachedOfflineTables();
    expect(Array.isArray(guests)).toBe(true);
    expect(Array.isArray(tables)).toBe(true);
  });

  it('should handle clearPendingCheckins without throwing errors', async () => {
    await expect(clearPendingCheckins()).resolves.not.toThrow();
  });

  it('should return syncedCount 0 when no pending check-ins exist', async () => {
    const mockSync = async () => ({ success: true, syncedCount: 0 });
    const result = await syncOfflineCheckinsToServer(mockSync);
    expect(result.syncedCount).toBe(0);
    expect(result.remainingCount).toBe(0);
  });
});
