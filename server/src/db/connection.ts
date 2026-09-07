import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'db_weddingbetawi';

// Pool without database selection (used for database creation / migrations)
export const rawPool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

// Main connection pool targeting the application database
export const pool = mysql.createPool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Hook pool.execute and pool.query in development to feed Developer DebugBar
if (process.env.NODE_ENV !== 'production') {
  // Dynamically import or require to avoid circular dependencies
  import('../middleware/debugTracker').then(({ recordQueryExecution }) => {
    const originalExecute = pool.execute.bind(pool);
    const originalQuery = pool.query.bind(pool);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool.execute = async function (sql: any, values: any): Promise<any> {
      const start = performance.now();
      try {
        const result = await originalExecute(sql, values);
        const duration = performance.now() - start;
        const sqlStr = typeof sql === 'string' ? sql : (sql?.sql || String(sql));
        recordQueryExecution(sqlStr, Array.isArray(values) ? values : undefined, duration);
        return result;
      } catch (err) {
        const duration = performance.now() - start;
        const sqlStr = typeof sql === 'string' ? sql : (sql?.sql || String(sql));
        recordQueryExecution(`[ERROR] ${sqlStr}`, Array.isArray(values) ? values : undefined, duration);
        throw err;
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pool.query = async function (sql: any, values: any): Promise<any> {
      const start = performance.now();
      try {
        const result = await originalQuery(sql, values);
        const duration = performance.now() - start;
        const sqlStr = typeof sql === 'string' ? sql : (sql?.sql || String(sql));
        recordQueryExecution(sqlStr, Array.isArray(values) ? values : undefined, duration);
        return result;
      } catch (err) {
        const duration = performance.now() - start;
        const sqlStr = typeof sql === 'string' ? sql : (sql?.sql || String(sql));
        recordQueryExecution(`[ERROR] ${sqlStr}`, Array.isArray(values) ? values : undefined, duration);
        throw err;
      }
    };
  }).catch(() => {});
}

export { dbName };
