import { describe, it, expect, afterAll } from 'vitest';
import { checkinService, safeIsoTimestamp } from '../services/checkinService';
import { pool } from '../db/connection';
import crypto from 'crypto';

describe('Checkin Service & Timestamp Resiliency Suite', () => {
  afterAll(async () => {
    await pool.end();
  });

  describe('safeIsoTimestamp helper', () => {
    it('should return valid ISO string when input is null or undefined', () => {
      const resNull = safeIsoTimestamp(null);
      const resUndefined = safeIsoTimestamp(undefined);
      expect(new Date(resNull).getTime()).not.toBeNaN();
      expect(new Date(resUndefined).getTime()).not.toBeNaN();
    });

    it('should parse valid ISO string properly', () => {
      const now = new Date().toISOString();
      const res = safeIsoTimestamp(now);
      expect(res).toBe(now);
    });

    it('should safely fallback to current ISO timestamp when given invalid date string like 14.30.00', () => {
      const res = safeIsoTimestamp('14.30.00');
      expect(() => new Date(res).toISOString()).not.toThrow();
      expect(new Date(res).getTime()).not.toBeNaN();
    });
  });

  describe('Atomic Check-In & Cancellation Rollback', () => {
    it('should atomically check-in guest and fully rollback guest status upon deletion', async () => {
      const guestId = 'test_guest_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
      const guestName = 'Test Guest Reception ' + Date.now();

      // 1. Insert test guest
      await pool.query(
        `INSERT INTO guests (id, name, phone, status, checked_in, souvenir_claimed, tier) 
         VALUES (?, ?, ?, 'sent', 0, 0, 'vip')`,
        [guestId, guestName, '081234567890']
      );

      // 2. Perform check-in via checkinService
      const { newRecord } = await checkinService.createCheckin({
        guestId,
        name: guestName,
        actualPax: 2,
        tier: 'vip',
        souvenirClaimed: true,
        tableNumber: 'VIP 1',
        source: 'qr_scan',
      });

      expect(newRecord).toBeDefined();
      expect(newRecord.id).toBeDefined();
      expect(newRecord.guestId).toBe(guestId);
      expect(newRecord.souvenirClaimed).toBe(true);

      // Verify guest is checked in
      const [guestRowsAfter] = await pool.query<any[]>(
        'SELECT checked_in, checked_in_at, souvenir_claimed, souvenir_claimed_at FROM guests WHERE id = ?',
        [guestId]
      );
      expect(guestRowsAfter[0].checked_in).toBe(1);
      expect(guestRowsAfter[0].checked_in_at).not.toBeNull();
      expect(guestRowsAfter[0].souvenir_claimed).toBe(1);

      // 3. Delete checkin and verify atomic rollback on guest record
      const deleteResult = await checkinService.deleteCheckin(newRecord.id);
      expect(deleteResult.success).toBe(true);
      expect(deleteResult.guestId).toBe(guestId);

      // Check checkins table
      const [checkinAfterDel] = await pool.query<any[]>(
        'SELECT id FROM checkins WHERE id = ?',
        [newRecord.id]
      );
      expect(checkinAfterDel.length).toBe(0);

      // Check guest record has been reset
      const [guestRowsAfterRollback] = await pool.query<any[]>(
        'SELECT checked_in, checked_in_at, souvenir_claimed, souvenir_claimed_at FROM guests WHERE id = ?',
        [guestId]
      );
      expect(guestRowsAfterRollback[0].checked_in).toBe(0);
      expect(guestRowsAfterRollback[0].checked_in_at).toBeNull();
      expect(guestRowsAfterRollback[0].souvenir_claimed).toBe(0);
      expect(guestRowsAfterRollback[0].souvenir_claimed_at).toBeNull();

      // 4. Cleanup guest
      await pool.query('DELETE FROM guests WHERE id = ?', [guestId]);
    });
  });
});
