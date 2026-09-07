import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { socket } from '../services/socket';
import { config as defaultConfig } from '../data/config';
import { WeddingConfig } from '../types';

interface WeddingContextType {
  weddingConfig: WeddingConfig;
  loading: boolean;
  updateWeddingConfig: (newConfig: WeddingConfig) => Promise<void>;
  refreshConfig: () => Promise<void>;
}

const CONFIG_CACHE_KEY = 'wedding_config_cache_v1';

function getCachedConfig(): WeddingConfig | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONFIG_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WeddingConfig;
  } catch {
    return null;
  }
}

function saveConfigToCache(cfg: WeddingConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(cfg));
  } catch {
    // Abaikan galat storage quota jika memori penuh
  }
}

const WeddingContext = createContext<WeddingContextType>({
  weddingConfig: defaultConfig as WeddingConfig,
  loading: true,
  updateWeddingConfig: async () => {},
  refreshConfig: async () => {},
});

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const normalizeConfig = useCallback((data: WeddingConfig): WeddingConfig => {
    return {
      ...defaultConfig,
      ...data,
      groom: { ...defaultConfig.groom, ...(data.groom || {}) },
      bride: { ...defaultConfig.bride, ...(data.bride || {}) },
      events: {
        akad: { ...defaultConfig.events.akad, ...(data.events?.akad || {}) },
        resepsi: { ...defaultConfig.events.resepsi, ...(data.events?.resepsi || {}) },
      },
      banks: data.banks || (data.bank ? [data.bank] : defaultConfig.banks),
      gallery: data.gallery || defaultConfig.gallery,
      galleryLayout: data.galleryLayout || 'editorial',
      loveStory: data.loveStory || defaultConfig.loveStory,
      musicUrl: data.musicUrl || (data.music?.playlist?.[0]?.url) || defaultConfig.musicUrl,
      music: {
        playlist: (data.music?.playlist && data.music.playlist.length > 0)
          ? data.music.playlist
          : (data.musicUrl ? [{ url: data.musicUrl }] : defaultConfig.music!.playlist),
        mode: (data.music?.mode && ['repeat-all', 'repeat-one', 'shuffle', 'linear'].includes(data.music.mode))
          ? data.music.mode
          : 'repeat-all',
      },
      seo: { ...defaultConfig.seo, ...(data.seo || {}) },
    };
  }, []);

  const cachedConfig = useMemo(() => getCachedConfig(), []);

  // Stale-While-Revalidate: Jika cache ditemukan di browser, langsung render seketika (0ms delay)
  const [weddingConfig, setWeddingConfig] = useState<WeddingConfig>(() => {
    return cachedConfig ? normalizeConfig(cachedConfig) : (defaultConfig as WeddingConfig);
  });

  const [loading, setLoading] = useState<boolean>(() => !cachedConfig);

  const loadConfig = useCallback(async () => {
    try {
      const data = await api.getConfig();
      if (data) {
        const normalized = normalizeConfig(data);
        setWeddingConfig(normalized);
        saveConfigToCache(normalized);
      }
    } catch {
      if (!cachedConfig) {
        setWeddingConfig(defaultConfig as WeddingConfig);
      }
    } finally {
      setLoading(false);
    }
  }, [normalizeConfig, cachedConfig]);

  useEffect(() => {
    // Sinkronisasi data terkini dari REST API di latar belakang
    loadConfig();

    // Dengarkan event realtime 'config:updated' dari Socket.io
    const handleConfigUpdated = (updatedConfig: WeddingConfig) => {
      const normalized = normalizeConfig(updatedConfig);
      setWeddingConfig(normalized);
      saveConfigToCache(normalized);
    };

    socket.on('config:updated', handleConfigUpdated);

    return () => {
      socket.off('config:updated', handleConfigUpdated);
    };
  }, [loadConfig, normalizeConfig]);

  const updateWeddingConfig = async (newConfig: WeddingConfig) => {
    await api.updateConfig(newConfig);
    const normalized = normalizeConfig(newConfig);
    setWeddingConfig(normalized);
    saveConfigToCache(normalized);
  };

  return (
    <WeddingContext.Provider value={{ weddingConfig, loading, updateWeddingConfig, refreshConfig: loadConfig }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWeddingConfig = () => useContext(WeddingContext);
