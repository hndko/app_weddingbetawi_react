export type Timestamp = { toDate?: () => Date; seconds?: number; nanoseconds?: number } | string;

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
  title?: string;
  artist?: string;
}

export interface MusicSettings {
  playlist: MusicTrack[];
  mode: 'repeat-all' | 'repeat-one' | 'shuffle' | 'linear';
  defaultVolume?: number;
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export type GalleryLayoutStyle = 'editorial' | 'masonry' | 'carousel' | 'polaroid';

export interface AgencyBranding {
  mode: 'disabled' | 'co_branded' | 'white_label';
  agencyName?: string;
  agencyLogoUrl?: string;
  agencyTagline?: string;
  agencyInstagram?: string;
  agencyWebsite?: string;
  agencyPhone?: string;
  agencyWhatsapp?: string;
  hideMariPartnerBranding?: boolean;
}

export interface LiveRundownStatus {
  isActive?: boolean;
  active?: boolean;
  currentEvent: string;
  currentEventTime?: string;
  customNote?: string;
  broadcastMessage?: string;
  lastUpdated?: string;
  updatedAt?: string;
}

export interface RundownScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  zone?: string;
}

export interface WeddingConfig {
  groom: PersonInfo;
  bride: PersonInfo;
  dateStr: string;
  dateISO: string;
  events: EventsConfig;
  gallery: string[];
  galleryLayout?: GalleryLayoutStyle;
  bank?: BankInfo; // deprecated
  banks?: BankInfo[];
  loveStory: LoveStoryItem[];
  musicUrl?: string; // deprecated
  music?: MusicSettings;
  seo?: SEOSettings;
  theme?: string;
  agencyBranding?: AgencyBranding;
  liveRundown?: LiveRundownStatus;
  rundownSchedule?: RundownScheduleItem[];
}

export interface Wish {
  id?: string;
  name: string;
  text: string;
  time?: string;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  audioUrl?: string;
  audioDuration?: number;
}

export type GuestTier = 'regular' | 'family' | 'vip' | 'vvip';

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
  souvenirClaimedAt?: string;
  tableNumber?: string;
  tier?: GuestTier;
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
  souvenirClaimedAt?: string;
  tableNumber?: string;
  tier?: GuestTier;
  vipNotes?: string;
}

export interface CheckInRecord {
  id?: string;
  guestId?: string;
  name: string;
  checkInTime: string;
  actualPax: number;
  souvenirClaimed: boolean;
  souvenirClaimedAt?: string;
  tableNumber?: string;
  tier?: GuestTier;
  source: 'qr_scan' | 'manual';
  notes?: string;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

export type ExpenseCategory =
  | 'venue'
  | 'catering'
  | 'attire_mua'
  | 'decoration'
  | 'photography'
  | 'entertainment_mc'
  | 'invitation_souvenir'
  | 'rings_dowry'
  | 'logistics_other';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export interface WeddingExpense {
  id?: string;
  category: ExpenseCategory;
  title: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  vendorName?: string;
  vendorPhone?: string;
  dueDate?: string;
  notes?: string;
  isCompleted?: boolean;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  updatedAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

export type TableShape = 'round' | 'long' | 'vip_stage';
export type TableZone = 'vip_front' | 'family_center' | 'regular_left' | 'regular_right';

export interface TableGuestAssignment {
  id: string; // guestId atau nama
  name: string;
  pax: number;
  isVip?: boolean;
}

export interface WeddingTable {
  id?: string;
  number: string; // e.g. "VIP-01", "Meja 05"
  name: string;   // e.g. "Keluarga Inti Pria", "Rekan Kerja Kantor"
  shape: TableShape;
  zone: TableZone;
  capacity: number; // e.g. 8 atau 10
  assignedGuests: TableGuestAssignment[];
  notes?: string;
  posX?: number; // koordinat persen denah (0 - 100)
  posY?: number; // koordinat persen denah (0 - 100)
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  updatedAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

export interface TriviaQuestion {
  id?: string;
  question: string;
  options: string[]; // 4 pilihan jawaban
  correctAnswerIndex?: number; // 0..3 (disensor pada endpoint publik tamu)
  explanation?: string; // Fakta seru setelah menjawab
  order: number;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
  updatedAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

export interface TriviaScore {
  id?: string;
  guestName: string;
  score: number; // Jumlah jawaban benar (e.g. 5)
  totalQuestions: number; // Total soal (e.g. 5)
  percentage: number; // 0 - 100
  title: string; // Gelar predikat (e.g. "Sahabat Sejati 100% 🏆")
  timeSpentSeconds?: number;
  createdAt?: Timestamp | Date | { toDate?: () => Date; seconds?: number; nanoseconds?: number } | null;
}

