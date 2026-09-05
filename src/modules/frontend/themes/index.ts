import { lazy } from 'react';
import { ThemeDefinition } from './types';
import { MusicPlayer as SharedMusicPlayer } from '../shared/components/MusicPlayer';
import { THEME_CATALOG } from './catalog';

export * from './types';
export * from './catalog';
export * from './themeTokens';
export * from './ThemeContext';

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

// Lazy-loaded Netflix theme
const NetflixOpeningCover = lazy(() => import('./netflix/OpeningCover').then(m => ({ default: m.OpeningCover })));
const NetflixInvitationContent = lazy(() => import('./netflix/InvitationContent').then(m => ({ default: m.InvitationContent })));
const NetflixAppFrame = lazy(() => import('./netflix/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Apple iOS theme
const AppleOpeningCover = lazy(() => import('./apple/OpeningCover').then(m => ({ default: m.OpeningCover })));
const AppleInvitationContent = lazy(() => import('./apple/InvitationContent').then(m => ({ default: m.InvitationContent })));
const AppleAppFrame = lazy(() => import('./apple/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Instagram Stories theme
const InstagramOpeningCover = lazy(() => import('./instagram/OpeningCover').then(m => ({ default: m.OpeningCover })));
const InstagramInvitationContent = lazy(() => import('./instagram/InvitationContent').then(m => ({ default: m.InvitationContent })));
const InstagramAppFrame = lazy(() => import('./instagram/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Bugis-Makassar theme
const BugisOpeningCover = lazy(() => import('./bugis/OpeningCover').then(m => ({ default: m.OpeningCover })));
const BugisInvitationContent = lazy(() => import('./bugis/InvitationContent').then(m => ({ default: m.InvitationContent })));
const BugisAppFrame = lazy(() => import('./bugis/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Palembang Sriwijaya theme
const PalembangOpeningCover = lazy(() => import('./palembang/OpeningCover').then(m => ({ default: m.OpeningCover })));
const PalembangInvitationContent = lazy(() => import('./palembang/InvitationContent').then(m => ({ default: m.InvitationContent })));
const PalembangAppFrame = lazy(() => import('./palembang/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Vintage Newspaper theme
const VintageOpeningCover = lazy(() => import('./vintage/OpeningCover').then(m => ({ default: m.OpeningCover })));
const VintageInvitationContent = lazy(() => import('./vintage/InvitationContent').then(m => ({ default: m.InvitationContent })));
const VintageAppFrame = lazy(() => import('./vintage/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Toraja theme
const TorajaOpeningCover = lazy(() => import('./toraja/OpeningCover').then(m => ({ default: m.OpeningCover })));
const TorajaInvitationContent = lazy(() => import('./toraja/InvitationContent').then(m => ({ default: m.InvitationContent })));
const TorajaAppFrame = lazy(() => import('./toraja/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded 8-Bit Arcade theme
const ArcadeOpeningCover = lazy(() => import('./arcade/OpeningCover').then(m => ({ default: m.OpeningCover })));
const ArcadeInvitationContent = lazy(() => import('./arcade/InvitationContent').then(m => ({ default: m.InvitationContent })));
const ArcadeAppFrame = lazy(() => import('./arcade/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Royal Decree theme
const RoyalOpeningCover = lazy(() => import('./royal/OpeningCover').then(m => ({ default: m.OpeningCover })));
const RoyalInvitationContent = lazy(() => import('./royal/InvitationContent').then(m => ({ default: m.InvitationContent })));
const RoyalAppFrame = lazy(() => import('./royal/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

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
  bugis: {
    meta: THEME_CATALOG[8],
    components: {
      OpeningCover: BugisOpeningCover,
      InvitationContent: BugisInvitationContent,
      AppFrame: BugisAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  palembang: {
    meta: THEME_CATALOG[9],
    components: {
      OpeningCover: PalembangOpeningCover,
      InvitationContent: PalembangInvitationContent,
      AppFrame: PalembangAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  spotify: {
    meta: THEME_CATALOG[10],
    components: {
      OpeningCover: SpotifyOpeningCover,
      InvitationContent: SpotifyInvitationContent,
      AppFrame: SpotifyAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  netflix: {
    meta: THEME_CATALOG[11],
    components: {
      OpeningCover: NetflixOpeningCover,
      InvitationContent: NetflixInvitationContent,
      AppFrame: NetflixAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  apple: {
    meta: THEME_CATALOG[12],
    components: {
      OpeningCover: AppleOpeningCover,
      InvitationContent: AppleInvitationContent,
      AppFrame: AppleAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  instagram: {
    meta: THEME_CATALOG[13],
    components: {
      OpeningCover: InstagramOpeningCover,
      InvitationContent: InstagramInvitationContent,
      AppFrame: InstagramAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  vintage: {
    meta: THEME_CATALOG[14],
    components: {
      OpeningCover: VintageOpeningCover,
      InvitationContent: VintageInvitationContent,
      AppFrame: VintageAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  toraja: {
    meta: THEME_CATALOG[15],
    components: {
      OpeningCover: TorajaOpeningCover,
      InvitationContent: TorajaInvitationContent,
      AppFrame: TorajaAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  arcade: {
    meta: THEME_CATALOG[16],
    components: {
      OpeningCover: ArcadeOpeningCover,
      InvitationContent: ArcadeInvitationContent,
      AppFrame: ArcadeAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  royal: {
    meta: THEME_CATALOG[17],
    components: {
      OpeningCover: RoyalOpeningCover,
      InvitationContent: RoyalInvitationContent,
      AppFrame: RoyalAppFrame,
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
