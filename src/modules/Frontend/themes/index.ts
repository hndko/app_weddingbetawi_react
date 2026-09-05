import { ThemeDefinition, ThemeMeta } from './types';
import { OpeningCover as BetawiOpeningCover } from '../betawi-themes/OpeningCover';
import { InvitationContent as BetawiInvitationContent } from '../betawi-themes/InvitationContent';
import { AppFrame as BetawiAppFrame } from '../betawi-themes/decorations/AppFrame';
import { MusicPlayer as BetawiMusicPlayer } from '../betawi-themes/MusicPlayer';

import { OpeningCover as JawaOpeningCover } from './jawa/OpeningCover';
import { InvitationContent as JawaInvitationContent } from './jawa/InvitationContent';
import { AppFrame as JawaAppFrame } from './jawa/decorations/AppFrame';

export * from './types';

export const THEME_CATALOG: ThemeMeta[] = [
  {
    id: 'betawi',
    name: 'Betawi Heritage',
    category: 'adat',
    subtitle: 'Adat Betawi Klasik Modern',
    description: 'Nuansa hangat adat Betawi berhias ornamen Gigi Balang, Ondel-ondel siluet elegan, dan arsitektur Rumah Kebaya.',
    thumbnail: '/assets/betawi-themes/images/og-image.jpg',
    previewColors: {
      primary: '#5B7065',
      secondary: '#B85D43',
      accent: '#D4AF37',
      bg: '#E8EBE3',
    },
    features: ['Gigi Balang Frame', 'Ondel-ondel Siluet', 'Bunga Flora Melayang', 'Musik Mengambang'],
    status: 'ready',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%235B7065'/><circle cx='50' cy='50' r='44' fill='none' stroke='%23D4AF37' stroke-width='3'/><path d='M50 15 L56 38 L80 38 L60 52 L68 75 L50 60 L32 75 L40 52 L20 38 L44 38 Z' fill='%23D4AF37'/></svg>",
  },
  {
    id: 'jawa',
    name: 'Javanese Royal Kraton',
    category: 'adat',
    subtitle: 'Adat Jawa Klasik Ningrat',
    description: 'Kemegahan ningrat keraton Jawa dengan ornamen sakral Gunungan Wayang Kulit, batik Parang, dan aksen emas keemasan.',
    thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    previewColors: {
      primary: '#1B3B2B',
      secondary: '#C5A059',
      accent: '#E5C158',
      bg: '#FAF8F2',
    },
    features: ['Gunungan Wayang Mas', 'Serat Ulem Pawiwahan', 'Bingkai Ukiran Keraton', 'Batik Royal Gold'],
    status: 'ready',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%23132A1C'/><circle cx='50' cy='50' r='44' fill='none' stroke='%23E5C158' stroke-width='3'/><path d='M50 14 C56 26 72 40 76 60 C78 70 70 78 50 78 C30 78 22 70 24 60 C28 40 44 26 50 14 Z' fill='%23E5C158'/><path d='M50 78 L50 88' stroke='%23E5C158' stroke-width='4' stroke-linecap='round'/></svg>",
  },
  {
    id: 'sunda',
    name: 'Sundanese Parahyangan',
    category: 'adat',
    subtitle: 'Adat Sunda Asri & Suci',
    description: 'Keanggunan mahkota Siger Sunda, ronce melati putih, motif Priangan, dan nuansa alam Parahyangan yang sejuk.',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    previewColors: {
      primary: '#4A6B5D',
      secondary: '#E6D5B8',
      accent: '#D4AF37',
      bg: '#F4F7F4',
    },
    features: ['Mahkota Siger Sunda', 'Ronce Melati Putih', 'Ornamen Bambu Priangan', 'Tahap Desain'],
    status: 'coming_soon',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%234A6B5D'/><circle cx='50' cy='50' r='44' fill='none' stroke='%23D4AF37' stroke-width='3'/><path d='M30 65 Q50 35 70 65 Z' fill='%23D4AF37'/></svg>",
  },
  {
    id: 'minimalist',
    name: 'Modern Botanical Minimalist',
    category: 'modern',
    subtitle: 'Nasional & Intimate Wedding',
    description: 'Gaya modern minimalis berbalut tipografi serif bersih, dedaunan eucalyptus cat air, dan tata letak lapang tanpa sekat.',
    thumbnail: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    previewColors: {
      primary: '#2D3748',
      secondary: '#9AA79C',
      accent: '#D4AF37',
      bg: '#F7FAFC',
    },
    features: ['Clean Aesthetic Serif', 'Eucalyptus Watercolor', 'Tata Letak Minimalis', 'Tahap Desain'],
    status: 'coming_soon',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%232D3748'/><circle cx='50' cy='50' r='44' fill='none' stroke='%239AA79C' stroke-width='3'/><text x='50' y='65' font-size='45' text-anchor='middle' fill='%23FFFFFF' font-family='serif'>W</text></svg>",
  },
  {
    id: 'islamic',
    name: 'Islamic Arabian Garden',
    category: 'islami',
    subtitle: 'Syar\'i & Sakral Kontemporer',
    description: 'Nuansa sakral islami berhias lengkungan kubah Arabesque, kaligrafi bismillah, dan taburan bintang geometris.',
    thumbnail: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    previewColors: {
      primary: '#0F4C5C',
      secondary: '#C5A059',
      accent: '#E36414',
      bg: '#FDFBF7',
    },
    features: ['Arabesque Arches', 'Bismillah Kaligrafi', 'Islamic Stars', 'Tahap Desain'],
    status: 'coming_soon',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%230F4C5C'/><circle cx='50' cy='50' r='44' fill='none' stroke='%23C5A059' stroke-width='3'/><path d='M50 20 C65 20 75 35 75 50 C75 65 65 80 50 80 C60 70 65 60 65 50 C65 40 60 30 50 20 Z' fill='%23C5A059'/></svg>",
  },
];

export const THEMES: Record<string, ThemeDefinition> = {
  betawi: {
    meta: THEME_CATALOG[0],
    components: {
      OpeningCover: BetawiOpeningCover,
      InvitationContent: BetawiInvitationContent,
      AppFrame: BetawiAppFrame,
      MusicPlayer: BetawiMusicPlayer,
    },
  },
  jawa: {
    meta: THEME_CATALOG[1],
    components: {
      OpeningCover: JawaOpeningCover,
      InvitationContent: JawaInvitationContent,
      AppFrame: JawaAppFrame,
      MusicPlayer: BetawiMusicPlayer,
    },
  },
};

export const DEFAULT_THEME_ID = 'betawi';

export function resolveTheme(themeId?: string): ThemeDefinition {
  const normalized = (themeId || '').toLowerCase().trim();
  if (normalized && THEMES[normalized]) {
    return THEMES[normalized];
  }
  return THEMES[DEFAULT_THEME_ID];
}
