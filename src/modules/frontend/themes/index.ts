import { ThemeDefinition, ThemeMeta } from './types';
import { OpeningCover as BetawiOpeningCover } from './betawi/OpeningCover';
import { InvitationContent as BetawiInvitationContent } from './betawi/InvitationContent';
import { AppFrame as BetawiAppFrame } from './betawi/decorations/AppFrame';
import { MusicPlayer as SharedMusicPlayer } from '../shared/components/MusicPlayer';

import { OpeningCover as JawaOpeningCover } from './jawa/OpeningCover';
import { InvitationContent as JawaInvitationContent } from './jawa/InvitationContent';
import { AppFrame as JawaAppFrame } from './jawa/decorations/AppFrame';

import { OpeningCover as SundaOpeningCover } from './sunda/OpeningCover';
import { InvitationContent as SundaInvitationContent } from './sunda/InvitationContent';
import { AppFrame as SundaAppFrame } from './sunda/decorations/AppFrame';

import { OpeningCover as MinimalistOpeningCover } from './minimalist/OpeningCover';
import { InvitationContent as MinimalistInvitationContent } from './minimalist/InvitationContent';
import { AppFrame as MinimalistAppFrame } from './minimalist/decorations/AppFrame';

export * from './types';

export const THEME_CATALOG: ThemeMeta[] = [
  {
    id: 'betawi',
    name: 'Betawi Heritage',
    category: 'adat',
    subtitle: 'Adat Betawi Klasik Modern',
    description: 'Nuansa hangat adat Betawi berhias ornamen Gigi Balang, Ondel-ondel siluet elegan, dan arsitektur Rumah Kebaya.',
    thumbnail: '/assets/themes/betawi/thumbnail.jpg',
    previewColors: {
      primary: '#5B7065',
      secondary: '#B85D43',
      accent: '#D4AF37',
      bg: '#E8EBE3',
    },
    features: ['Gigi Balang Frame', 'Ondel-ondel Siluet', 'Bunga Flora Melayang', 'Musik Mengambang'],
    status: 'ready',
    favicon: '/assets/themes/betawi/favicon.svg',
  },
  {
    id: 'jawa',
    name: 'Javanese Royal Kraton',
    category: 'adat',
    subtitle: 'Adat Jawa Klasik Ningrat',
    description: 'Kemegahan ningrat keraton Jawa dengan ornamen sakral Gunungan Wayang Kulit, batik Parang, dan aksen emas keemasan.',
    thumbnail: '/assets/themes/jawa/thumbnail.svg',
    previewColors: {
      primary: '#1B3B2B',
      secondary: '#C5A059',
      accent: '#E5C158',
      bg: '#FAF8F2',
    },
    features: ['Gunungan Wayang Mas', 'Serat Ulem Pawiwahan', 'Bingkai Ukiran Keraton', 'Batik Royal Gold'],
    status: 'ready',
    favicon: '/assets/themes/jawa/favicon.svg',
  },
  {
    id: 'sunda',
    name: 'Sundanese Parahyangan',
    category: 'adat',
    subtitle: 'Adat Sunda Asri & Suci',
    description: 'Keanggunan mahkota Siger Sunda, ronce melati putih, motif Priangan, dan nuansa alam Parahyangan yang sejuk.',
    thumbnail: '/assets/themes/sunda/thumbnail.svg',
    previewColors: {
      primary: '#4A6B5D',
      secondary: '#E6D5B8',
      accent: '#D4AF37',
      bg: '#F4F7F4',
    },
    features: ['Mahkota Siger Sunda', 'Serat Ulem Pawiwahan', 'Ronce Melati Putih', 'Bambu Priangan Arch'],
    status: 'ready',
    favicon: '/assets/themes/sunda/favicon.svg',
  },
  {
    id: 'minimalist',
    name: 'Modern Botanical Minimalist',
    category: 'modern',
    subtitle: 'Nasional & Intimate Wedding',
    description: 'Gaya modern minimalis berbalut tipografi serif bersih, dedaunan eucalyptus cat air, dan tata letak lapang tanpa sekat.',
    thumbnail: '/assets/themes/minimalist/thumbnail.svg',
    previewColors: {
      primary: '#2D3748',
      secondary: '#9AA79C',
      accent: '#D4AF37',
      bg: '#F7FAFC',
    },
    features: ['Clean Aesthetic Serif', 'Eucalyptus Watercolor', 'Editorial Minimalist', 'Tata Letak Lapang'],
    status: 'ready',
    favicon: '/assets/themes/minimalist/favicon.svg',
  },
  {
    id: 'islamic',
    name: 'Islamic Arabian Garden',
    category: 'islami',
    subtitle: 'Syar\'i & Sakral Kontemporer',
    description: 'Nuansa sakral islami berhias lengkungan kubah Arabesque, kaligrafi bismillah, dan taburan bintang geometris.',
    thumbnail: '/assets/themes/islamic/thumbnail.svg',
    previewColors: {
      primary: '#0F4C5C',
      secondary: '#C5A059',
      accent: '#E36414',
      bg: '#FDFBF7',
    },
    features: ['Arabesque Arches', 'Bismillah Kaligrafi', 'Islamic Stars', 'Tahap Desain'],
    status: 'coming_soon',
    favicon: '/assets/themes/islamic/favicon.svg',
  },
];

export const THEMES: Record<string, ThemeDefinition> = {
  betawi: {
    meta: THEME_CATALOG[0],
    components: {
      OpeningCover: BetawiOpeningCover,
      InvitationContent: BetawiInvitationContent,
      AppFrame: BetawiAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  jawa: {
    meta: THEME_CATALOG[1],
    components: {
      OpeningCover: JawaOpeningCover,
      InvitationContent: JawaInvitationContent,
      AppFrame: JawaAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  sunda: {
    meta: THEME_CATALOG[2],
    components: {
      OpeningCover: SundaOpeningCover,
      InvitationContent: SundaInvitationContent,
      AppFrame: SundaAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  minimalist: {
    meta: THEME_CATALOG[3],
    components: {
      OpeningCover: MinimalistOpeningCover,
      InvitationContent: MinimalistInvitationContent,
      AppFrame: MinimalistAppFrame,
      MusicPlayer: SharedMusicPlayer,
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
