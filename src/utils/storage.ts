import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '../types/theme';

const STORAGE_KEYS = {
  TASKS: '@haya_tasks_v1',
  LOGS: '@haya_logs_v1',
  THEME: '@haya_theme_v1',
  SETTINGS: '@haya_settings_v1',
};


export async function saveThemeToStorage(theme: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  } catch (error) {
    console.error('Failed to save theme to storage', error);
  }
}

export async function loadThemeFromStorage(): Promise<ThemeMode | null> {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return (theme as ThemeMode) || null;
  } catch (error) {
    console.error('Failed to load theme from storage', error);
    return null;
  }
}

export interface AppSettings {
  particlesEnabled: boolean;
  sfxEnabled: boolean;
  notificationsEnabled: boolean;
}

export async function saveSettingsToStorage(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to storage', error);
  }
}

export async function loadSettingsFromStorage(): Promise<AppSettings | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load settings from storage', error);
    return null;
  }
}

