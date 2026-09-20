import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { RootStackParamList, Task, TaskStatus } from '../types';
import { useFilteredTasks } from '../hooks';
import { PixelHeader } from '../components/common/PixelHeader';
import { RpgBanner } from '../components/home/RpgBanner';
import { FilterTabs, FilterType } from '../components/home/FilterTabs';
import { TaskTimelineItem } from '../components/home/TaskTimelineItem';
import { PixelCard } from '../components/common/PixelCard';
import { PixelButton } from '../components/common/PixelButton';
import { PixelLevelUpModal } from '../components/common/PixelLevelUpModal';

export const HomeScreen: React.FC = () => {
  const { colors } = useTheme();
  const { tasks, selectedDate, updateTaskStatus, deleteTask, isLoading, user } = useSchedule();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Level Up Tracking
  const prevLevelRef = useRef<number>(user?.level || 1);
  const [levelUpData, setLevelUpData] = useState<{ curr: number } | null>(null);

  useEffect(() => {
    if (user?.level) {
      if (prevLevelRef.current > 0 && user.level > prevLevelRef.current) {
        setLevelUpData({ curr: user.level });
      }
      prevLevelRef.current = user.level;
    }
  }, [user?.level]);

  // Custom hook handles date filtering and counts with memoization
  const { dateTasks, filteredTasks } = useFilteredTasks(tasks, selectedDate, activeFilter);

  const handleDelete = useCallback((id: string, title: string) => {
    Alert.alert(
      'Hapus Misi',
      `Yakin ingin menghapus misi "${title}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hapus', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deleteTask(id);
            } catch (error) {
              Alert.alert('Gagal', 'Terjadi kesalahan saat menghubungi server awan. Pastikan koneksi internet Anda stabil.');
            }
          } 
        },
      ]
    );
  }, [deleteTask]);

  const handleUpdateStatus = useCallback(async (id: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(id, status);
    } catch (error) {
      Alert.alert('Gagal', 'Gagal memperbarui status misi ke server. Mohon coba lagi.');
    }
  }, [updateTaskStatus]);

  const handleEdit = useCallback((id: string) => {
    navigation.navigate('AddEditTask', { taskId: id });
  }, [navigation]);

  const renderTaskItem: ListRenderItem<Task> = useCallback(({ item }) => (
    <TaskTimelineItem
      task={item}
      onUpdateStatus={handleUpdateStatus}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ), [handleUpdateStatus, handleEdit, handleDelete]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerGroup}>
      {/* Top RPG Banner (Weather + EXP Progress) */}
      <RpgBanner />

      {/* Cartridge Status Filter Tabs */}
      <FilterTabs
        tasks={dateTasks}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
      />
    </View>
  ), [dateTasks, activeFilter]);

  const renderFooter = useCallback(() => (
    <PixelCard style={styles.quickAddCard}>
      <View style={styles.quickAddContent}>
        <View style={[styles.quickAddIconBox, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="add-task" size={18} color={colors.onPrimary} />
        </View>
        <View style={styles.quickAddTexts}>
          <Text style={[styles.quickAddTitle, { color: colors.onSurface }]}>
            QUEST BARU?
          </Text>
          <Text style={[styles.quickAddSubtitle, { color: colors.onSurfaceVariant }]}>
            Catat agenda instan ke timeline
          </Text>
        </View>
      </View>
      <PixelButton
        title="Cepat Tambah"
        size="sm"
        icon="add"
        onPress={() => navigation.navigate('AddEditTask', { initialDate: selectedDate })}
      />
    </PixelCard>
  ), [colors, navigation, selectedDate]);

  const renderEmpty = useCallback(() => (
    <PixelCard style={styles.emptyCard}>
      <MaterialIcons name="sports-esports" size={36} color={colors.primary} />
      <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>
        TIDAK ADA MISI
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
        Belum ada kegiatan pada filter ini. Tekan tombol tambah untuk mencatat quest baru!
      </Text>
    </PixelCard>
  ), [colors]);

  const renderLoading = useCallback(() => (
    <PixelCard style={styles.emptyCard}>
      <Text style={[styles.emptyTitle, { color: colors.primary }]}>
        LOADING...
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
        Sedang memuat data dari memori.
      </Text>
    </PixelCard>
  ), [colors]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <PixelHeader subtitle="Jadwal Harian" />

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={renderTaskItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={isLoading ? renderLoading : renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      <PixelLevelUpModal
        visible={!!levelUpData}
        newLevel={levelUpData?.curr || 1}
        onClose={() => setLevelUpData(null)}
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
    gap: 12,
  },
  headerGroup: {
    gap: 12,
    marginBottom: 4,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  quickAddCard: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  quickAddContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  quickAddIconBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddTexts: {
    flex: 1,
  },
  quickAddTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickAddSubtitle: {
    fontSize: 11,
  },
});
