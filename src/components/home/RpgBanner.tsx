import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useSchedule } from '../../contexts/ScheduleContext';
import { formatDateIndonesian } from '../../utils/dateUtils';
import { PixelCard } from '../common/PixelCard';

export const RpgBanner: React.FC = () => {
  const { colors } = useTheme();
  const { selectedDate, getTodayProgress, user } = useSchedule();
  const { total, done } = getTodayProgress();

  const dateFormatted = formatDateIndonesian(selectedDate);
  const level = user?.level || 1;
  const totalExp = user?.totalExp || 0;
  
  const expForCurrentLevel = (level - 1) * 100;
  const currentLevelExp = totalExp - expForCurrentLevel;
  const percentageToNextLevel = Math.max(0, Math.min(100, currentLevelExp)); // because 1 level = 100 exp

  return (
    <PixelCard style={styles.card} shadowOffset={3}>
      {/* Header info row */}
      <View style={styles.headerRow}>
        <View style={styles.titleArea}>
          <View style={styles.questTag}>
            <View style={[styles.questSquare, { backgroundColor: colors.primary }]} />
            <Text style={[styles.questLabel, { color: colors.primary }]}>
              QUEST: {done}/{total} SELESAI
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.onSurface }]}>
            {dateFormatted}
          </Text>
        </View>

        {/* Pixel Weather Badge */}
        <View
          style={[
            styles.weatherBadge,
            {
              backgroundColor: colors.surfaceContainerHigh,
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
            size={22}
            color={colors.primary}
          />
          <View style={styles.weatherInfo}>
            <Text style={[styles.weatherTemp, { color: colors.onSurface }]}>
              {colors.tempText.split('•')[0].trim()}
            </Text>
            <Text style={[styles.weatherCondition, { color: colors.secondary }]}>
              {colors.weatherTitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Pixel EXP Progress Bar */}
      <View
        style={[
          styles.expContainer,
          {
            backgroundColor: colors.surfaceContainer,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.expHeader}>
          <View style={styles.expLabelRow}>
            <MaterialIcons name="bolt" size={16} color={colors.tertiary} />
            <Text style={[styles.expTitle, { color: colors.onSurface }]}>
              LEVEL {level}
            </Text>
          </View>
          <Text style={[styles.expRatio, { color: colors.primary }]}>
            {currentLevelExp} / 100 EXP
          </Text>
        </View>

        {/* Track */}
        <View
          style={[
            styles.expTrack,
            {
              backgroundColor: colors.surfaceDim,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.expFill,
              {
                width: `${Math.max(percentageToNextLevel, 4)}%`,
                backgroundColor: colors.primary,
              },
            ]}
          >
            {/* Top Shine strip */}
            <View
              style={[
                styles.shineStrip,
                { backgroundColor: colors.tertiaryFixed },
              ]}
            />
          </View>
        </View>
      </View>
    </PixelCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 14,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flexDirection: 'column',
  },
  questTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  questSquare: {
    width: 8,
    height: 8,
  },
  questLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1.5,
  },
  weatherInfo: {
    alignItems: 'flex-end',
  },
  weatherTemp: {
    fontSize: 12,
    fontWeight: '800',
  },
  weatherCondition: {
    fontSize: 10,
    fontWeight: '600',
  },
  expContainer: {
    padding: 8,
    borderWidth: 1.5,
    gap: 6,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  expRatio: {
    fontSize: 11,
    fontWeight: '800',
  },
  expTrack: {
    height: 14,
    borderWidth: 1.5,
    padding: 1,
    justifyContent: 'center',
  },
  expFill: {
    height: '100%',
    position: 'relative',
  },
  shineStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
});
