import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

export function createUploadRouter() {
  const router = Router();

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
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `img-${uniqueSuffix}${ext || '.jpg'}`);
    },
  });

  const upload = multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // Maksimal 10MB per file
    },
    fileFilter: (_req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp|gif|svg\+xml/;
      const isMimeValid = allowed.test(file.mimetype);
      const isExtValid = allowed.test(path.extname(file.originalname).toLowerCase());

      if (isMimeValid || isExtValid) {
        cb(null, true);
      } else {
        cb(new Error('Format file tidak didukung. Harap unggah format JPG, PNG, atau WebP.'));
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

  return router;
}
