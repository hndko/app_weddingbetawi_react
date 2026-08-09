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
}

export interface Wish {
  id?: string;
  name: string;
  text: string;
  time?: string;
  createdAt?: any;
}

export interface RSVPResponse {
  id?: string;
  name: string;
  attendance: string;
  guestCount: number;
  notes: string;
  createdAt?: any;
}
