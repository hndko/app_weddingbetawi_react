export type WhatsAppGatewayProvider = 'manual' | 'fonnte' | 'waha' | 'twilio';

export interface WhatsAppGatewayConfig {
  provider: WhatsAppGatewayProvider;
  fonnteToken?: string;
  wahaEndpointUrl?: string;
  wahaApiKey?: string;
  wahaSession?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  adminPhone?: string;
  notifyAdminOnRsvp?: boolean;
  notifyGuestOnRsvp?: boolean;
}

export interface SendMessageResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  details?: unknown;
}

/**
 * Membersihkan format nomor telepon menjadi standar internasional tanpa tanda + atau spasi (contoh: 6281234567890).
 * Mendukung preservasi nomor internasional jika diawali tanda '+' (contoh: +81, +82, +65).
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';
  const trimmed = phone.trim();
  const startsWithPlus = trimmed.startsWith('+');
  let clean = trimmed.replace(/[^0-9]/g, '');
  if (!clean) return '';

  if (startsWithPlus) {
    // Nomor internasional eksplisit dengan prefix +, pertahankan kode negara asli
    return clean;
  }

  // Penanganan format nomor Indonesia lokal
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (clean.startsWith('8') && clean.length >= 9 && clean.length <= 13) {
    // Konvensi seluler Indonesia tanpa angka 0 di depan (misal 81234567890)
    clean = '62' + clean;
  }
  return clean;
}

export interface IWhatsAppProvider {
  readonly name: string;
  sendMessage(to: string, message: string, config: WhatsAppGatewayConfig): Promise<SendMessageResult>;
}

/**
 * Provider Fonnte (https://fonnte.com)
 */
class FonnteProvider implements IWhatsAppProvider {
  readonly name = 'fonnte';

  async sendMessage(to: string, message: string, config: WhatsAppGatewayConfig): Promise<SendMessageResult> {
    const token = config.fonnteToken?.trim();
    if (!token) {
      return { success: false, provider: this.name, error: 'Token API Fonnte belum diisi di pengaturan' };
    }

    const cleanPhone = cleanPhoneNumber(to);
    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, provider: this.name, error: `Nomor telepon tujuan tidak valid: "${to}"` };
    }

    try {
      const body = new URLSearchParams();
      body.append('target', cleanPhone);
      body.append('message', message);
      body.append('countryCode', '62');

      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json() as any;

      if (!response.ok || data.status === false) {
        return {
          success: false,
          provider: this.name,
          error: data.reason || data.message || `HTTP ${response.status}: Gagal mengirim via Fonnte`,
          details: data,
        };
      }

      return {
        success: true,
        provider: this.name,
        messageId: data.id?.[0] || data.process || 'fonnte_' + Date.now(),
        details: data,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, provider: this.name, error: `Koneksi Fonnte gagal: ${msg}` };
    }
  }
}

/**
 * Provider WAHA (WhatsApp HTTP API - self-hosted open-source)
 * https://waha.devlike.pro
 */
class WahaProvider implements IWhatsAppProvider {
  readonly name = 'waha';

  async sendMessage(to: string, message: string, config: WhatsAppGatewayConfig): Promise<SendMessageResult> {
    const rawUrl = config.wahaEndpointUrl?.trim();
    if (!rawUrl) {
      return { success: false, provider: this.name, error: 'URL Endpoint Server WAHA belum diisi di pengaturan' };
    }

    const cleanPhone = cleanPhoneNumber(to);
    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, provider: this.name, error: `Nomor telepon tujuan tidak valid: "${to}"` };
    }

    const endpoint = rawUrl.replace(/\/$/, '') + '/api/sendText';
    const session = config.wahaSession?.trim() || 'default';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (config.wahaApiKey?.trim()) {
      headers['X-Api-Key'] = config.wahaApiKey.trim();
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          session,
          chatId: `${cleanPhone}@c.us`,
          text: message,
        }),
      });

      const data = await response.json() as any;

      if (!response.ok) {
        return {
          success: false,
          provider: this.name,
          error: data.message || `HTTP ${response.status}: Gagal mengirim via WAHA`,
          details: data,
        };
      }

      return {
        success: true,
        provider: this.name,
        messageId: data.id || 'waha_' + Date.now(),
        details: data,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, provider: this.name, error: `Koneksi WAHA gagal: ${msg}` };
    }
  }
}

