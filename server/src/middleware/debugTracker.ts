import { Request, Response, NextFunction } from 'express';
import { AsyncLocalStorage } from 'async_hooks';

export interface DebugQueryLog {
  sql: string;
  params?: unknown[];
  durationMs: number;
  timestamp: number;
}

export interface RequestDebugContext {
  id: string;
  startTime: number;
  queries: DebugQueryLog[];
}

export const debugStorage = new AsyncLocalStorage<RequestDebugContext>();

/**
 * Record a query execution in the active request context (if development mode)
 */
export function recordQueryExecution(sql: string, params?: unknown[], durationMs: number = 0): void {
  const store = debugStorage.getStore();
  if (store) {
    store.queries.push({
      sql: sql.trim(),
      params: Array.isArray(params) ? params : undefined,
      durationMs: Math.round(durationMs * 100) / 100,
      timestamp: Date.now(),
    });
  }
}

/**
 * Express Middleware to track request execution and attach query metrics in dev mode
 */
export function debugTrackerMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Only track in non-production environments
  if (process.env.NODE_ENV === 'production') {
    return next();
  }

  const context: RequestDebugContext = {
    id: Math.random().toString(36).substring(2, 9),
    startTime: Date.now(),
    queries: [],
  };

  debugStorage.run(context, () => {
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);

    const injectDebugHeaders = () => {
      if (!res.headersSent) {
        const totalDuration = Date.now() - context.startTime;
        const totalQueryDuration = context.queries.reduce((sum, q) => sum + q.durationMs, 0);

        try {
          const payload = JSON.stringify({
            queries: context.queries,
            totalQueryDuration: Math.round(totalQueryDuration * 100) / 100,
            serverDuration: totalDuration,
          });
          res.setHeader('X-Debug-Queries', Buffer.from(payload).toString('base64'));
          res.setHeader('Server-Timing', `total;dur=${totalDuration}, db;dur=${totalQueryDuration}`);
        } catch {
          // Graceful ignore
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.json = function (body: any) {
      injectDebugHeaders();
      return originalJson(body);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.send = function (body: any) {
      injectDebugHeaders();
      return originalSend(body);
    };

    next();
  });
}
