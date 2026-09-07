/**
 * Utility helper untuk mengonversi link Google Maps, kode embed iframe,
 * atau kombinasi nama tempat & alamat menjadi URL iframe embed Google Maps yang valid.
 */

export function getEmbedMapUrl(
  mapUrl?: string,
  venue?: string,
  address?: string
): string {
  const trimmedUrl = (mapUrl || '').trim();

  // 1. Jika pengguna menempelkan tag HTML <iframe> utuh (misal dari fitur 'Bagi / Bagikan' -> 'Sematkan peta' di Google Maps)
  if (trimmedUrl.startsWith('<iframe') || trimmedUrl.includes('<iframe')) {
    const srcMatch = trimmedUrl.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // 2. Jika URL sudah merupakan URL embed resmi Google Maps
  if (
    trimmedUrl.includes('google.com/maps/embed') ||
    (trimmedUrl.includes('google.com/maps') && trimmedUrl.includes('output=embed')) ||
    (trimmedUrl.includes('maps.google.com') && trimmedUrl.includes('output=embed'))
  ) {
    return trimmedUrl;
  }

  // 3. Jika URL memiliki parameter pencarian ?q= atau &query=
  if (trimmedUrl.includes('google.com/maps') || trimmedUrl.includes('maps.google.com')) {
    try {
      const parsed = new URL(trimmedUrl);
      const queryParam = parsed.searchParams.get('q') || parsed.searchParams.get('query');
      if (queryParam) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(queryParam)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    } catch {
      // Abaikan galat URL parser dan lanjutkan ke sintesis alamat
    }
  }

  // 4. Sintesis query embed dari kombinasi Venue (Nama Tempat) dan Alamat Lengkap
  const queryParts = [venue?.trim(), address?.trim()].filter(Boolean);
  const locationQuery = queryParts.join(', ');

  if (locationQuery) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // 5. Fallback jika semua data lokasi kosong
  return `https://maps.google.com/maps?q=${encodeURIComponent('Jakarta, Indonesia')}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}
