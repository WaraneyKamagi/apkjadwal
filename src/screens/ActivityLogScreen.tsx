import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { ActivityLog } from '../types';
import { useActivityLogFilter, LogFilter } from '../hooks';
import { formatTime } from '../utils/dateUtils';
import { PixelHeader } from '../components/common/PixelHeader';
import { PixelCard } from '../components/common/PixelCard';
import { PixelBadge } from '../components/common/PixelBadge';

const FILTER_BUTTONS: { key: LogFilter; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { key: 'all', label: 'Semua', icon: 'apps' },
  { key: 'status', label: 'Ubah Status', icon: 'sync-alt' },
  { key: 'create', label: 'Tambah', icon: 'add-box' },
  { key: 'edit', label: 'Edit', icon: 'edit-note' },
  { key: 'delete', label: 'Hapus', icon: 'delete' },
];

export const ActivityLogScreen: React.FC = () => {
  const { colors } = useTheme();
  const { logs } = useSchedule();

  const [activeFilter, setActiveFilter] = useState<LogFilter>('all');

  const { filteredLogs, totalCount } = useActivityLogFilter(logs, activeFilter);

  const renderLogItem: ListRenderItem<ActivityLog> = useCallback(({ item: log }) => {
    let actionBadgeLabel = 'UPDATE';
    let badgeColor = colors.secondaryContainer;
    let badgeTextColor = colors.onSecondaryContainer;

    if (log.actionType === 'create') {
      actionBadgeLabel = 'TAMBAH';
      badgeColor = colors.primary;
      badgeTextColor = colors.onPrimary;
    } else if (log.actionType === 'status') {
      actionBadgeLabel = 'STATUS';
      badgeColor = colors.tertiaryFixed;
      badgeTextColor = colors.onTertiaryFixed;
    } else if (log.actionType === 'delete') {
      actionBadgeLabel = 'HAPUS';
      badgeColor = colors.error;
      badgeTextColor = colors.onError;
    } else if (log.actionType === 'edit') {
      actionBadgeLabel = 'EDIT';
      badgeColor = colors.surfaceContainer;
      badgeTextColor = colors.onSurfaceVariant;
    }

    return (
      <PixelCard style={styles.logCard} shadowOffset={2}>
        <View style={styles.logCardHeader}>
          <View style={styles.badgeRow}>
            <PixelBadge
              label={actionBadgeLabel}
              color={badgeColor}
              textColor={badgeTextColor}
            />
            <Text style={[styles.logTime, { color: colors.onSurfaceVariant }]}>
              {formatTime(log.timestamp)}
            </Text>
          </View>
          {log.expGained ? (
            <View style={[styles.expGainBadge, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
              <MaterialIcons name="bolt" size={14} color={colors.tertiary} />
              <Text style={[styles.expGainText, { color: colors.primary }]}>
                +{log.expGained} EXP
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.taskTitle, { color: colors.onSurface }]}>
          {log.taskTitle}
        </Text>
        <Text style={[styles.logDesc, { color: colors.onSurfaceVariant }]}>
          {log.description}
        </Text>
      </PixelCard>
    );
  }, [colors]);

  const renderHeader = useMemo(() => (
    <View style={styles.headerContainer}>
      {/* Top Pixel Stat Card */}
      <PixelCard style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={styles.titleRow}>
            <View style={[styles.squareIcon, { backgroundColor: colors.primary }]} />
            <Text style={[styles.statTitle, { color: colors.onSurface }]}>
              CATATAN LOG AKTIVITAS
            </Text>
          </View>
          <View style={[styles.sysBadge, { backgroundColor: colors.secondaryContainer, borderColor: colors.border }]}>
            <Text style={[styles.sysText, { color: colors.onSecondaryContainer }]}>SYS.V16</Text>
          </View>
        </View>

        <View style={[styles.statRow, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.border }]}>
          <View style={styles.terminalInfo}>
            <MaterialIcons name="terminal" size={18} color={colors.primary} />
            <Text style={[styles.totalText, { color: colors.onSurfaceVariant }]}>
              TOTAL {totalCount} AKSI TERCATAT
            </Text>
          </View>
          <View style={styles.liveSync}>
            <View style={[styles.liveDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.liveText, { color: colors.secondary }]}>LIVE SYNC</Text>
          </View>
        </View>
      </PixelCard>

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_BUTTONS.map(fb => {
          const isActive = activeFilter === fb.key;
          return (
            <Pressable
              key={fb.key}
              onPress={() => setActiveFilter(fb.key)}
              style={({ pressed }) => [
                styles.filterOuter,
                pressed && { transform: [{ translateX: 1 }, { translateY: 1 }] },
              ]}
            >
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
                  styles.filterBtn,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surfaceContainer,
                    borderColor: colors.border,
                  },
                ]}
              >
                <MaterialIcons
                  name={fb.icon}
                  size={14}
                  color={isActive ? colors.onPrimary : colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.filterBtnText,
                    {
                      color: isActive ? colors.onPrimary : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {fb.label.toUpperCase()}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  ), [colors, totalCount, activeFilter]);

  const renderEmpty = useCallback(() => (
    <PixelCard style={styles.emptyCard}>
      <MaterialIcons name="receipt-long" size={32} color={colors.primary} />
      <Text style={[styles.emptyText, { color: colors.onSurface }]}>
        BELUM ADA LOG PADA FILTER INI
      </Text>
    </PixelCard>
  ), [colors]);

  const renderSeparator = useCallback(() => (
    <View style={styles.separator} />
  ), []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <PixelHeader subtitle="Log Aktivitas" />

      <FlatList
        data={filteredLogs}
        keyExtractor={item => item.id}
        renderItem={renderLogItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    gap: 12,
    marginBottom: 12,
  },
  separator: {
    height: 10,
  },
  statCard: {
    padding: 14,
    gap: 10,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  squareIcon: {
    width: 8,
    height: 8,
  },
  statTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sysBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  sysText: {
    fontSize: 9,
    fontWeight: '800',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
  },
  terminalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  totalText: {
    fontSize: 11,
    fontWeight: '800',
  },
  liveSync: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterOuter: {
    position: 'relative',
    marginRight: 2,
    marginBottom: 2,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1.5,
  },
  filterBtnText: {
    fontSize: 10,
    fontWeight: '800',
  },
  logCard: {
    padding: 12,
    gap: 6,
  },
  logCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logTime: {
    fontSize: 11,
    fontWeight: '600',
  },
  expGainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  expGainText: {
    fontSize: 10,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  logDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
