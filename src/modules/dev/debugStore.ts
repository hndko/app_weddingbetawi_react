/**
 * In-Memory Reactive Store for Developer Floating DebugBar
 * Designed specifically for full-stack developer visibility (React 19 + Express 5 + MySQL)
 */

export interface QueryLogEntry {
  sql: string;
  params?: unknown[];
  durationMs: number;
  timestamp: number;
  apiEndpoint?: string;
}

export interface ApiLogEntry {
  id: string;
  url: string;
  method: string;
  status: number;
  durationMs: number;
  timestamp: number;
  requestPayload?: unknown;
  responsePreview?: unknown;
  queries: QueryLogEntry[];
  serverTiming?: string;
}

export interface SocketLogEntry {
  id: string;
  direction: 'in' | 'out' | 'info';
  event: string;
  payload?: unknown;
  timestamp: number;
}

export type DebugTabType = 'queries' | 'api' | 'socket' | 'state' | 'perf';

type StoreListener = () => void;

class DebugStore {
  private apiLogs: ApiLogEntry[] = [];
  private socketLogs: SocketLogEntry[] = [];
  private socketStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected';
  private socketId: string = '-';
  private pingMs: number = 0;
  private isOpen: boolean = false;
  private activeTab: DebugTabType = 'queries';
  private listeners: Set<StoreListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const savedOpen = localStorage.getItem('mp_debugbar_open');
      this.isOpen = savedOpen === 'true';
    }
  }

  public subscribe(listener: StoreListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch {}
    });
  }

  public addApiLog(entry: Omit<ApiLogEntry, 'id'>): void {
    const newEntry: ApiLogEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
    };
    // Keep last 40 API requests to avoid memory bloating
    this.apiLogs = [newEntry, ...this.apiLogs.slice(0, 39)];
    this.notify();
  }

  public addSocketLog(direction: 'in' | 'out' | 'info', event: string, payload?: unknown): void {
    const newEntry: SocketLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      direction,
      event,
      payload,
      timestamp: Date.now(),
    };
    // Keep last 50 socket events
    this.socketLogs = [newEntry, ...this.socketLogs.slice(0, 49)];
    this.notify();
  }

  public setSocketStatus(status: 'connected' | 'disconnected' | 'connecting', socketId: string = '-', pingMs: number = 0): void {
    this.socketStatus = status;
    this.socketId = socketId;
    this.pingMs = pingMs;
    this.notify();
  }

  public toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mp_debugbar_open', String(this.isOpen));
    }
    this.notify();
  }

  public setOpen(open: boolean): void {
    this.isOpen = open;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mp_debugbar_open', String(this.isOpen));
    }
    this.notify();
  }

  public setActiveTab(tab: DebugTabType): void {
    this.activeTab = tab;
    this.notify();
  }

  public clearAll(): void {
    this.apiLogs = [];
    this.socketLogs = [];
    this.notify();
  }

  // Getters
  public getApiLogs(): ApiLogEntry[] {
    return this.apiLogs;
  }

  public getAllQueries(): QueryLogEntry[] {
    const all: QueryLogEntry[] = [];
    this.apiLogs.forEach((api) => {
      api.queries.forEach((q) => {
        all.push({
          ...q,
          apiEndpoint: `${api.method} ${api.url}`,
        });
      });
    });
    return all;
  }

  public getSocketLogs(): SocketLogEntry[] {
    return this.socketLogs;
  }

  public getSocketStatus() {
    return {
      status: this.socketStatus,
      socketId: this.socketId,
      pingMs: this.pingMs,
    };
  }

  public getIsOpen(): boolean {
    return this.isOpen;
  }

  public getActiveTab(): DebugTabType {
    return this.activeTab;
  }

  public getTotalQueryDuration(): number {
    const queries = this.getAllQueries();
    return Math.round(queries.reduce((acc, q) => acc + q.durationMs, 0) * 100) / 100;
  }
}

export const debugStore = new DebugStore();
