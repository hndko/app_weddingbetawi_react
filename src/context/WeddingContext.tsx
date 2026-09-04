import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { config as defaultConfig } from '../data/config';
import { WeddingConfig } from '../types';

interface WeddingContextType {
  weddingConfig: WeddingConfig;
  loading: boolean;
  updateWeddingConfig: (newConfig: WeddingConfig) => Promise<void>;
}

const WeddingContext = createContext<WeddingContextType>({
  weddingConfig: defaultConfig as WeddingConfig,
  loading: true,
  updateWeddingConfig: async () => {},
});

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weddingConfig, setWeddingConfig] = useState<WeddingConfig>(defaultConfig as WeddingConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Safety fallback: jika Firestore offline/unreachable, jangan gantung loading UI lebih dari 1 detik
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const docRef = doc(db, 'wedding_config', 'main');
    
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      clearTimeout(safetyTimer);
      if (docSnap.exists()) {
        const data = docSnap.data() as WeddingConfig;
        setWeddingConfig({
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
          loveStory: data.loveStory || defaultConfig.loveStory,
          musicUrl: data.musicUrl || defaultConfig.musicUrl,
          music: data.music || {
            playlist: data.musicUrl ? [{ url: data.musicUrl }] : defaultConfig.music!.playlist,
            mode: 'repeat-all'
          },
          seo: { ...defaultConfig.seo, ...(data.seo || {}) },
        });
      } else {
        // Initialize doc in Firestore if missing
        try {
          await setDoc(docRef, defaultConfig);
        } catch (err) {
          console.error('Failed to initialize wedding_config in Firestore:', err);
        }
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching wedding config:', error);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const updateWeddingConfig = async (newConfig: WeddingConfig) => {
    const docRef = doc(db, 'wedding_config', 'main');
    await setDoc(docRef, newConfig, { merge: true });
  };

  return (
    <WeddingContext.Provider value={{ weddingConfig, loading, updateWeddingConfig }}>
      {children}
    </WeddingContext.Provider>
  );
};

export const useWeddingConfig = () => useContext(WeddingContext);
