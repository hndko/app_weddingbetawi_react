import { lazy } from 'react';
import { ThemeDefinition } from './types';
import { MusicPlayer as SharedMusicPlayer } from '../shared/components/MusicPlayer';
import { THEME_CATALOG } from './catalog';

export * from './types';
export * from './catalog';

// Lazy-loaded Betawi theme
const BetawiOpeningCover = lazy(() => import('./betawi/OpeningCover').then(m => ({ default: m.OpeningCover })));
const BetawiInvitationContent = lazy(() => import('./betawi/InvitationContent').then(m => ({ default: m.InvitationContent })));
const BetawiAppFrame = lazy(() => import('./betawi/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Jawa theme
const JawaOpeningCover = lazy(() => import('./jawa/OpeningCover').then(m => ({ default: m.OpeningCover })));
const JawaInvitationContent = lazy(() => import('./jawa/InvitationContent').then(m => ({ default: m.InvitationContent })));
const JawaAppFrame = lazy(() => import('./jawa/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Sunda theme
const SundaOpeningCover = lazy(() => import('./sunda/OpeningCover').then(m => ({ default: m.OpeningCover })));
const SundaInvitationContent = lazy(() => import('./sunda/InvitationContent').then(m => ({ default: m.InvitationContent })));
const SundaAppFrame = lazy(() => import('./sunda/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Minimalist theme
const MinimalistOpeningCover = lazy(() => import('./minimalist/OpeningCover').then(m => ({ default: m.OpeningCover })));
const MinimalistInvitationContent = lazy(() => import('./minimalist/InvitationContent').then(m => ({ default: m.InvitationContent })));
const MinimalistAppFrame = lazy(() => import('./minimalist/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Islamic theme
const IslamicOpeningCover = lazy(() => import('./islamic/OpeningCover').then(m => ({ default: m.OpeningCover })));
const IslamicInvitationContent = lazy(() => import('./islamic/InvitationContent').then(m => ({ default: m.InvitationContent })));
const IslamicAppFrame = lazy(() => import('./islamic/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Minang theme
const MinangOpeningCover = lazy(() => import('./minang/OpeningCover').then(m => ({ default: m.OpeningCover })));
const MinangInvitationContent = lazy(() => import('./minang/InvitationContent').then(m => ({ default: m.InvitationContent })));
const MinangAppFrame = lazy(() => import('./minang/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Bali theme
const BaliOpeningCover = lazy(() => import('./bali/OpeningCover').then(m => ({ default: m.OpeningCover })));
const BaliInvitationContent = lazy(() => import('./bali/InvitationContent').then(m => ({ default: m.InvitationContent })));
const BaliAppFrame = lazy(() => import('./bali/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Batak theme
const BatakOpeningCover = lazy(() => import('./batak/OpeningCover').then(m => ({ default: m.OpeningCover })));
const BatakInvitationContent = lazy(() => import('./batak/InvitationContent').then(m => ({ default: m.InvitationContent })));
const BatakAppFrame = lazy(() => import('./batak/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Spotify theme
const SpotifyOpeningCover = lazy(() => import('./spotify/OpeningCover').then(m => ({ default: m.OpeningCover })));
const SpotifyInvitationContent = lazy(() => import('./spotify/InvitationContent').then(m => ({ default: m.InvitationContent })));
const SpotifyAppFrame = lazy(() => import('./spotify/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

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
  islamic: {
    meta: THEME_CATALOG[4],
    components: {
      OpeningCover: IslamicOpeningCover,
      InvitationContent: IslamicInvitationContent,
      AppFrame: IslamicAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  minang: {
    meta: THEME_CATALOG[5],
    components: {
      OpeningCover: MinangOpeningCover,
      InvitationContent: MinangInvitationContent,
      AppFrame: MinangAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  bali: {
    meta: THEME_CATALOG[6],
    components: {
      OpeningCover: BaliOpeningCover,
      InvitationContent: BaliInvitationContent,
      AppFrame: BaliAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  batak: {
    meta: THEME_CATALOG[7],
    components: {
      OpeningCover: BatakOpeningCover,
      InvitationContent: BatakInvitationContent,
      AppFrame: BatakAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  spotify: {
    meta: THEME_CATALOG[8],
    components: {
      OpeningCover: SpotifyOpeningCover,
      InvitationContent: SpotifyInvitationContent,
      AppFrame: SpotifyAppFrame,
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
