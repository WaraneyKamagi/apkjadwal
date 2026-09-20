import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeColors, ThemeMode } from '../types';
import { THEMES } from '../constants/themes';
import {
  loadThemeFromStorage,
  saveThemeToStorage,
  loadSettingsFromStorage,
  saveSettingsToStorage,
} from '../utils/storage';

interface ThemeContextType {
  themeMode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;
  sfxEnabled: boolean;
  setSfxEnabled: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  refreshThemeSettings: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('default');
  const [particlesEnabled, setParticlesEnabledState] = useState<boolean>(true);
  const [sfxEnabled, setSfxEnabledState] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(true);

  const refreshThemeSettings = useCallback(async () => {
    const savedTheme = await loadThemeFromStorage();
    if (savedTheme && THEMES[savedTheme]) {
      setThemeModeState(savedTheme);
    }
    const savedSettings = await loadSettingsFromStorage();
    if (savedSettings) {
      setParticlesEnabledState(savedSettings.particlesEnabled ?? true);
      setSfxEnabledState(savedSettings.sfxEnabled ?? false);
      setNotificationsEnabledState(savedSettings.notificationsEnabled ?? true);
    }
  }, []);

  useEffect(() => {
    refreshThemeSettings();
  }, [refreshThemeSettings]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemeToStorage(mode);
  }, []);

  const setParticlesEnabled = useCallback((enabled: boolean) => {
    setParticlesEnabledState(enabled);
    saveSettingsToStorage({ particlesEnabled: enabled, sfxEnabled, notificationsEnabled });
  }, [sfxEnabled, notificationsEnabled]);

  const setSfxEnabled = useCallback((enabled: boolean) => {
    setSfxEnabledState(enabled);
    saveSettingsToStorage({ particlesEnabled, sfxEnabled: enabled, notificationsEnabled });
  }, [particlesEnabled, notificationsEnabled]);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    saveSettingsToStorage({ particlesEnabled, sfxEnabled, notificationsEnabled: enabled });
  }, [particlesEnabled, sfxEnabled]);

  const colors = useMemo(() => THEMES[themeMode] || THEMES.default, [themeMode]);

  const contextValue = useMemo(() => ({
    themeMode,
    colors,
    setThemeMode,
    particlesEnabled,
    setParticlesEnabled,
    sfxEnabled,
    setSfxEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    refreshThemeSettings,
  }), [
    themeMode,
    colors,
    setThemeMode,
    particlesEnabled,
    setParticlesEnabled,
    sfxEnabled,
    setSfxEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    refreshThemeSettings,
  ]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
