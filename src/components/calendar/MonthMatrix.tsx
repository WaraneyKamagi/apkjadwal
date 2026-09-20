import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { getCalendarGrid, getTodayDateString } from '../../utils/dateUtils';
import { Task } from '../../types';
import { PixelCard } from '../common/PixelCard';

interface MonthMatrixProps {
  year: number;
  month: number; // 0-11
  selectedDate: string;
  onSelectDate: (date: string) => void;
  tasks: Task[];
}

export const MonthMatrix: React.FC<MonthMatrixProps> = React.memo(({
  year,
  month,
  selectedDate,
  onSelectDate,
  tasks,
}) => {
  const { colors } = useTheme();
  const grid = getCalendarGrid(year, month);
  const todayStr = getTodayDateString();

  const dayHeaders = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

  // Pre-compute task counts to avoid O(N*42) filtering during render
  const taskCountsByDate = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) {
      if (t.date) {
        counts[t.date] = (counts[t.date] || 0) + 1;
      }
    }
    return counts;
  }, [tasks]);

  return (
    <PixelCard style={styles.card}>
      {/* Day of Week Headers */}
      <View style={[styles.headerRow, { borderBottomColor: colors.divider }]}>
        {dayHeaders.map((day, idx) => (
          <View key={idx} style={styles.headerCell}>
            <Text style={[styles.headerText, { color: colors.onSurfaceVariant }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.grid}>
        {grid.map((cell, index) => {
          if (!cell.dayNumber) {
            return <View key={`empty-${index}`} style={styles.emptyCell} />;
          }

          const isSelected = cell.dateString === selectedDate;
          const isToday = cell.dateString === todayStr;
          const taskCount = taskCountsByDate[cell.dateString] || 0;

          return (
            <Pressable
              key={cell.dateString}
              onPress={() => onSelectDate(cell.dateString)}
              style={[
                styles.cell,
                {
                  backgroundColor: isSelected
                    ? colors.primary
                    : isToday
                    ? colors.surfaceContainer
                    : colors.surfaceContainerLowest,
                  borderColor: isSelected ? colors.border : colors.surfaceContainer,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: isSelected
                      ? colors.onPrimary
                      : isToday
                      ? colors.primary
                      : colors.onSurface,
                    fontWeight: isToday || isSelected ? '800' : '600',
                  },
                ]}
              >
                {cell.dayNumber}
              </Text>

              {/* Task indicator dots */}
              <View style={styles.dotContainer}>
                {taskCount > 0 && (
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isSelected
                          ? colors.tertiaryFixed
                          : colors.primary,
                      },
                    ]}
                  />
                )}
                {taskCount > 1 && (
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isSelected
                          ? colors.onPrimary
                          : colors.secondary,
                      },
                    ]}
                  />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </PixelCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 10,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCell: {
    width: `${100 / 7}%`,
    height: 44,
  },
  cell: {
    width: `${100 / 7}%`,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dayNumber: {
    fontSize: 13,
  },
  dotContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
    height: 5,
  },
  dot: {
    width: 4,
    height: 4,
  },
});
