import { 
  WeddingConfig, 
  Wish, 
  RSVPResponse, 
  GuestInvitation, 
  WeddingExpense, 
  WeddingTable, 
  TriviaQuestion,
  CheckInRecord 
} from '../types';
import { debugStore, QueryLogEntry } from '../modules/dev/debugStore';

const BASE_URL = '/api';

/**
 * Mengambil token autentikasi JWT dari storage browser
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
  } catch {
    return null;
  }
}

/**
 * Menyimpan token autentikasi JWT ke session storage
 */
export function setAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      sessionStorage.setItem('admin_token', token);
    } else {
      sessionStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token');
    }
  } catch {
    // Ignore storage quota error
  }
}

function recordDevApiLog(
  url: string,
  method: string,
  status: number,
  durationMs: number,
  responseHeaders: Headers,
  requestPayload?: unknown,
  responseBody?: unknown
): void {
  if (!import.meta.env.DEV) return;

  const queries: QueryLogEntry[] = [];
  const debugHeader = responseHeaders.get('X-Debug-Queries');
  if (debugHeader) {
    try {
      const decoded = JSON.parse(atob(debugHeader));
      if (Array.isArray(decoded.queries)) {
        queries.push(...decoded.queries);
      }
    } catch {
      // ignore
    }
  }

  const serverTiming = responseHeaders.get('Server-Timing') || undefined;

  debugStore.addApiLog({
    url,
    method,
    status,
    durationMs,
    timestamp: Date.now(),
    requestPayload,
    responsePreview: responseBody,
    queries,
    serverTiming,
  });
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const method = (options?.method || 'GET').toUpperCase();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers as Record<string, string> || {}),
  };

  const startTime = performance.now();
  let parsedPayload: unknown = undefined;
  if (options?.body && typeof options.body === 'string') {
    try {
      parsedPayload = JSON.parse(options.body);
    } catch {
      parsedPayload = options.body;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    const duration = Math.round((performance.now() - startTime) * 100) / 100;
    recordDevApiLog(endpoint, method, 0, duration, new Headers(), parsedPayload, { error: (err as Error).message });
    throw err;
  }

  const duration = Math.round((performance.now() - startTime) * 100) / 100;

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    let errData: unknown = undefined;
    try {
      errData = await response.json();
      if (errData && typeof errData === 'object' && 'error' in errData && typeof (errData as { error: unknown }).error === 'string') {
        errorMsg = (errData as { error: string }).error;
      }
      recordDevApiLog(endpoint, method, response.status, duration, response.headers, parsedPayload, errData);
    } catch {
      recordDevApiLog(endpoint, method, response.status, duration, response.headers, parsedPayload, { error: errorMsg });
    }

    // Jika token kedaluwarsa atau tidak valid, bersihkan sesi
    if (response.status === 401 && token) {
      setAuthToken(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('admin_authenticated');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    throw new Error(errorMsg);
  }

  const data = await response.json();
  recordDevApiLog(endpoint, method, response.status, duration, response.headers, parsedPayload, data);
  return data;
}

export const api = {
  // Config
  getConfig: (): Promise<WeddingConfig> => request<WeddingConfig>('/config'),
  updateConfig: (config: WeddingConfig): Promise<{ success: boolean; data: WeddingConfig }> =>
    request('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),

  // Wishes (dengan dukungan pembatasan query / pagination)
  getWishes: (params?: { limit?: number; offset?: number; all?: boolean }): Promise<Wish[]> => {
    const query = new URLSearchParams();
    if (params?.all) query.set('all', 'true');
    if (params?.limit !== undefined) query.set('limit', String(params.limit));
    if (params?.offset !== undefined) query.set('offset', String(params.offset));
    const qs = query.toString();
    return request<Wish[]>(`/wishes${qs ? `?${qs}` : ''}`);
  },
  createWish: (data: { name: string; text: string; attendance?: string; time?: string }): Promise<{ success: boolean; data: Wish }> =>
    request('/wishes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteWish: (id: string): Promise<{ success: boolean }> =>
    request(`/wishes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // RSVPs
  getRsvps: (): Promise<RSVPResponse[]> => request<RSVPResponse[]>('/rsvps'),
  createRsvp: (data: { name: string; attendance: string; guestCount: number; notes: string }): Promise<{ success: boolean; data: RSVPResponse }> =>
    request('/rsvps', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  deleteRsvp: (id: string): Promise<{ success: boolean }> =>
    request(`/rsvps/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // Guests
  getGuests: (): Promise<GuestInvitation[]> => request<GuestInvitation[]>('/guests'),
  createGuest: (data: { name: string; phone?: string; tableNumber?: string; notes?: string }): Promise<{ success: boolean; data: GuestInvitation }> =>
    request('/guests', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  importGuests: (guests: Array<{ name: string; phone?: string; status?: string; tableNumber?: string; notes?: string }>): Promise<{ success: boolean; count: number }> =>
    request('/guests', {
      method: 'POST',
      body: JSON.stringify({ guests }),
    }),
  updateGuest: (id: string, updates: Partial<GuestInvitation>): Promise<{ success: boolean }> =>
    request(`/guests/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  checkInGuest: (id: string): Promise<{ success: boolean }> =>
    request(`/guests/${encodeURIComponent(id)}/checkin`, {
      method: 'PATCH',
    }),
  deleteGuest: (id: string): Promise<{ success: boolean }> =>
    request(`/guests/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  resetAllGuests: (): Promise<{ success: boolean }> =>
    request('/guests', {
      method: 'DELETE',
    }),

  // Uploads
  uploadFile: async (file: File): Promise<{ success: boolean; url: string; filename: string; size: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();
    const startTime = performance.now();

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const duration = Math.round((performance.now() - startTime) * 100) / 100;

    if (!response.ok) {
      recordDevApiLog('/upload', 'POST', response.status, duration, response.headers, { filename: file.name, size: file.size }, { error: `Upload failed with status ${response.status}` });
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    recordDevApiLog('/upload', 'POST', response.status, duration, response.headers, { filename: file.name, size: file.size }, data);
    return data;
  },

  uploadMultipleFiles: async (files: File[]): Promise<{ success: boolean; urls: string[] }> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const token = getAuthToken();
    const startTime = performance.now();

    const response = await fetch(`${BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const duration = Math.round((performance.now() - startTime) * 100) / 100;

    if (!response.ok) {
      recordDevApiLog('/upload/multiple', 'POST', response.status, duration, response.headers, { count: files.length }, { error: `Batch upload failed with status ${response.status}` });
      throw new Error(`Batch upload failed with status ${response.status}`);
    }

    const data = await response.json();
    recordDevApiLog('/upload/multiple', 'POST', response.status, duration, response.headers, { count: files.length }, data);
    return data;
  },

  deleteUploadedFile: (url: string): Promise<{ success: boolean; message: string }> =>
    request('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ url }),
    }),

  // Auth
  login: (credentials: { username: string; password: string }): Promise<{ success: boolean; token?: string; user: { id: string | number; username: string; role: string } }> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verifyAuth: (): Promise<{ success: boolean; user: { id: string | number; username: string; role: string } }> =>
    request('/auth/me'),

  changePassword: (data: { username: string; oldPassword: string; newPassword: string }): Promise<{ success: boolean; message: string }> =>
    request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Budget
  getBudget: (): Promise<WeddingExpense[]> => request<WeddingExpense[]>('/budget'),
  createBudgetItem: (item: Partial<WeddingExpense>): Promise<{ success: boolean; data: WeddingExpense }> =>
    request('/budget', {
      method: 'POST',
      body: JSON.stringify(item),
    }),
  updateBudgetItem: (id: string, item: Partial<WeddingExpense>): Promise<{ success: boolean }> =>
    request(`/budget/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),
  deleteBudgetItem: (id: string): Promise<{ success: boolean }> =>
    request(`/budget/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // Seating
  getSeating: (): Promise<WeddingTable[]> => request<WeddingTable[]>('/seating'),
  createSeatingTable: (table: Partial<WeddingTable>): Promise<{ success: boolean; data: WeddingTable }> =>
    request('/seating', {
      method: 'POST',
      body: JSON.stringify(table),
    }),
  updateSeatingTable: (id: string, table: Partial<WeddingTable>): Promise<{ success: boolean }> =>
    request(`/seating/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(table),
    }),
  deleteSeatingTable: (id: string): Promise<{ success: boolean }> =>
    request(`/seating/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // Trivia
  getTrivia: (): Promise<TriviaQuestion[]> => request<TriviaQuestion[]>('/trivia'),
  createTrivia: (q: Partial<TriviaQuestion>): Promise<{ success: boolean; data: TriviaQuestion }> =>
    request('/trivia', {
      method: 'POST',
      body: JSON.stringify(q),
    }),
  updateTrivia: (id: string, q: Partial<TriviaQuestion>): Promise<{ success: boolean }> =>
    request(`/trivia/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(q),
    }),
  deleteTrivia: (id: string): Promise<{ success: boolean }> =>
    request(`/trivia/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  // Checkins
  getCheckins: (): Promise<CheckInRecord[]> => request<CheckInRecord[]>('/checkins'),
  createCheckin: (record: Partial<CheckInRecord>): Promise<{ success: boolean; data: CheckInRecord }> =>
    request('/checkins', {
      method: 'POST',
      body: JSON.stringify(record),
    }),
  deleteCheckin: (id: string): Promise<{ success: boolean }> =>
    request(`/checkins/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};
