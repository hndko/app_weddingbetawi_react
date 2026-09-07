import { 
  WeddingConfig, 
  Wish, 
  RSVPResponse, 
  GuestInvitation, 
  WeddingExpense, 
  WeddingTable, 
  TriviaQuestion 
} from '../types';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      if (errData.error) errorMsg = errData.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Config
  getConfig: (): Promise<WeddingConfig> => request<WeddingConfig>('/config'),
  updateConfig: (config: WeddingConfig): Promise<{ success: boolean; data: WeddingConfig }> =>
    request('/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    }),

  // Wishes
  getWishes: (): Promise<Wish[]> => request<Wish[]>('/wishes'),
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
  uploadFile: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return response.json();
  },

  uploadMultipleFiles: async (files: File[]): Promise<{ success: boolean; urls: string[] }> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const response = await fetch(`${BASE_URL}/upload/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Batch upload failed with status ${response.status}`);
    }

    return response.json();
  },

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
};
