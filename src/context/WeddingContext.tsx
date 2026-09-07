import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

const WeddingContext = createContext<WeddingContextType>({
  weddingConfig: defaultConfig as WeddingConfig,
  loading: true,
  updateWeddingConfig: async () => {},
  refreshConfig: async () => {},
});

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingConfig, setWeddingConfig] = useState<WeddingConfig>(defaultConfig as WeddingConfig);
  const [loading, setLoading] = useState(true);

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

  const loadConfig = useCallback(async () => {
    try {
      const data = await api.getConfig();
      if (data) {
        setWeddingConfig(normalizeConfig(data));
      }
    } catch (err) {
      console.warn('[WeddingContext] Gagal mengambil konfigurasi dari REST API, menggunakan default:', err);
      setWeddingConfig(defaultConfig as WeddingConfig);
    } finally {
      setLoading(false);
    }
  }, [normalizeConfig]);

  useEffect(() => {
    // Muat konfigurasi awal dari REST API
    loadConfig();

    // Dengarkan event realtime 'config:updated' dari Socket.io
    const handleConfigUpdated = (updatedConfig: WeddingConfig) => {
      console.log('[WeddingContext] Menerima pembaruan realtime dari Socket.io');
      setWeddingConfig(normalizeConfig(updatedConfig));
    };

    socket.on('config:updated', handleConfigUpdated);

    return () => {
      socket.off('config:updated', handleConfigUpdated);
    };
  }, [loadConfig, normalizeConfig]);

  const updateWeddingConfig = async (newConfig: WeddingConfig) => {
    await api.updateConfig(newConfig);
    setWeddingConfig(normalizeConfig(newConfig));
  };

  return (
    <WeddingContext.Provider value={{ weddingConfig, loading, updateWeddingConfig, refreshConfig: loadConfig }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWeddingConfig = () => useContext(WeddingContext);
