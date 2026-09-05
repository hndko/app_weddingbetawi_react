import React, { createContext, useContext, useMemo } from 'react';
import { ThemeVisualTokens, getThemeTokens } from './themeTokens';

interface ThemeContextValue {
  themeId: string;
  tokens: ThemeVisualTokens;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'betawi',
  tokens: getThemeTokens('betawi'),
  isDark: false,
});

export interface ThemeProviderProps {
  themeId?: string;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ themeId = 'betawi', children }) => {
  const value = useMemo(() => {
    const tokens = getThemeTokens(themeId);
    return {
      themeId,
      tokens,
      isDark: tokens.isDark,
    };
  }, [themeId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemeTokens(): ThemeContextValue {
  return useContext(ThemeContext);
}
