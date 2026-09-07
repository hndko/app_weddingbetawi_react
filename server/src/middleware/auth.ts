import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthUserPayload {
  id: number | string;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

/**
 * Middleware untuk memvalidasi JWT Bearer Token pada rute terlindungi panel admin.
 * Memeriksa header Authorization: Bearer <token>.
 */
export function authenticateJwt(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Akses ditolak: Token autentikasi tidak ditemukan. Silakan login ke panel admin.',
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const secret = process.env.JWT_SECRET || 'mari_partner_jwt_secret_2026';

  try {
    const decoded = jwt.verify(token, secret) as AuthUserPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (err: unknown) {
    const isExpired = typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'TokenExpiredError';
    if (isExpired) {
      res.status(401).json({
        error: 'Sesi login Anda telah kedaluwarsa. Silakan masuk kembali.',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }
    res.status(401).json({
      error: 'Token autentikasi tidak valid atau telah dirusak.',
      code: 'INVALID_TOKEN',
    });
  }
}
