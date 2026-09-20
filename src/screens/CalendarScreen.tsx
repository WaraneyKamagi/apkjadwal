import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { RootStackParamList } from '../types/navigation';
import { formatMonthYear, formatDateIndonesian } from '../utils/dateUtils';
import { PixelHeader } from '../components/common/PixelHeader';
import { WeeklyStrip } from '../components/calendar/WeeklyStrip';
import { MonthMatrix } from '../components/calendar/MonthMatrix';
import { PixelCard } from '../components/common/PixelCard';
import { PixelBadge } from '../components/common/PixelBadge';
import { PixelButton } from '../components/common/PixelButton';

export const CalendarScreen: React.FC = () => {
  const { colors } = useTheme();
  const { tasks, selectedDate, setSelectedDate, updateTaskStatus } = useSchedule();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Extract year and month from selectedDate
  const [dateYear, dateMonth] = selectedDate.split('-').map(Number);
  const [currentYear, setCurrentYear] = useState(dateYear || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(
    dateMonth !== undefined ? dateMonth - 1 : new Date().getMonth()
  );

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Agenda for the chosen selectedDate
  const selectedTasks = tasks.filter(t => t.date === selectedDate);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <PixelHeader subtitle="Kalender Agenda" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Retro Month Navigation Bar */}
        <PixelCard style={styles.monthBar}>
          <Pressable
            onPress={prevMonth}
            style={[styles.monthNavBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
          >
            <MaterialIcons name="arrow-back-ios" size={16} color={colors.onSurface} />
          </Pressable>

          <View style={styles.monthCenter}>
            <View style={styles.pulseRow}>
              <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
              <Text style={[styles.monthTitle, { color: colors.onSurface }]}>
                {formatMonthYear(currentYear, currentMonth)}
              </Text>
              <View style={[styles.pulseDot, { backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.monthSubtitle, { color: colors.onSurfaceVariant }]}>
              PILIH TANGGAL ACARA
            </Text>
          </View>

          <Pressable
            onPress={nextMonth}
            style={[styles.monthNavBtn, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
          >
            <MaterialIcons name="arrow-forward-ios" size={16} color={colors.onSurface} />
          </Pressable>
        </PixelCard>

        {/* Weekly Strip */}
        <WeeklyStrip
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          tasks={tasks}
        />

        {/* 31-Day Month Matrix Grid */}
        <MonthMatrix
          year={currentYear}
          month={currentMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          tasks={tasks}
        />

        {/* Agenda Section for Selected Date */}
        <View style={styles.agendaSection}>
          <View style={styles.agendaHeader}>
            <View style={styles.agendaTitleRow}>
              <MaterialIcons name="event-note" size={18} color={colors.primary} />
              <Text style={[styles.agendaHeading, { color: colors.onSurface }]}>
                AGENDA: {formatDateIndonesian(selectedDate).toUpperCase()}
              </Text>
            </View>
            <Text style={[styles.agendaCount, { color: colors.primary }]}>
              {selectedTasks.length} Misi
            </Text>
          </View>

          {selectedTasks.length > 0 ? (
            selectedTasks.map(task => (
              <PixelCard key={task.id} style={styles.taskCard} shadowOffset={2}>
                <View style={styles.taskCardHeader}>
                  <View style={styles.badgeContainer}>
                    <PixelBadge
                      label={
                        task.status === 'running'
                          ? 'BERJALAN'
                          : task.status === 'done'
                          ? 'SELESAI'
                          : task.status === 'cancelled'
                          ? 'BATAL'
                          : 'BELUM'
                      }
                      status={task.status}
                    />
                    <PixelBadge
                      label={task.category}
                      color={colors.secondaryContainer}
                      textColor={colors.onSecondaryContainer}
                    />
                  </View>
                  <Text style={[styles.taskTime, { color: colors.primary }]}>
                    {task.startTime} - {task.endTime}
                  </Text>
                </View>

                <Text style={[styles.taskTitle, { color: colors.onSurface }]}>
                  {task.title}
                </Text>

                {task.description ? (
                  <Text style={[styles.taskDesc, { color: colors.onSurfaceVariant }]}>
                    {task.description}
                  </Text>
                ) : null}

                {/* Quick toggle status button */}
                <View style={styles.quickActionRow}>
                  <Pressable
                    onPress={() =>
                      updateTaskStatus(task.id, task.status === 'done' ? 'pending' : 'done')
                    }
                    style={[
                      styles.toggleStatusBtn,
                      {
                        backgroundColor: task.status === 'done' ? colors.secondaryContainer : colors.primary,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name={task.status === 'done' ? 'check-circle' : 'radio-button-unchecked'}
                      size={14}
                      color={task.status === 'done' ? colors.onSecondaryContainer : colors.onPrimary}
                    />
                    <Text
                      style={[
                        styles.toggleStatusText,
                        {
                          color: task.status === 'done' ? colors.onSecondaryContainer : colors.onPrimary,
                        },
                      ]}
                    >
                      {task.status === 'done' ? 'SELESAI (TAP UTK BATALKAN)' : 'TANDAI SELESAI'}
                    </Text>
                  </Pressable>
                </View>
              </PixelCard>
            ))
          ) : (
            <PixelCard style={styles.emptyAgendaCard}>
              <Text style={[styles.emptyAgendaText, { color: colors.onSurfaceVariant }]}>
                Tidak ada agenda yang dijadwalkan pada tanggal ini.
              </Text>
            </PixelCard>
          )}

          {/* Add Agenda Button for this Date */}
          <PixelButton
            title="Tambah Agenda Pada Tanggal Ini"
            icon="add"
            onPress={() => navigation.navigate('AddEditTask', { initialDate: selectedDate })}
            style={{ marginTop: 6 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  monthNavBtn: {
    width: 36,
    height: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCenter: {
    alignItems: 'center',
  },
  pulseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  monthSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 2,
  },
  agendaSection: {
    marginTop: 8,
    gap: 10,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  agendaTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  agendaHeading: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  agendaCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  taskCard: {
    padding: 12,
    gap: 6,
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  taskTime: {
    fontSize: 12,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  taskDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  quickActionRow: {
    marginTop: 4,
    flexDirection: 'row',
  },
  toggleStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  toggleStatusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyAgendaCard: {
    padding: 16,
    alignItems: 'center',
  },
  emptyAgendaText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
