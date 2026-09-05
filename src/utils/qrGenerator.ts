import QRCode from 'qrcode';

export interface GuestQRPayload {
  v: number;
  id?: string;
  name: string;
  pax: number;
  code: string;
}

/**
 * Generate unique ticket pass code based on name and ID
 */
export function generateTicketCode(name: string, id?: string): string {
  const seed = `${name}-${id || 'pass'}`.toUpperCase();
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(6, '0').slice(-6);
  return `WDG-${hex}`;
}

/**
 * Serialize guest data into standard compact QR payload
 */
export function serializeGuestPayload(guest: {
  id?: string;
  name: string;
  pax?: number;
  code?: string;
}): string {
  const code = guest.code || generateTicketCode(guest.name, guest.id);
  const payload: GuestQRPayload = {
    v: 1,
    id: guest.id,
    name: guest.name.trim(),
    pax: Math.max(1, guest.pax || 1),
    code,
  };
  return JSON.stringify(payload);
}

/**
 * Parse raw scanned QR string into structured guest ticket data
 * Supports structured JSON, pipe-separated, or plain name fallback
 */
export function parseGuestPayload(raw: string): {
  id?: string;
  name: string;
  pax: number;
  code: string;
  raw: string;
} {
  const trimmed = raw.trim();

  // 1. Try parse JSON format
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed) as Partial<GuestQRPayload>;
      if (parsed.name) {
        return {
          id: parsed.id,
          name: parsed.name,
          pax: Number(parsed.pax) || 1,
          code: parsed.code || generateTicketCode(parsed.name, parsed.id),
          raw: trimmed,
        };
      }
    } catch {
      // Fallback below
    }
  }

  // 2. Try parse pipe format WDG|ID|NAME|PAX|CODE
  if (trimmed.startsWith('WDG|')) {
    const parts = trimmed.split('|');
    const id = parts[1] || undefined;
    const name = parts[2] || 'Tamu Undangan';
    const pax = parseInt(parts[3], 10) || 1;
    const code = parts[4] || generateTicketCode(name, id);
    return { id, name, pax, code, raw: trimmed };
  }

  // 3. Fallback: Treat as plain guest name or ticket code
  return {
    name: trimmed,
    pax: 1,
    code: generateTicketCode(trimmed),
    raw: trimmed,
  };
}

/**
 * Generate high-resolution Data URL (PNG) from QR string
 */
export async function generateQRCodeDataURL(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    darkColor?: string;
    lightColor?: string;
  }
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options?.width || 360,
    margin: options?.margin ?? 2,
    color: {
      dark: options?.darkColor || '#1A2E26', // Deep forest/text-dark
      light: options?.lightColor || '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  });
}