/**
 * Provider Twilio Programmable Messaging
 * https://www.twilio.com/docs/whatsapp/api
 */
class TwilioProvider implements IWhatsAppProvider {
  readonly name = 'twilio';

  async sendMessage(to: string, message: string, config: WhatsAppGatewayConfig): Promise<SendMessageResult> {
    const accountSid = config.twilioAccountSid?.trim();
    const authToken = config.twilioAuthToken?.trim();
    let fromNumber = config.twilioFromNumber?.trim();

    if (!accountSid || !authToken || !fromNumber) {
      return {
        success: false,
        provider: this.name,
        error: 'Kredensial Twilio (Account SID, Auth Token, atau Nomor Pengirim) belum lengkap',
      };
    }

    const cleanPhone = cleanPhoneNumber(to);
    if (!cleanPhone || cleanPhone.length < 9) {
      return { success: false, provider: this.name, error: `Nomor telepon tujuan tidak valid: "${to}"` };
    }

    if (!fromNumber.startsWith('whatsapp:')) {
      fromNumber = 'whatsapp:' + fromNumber;
    }

    const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    try {
      const body = new URLSearchParams();
      body.append('From', fromNumber);
      body.append('To', `whatsapp:+${cleanPhone}`);
      body.append('Body', message);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });

      const data = await response.json() as any;

      if (!response.ok) {
        return {
          success: false,
          provider: this.name,
          error: data.message || `HTTP ${response.status}: Gagal mengirim via Twilio`,
          details: data,
        };
      }

      return {
        success: true,
        provider: this.name,
        messageId: data.sid || 'twilio_' + Date.now(),
        details: data,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, provider: this.name, error: `Koneksi Twilio gagal: ${msg}` };
    }
  }
}

/**
 * Provider Manual (fallback standar wa.me)
 */
class ManualProvider implements IWhatsAppProvider {
  readonly name = 'manual';

  async sendMessage(to: string, _message: string): Promise<SendMessageResult> {
    return {
      success: true,
      provider: this.name,
      messageId: 'manual_' + Date.now(),
      details: { mode: 'manual_wa_me', phone: cleanPhoneNumber(to) },
    };
  }
}

// Registry provider yang modular & extensible
const providerRegistry: Record<WhatsAppGatewayProvider, IWhatsAppProvider> = {
  fonnte: new FonnteProvider(),
  waha: new WahaProvider(),
  twilio: new TwilioProvider(),
  manual: new ManualProvider(),
};

/**
 * Mengirim pesan WhatsApp menggunakan provider yang aktif pada konfigurasi.
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string,
  config?: WhatsAppGatewayConfig
): Promise<SendMessageResult> {
  const activeConfig: WhatsAppGatewayConfig = config || { provider: 'manual' };
  const providerKey = activeConfig.provider || 'manual';
  const provider = providerRegistry[providerKey] || providerRegistry.manual;

  return provider.sendMessage(to, message, activeConfig);
}

/**
 * Menguji koneksi pengiriman WhatsApp Gateway ke nomor uji coba.
 */
export async function testWhatsAppGateway(
  testPhone: string,
  config: WhatsAppGatewayConfig
): Promise<SendMessageResult> {
  const providerName = (config.provider || 'manual').toUpperCase();
  const testMessage = `💍 *TES KONEKSI WHATSAPP GATEWAY*\n\n` +
    `Halo! Ini adalah pesan uji coba dari sistem undangan pernikahan digital *Mari Partner*.\n\n` +
    `🔌 Provider: *${providerName}*\n` +
    `⏰ Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}\n` +
    `✅ Status: Koneksi gateway berhasil terhubung dan siap digunakan!`;

  return sendWhatsAppMessage(testPhone, testMessage, config);
}
