/**
 * Utility kompresi gambar client-side berkinerja tinggi menggunakan HTML Canvas.
 * Mengonversi foto berukuran besar (5MB-12MB) menjadi WebP/JPEG teroptimasi (~150KB-250KB)
 * sebelum dikirimkan ke REST API server.
 */

export interface ImageCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  preferWebp?: boolean;
}

/**
 * Memeriksa apakah browser mendukung konversi Canvas ke format image/webp
 */
function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    return false;
  }
}

/**
 * Mengompresi objek File gambar menjadi objek File baru yang ringan (WebP/JPEG).
 */
export async function compressImageToFile(
  file: File,
  options: ImageCompressOptions = {}
): Promise<File> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
    preferWebp = true,
  } = options;

  // Jangan kompresi SVG atau GIF animasi
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  // Jika ukuran file sudah sangat kecil (< 80KB), lewati kompresi
  if (file.size < 80 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => resolve(file); // Fallback ke file asli jika gagal baca

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => resolve(file); // Fallback ke file asli jika gagal parse

      img.onload = () => {
        try {
          let { width, height } = img;

          // Kalkulasi proporsi penskalaan
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          // Atur smoothing untuk ketajaman visual terbaik
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const targetMime = preferWebp && supportsWebP() ? 'image/webp' : 'image/jpeg';
          const ext = targetMime === 'image/webp' ? '.webp' : '.jpg';
          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const newFileName = `${baseName}${ext}`;

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }

              // Jika hasil kompresi ternyata lebih besar dari file asli (sangat jarang), gunakan file asli
              if (blob.size >= file.size) {
                resolve(file);
                return;
              }

              const compressedFile = new File([blob], newFileName, {
                type: blob.type,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            targetMime,
            quality
          );
        } catch {
          resolve(file);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Kompresi gambar menjadi format base64 data URL untuk fallback luring
 */
export async function compressImageToDataUrl(
  file: File,
  options: ImageCompressOptions = {}
): Promise<string> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.75,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas foto'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memproses gambar'));
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Gagal inisialisasi context 2D canvas'));
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const targetMime = supportsWebP() ? 'image/webp' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(targetMime, quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
