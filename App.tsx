import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { ScheduleProvider, useSchedule } from './src/contexts/ScheduleContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { WeatherParticles } from './src/components/common/WeatherParticles';

SplashScreen.preventAutoHideAsync();

function MainApp() {
  const { themeMode } = useTheme();
  const { isLoading } = useSchedule();

  React.useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <StatusBar style={themeMode === 'starry' ? 'light' : 'dark'} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <WeatherParticles />
    </>
  );
}

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ScheduleProvider>
            <MainApp />
          </ScheduleProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ConvexProvider>
  );
}
