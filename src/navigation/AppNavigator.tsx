import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ActivityLogScreen } from '../screens/ActivityLogScreen';
import { ThemeSettingsScreen } from '../screens/ThemeSettingsScreen';
import { AddEditTaskScreen } from '../screens/AddEditTaskScreen';
import { CustomTabBar } from './CustomTabBar';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const EmptyComponent = () => <View />;

function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Jadwal" component={HomeScreen} />
      <Tab.Screen name="Kalender" component={CalendarScreen} />
      <Tab.Screen name="TambahAction" component={EmptyComponent} />
      <Tab.Screen name="Aktivitas" component={ActivityLogScreen} />
      <Tab.Screen name="Tema" component={ThemeSettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="AddEditTask"
        component={AddEditTaskScreen}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}
