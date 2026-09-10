import { describe, it, expect } from 'vitest';
import {
  isAttending,
  isDeclined,
  isMaybe,
  getAttendanceLabel,
  formatCurrency,
  getCoupleLabel,
} from '../reportExporter';
import { WeddingConfig } from '../../types';

describe('reportExporter Utility Suite', () => {
  describe('bilingual attendance helpers', () => {
    it('should correctly identify attending status in Indonesian and English', () => {
      expect(isAttending('hadir')).toBe(true);
      expect(isAttending('Hadir')).toBe(true);
      expect(isAttending('attending')).toBe(true);
      expect(isAttending('Attending')).toBe(true);
      expect(isAttending('yes')).toBe(true);
      expect(isAttending('tidak_hadir')).toBe(false);
      expect(isAttending('ragu')).toBe(false);
      expect(isAttending(undefined)).toBe(false);
    });

    it('should correctly identify declined status in Indonesian and English', () => {
      expect(isDeclined('tidak_hadir')).toBe(true);
      expect(isDeclined('tidak hadir')).toBe(true);
      expect(isDeclined('declined')).toBe(true);
      expect(isDeclined('no')).toBe(true);
      expect(isDeclined('hadir')).toBe(false);
      expect(isDeclined(undefined)).toBe(false);
    });

    it('should correctly identify maybe status in Indonesian and English', () => {
      expect(isMaybe('ragu')).toBe(true);
      expect(isMaybe('masih_ragu')).toBe(true);
      expect(isMaybe('maybe')).toBe(true);
      expect(isMaybe('hadir')).toBe(false);
      expect(isMaybe(undefined)).toBe(false);
    });

    it('should return human-readable attendance labels', () => {
      expect(getAttendanceLabel('hadir')).toBe('Hadir');
      expect(getAttendanceLabel('attending')).toBe('Hadir');
      expect(getAttendanceLabel('tidak_hadir')).toBe('Tidak Hadir');
      expect(getAttendanceLabel('declined')).toBe('Tidak Hadir');
      expect(getAttendanceLabel('ragu')).toBe('Masih Ragu');
      expect(getAttendanceLabel('maybe')).toBe('Masih Ragu');
      expect(getAttendanceLabel(undefined)).toBe('Belum Konfirmasi');
    });
  });

  describe('formatCurrency', () => {
    it('should format Indonesian Rupiah with proper separators', () => {
      const formatted = formatCurrency(25000000);
      expect(formatted).toContain('Rp');
      expect(formatted).toContain('25');
    });

    it('should handle zero or falsy amounts gracefully', () => {
      expect(formatCurrency(0)).toBe('Rp 0');
    });
  });

  describe('getCoupleLabel', () => {
    it('should format couple nickname properly', () => {
      const mockConfig = {
        groom: { nickname: 'Ali', fullName: 'Ali Ramadhan' },
        bride: { nickname: 'Fatimah', fullName: 'Fatimah Zahra' },
      } as unknown as WeddingConfig;

      expect(getCoupleLabel(mockConfig)).toBe('Ali & Fatimah');
    });
  });
});
