import { jsPDF } from 'jspdf';
import { WeddingConfig } from '../types';
import { THEME_TOKENS, ThemeVisualTokens } from '../modules/frontend/themes/themeTokens';
import { generateTicketCode, serializeGuestPayload, generateQRCodeDataURL } from './qrGenerator';

export interface RenderGuestPassOptions {
  guestName: string;
  guestPax?: number;
  guestId?: string;
  tableNumber?: string;
  tableName?: string;
  weddingConfig: WeddingConfig;
  themeTokens?: ThemeVisualTokens;
  themeId?: string;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 1850;

/**
 * Render Ultra-HD Thematic Digital Guest Pass onto an off-screen HTML5 Canvas
 */
export async function renderGuestPassCanvas(options: RenderGuestPassOptions): Promise<HTMLCanvasElement> {
  const {
    guestName,
    guestPax = 1,
    guestId,
    tableNumber,
    tableName,
    weddingConfig,
    themeTokens: customTokens,
    themeId,
  } = options;

  // Resolve visual tokens from parameter, themeId, or config fallback
  const activeThemeId = themeId || weddingConfig.theme || 'betawi';
  const tokens = customTokens || THEME_TOKENS[activeThemeId] || THEME_TOKENS.betawi;

  const displayName = (guestName && guestName.trim() !== '' && guestName !== 'Tamu Undangan')
    ? guestName.trim()
    : 'Tamu Terhormat';

  const ticketCode = generateTicketCode(displayName, guestId);
  const coupleText = `${weddingConfig.groom.nickname} & ${weddingConfig.bride.nickname}`;
  const eventDate = weddingConfig.events.resepsi.date || weddingConfig.dateStr || 'Minggu, 20 September 2026';
  const eventVenue = weddingConfig.events.resepsi.venue || weddingConfig.events.akad.venue || 'Ballroom Resepsi';
  const eventAddress = weddingConfig.events.resepsi.address || weddingConfig.events.akad.address || '';

  // 1. Generate High-Res QR Code Data URL (Level H, width 600px for crisp render)
  const payload = serializeGuestPayload({
    id: guestId,
    name: displayName,
    pax: guestPax,
    code: ticketCode,
  });

  const qrDataUrl = await generateQRCodeDataURL(payload, { width: 600, margin: 2 });

  // 2. Prepare Canvas
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context is not supported');

  // Smooth rendering settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 3. Draw Base Outer Background (Theme Background with subtle vignette)
  const isDark = tokens.isDark;
  ctx.fillStyle = tokens.bg || (isDark ? '#0B0F10' : '#FAF8F5');
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Decorative ambient radial glow
  const glowGrad = ctx.createRadialGradient(
    CANVAS_WIDTH / 2, 400, 50,
    CANVAS_WIDTH / 2, 400, 800
  );
  glowGrad.addColorStop(0, tokens.primary + (isDark ? '2A' : '15'));
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // 4. Draw Main Pass Ticket Container (Rounded Card)
  const cardX = 60;
  const cardY = 60;
  const cardW = CANVAS_WIDTH - 120;
  const cardH = CANVAS_HEIGHT - 120;
  const cardRadius = 44;

  // Outer drop shadow
  ctx.save();
  ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.12)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;

  ctx.fillStyle = isDark ? '#14181B' : '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();
  ctx.restore();

  // Outer Primary Border
  ctx.strokeStyle = tokens.primary || (isDark ? '#00E5FF' : '#D4AF37');
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
  ctx.stroke();

