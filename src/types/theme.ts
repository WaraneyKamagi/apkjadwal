export type ThemeMode = 'default' | 'rainy' | 'starry' | 'windy' | 'snow';

export interface ThemeColors {
  name: string;
  weatherTitle: string;
  weatherDesc: string;
  weatherIcon: string;
  tempText: string;
  surface: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  surfaceContainerLowest: string;
  surfaceDim: string;
  onSurface: string;
  onSurfaceVariant: string;
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  tertiaryFixed: string;
  onTertiaryFixed: string;
  error: string;
  onError: string;
  border: string;
  divider: string;
  shadow: string;
  cardBg: string;
  accentSwatches: string[];
}
