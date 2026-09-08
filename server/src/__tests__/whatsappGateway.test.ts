import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cleanPhoneNumber,
  sendWhatsAppMessage,
  testWhatsAppGateway,
  WhatsAppGatewayConfig,
} from '../services/whatsappGateway';

describe('WhatsApp Gateway Service Suite', () => {
  describe('cleanPhoneNumber', () => {
    it('should normalize leading 0 to 62', () => {
      expect(cleanPhoneNumber('081234567890')).toBe('6281234567890');
    });

    it('should normalize leading 8 to 628', () => {
      expect(cleanPhoneNumber('81234567890')).toBe('6281234567890');
    });

    it('should preserve standard 62 prefix and strip symbols', () => {
      expect(cleanPhoneNumber('+62 812-3456-7890')).toBe('6281234567890');
    });

    it('should handle empty or whitespace-only inputs', () => {
      expect(cleanPhoneNumber('')).toBe('');
      expect(cleanPhoneNumber('   ')).toBe('');
    });
  });

  describe('Manual Fallback Provider', () => {
    it('should immediately succeed without network call in manual mode', async () => {
      const result = await sendWhatsAppMessage('081234567890', 'Halo dunia', {
        provider: 'manual',
      });

      expect(result.success).toBe(true);
      expect(result.provider).toBe('manual');
      expect(result.messageId).toContain('manual_');
      expect(result.details).toEqual({
        mode: 'manual_wa_me',
        phone: '6281234567890',
      });
    });

    it('should default to manual provider if config is missing or provider undefined', async () => {
      const result = await sendWhatsAppMessage('081234567890', 'Halo default');
      expect(result.success).toBe(true);
      expect(result.provider).toBe('manual');
    });
  });

  describe('Provider Validation Guardrails', () => {
    it('should reject Fonnte if token is missing', async () => {
      const config: WhatsAppGatewayConfig = { provider: 'fonnte' };
      const result = await sendWhatsAppMessage('081234567890', 'Halo', config);
      expect(result.success).toBe(false);
      expect(result.provider).toBe('fonnte');
      expect(result.error).toContain('Token API Fonnte belum diisi');
    });

    it('should reject WAHA if endpoint URL is missing', async () => {
      const config: WhatsAppGatewayConfig = { provider: 'waha' };
      const result = await sendWhatsAppMessage('081234567890', 'Halo', config);
      expect(result.success).toBe(false);
      expect(result.provider).toBe('waha');
      expect(result.error).toContain('URL Endpoint Server WAHA belum diisi');
    });

    it('should reject Twilio if any credential is missing', async () => {
      const config: WhatsAppGatewayConfig = {
        provider: 'twilio',
        twilioAccountSid: 'AC123',
        // missing authToken and fromNumber
      };
      const result = await sendWhatsAppMessage('081234567890', 'Halo', config);
      expect(result.success).toBe(false);
      expect(result.provider).toBe('twilio');
      expect(result.error).toContain('Kredensial Twilio');
    });

    it('should reject invalid or short phone numbers across providers', async () => {
      const fonnteConfig: WhatsAppGatewayConfig = { provider: 'fonnte', fonnteToken: 'valid_token' };
      const resFonnte = await sendWhatsAppMessage('123', 'Halo', fonnteConfig);
      expect(resFonnte.success).toBe(false);
      expect(resFonnte.error).toContain('Nomor telepon tujuan tidak valid');

      const wahaConfig: WhatsAppGatewayConfig = { provider: 'waha', wahaEndpointUrl: 'https://waha.example.com' };
      const resWaha = await sendWhatsAppMessage('abc', 'Halo', wahaConfig);
      expect(resWaha.success).toBe(false);
      expect(resWaha.error).toContain('Nomor telepon tujuan tidak valid');
    });
  });

  describe('Mocked Provider Network Calls', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should send via Fonnte successfully when API returns success', async () => {
      const fakeFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: true, id: ['msg_fonnte_123'] }),
      });
      vi.stubGlobal('fetch', fakeFetch);

      const config: WhatsAppGatewayConfig = {
        provider: 'fonnte',
        fonnteToken: 'secret_token_123',
      };

      const result = await sendWhatsAppMessage('081234567890', 'Undangan Pernikahan', config);
      expect(result.success).toBe(true);
      expect(result.provider).toBe('fonnte');
      expect(result.messageId).toBe('msg_fonnte_123');
      expect(fakeFetch).toHaveBeenCalledTimes(1);
      expect(fakeFetch).toHaveBeenCalledWith(
        'https://api.fonnte.com/send',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'secret_token_123',
          }),
        })
      );
    });

    it('should send via WAHA successfully when endpoint returns success', async () => {
      const fakeFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 'waha_msg_999' }),
      });
      vi.stubGlobal('fetch', fakeFetch);

      const config: WhatsAppGatewayConfig = {
        provider: 'waha',
        wahaEndpointUrl: 'https://waha.mycorp.id/',
        wahaApiKey: 'waha_key_abc',
        wahaSession: 'session_wedding',
      };

      const result = await sendWhatsAppMessage('081234567890', 'Halo dari WAHA', config);
      expect(result.success).toBe(true);
      expect(result.provider).toBe('waha');
      expect(result.messageId).toBe('waha_msg_999');
      expect(fakeFetch).toHaveBeenCalledTimes(1);
      expect(fakeFetch).toHaveBeenCalledWith(
        'https://waha.mycorp.id/api/sendText',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Api-Key': 'waha_key_abc',
          }),
        })
      );
    });

    it('should send via Twilio successfully with Basic Auth', async () => {
      const fakeFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ sid: 'SM1234567890abcdef' }),
      });
      vi.stubGlobal('fetch', fakeFetch);

      const config: WhatsAppGatewayConfig = {
        provider: 'twilio',
        twilioAccountSid: 'AC_TEST_SID',
        twilioAuthToken: 'AUTH_TEST_TOKEN',
        twilioFromNumber: '+14155238886',
      };

      const result = await sendWhatsAppMessage('081234567890', 'Halo dari Twilio', config);
      expect(result.success).toBe(true);
      expect(result.provider).toBe('twilio');
      expect(result.messageId).toBe('SM1234567890abcdef');
      expect(fakeFetch).toHaveBeenCalledTimes(1);
      expect(fakeFetch).toHaveBeenCalledWith(
        'https://api.twilio.com/2010-04-01/Accounts/AC_TEST_SID/Messages.json',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic '),
          }),
        })
      );
    });

    it('should execute testWhatsAppGateway and format the ping message', async () => {
      const fakeFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ status: true, id: ['test_fonnte_id'] }),
      });
      vi.stubGlobal('fetch', fakeFetch);

      const config: WhatsAppGatewayConfig = {
        provider: 'fonnte',
        fonnteToken: 'secret_token',
      };

      const result = await testWhatsAppGateway('081234567890', config);
      expect(result.success).toBe(true);
      expect(result.provider).toBe('fonnte');
      expect(fakeFetch).toHaveBeenCalledTimes(1);
    });
  });
});
