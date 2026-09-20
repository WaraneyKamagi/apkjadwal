import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        // Custom middle button "Tambah"
        if (route.name === 'TambahAction') {
          return (
            <View key={route.key} style={styles.tabItem}>
              <Pressable
                onPress={() => navigation.navigate('AddEditTask')}
                style={({ pressed }) => [
                  styles.fabOuter,
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                {/* 16-bit Hard Shadow for FAB */}
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    {
                      backgroundColor: colors.border,
                      top: 3,
                      left: 3,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.fabInner,
                    {
                      backgroundColor: colors.primary,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <MaterialIcons name="add" size={28} color={colors.onPrimary} />
                </View>
              </Pressable>
              <Text style={[styles.tabLabel, { color: colors.onSurfaceVariant, marginTop: 4 }]}>
                Tambah
              </Text>
            </View>
          );
        }

        let iconName: keyof typeof MaterialIcons.glyphMap = 'today';
        let label = 'Jadwal';

        if (route.name === 'Jadwal') {
          iconName = 'calendar-today';
          label = 'Jadwal';
        } else if (route.name === 'Kalender') {
          iconName = 'calendar-month';
          label = 'Kalender';
        } else if (route.name === 'Aktivitas') {
          iconName = 'checklist';
          label = 'Aktivitas';
        } else if (route.name === 'Tema') {
          iconName = 'palette';
          label = 'Tema';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
          >
            <MaterialIcons
              name={iconName}
              size={22}
              color={isFocused ? colors.primary : colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.primary : colors.onSurfaceVariant,
                  fontWeight: isFocused ? '800' : '600',
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 68,
    borderTopWidth: 2,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  fabOuter: {
    marginTop: -20,
    width: 46,
    height: 46,
    position: 'relative',
  },
  fabInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
