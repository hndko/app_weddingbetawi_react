import { EventDetail, WeddingConfig } from '../types';

interface ParsedDateTimeRange {
  startUtc: string; // Format: YYYYMMDDTHHmmssZ
  endUtc: string;   // Format: YYYYMMDDTHHmmssZ
}

const pad = (num: number): string => String(num).padStart(2, '0');

const formatUtcString = (date: Date): string => {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
};

export function parseEventDateTime(event: EventDetail, weddingConfig: WeddingConfig): ParsedDateTimeRange {
  // Determine base date (year, month, day)
  let year = 2026;
  let month = 9; // 1-indexed (September)
  let day = 20;

  if (weddingConfig.dateISO) {
    const isoParts = weddingConfig.dateISO.split('T')[0]?.split('-');
    if (isoParts && isoParts.length === 3) {
      const y = parseInt(isoParts[0], 10);
      const m = parseInt(isoParts[1], 10);
      const d = parseInt(isoParts[2], 10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        year = y;
        month = m;
        day = d;
      }
    }
  }

  // Determine timezone offset in hours (Default WIB = UTC+7)
  let tzOffsetHours = 7;
  const timeUpper = (event.time || '').toUpperCase();
  if (timeUpper.includes('WITA')) {
    tzOffsetHours = 8;
  } else if (timeUpper.includes('WIT')) {
    tzOffsetHours = 9;
  }

  // Parse start and end hours/minutes from time string (e.g. "08:00 - 10:00 WIB" or "11:00 WIB - Selesai")
  const timeRegex = /(\d{1,2})[:.](\d{2})/g;
  const matches = [...(event.time || '').matchAll(timeRegex)];

  let startHour = 8;
  let startMinute = 0;
  let endHour = 10;
  let endMinute = 0;

  if (matches.length >= 1) {
    startHour = parseInt(matches[0][1], 10);
    startMinute = parseInt(matches[0][2], 10);
    endHour = startHour + 2;
    endMinute = startMinute;
  }

  if (matches.length >= 2) {
    endHour = parseInt(matches[1][1], 10);
    endMinute = parseInt(matches[1][2], 10);
  }

  // Construct UTC Dates
  // Note: Date.UTC takes month 0-indexed (month - 1)
  const startDate = new Date(Date.UTC(year, month - 1, day, startHour - tzOffsetHours, startMinute, 0));
  const endDate = new Date(Date.UTC(year, month - 1, day, endHour - tzOffsetHours, endMinute, 0));

  return {
    startUtc: formatUtcString(startDate),
    endUtc: formatUtcString(endDate),
  };
}

export function generateGoogleCalendarUrl(event: EventDetail, weddingConfig: WeddingConfig): string {
  const { startUtc, endUtc } = parseEventDateTime(event, weddingConfig);
  const groomName = weddingConfig.groom?.nickname || 'Mempelai Pria';
  const brideName = weddingConfig.bride?.nickname || 'Mempelai Wanita';
  const title = `Pernikahan ${groomName} & ${brideName} - ${event.title}`;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://undangan.digital';
  const details = [
    `Pernikahan Bahagia ${groomName} & ${brideName}`,
    `Acara: ${event.title}`,
    `Waktu: ${event.day}, ${event.date} (${event.time})`,
    `Lokasi: ${event.venue}`,
    `Alamat: ${event.address}`,
    event.mapUrl ? `Peta Google Maps: ${event.mapUrl}` : '',
    `Tautan Undangan: ${currentUrl}`,
    '',
    'Kehadiran dan doa restu Anda merupakan kehormatan dan kebahagiaan terbesar bagi kami sekeluarga.',
  ].filter(Boolean).join('\n');

  const location = `${event.venue}, ${event.address}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startUtc}/${endUtc}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function generateIcsContent(event: EventDetail, weddingConfig: WeddingConfig): string {
  const { startUtc, endUtc } = parseEventDateTime(event, weddingConfig);
  const groomName = weddingConfig.groom?.nickname || 'Mempelai Pria';
  const brideName = weddingConfig.bride?.nickname || 'Mempelai Wanita';
  const title = `Pernikahan ${groomName} & ${brideName} - ${event.title}`;
  const nowUtc = formatUtcString(new Date());
  const uid = `wedding-${groomName.toLowerCase()}-${brideName.toLowerCase()}-${event.title.toLowerCase().replace(/\s+/g, '-')}-${startUtc}@wedding-invitation`;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://undangan.digital';
  const description = [
    `Pernikahan Bahagia ${groomName} & ${brideName}`,
    `Acara: ${event.title}`,
    `Waktu: ${event.day}, ${event.date} (${event.time})`,
    `Lokasi: ${event.venue}`,
    `Alamat: ${event.address}`,
    event.mapUrl ? `Peta Google Maps: ${event.mapUrl}` : '',
    `Tautan Undangan: ${currentUrl}`,
    '',
    'Kehadiran dan doa restu Anda merupakan kehormatan terbesar bagi kami sekeluarga.',
  ].filter(Boolean).join('\\n');

  const location = `${event.venue}, ${event.address}`.replace(/,/g, '\\,');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mari Partner Wedding Invitation//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${currentUrl}`,
    'STATUS:CONFIRMED',
    // Alarm 1: 1 Hari sebelum acara (H-1)
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Pengingat H-1: Besok Acara ${title}!`,
    'END:VALARM',
    // Alarm 2: 1 Jam sebelum acara (H-1 Jam)
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Pengingat 1 Jam Menuju: ${title}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcsFile(event: EventDetail, weddingConfig: WeddingConfig): void {
  const icsContent = generateIcsContent(event, weddingConfig);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `jadwal-${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`;
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
