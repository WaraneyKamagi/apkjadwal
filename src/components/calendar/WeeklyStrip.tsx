import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getWeekDays } from '../../utils/dateUtils';
import { Task } from '../../types/task';

interface WeeklyStripProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tasks: Task[];
}

export const WeeklyStrip: React.FC<WeeklyStripProps> = ({
  selectedDate,
  onSelectDate,
  tasks,
}) => {
  const { colors } = useTheme();
  const weekDays = getWeekDays(selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: colors.onSurface }]}>PEKAN AKTIF</Text>
        <Text style={[styles.sublabel, { color: colors.primary }]}>PILIH HARI</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {weekDays.map(item => {
          const isSelected = item.dateString === selectedDate;
          const dayTasks = tasks.filter(t => t.date === item.dateString);
          const hasTasks = dayTasks.length > 0;

          return (
            <Pressable
              key={item.dateString}
              onPress={() => onSelectDate(item.dateString)}
              style={({ pressed }) => [
                styles.chipOuter,
                pressed && { transform: [{ translateX: 1 }, { translateY: 1 }] },
              ]}
            >
              {/* Hard shadow */}
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    backgroundColor: colors.border,
                    top: 2,
                    left: 2,
                  },
                ]}
              />
              <View
                style={[
                  styles.chipInner,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceContainerLowest,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayShort,
                    {
                      color: isSelected ? colors.onPrimary : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {item.dayShort}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    {
                      color: isSelected ? colors.onPrimary : colors.onSurface,
                    },
                  ]}
                >
                  {item.dayNumber}
                </Text>
                {/* Dots indicator */}
                <View style={styles.dotsRow}>
                  {hasTasks ? (
                    <View
                      style={[
                        styles.dot,
                        {
                          backgroundColor: isSelected ? colors.tertiaryFixed : colors.primary,
                        },
                      ]}
                    />
                  ) : (
                    <View style={styles.emptyDot} />
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  sublabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  scroll: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  chipOuter: {
    width: 48,
    height: 64,
    position: 'relative',
    marginRight: 2,
    marginBottom: 2,
  },
  chipInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  dayShort: {
    fontSize: 10,
    fontWeight: '700',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  dotsRow: {
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
  },
  emptyDot: {
    width: 5,
    height: 5,
  },
});
