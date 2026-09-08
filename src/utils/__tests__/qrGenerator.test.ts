import { describe, it, expect } from 'vitest';
import {
  generateTicketCode,
  serializeGuestPayload,
  parseGuestPayload,
} from '../qrGenerator';

describe('qrGenerator Utility Suite', () => {
  describe('generateTicketCode', () => {
    it('should generate consistent format WDG-XXXXXX', () => {
      const code = generateTicketCode('Budi Santoso', 'guest_123');
      expect(code).toMatch(/^WDG-[A-F0-9]{6}$/);
    });

    it('should generate identical code for the same name and id (deterministic)', () => {
      const code1 = generateTicketCode('Siti Rahma', 'guest_456');
      const code2 = generateTicketCode('Siti Rahma', 'guest_456');
      expect(code1).toBe(code2);
    });

    it('should generate different codes for different guests', () => {
      const code1 = generateTicketCode('Ahmad Fauzi', 'guest_1');
      const code2 = generateTicketCode('Hendra Wijaya', 'guest_2');
      expect(code1).not.toBe(code2);
    });
  });

  describe('serializeGuestPayload & parseGuestPayload', () => {
    it('should serialize and parse JSON format accurately', () => {
      const guest = {
        id: 'g_8899',
        name: 'dr. Muhammad Rizky, Sp.A',
        pax: 3,
        code: 'WDG-A1B2C3',
      };

      const serialized = serializeGuestPayload(guest);
      expect(serialized).toContain('"name":"dr. Muhammad Rizky, Sp.A"');
      expect(serialized).toContain('"pax":3');

      const parsed = parseGuestPayload(serialized);
      expect(parsed.id).toBe('g_8899');
      expect(parsed.name).toBe('dr. Muhammad Rizky, Sp.A');
      expect(parsed.pax).toBe(3);
      expect(parsed.code).toBe('WDG-A1B2C3');
    });

    it('should parse legacy pipe-delimited format WDG|ID|NAME|PAX|CODE', () => {
      const pipeStr = 'WDG|g_101|Anisa Zahra|2|WDG-XYZ999';
      const parsed = parseGuestPayload(pipeStr);

      expect(parsed.id).toBe('g_101');
      expect(parsed.name).toBe('Anisa Zahra');
      expect(parsed.pax).toBe(2);
      expect(parsed.code).toBe('WDG-XYZ999');
    });

    it('should handle plain string fallback gracefully', () => {
      const plainStr = 'Dimas Anggara';
      const parsed = parseGuestPayload(plainStr);

      expect(parsed.name).toBe('Dimas Anggara');
      expect(parsed.pax).toBe(1);
      expect(parsed.code).toMatch(/^WDG-[A-F0-9]{6}$/);
    });

    it('should sanitize zero or negative pax to minimum 1', () => {
      const guest = {
        name: 'Guest Zero',
        pax: -5,
      };
      const serialized = serializeGuestPayload(guest);
      const parsed = parseGuestPayload(serialized);
      expect(parsed.pax).toBe(1);
    });
  });
});
