export interface ThemeVisualTokens {
  isDark: boolean;
  bg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  primary: string;
  secondary: string;
  accent: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  btnPrimaryBg: string;
  btnPrimaryText: string;
  navBg: string;
  navBorder: string;
  navActive: string;
  navInactive: string;
  floatingBtnBg: string;
  floatingBtnBorder: string;
  floatingBtnText: string;
  floatingBtnRing: string;
  floatingBtnActiveText: string;
}

export const THEME_TOKENS: Record<string, ThemeVisualTokens> = {
  // 🎬 Netflix Cinematic Premiere (Dark OTT Streaming)
  netflix: {
    isDark: true,
    bg: '#0F0F0F',
    cardBg: 'rgba(24, 24, 24, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    textPrimary: '#FFFFFF',
    textMuted: '#9CA3AF',
    primary: '#E50914',
    secondary: '#1F1F1F',
    accent: '#E50914',
    inputBg: 'rgba(32, 32, 32, 0.95)',
    inputBorder: 'rgba(255, 255, 255, 0.15)',
    inputText: '#FFFFFF',
    btnPrimaryBg: '#E50914',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(18, 18, 18, 0.92)',
    navBorder: 'rgba(255, 255, 255, 0.12)',
    navActive: '#E50914',
    navInactive: 'rgba(255, 255, 255, 0.45)',
    floatingBtnBg: 'rgba(24, 24, 24, 0.92)',
    floatingBtnBorder: 'rgba(255, 255, 255, 0.15)',
    floatingBtnText: '#FFFFFF',
    floatingBtnRing: 'rgba(229, 9, 20, 0.25)',
    floatingBtnActiveText: '#E50914',
  },

  // 🎵 Spotify Interactive Love Playlist (Dark Neon Music)
  spotify: {
    isDark: true,
    bg: '#121212',
    cardBg: 'rgba(24, 24, 24, 0.88)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    textPrimary: '#FFFFFF',
    textMuted: '#A7A7A7',
    primary: '#1DB954',
    secondary: '#181818',
    accent: '#1ED760',
    inputBg: 'rgba(32, 32, 32, 0.95)',
    inputBorder: 'rgba(255, 255, 255, 0.15)',
    inputText: '#FFFFFF',
    btnPrimaryBg: '#1DB954',
    btnPrimaryText: '#000000',
    navBg: 'rgba(18, 18, 18, 0.92)',
    navBorder: 'rgba(255, 255, 255, 0.12)',
    navActive: '#1DB954',
    navInactive: 'rgba(255, 255, 255, 0.45)',
    floatingBtnBg: 'rgba(24, 24, 24, 0.92)',
    floatingBtnBorder: 'rgba(255, 255, 255, 0.15)',
    floatingBtnText: '#FFFFFF',
    floatingBtnRing: 'rgba(29, 185, 84, 0.25)',
    floatingBtnActiveText: '#1DB954',
  },

  // 👑 Javanese Royal Kraton (Classic Gold & Dark Green)
  jawa: {
    isDark: false,
    bg: '#FAF8F2',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(197, 160, 89, 0.25)',
    textPrimary: '#1B3B2B',
    textMuted: '#5C6B61',
    primary: '#1B3B2B',
    secondary: '#C5A059',
    accent: '#C5A059',
    inputBg: 'rgba(250, 248, 242, 0.85)',
    inputBorder: 'rgba(197, 160, 89, 0.3)',
    inputText: '#1B3B2B',
    btnPrimaryBg: '#1B3B2B',
    btnPrimaryText: '#FAF8F2',
    navBg: 'rgba(250, 248, 242, 0.92)',
    navBorder: 'rgba(197, 160, 89, 0.25)',
    navActive: '#C5A059',
    navInactive: 'rgba(27, 59, 43, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(197, 160, 89, 0.35)',
    floatingBtnText: '#1B3B2B',
    floatingBtnRing: 'rgba(197, 160, 89, 0.25)',
    floatingBtnActiveText: '#C5A059',
  },

  // 🌺 Sundanese Parahyangan (Priangan Green & Bamboo Soft)
  sunda: {
    isDark: false,
    bg: '#F4F7F4',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(74, 107, 93, 0.2)',
    textPrimary: '#283D34',
    textMuted: '#5E736A',
    primary: '#4A6B5D',
    secondary: '#E6D5B8',
    accent: '#D4AF37',
    inputBg: 'rgba(244, 247, 244, 0.85)',
    inputBorder: 'rgba(74, 107, 93, 0.25)',
    inputText: '#283D34',
    btnPrimaryBg: '#4A6B5D',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(255, 255, 255, 0.92)',
    navBorder: 'rgba(74, 107, 93, 0.2)',
    navActive: '#4A6B5D',
    navInactive: 'rgba(40, 61, 52, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(74, 107, 93, 0.3)',
    floatingBtnText: '#4A6B5D',
    floatingBtnRing: 'rgba(74, 107, 93, 0.2)',
    floatingBtnActiveText: '#D4AF37',
  },

  // 🌿 Modern Botanical Minimalist (Clean Slate & Eucalyptus)
  minimalist: {
    isDark: false,
    bg: '#F7FAFC',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(154, 167, 156, 0.25)',
    textPrimary: '#2D3748',
    textMuted: '#718096',
    primary: '#2D3748',
    secondary: '#9AA79C',
    accent: '#4A5568',
    inputBg: 'rgba(247, 250, 252, 0.9)',
    inputBorder: 'rgba(154, 167, 156, 0.3)',
    inputText: '#2D3748',
    btnPrimaryBg: '#2D3748',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(255, 255, 255, 0.92)',
    navBorder: 'rgba(154, 167, 156, 0.2)',
    navActive: '#2D3748',
    navInactive: 'rgba(45, 55, 72, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(154, 167, 156, 0.3)',
    floatingBtnText: '#2D3748',
    floatingBtnRing: 'rgba(45, 55, 72, 0.15)',
    floatingBtnActiveText: '#9AA79C',
  },

  // 🕌 Islamic Arabian Garden (Emerald & Arabesque Gold)
  islamic: {
    isDark: false,
    bg: '#FAF6EE',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(197, 160, 89, 0.25)',
    textPrimary: '#0F4C5C',
    textMuted: '#4F6F77',
    primary: '#0F4C5C',
    secondary: '#C5A059',
    accent: '#C5A059',
    inputBg: 'rgba(250, 246, 238, 0.85)',
    inputBorder: 'rgba(197, 160, 89, 0.3)',
    inputText: '#0F4C5C',
    btnPrimaryBg: '#0F4C5C',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(250, 246, 238, 0.92)',
    navBorder: 'rgba(197, 160, 89, 0.25)',
    navActive: '#C5A059',
    navInactive: 'rgba(15, 76, 92, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(197, 160, 89, 0.35)',
    floatingBtnText: '#0F4C5C',
    floatingBtnRing: 'rgba(197, 160, 89, 0.25)',
    floatingBtnActiveText: '#C5A059',
  },

  // 👑 Minangkabau Royal Songket (Maroon Beludru & Emas Suntiang)
  minang: {
    isDark: false,
    bg: '#FAF5F0',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(123, 17, 34, 0.2)',
    textPrimary: '#420A13',
    textMuted: '#6B3E45',
    primary: '#7B1122',
    secondary: '#D4AF37',
    accent: '#D4AF37',
    inputBg: 'rgba(250, 245, 240, 0.85)',
    inputBorder: 'rgba(123, 17, 34, 0.25)',
    inputText: '#420A13',
    btnPrimaryBg: '#7B1122',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(250, 245, 240, 0.92)',
    navBorder: 'rgba(123, 17, 34, 0.2)',
    navActive: '#7B1122',
    navInactive: 'rgba(66, 10, 19, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(123, 17, 34, 0.3)',
    floatingBtnText: '#7B1122',
    floatingBtnRing: 'rgba(212, 175, 55, 0.25)',
    floatingBtnActiveText: '#D4AF37',
  },

  // 🛕 Balinese Royal Temple (Bata Candi & Bunga Jepun Kamboja)
  bali: {
    isDark: false,
    bg: '#FAF6F0',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(124, 45, 18, 0.2)',
    textPrimary: '#451A03',
    textMuted: '#78350F',
    primary: '#7C2D12',
    secondary: '#C5A059',
    accent: '#C5A059',
    inputBg: 'rgba(250, 246, 240, 0.85)',
    inputBorder: 'rgba(124, 45, 18, 0.25)',
    inputText: '#451A03',
    btnPrimaryBg: '#7C2D12',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(250, 246, 240, 0.92)',
    navBorder: 'rgba(124, 45, 18, 0.2)',
    navActive: '#7C2D12',
    navInactive: 'rgba(69, 26, 3, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(124, 45, 18, 0.3)',
    floatingBtnText: '#7C2D12',
    floatingBtnRing: 'rgba(197, 160, 89, 0.25)',
    floatingBtnActiveText: '#C5A059',
  },

  // 🏛️ Batak Toba Royal Gorga (Tolu Bolit Merah, Hitam & Emas)
  batak: {
    isDark: false,
    bg: '#FAF6F0',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(122, 27, 30, 0.2)',
    textPrimary: '#1C1917',
    textMuted: '#57534E',
    primary: '#7A1B1E',
    secondary: '#1C1917',
    accent: '#D4AF37',
    inputBg: 'rgba(250, 246, 240, 0.85)',
    inputBorder: 'rgba(122, 27, 30, 0.25)',
    inputText: '#1C1917',
    btnPrimaryBg: '#7A1B1E',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(250, 246, 240, 0.92)',
    navBorder: 'rgba(122, 27, 30, 0.2)',
    navActive: '#7A1B1E',
    navInactive: 'rgba(28, 25, 23, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(122, 27, 30, 0.3)',
    floatingBtnText: '#7A1B1E',
    floatingBtnRing: 'rgba(212, 175, 55, 0.25)',
    floatingBtnActiveText: '#D4AF37',
  },

  // 🏮 Betawi Heritage (Default Klasik Sage, Terracotta & Emas)
  betawi: {
    isDark: false,
    bg: '#E8EBE3',
    cardBg: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(91, 112, 101, 0.2)',
    textPrimary: '#292925',
    textMuted: '#5B7065',
    primary: '#5B7065',
    secondary: '#B85D43',
    accent: '#D4AF37',
    inputBg: 'rgba(238, 238, 234, 0.85)',
    inputBorder: 'rgba(91, 112, 101, 0.25)',
    inputText: '#292925',
    btnPrimaryBg: '#5B7065',
    btnPrimaryText: '#FFFFFF',
    navBg: 'rgba(252, 250, 245, 0.92)',
    navBorder: 'rgba(91, 112, 101, 0.2)',
    navActive: '#5B7065',
    navInactive: 'rgba(41, 41, 37, 0.45)',
    floatingBtnBg: 'rgba(255, 255, 255, 0.95)',
    floatingBtnBorder: 'rgba(91, 112, 101, 0.3)',
    floatingBtnText: '#566B46',
    floatingBtnRing: 'rgba(141, 166, 107, 0.25)',
    floatingBtnActiveText: '#566B46',
  },
};

export const DEFAULT_THEME_TOKENS: ThemeVisualTokens = THEME_TOKENS.betawi;

export function getThemeTokens(themeId?: string): ThemeVisualTokens {
  const normalized = (themeId || '').toLowerCase().trim();
  return THEME_TOKENS[normalized] || DEFAULT_THEME_TOKENS;
}
