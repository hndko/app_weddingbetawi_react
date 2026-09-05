import { lazy } from 'react';
import { ThemeDefinition, ThemeMeta } from './types';
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

// Lazy-loaded Sunda Maroon theme
const SundaMaroonOpeningCover = lazy(() => import('./sunda_maroon/OpeningCover').then(m => ({ default: m.OpeningCover })));
const SundaMaroonInvitationContent = lazy(() => import('./sunda_maroon/InvitationContent').then(m => ({ default: m.InvitationContent })));
const SundaMaroonAppFrame = lazy(() => import('./sunda_maroon/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

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

// Lazy-loaded Dayak theme
const DayakOpeningCover = lazy(() => import('./dayak/OpeningCover').then(m => ({ default: m.OpeningCover })));
const DayakInvitationContent = lazy(() => import('./dayak/InvitationContent').then(m => ({ default: m.InvitationContent })));
const DayakAppFrame = lazy(() => import('./dayak/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

// Lazy-loaded Cyberpunk theme
const CyberpunkOpeningCover = lazy(() => import('./cyberpunk/OpeningCover').then(m => ({ default: m.OpeningCover })));
const CyberpunkInvitationContent = lazy(() => import('./cyberpunk/InvitationContent').then(m => ({ default: m.InvitationContent })));
const CyberpunkAppFrame = lazy(() => import('./cyberpunk/decorations/AppFrame').then(m => ({ default: m.AppFrame })));

const getThemeMeta = (id: string): ThemeMeta => {
  const meta = THEME_CATALOG.find(t => t.id === id);
  if (!meta) throw new Error(`Theme metadata not found for ID: ${id}`);
  return meta;
};

export const THEMES: Record<string, ThemeDefinition> = {
  betawi: {
    meta: getThemeMeta('betawi'),
    components: {
      OpeningCover: BetawiOpeningCover,
      InvitationContent: BetawiInvitationContent,
      AppFrame: BetawiAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  jawa: {
    meta: getThemeMeta('jawa'),
    components: {
      OpeningCover: JawaOpeningCover,
      InvitationContent: JawaInvitationContent,
      AppFrame: JawaAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  sunda: {
    meta: getThemeMeta('sunda'),
    components: {
      OpeningCover: SundaOpeningCover,
      InvitationContent: SundaInvitationContent,
      AppFrame: SundaAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  sunda_maroon: {
    meta: getThemeMeta('sunda_maroon'),
    components: {
      OpeningCover: SundaMaroonOpeningCover,
      InvitationContent: SundaMaroonInvitationContent,
      AppFrame: SundaMaroonAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  minimalist: {
    meta: getThemeMeta('minimalist'),
    components: {
      OpeningCover: MinimalistOpeningCover,
      InvitationContent: MinimalistInvitationContent,
      AppFrame: MinimalistAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  islamic: {
    meta: getThemeMeta('islamic'),
    components: {
      OpeningCover: IslamicOpeningCover,
      InvitationContent: IslamicInvitationContent,
      AppFrame: IslamicAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  minang: {
    meta: getThemeMeta('minang'),
    components: {
      OpeningCover: MinangOpeningCover,
      InvitationContent: MinangInvitationContent,
      AppFrame: MinangAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  bali: {
    meta: getThemeMeta('bali'),
    components: {
      OpeningCover: BaliOpeningCover,
      InvitationContent: BaliInvitationContent,
      AppFrame: BaliAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  batak: {
    meta: getThemeMeta('batak'),
    components: {
      OpeningCover: BatakOpeningCover,
      InvitationContent: BatakInvitationContent,
      AppFrame: BatakAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  bugis: {
    meta: getThemeMeta('bugis'),
    components: {
      OpeningCover: BugisOpeningCover,
      InvitationContent: BugisInvitationContent,
      AppFrame: BugisAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  palembang: {
    meta: getThemeMeta('palembang'),
    components: {
      OpeningCover: PalembangOpeningCover,
      InvitationContent: PalembangInvitationContent,
      AppFrame: PalembangAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  spotify: {
    meta: getThemeMeta('spotify'),
    components: {
      OpeningCover: SpotifyOpeningCover,
      InvitationContent: SpotifyInvitationContent,
      AppFrame: SpotifyAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  netflix: {
    meta: getThemeMeta('netflix'),
    components: {
      OpeningCover: NetflixOpeningCover,
      InvitationContent: NetflixInvitationContent,
      AppFrame: NetflixAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  apple: {
    meta: getThemeMeta('apple'),
    components: {
      OpeningCover: AppleOpeningCover,
      InvitationContent: AppleInvitationContent,
      AppFrame: AppleAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  instagram: {
    meta: getThemeMeta('instagram'),
    components: {
      OpeningCover: InstagramOpeningCover,
      InvitationContent: InstagramInvitationContent,
      AppFrame: InstagramAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  vintage: {
    meta: getThemeMeta('vintage'),
    components: {
      OpeningCover: VintageOpeningCover,
      InvitationContent: VintageInvitationContent,
      AppFrame: VintageAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  toraja: {
    meta: getThemeMeta('toraja'),
    components: {
      OpeningCover: TorajaOpeningCover,
      InvitationContent: TorajaInvitationContent,
      AppFrame: TorajaAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  arcade: {
    meta: getThemeMeta('arcade'),
    components: {
      OpeningCover: ArcadeOpeningCover,
      InvitationContent: ArcadeInvitationContent,
      AppFrame: ArcadeAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  royal: {
    meta: getThemeMeta('royal'),
    components: {
      OpeningCover: RoyalOpeningCover,
      InvitationContent: RoyalInvitationContent,
      AppFrame: RoyalAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  dayak: {
    meta: getThemeMeta('dayak'),
    components: {
      OpeningCover: DayakOpeningCover,
      InvitationContent: DayakInvitationContent,
      AppFrame: DayakAppFrame,
      MusicPlayer: SharedMusicPlayer,
    },
  },
  cyberpunk: {
    meta: getThemeMeta('cyberpunk'),
    components: {
      OpeningCover: CyberpunkOpeningCover,
      InvitationContent: CyberpunkInvitationContent,
      AppFrame: CyberpunkAppFrame,
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
