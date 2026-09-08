import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateJwt } from '../middleware/auth';

export function createUploadRouter() {
  const router = Router();

  // Seluruh endpoint unggah berkas wajib terautentikasi JWT Admin
  router.use(authenticateJwt);

  // Pastikan folder server/uploads tersedia
  const uploadDir = path.resolve(process.cwd(), 'server', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/webp': '.webp',
      };
      const safeExt = mimeToExt[file.mimetype.toLowerCase()] || '.jpg';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `img-${uniqueSuffix}${safeExt}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // Maksimal 10MB per file
    },
    fileFilter: (_req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

      const fileExt = path.extname(file.originalname).toLowerCase();
      const isMimeValid = allowedMimes.includes(file.mimetype.toLowerCase());
      const isExtValid = allowedExts.includes(fileExt);

      // P0 Security Guard: Wajib validasi ganda (MIME type AND extension) dan larang SVG untuk eliminasi Stored XSS
      if (isMimeValid && isExtValid) {
        cb(null, true);
      } else {
        cb(new Error('Format file tidak didukung. Harap unggah format gambar bitmap asli: JPG, PNG, atau WebP.'));
      }
    },
  });

  // POST /api/upload - Single file upload
  router.post('/', upload.single('file'), (req: Request, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Tidak ada file yang diunggah' });
        return;
      }

      const relativeUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        url: relativeUrl,
        filename: req.file.filename,
        size: req.file.size,
      });
    } catch (error) {
      console.error('[API Upload Error]:', error);
      res.status(500).json({ error: 'Gagal mengunggah file' });
    }
  });

  // POST /api/upload/multiple - Batch files upload (misal untuk Galeri Foto)
  router.post('/multiple', upload.array('files', 20), (req: Request, res: Response): void => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ error: 'Tidak ada file yang diunggah' });
        return;
      }

      const result = files.map((f) => ({
        url: `/uploads/${f.filename}`,
        filename: f.filename,
        size: f.size,
      }));

      res.json({
        success: true,
        urls: result.map((r) => r.url),
        files: result,
      });
    } catch (error) {
      console.error('[API Upload Multiple Error]:', error);
      res.status(500).json({ error: 'Gagal mengunggah kumpulan file' });
    }
  });

  // DELETE /api/upload - Hapus berkas spesifik dari server/uploads
  router.delete('/', (req: Request, res: Response): void => {
    try {
      const url = (req.body?.url || req.query?.url) as string;
      if (!url || typeof url !== 'string' || !url.startsWith('/uploads/')) {
        res.status(400).json({ error: 'URL berkas tidak valid' });
        return;
      }

      // Ambil hanya nama berkas untuk mencegah path traversal attack (OWASP Pilar 3)
      const filename = path.basename(url);
      const targetFile = path.resolve(uploadDir, filename);

      if (fs.existsSync(targetFile)) {
        fs.unlinkSync(targetFile);
        console.log(`[Storage Cleanup] Berkas fisik ${filename} berhasil dihapus.`);
        res.json({ success: true, message: `Berkas ${filename} berhasil dihapus dari storage` });
      } else {
        res.json({ success: true, message: 'Berkas tidak ditemukan atau sudah dihapus' });
      }
    } catch (error) {
      console.error('[API Delete Upload Error]:', error);
      res.status(500).json({ error: 'Gagal menghapus berkas dari storage' });
    }
  });

  return router;
}
