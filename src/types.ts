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
}

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
}

export interface WeddingConfig {
  groom: PersonInfo;
  bride: PersonInfo;
  dateStr: string;
  dateISO: string;
  events: EventsConfig;
  gallery: string[];
  bank: BankInfo;
  loveStory: LoveStoryItem[];
  musicUrl: string;
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
