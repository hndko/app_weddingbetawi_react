import type { Timestamp } from 'firebase/firestore';

export interface PersonInfo {
  nickname: string;
  fullName: string;
  parents: string;
  instagram: string;
  image: string;
}

export interface EventDetail {
  title: string;
  day: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapUrl: string;
}

export interface EventsConfig {
  akad: EventDetail;
  resepsi: EventDetail;
}

export interface BankInfo {
  name: string;
  account: string;
  holder: string;
  isQris?: boolean;
  qrisImage?: string;
}

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
}

export interface MusicTrack {
  url: string;
}

export interface MusicSettings {
  playlist: MusicTrack[];
  mode: 'repeat-all' | 'repeat-one' | 'shuffle' | 'linear';
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export interface WeddingConfig {
  groom: PersonInfo;
  bride: PersonInfo;
  dateStr: string;
  dateISO: string;
  events: EventsConfig;
  gallery: string[];
  bank?: BankInfo; // deprecated
  banks?: BankInfo[];
  loveStory: LoveStoryItem[];
  musicUrl?: string; // deprecated
  music?: MusicSettings;
  seo?: SEOSettings;
  theme?: string;
}

export interface Wish {
  id?: string;
  name: string;
  text: string;
  time?: string;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

export interface RSVPResponse {
  id?: string;
  name: string;
  attendance: string;
  guestCount: number;
  notes: string;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  checkedIn?: boolean;
  checkInTime?: string;
  actualPax?: number;
  souvenirClaimed?: boolean;
  tableNumber?: string;
}

export interface GuestInvitation {
  id?: string;
  name: string;
  phone?: string;
  status: 'pending' | 'sent';
  sentAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  checkedIn?: boolean;
  checkInTime?: string;
  actualPax?: number;
  souvenirClaimed?: boolean;
  tableNumber?: string;
}

export interface CheckInRecord {
  id?: string;
  guestId?: string;
  name: string;
  checkInTime: string;
  actualPax: number;
  souvenirClaimed: boolean;
  tableNumber?: string;
  source: 'qr_scan' | 'manual';
  notes?: string;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

