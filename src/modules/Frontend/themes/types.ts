import React from 'react';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

export interface ThemeMeta {
  id: string;
  name: string;
  category: 'adat' | 'modern' | 'islami';
  subtitle: string;
  description: string;
  thumbnail: string;
  previewColors: ThemeColors;
  features: string[];
  status: 'ready' | 'coming_soon';
}

export interface ThemeComponents {
  OpeningCover: React.ComponentType<{ onOpen: () => void }>;
  InvitationContent: React.ComponentType;
  AppFrame?: React.ComponentType;
  MusicPlayer?: React.ComponentType<{ isOpened: boolean }>;
}

export interface ThemeDefinition {
  meta: ThemeMeta;
  components: ThemeComponents;
}
