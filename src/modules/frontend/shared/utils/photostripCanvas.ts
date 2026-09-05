export type PhotostripLayout = 'strip_3pose' | 'single_polaroid';
export type FrameTemplate = 'theme' | 'black_studio' | 'white_studio' | 'romantic_pastel';
export type PhotoFilter = 'natural' | 'bw' | 'vintage' | 'warm';

export interface PhotostripConfig {
  layout: PhotostripLayout;
  template: FrameTemplate;
  filter: PhotoFilter;
  groomName: string;
  brideName: string;
  weddingDateText: string;
  guestName?: string;
  themeColors?: {
    bg: string;
    textPrimary: string;
    accent: string;
    cardBorder: string;
    isDark?: boolean;
  };
}

export interface FramePalette {
  bg: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  photoBorderColor: string;
  isDark: boolean;
}

/**
 * Resolve frame colors based on template selection and active theme
 */
export function getFramePalette(template: FrameTemplate, themeColors?: PhotostripConfig['themeColors']): FramePalette {
  switch (template) {
    case 'black_studio':
      return {
        bg: '#121214',
        textColor: '#FFFFFF',
        accentColor: '#D4AF37', // Elegant Studio Gold
        borderColor: '#27272A',
        photoBorderColor: '#3F3F46',
        isDark: true
      };
    case 'white_studio':
      return {
        bg: '#FFFFFF',
        textColor: '#18181B',
        accentColor: '#52525B', // Clean Charcoal
        borderColor: '#E4E4E7',
        photoBorderColor: '#E4E4E7',
        isDark: false
      };
    case 'romantic_pastel':
      return {
        bg: '#FDF2F4',
        textColor: '#881337',
        accentColor: '#E11D48', // Soft Rose Pink
        borderColor: '#FECDD3',
        photoBorderColor: '#FDA4AF',
        isDark: false
      };
    case 'theme':
    default:
      if (themeColors) {
        return {
          bg: themeColors.bg,
          textColor: themeColors.textPrimary,
          accentColor: themeColors.accent,
          borderColor: themeColors.cardBorder,
          photoBorderColor: themeColors.accent,
          isDark: Boolean(themeColors.isDark)
        };
      }
      return {
        bg: '#18181B',
        textColor: '#FFFFFF',
        accentColor: '#EAB308',
        borderColor: '#3F3F46',
        photoBorderColor: '#52525B',
        isDark: true
      };
  }
}

/**
 * Load image safely into HTMLImageElement
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Draw image with object-fit: cover logic and apply chosen filter
 */
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  filter: PhotoFilter,
  radius: number = 8
): void {
  const imgAspect = img.width / img.height;
  const targetAspect = w / h;
  let sx: number, sy: number, sWidth: number, sHeight: number;

  if (imgAspect > targetAspect) {
    sHeight = img.height;
    sWidth = sHeight * targetAspect;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = sWidth / targetAspect;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }

  ctx.save();

  // Create rounded clip path for photo
  if (radius > 0) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.clip();
  }

  // Apply CSS-style filter to 2D Canvas context
  switch (filter) {
    case 'bw':
      ctx.filter = 'grayscale(100%) contrast(115%) brightness(98%)';
      break;
    case 'vintage':
      ctx.filter = 'sepia(50%) contrast(105%) brightness(95%) saturate(85%)';
      break;
    case 'warm':
      ctx.filter = 'sepia(20%) saturate(120%) brightness(104%) contrast(102%)';
      break;
    case 'natural':
    default:
      ctx.filter = 'none';
      break;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  ctx.restore();
}

/**
 * Draw a stylized divider line with small central diamond/ring
 */
function drawOrnamentalDivider(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  y: number,
  width: number,
  color: string
): void {
  const half = width / 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.2;

  // Left line with fade
  ctx.beginPath();
  ctx.moveTo(centerX - half, y);
  ctx.lineTo(centerX - 16, y);
  ctx.stroke();

  // Center diamond
  ctx.beginPath();
  ctx.moveTo(centerX, y - 4);
  ctx.lineTo(centerX + 4, y);
  ctx.lineTo(centerX, y + 4);
  ctx.lineTo(centerX - 4, y);
  ctx.closePath();
  ctx.fill();

  // Right line with fade
  ctx.beginPath();
  ctx.moveTo(centerX + 16, y);
  ctx.lineTo(centerX + half, y);
  ctx.stroke();

  ctx.restore();
}

/**
 * Generate full high-resolution photostrip as Base64 PNG Data URL
 */
