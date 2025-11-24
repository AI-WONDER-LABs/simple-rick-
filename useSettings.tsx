import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  backgroundUri: string | null;
  backgroundName: string;
  autoExpand: boolean;
}

const SETTINGS_KEY = '@simple_rick_settings';

const defaultSettings: AppSettings = {
  backgroundUri: 'https://cdn-ai.onspace.ai/onspace/files/Q4fNwr5Pspg7uczryNFvQd/Screenshot_20251124-003129~2.png',
  backgroundName: 'Rick Portal',
  autoExpand: false,
};

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = async () => {
    try {
      setSettings(defaultSettings);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  return {
    settings,
    isLoading,
    updateSettings,
    resetSettings,
  };
};