  // Inner Fine Border
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.07)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cardX + 18, cardY + 18, cardW - 36, cardH - 36, cardRadius - 12);
  ctx.stroke();

  // 5. Corner Filigree Ornaments
  const drawCornerOrnament = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = tokens.primary || '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(36, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 36);
    ctx.moveTo(8, 8);
    ctx.arc(8, 8, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  drawCornerOrnament(cardX + 32, cardY + 32, 0);
  drawCornerOrnament(cardX + cardW - 32, cardY + 32, Math.PI / 2);
  drawCornerOrnament(cardX + cardW - 32, cardY + cardH - 32, Math.PI);
  drawCornerOrnament(cardX + 32, cardY + cardH - 32, -Math.PI / 2);

  // 6. Header Section (Event & Couple Nicknames)
  ctx.textAlign = 'center';

  // Sub-badge Walimatul Ursy
  ctx.fillStyle = tokens.primary || '#D4AF37';
  ctx.font = 'bold 22px "Cinzel", "Times New Roman", Georgia, serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('WALIMATUL URSY  •  DIGITAL WEDDING PASS', CANVAS_WIDTH / 2, cardY + 80);
  ctx.letterSpacing = '0px';

  // Couple Nicknames
  ctx.fillStyle = tokens.textPrimary || (isDark ? '#FFFFFF' : '#1A2E26');
  ctx.font = 'bold 56px "Cinzel", Georgia, serif';
  ctx.fillText(coupleText, CANVAS_WIDTH / 2, cardY + 160);

  // Event Date & Time
  ctx.fillStyle = tokens.textMuted || (isDark ? '#A0AEC0' : '#6B7280');
  ctx.font = '500 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(eventDate, CANVAS_WIDTH / 2, cardY + 205);

  // 7. Perforated Ticket Dashed Divider with Ticket Notch Cutouts
  const perfY = cardY + 260;

  // Left notch cutout
  ctx.fillStyle = tokens.bg || (isDark ? '#0B0F10' : '#FAF8F5');
  ctx.beginPath();
  ctx.arc(cardX, perfY, 24, -Math.PI / 2, Math.PI / 2, false);
  ctx.fill();
  ctx.strokeStyle = tokens.primary || '#D4AF37';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Right notch cutout
  ctx.beginPath();
  ctx.arc(cardX + cardW, perfY, 24, Math.PI / 2, -Math.PI / 2, false);
  ctx.fill();
  ctx.stroke();

  // Dashed Line
  ctx.save();
  ctx.setLineDash([14, 12]);
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.18)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cardX + 36, perfY);
  ctx.lineTo(cardX + cardW - 36, perfY);
  ctx.stroke();
  ctx.restore();

  // 8. Guest Name Section
  const guestStartY = perfY + 80;
  ctx.fillStyle = tokens.primary || '#D4AF37';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('YTH. BAPAK / IBU / SAUDARA/I', CANVAS_WIDTH / 2, guestStartY);
  ctx.letterSpacing = '0px';

  // Guest Full Name
  ctx.fillStyle = tokens.textPrimary || (isDark ? '#FFFFFF' : '#1A2E26');
  // Auto-fit font size if guest name is very long
  const nameLength = displayName.length;
  const nameFontSize = nameLength > 30 ? 36 : nameLength > 20 ? 44 : 52;
  ctx.font = `bold ${nameFontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(displayName, CANVAS_WIDTH / 2, guestStartY + 65);

  // 9. Badges: Pax & Table Number
  const badgeY = guestStartY + 115;
  const badgeW = 540;
  const badgeH = 58;
  const badgeX = CANVAS_WIDTH / 2 - badgeW / 2;

  ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.07)' : '#F3F4F6';
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 29);
  ctx.fill();

  ctx.strokeStyle = tokens.primary || '#D4AF37';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = tokens.textPrimary || (isDark ? '#FFFFFF' : '#1F2937');
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  const tableText = tableNumber ? `MEJA: ${tableNumber}${tableName ? ` (${tableName})` : ''}` : 'MEJA: REGULER';
  ctx.fillText(`🎟️ KUOTA: ${guestPax} PAX   •   🪑 ${tableText}`, CANVAS_WIDTH / 2, badgeY + 37);

  // 10. High-Contrast QR Code Card Container
  const qrContainerY = badgeY + 95;
  const qrBoxSize = 540;
  const qrBoxX = CANVAS_WIDTH / 2 - qrBoxSize / 2;

  // Solid white container for foolproof QR scannability across all dark/light themes
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.beginPath();
  ctx.roundRect(qrBoxX, qrContainerY, qrBoxSize, qrBoxSize, 36);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = tokens.primary || '#D4AF37';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Load and Draw QR Code image
  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrDataUrl;
  });

  const qrInnerSize = 460;
  const qrInnerOffset = (qrBoxSize - qrInnerSize) / 2;
  ctx.drawImage(qrImg, qrBoxX + qrInnerOffset, qrContainerY + qrInnerOffset, qrInnerSize, qrInnerSize);

  // Ticket Code Pill beneath QR
  const codePillY = qrContainerY + qrBoxSize + 25;
  ctx.fillStyle = isDark ? '#1E293B' : '#F1F5F9';
  ctx.beginPath();
  ctx.roundRect(CANVAS_WIDTH / 2 - 200, codePillY, 400, 48, 24);
  ctx.fill();

  ctx.fillStyle = tokens.primary || '#D4AF37';
  ctx.font = 'bold 22px "Courier New", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText(`PASS CODE: ${ticketCode}`, CANVAS_WIDTH / 2, codePillY + 32);
  ctx.letterSpacing = '0px';

  // 11. Venue & Reception Location Info
  const venueY = codePillY + 95;
  ctx.fillStyle = tokens.textPrimary || (isDark ? '#FFFFFF' : '#111827');
  ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`📍 ${eventVenue}`, CANVAS_WIDTH / 2, venueY);

  if (eventAddress) {
    ctx.fillStyle = tokens.textMuted || (isDark ? '#94A3B8' : '#6B7280');
    ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
    // Truncate address if too long
    const cleanAddr = eventAddress.length > 70 ? eventAddress.slice(0, 67) + '...' : eventAddress;
    ctx.fillText(cleanAddr, CANVAS_WIDTH / 2, venueY + 34);
  }

  // 12. Security Verification & Barcode Graphic
  const barcodeY = venueY + 80;

  // Faux Barcode lines
  ctx.fillStyle = isDark ? '#E2E8F0' : '#1E293B';
  const barcodeWidth = 640;
  const barcodeStartX = CANVAS_WIDTH / 2 - barcodeWidth / 2;
  const barHeight = 44;

  // Deterministic barcode pattern based on ticketCode
  let curX = barcodeStartX;
  for (let i = 0; i < ticketCode.length * 6; i++) {
    const charCode = ticketCode.charCodeAt(i % ticketCode.length);
    const barW = (charCode % 4) + 2;
    const gapW = ((charCode >> 2) % 3) + 2;
    if (curX + barW > barcodeStartX + barcodeWidth) break;
    ctx.fillRect(curX, barcodeY, barW, barHeight);
    curX += barW + gapW;
  }

  // Barcode Numbers
  ctx.fillStyle = tokens.textMuted || (isDark ? '#94A3B8' : '#64748B');
  ctx.font = '16px "Courier New", monospace';
  ctx.fillText(`* ${ticketCode.replace('-', ' ')} *`, CANVAS_WIDTH / 2, barcodeY + barHeight + 20);

  // Security Footer Notice
  ctx.fillStyle = tokens.textMuted || (isDark ? '#64748B' : '#94A3B8');
  ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Harap tunjukkan pass digital ini kepada petugas di meja resepsi hari-H pernikahan.', CANVAS_WIDTH / 2, barcodeY + barHeight + 52);

  return canvas;
}

/**
 * Trigger browser download of the generated pass as an image (PNG or JPEG)
 */
export function downloadPassImage(canvas: HTMLCanvasElement, filename: string, format: 'png' | 'jpeg' = 'png'): void {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const extension = format === 'jpeg' ? '.jpg' : '.png';
  const cleanName = filename.endsWith(extension) ? filename : `${filename}${extension}`;

  const dataUrl = canvas.toDataURL(mimeType, 0.95);
  const link = document.createElement('a');
  link.download = cleanName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Trigger browser download of the generated pass as a crisp print-ready PDF via jsPDF
 */
export async function downloadPassPDF(
  canvas: HTMLCanvasElement,
  filename: string,
  guestInfo?: { guestName: string; coupleText?: string }
): Promise<void> {
  const cleanName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  // Use standard A6 portrait width (105 mm) and proportional height to avoid any white margins
  const pdfWidth = 105;
  const pdfHeight = (canvas.height / canvas.width) * pdfWidth;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [pdfWidth, pdfHeight],
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  doc.setProperties({
    title: `Digital Wedding Pass - ${guestInfo?.guestName || 'Tamu Undangan'}`,
    subject: `Undangan Pernikahan ${guestInfo?.coupleText || 'The Wedding'}`,
    creator: 'Mari Partner Wedding Invitation SPA',
    author: 'Wedding Organizer System',
  });

  doc.save(cleanName);
}