export async function generatePhotostrip(
  photos: string[],
  config: PhotostripConfig
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context tidak tersedia.');
  }

  const palette = getFramePalette(config.template, config.themeColors);

  if (config.layout === 'strip_3pose') {
    // 3-Pose Vertical Strip (Korean Photo Studio standard: 600 x 1800 px)
    canvas.width = 600;
    canvas.height = 1800;

    // 1. Background Fill
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Decorative Double Border
    ctx.strokeStyle = palette.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, canvas.width - 32, canvas.height - 32);

    ctx.strokeStyle = `${palette.accentColor}40`;
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 22, canvas.width - 44, canvas.height - 44);

    // 3. Draw 3 Photo Frames
    const slotW = 520;
    const slotH = 410;
    const leftX = 40;
    const topY = 44;
    const gap = 24;

    for (let i = 0; i < 3; i++) {
      const currentY = topY + i * (slotH + gap);

      // Photo backdrop placeholder
      ctx.fillStyle = palette.isDark ? '#1F1F23' : '#F4F4F5';
      ctx.beginPath();
      ctx.roundRect(leftX, currentY, slotW, slotH, 8);
      ctx.fill();

      // Border outline for slot
      ctx.strokeStyle = palette.photoBorderColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(leftX, currentY, slotW, slotH, 8);
      ctx.stroke();

      if (photos[i]) {
        try {
          const img = await loadImage(photos[i]);
          drawImageCover(ctx, img, leftX, currentY, slotW, slotH, config.filter, 8);
        } catch {
          // Fallback if image failed to load
          ctx.fillStyle = palette.textColor;
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`Foto ${i + 1}`, leftX + slotW / 2, currentY + slotH / 2);
        }
      } else {
        // Empty slot placeholder
        ctx.fillStyle = `${palette.textColor}60`;
        ctx.font = '500 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Pose ${i + 1}`, leftX + slotW / 2, currentY + slotH / 2);
      }
    }

    // 4. Footer & Branding Area (y: 1360 - 1760)
    const centerX = canvas.width / 2;
    drawOrnamentalDivider(ctx, centerX, 1375, 340, palette.accentColor);

    // Small Tagline
    ctx.fillStyle = `${palette.textColor}99`;
    ctx.font = '600 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '3px';
    ctx.fillText('THE WEDDING CELEBRATION OF', centerX, 1405);
    ctx.letterSpacing = '0px';

    // Groom & Bride Names
    ctx.fillStyle = palette.textColor;
    ctx.font = 'bold 36px serif, "Playfair Display", Georgia';
    ctx.fillText(`${config.groomName} & ${config.brideName}`, centerX, 1455);

    // Date
    ctx.fillStyle = palette.accentColor;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(config.weddingDateText, centerX, 1490);

    // Guest Dedication (if available)
    if (config.guestName) {
      ctx.fillStyle = `${palette.textColor}CC`;
      ctx.font = 'italic 15px sans-serif';
      ctx.fillText(`Captured with love by ${config.guestName}`, centerX, 1530);
    }

    // Secondary Ornamental Divider
    drawOrnamentalDivider(ctx, centerX, 1570, 240, `${palette.accentColor}80`);

    // Bottom Stamp / Edition Details
    ctx.fillStyle = `${palette.textColor}66`;
    ctx.font = '700 11px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('VIRTUAL WEDDING PHOTOBOOTH • LIMITED PRINT', centerX, 1610);
    ctx.font = '500 10px sans-serif';
    ctx.fillText('MEMORIES TO CHERISH FOREVER', centerX, 1630);
    ctx.letterSpacing = '0px';

  } else {
    // Single Polaroid Frame (800 x 1000 px)
    canvas.width = 800;
    canvas.height = 1000;

    // 1. Background Fill
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Subtle Outer Border
    ctx.strokeStyle = palette.borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // 3. Single Large Photo Slot (Square 1:1 Polaroid standard: 704 x 704 px)
    const slotX = 48;
    const slotY = 48;
    const slotSize = 704;

    // Photo slot background
    ctx.fillStyle = palette.isDark ? '#1F1F23' : '#F4F4F5';
    ctx.beginPath();
    ctx.roundRect(slotX, slotY, slotSize, slotSize, 4);
    ctx.fill();

    // Slot border
    ctx.strokeStyle = palette.photoBorderColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(slotX, slotY, slotSize, slotSize, 4);
    ctx.stroke();

    if (photos[0]) {
      try {
        const img = await loadImage(photos[0]);
        drawImageCover(ctx, img, slotX, slotY, slotSize, slotSize, config.filter, 4);
      } catch {
        ctx.fillStyle = palette.textColor;
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Foto Polaroid', slotX + slotSize / 2, slotY + slotSize / 2);
      }
    }

    // 4. Polaroid Chin (y: 770 to 970)
    const centerX = canvas.width / 2;
    drawOrnamentalDivider(ctx, centerX, 785, 400, palette.accentColor);

    // Groom & Bride Names
    ctx.fillStyle = palette.textColor;
    ctx.font = 'bold 38px serif, "Playfair Display", Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(`${config.groomName} & ${config.brideName}`, centerX, 835);

    // Date
    ctx.fillStyle = palette.accentColor;
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(config.weddingDateText, centerX, 872);

    // Guest Dedication or Sweet Quote
    ctx.fillStyle = `${palette.textColor}B3`;
    ctx.font = 'italic 15px sans-serif';
    if (config.guestName) {
      ctx.fillText(`Special memory with ${config.guestName}`, centerX, 910);
    } else {
      ctx.fillText('“A beautiful memory from a wonderful day”', centerX, 910);
    }

    // Bottom Watermark
    ctx.fillStyle = `${palette.textColor}60`;
    ctx.font = '600 11px sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('WEDDING PHOTOBOOTH • POLAROID EDITION', centerX, 950);
    ctx.letterSpacing = '0px';
  }

  return canvas.toDataURL('image/png', 0.95);
}

/**
 * Trigger immediate browser download of rendered photostrip
 */
export function downloadPhotostrip(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
