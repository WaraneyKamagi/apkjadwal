import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Task, TaskStatus } from '../../types/task';

export type FilterType = 'all' | TaskStatus;

interface FilterTabsProps {
  tasks: Task[];
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
  tasks,
  activeFilter,
  onSelectFilter,
}) => {
  const { colors } = useTheme();

  const counts = {
    all: tasks.length,
    running: tasks.filter(t => t.status === 'running').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  const tabs: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'Semua', count: counts.all },
    { key: 'running', label: 'Berjalan', count: counts.running },
    { key: 'pending', label: 'Belum', count: counts.pending },
    { key: 'done', label: 'Selesai', count: counts.done },
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {tabs.map(tab => {
          const isActive = activeFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelectFilter(tab.key)}
              style={({ pressed }) => [
                styles.tabOuter,
                pressed && { transform: [{ translateX: 1 }, { translateY: 1 }] },
              ]}
            >
              {/* Hard pixel shadow for tab */}
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
                  styles.tabButton,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surfaceContainerLowest,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? colors.onPrimary : colors.onSurface,
                    },
                  ]}
                >
                  {tab.label.toUpperCase()} ({tab.count})
                </Text>
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
    marginVertical: 6,
  },
  scroll: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  tabOuter: {
    position: 'relative',
    marginRight: 2,
    marginBottom: 2,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderRadius: 0,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
