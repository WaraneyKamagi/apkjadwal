import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface PixelHeaderProps {
  subtitle?: string;
}

export const PixelHeader: React.FC<PixelHeaderProps> = ({ subtitle = 'Jadwal Harian' }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        <Image
          source={require('../../../assets/pixel/haya_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.titleCol}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.primary }]}>HAYA</Text>
            <View
              style={[
                styles.bitBadge,
                {
                  backgroundColor: colors.secondaryContainer,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.bitText, { color: colors.onSecondaryContainer }]}>
                16-BIT
              </Text>
            </View>
          </View>
          <Text
            style={[styles.subtitle, { color: colors.onSurfaceVariant }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.rightContainer}>
        {/* Weather status pill */}
        <View
          style={[
            styles.weatherBadge,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialIcons
            name={
              colors.weatherIcon === 'water_drop'
                ? 'water-drop'
                : colors.weatherIcon === 'nights_stay'
                ? 'nights-stay'
                : colors.weatherIcon === 'air'
                ? 'air'
                : colors.weatherIcon === 'ac_unit'
                ? 'ac-unit'
                : 'cloud'
            }
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.weatherText, { color: colors.secondary }]}>
            {colors.weatherTitle}
          </Text>
        </View>

        {/* Avatar Portrait */}
        <View style={[styles.avatarFrame, { borderColor: colors.border }]}>
          <Image
            source={require('../../../assets/pixel/avatar.png')}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    zIndex: 50,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  titleCol: {
    flexDirection: 'column',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bitBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderWidth: 1,
  },
  bitText: {
    fontSize: 9,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  weatherText: {
    fontSize: 11,
    fontWeight: '600',
  },
  avatarFrame: {
    width: 34,
    height: 34,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 30,
    height: 30,
  },
});
