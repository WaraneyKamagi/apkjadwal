import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { RootStackParamList } from '../types/navigation';
import { TaskCategory } from '../types/task';
import {
  getTodayDateString,
  getTomorrowDateString,
  getDayAfterTomorrowDateString,
} from '../utils/dateUtils';
import { PixelCard } from '../components/common/PixelCard';
import { PixelAlertModal } from '../components/common/PixelAlertModal';
import { PixelDatePickerModal } from '../components/common/PixelDatePickerModal';
import { PixelTextInput, PixelTextArea, PixelToggle } from '../components/form/PixelFormFields';

const CATEGORIES: TaskCategory[] = [
  'Kerja / Proyek',
  'Belajar',
  'Olahraga',
  'Personal',
  'Operasional',
];

export const AddEditTaskScreen: React.FC = () => {
  const { colors } = useTheme();
  const { tasks, addTask, updateTask } = useSchedule();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'AddEditTask'>>();

  const taskId = route.params?.taskId;
  const initialDate = route.params?.initialDate || getTodayDateString();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState<TaskCategory>('Kerja / Proyek');
  const [hasReminder, setHasReminder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  useEffect(() => {
    if (taskId) {
      const existing = tasks.find(t => t.id === taskId);
      if (existing) {
        setTitle(existing.title);
        setDescription(existing.description);
        setDate(existing.date);
        setStartTime(existing.startTime);
        setEndTime(existing.endTime);
        setCategory(existing.category);
        setHasReminder(existing.hasReminder);
      }
    }
  }, [taskId, tasks]);

  const handleSave = async () => {
    if (!title.trim()) {
      showAlert('Perhatian', 'Judul kegiatan tidak boleh kosong!');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      showAlert('Format Tanggal Salah', 'Gunakan format YYYY-MM-DD (Contoh: 2024-10-24)');
      return;
    }
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime()) || date !== parsedDate.toISOString().split('T')[0]) {
      showAlert('Tanggal Tidak Valid', 'Tanggal yang dimasukkan tidak ada di kalender.');
      return;
    }

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime)) {
      showAlert('Format Waktu Salah', 'Jam Mulai harus menggunakan format HH:MM (00:00 - 23:59)');
      return;
    }
    if (!timeRegex.test(endTime)) {
      showAlert('Format Waktu Salah', 'Jam Selesai harus menggunakan format HH:MM (00:00 - 23:59)');
      return;
    }

    if (startTime >= endTime) {
      showAlert('Waktu Tidak Valid', 'Jam Selesai harus lebih besar dari Jam Mulai');
      return;
    }

    setIsSaving(true);
    try {
      if (taskId) {
        await updateTask(taskId, {
          title: title.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          category,
          hasReminder,
        });
      } else {
        await addTask({
          title: title.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          category,
          status: 'pending',
          hasReminder,
        });
      }

      setIsSaved(true);
      setTimeout(() => {
        navigation.goBack();
      }, 500);
    } catch (error) {
      showAlert('Error', 'Gagal menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();
  const lusaStr = getDayAfterTomorrowDateString();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Window Header */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="arrow-back" size={22} color={colors.onSurface} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
            {taskId ? 'EDIT TUGAS' : 'TAMBAH TUGAS'}
          </Text>
          <Pressable onPress={() => navigation.goBack()} style={styles.cancelBtn}>
            <Text style={[styles.cancelText, { color: colors.error }]}>BATAL</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quest Creator Subheader */}
          <View style={styles.subHeader}>
            <View style={[styles.questIconBox, { backgroundColor: colors.tertiaryFixed, borderColor: colors.border }]}>
              <MaterialIcons name="auto-stories" size={20} color={colors.onTertiaryFixed} />
            </View>
            <View>
              <Text style={[styles.questTag, { color: colors.secondary }]}>QUEST CREATOR</Text>
              <Text style={[styles.questTitle, { color: colors.onSurface }]}>
                {taskId ? 'Perbarui Rincian Misi' : 'Tambah Kegiatan Baru'}
              </Text>
            </View>
          </View>

          {/* Game Boy RPG Form Window */}
          <PixelCard style={styles.formCard}>
            {/* Form Window Title Rail */}
            <View style={[styles.formRail, { backgroundColor: colors.surfaceContainerLow, borderBottomColor: colors.border }]}>
              <View style={styles.railDots}>
                <View style={[styles.railDot, { backgroundColor: colors.primary }]} />
                <View style={[styles.railDot, { backgroundColor: colors.tertiary }]} />
                <View style={[styles.railDot, { backgroundColor: colors.error }]} />
                <Text style={[styles.railTitle, { color: colors.onSurface }]}>
                  DIARY_LOG.EXE
                </Text>
              </View>
              <View style={[styles.lvlBadge, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}>
                <Text style={[styles.lvlText, { color: colors.onSurfaceVariant }]}>LVL. 01</Text>
              </View>
            </View>

            {/* Form Body */}
            <View style={styles.formBody}>
              {/* 1. Judul Kegiatan */}
              <PixelTextInput
                label="JUDUL KEGIATAN"
                isRequired
                placeholder="Contoh: Rapat Desain Sistem"
                value={title}
                onChangeText={setTitle}
              />

              {/* 2. Deskripsi Misi */}
              <PixelTextArea
                label="DESKRIPSI MISI"
                maxLength={150}
                currentLength={description.length}
                placeholder="Tuliskan catatan atau detail kegiatan..."
                value={description}
                onChangeText={t => t.length <= 150 && setDescription(t)}
              />

              {/* 3. Tanggal Misi & Shortcut Buttons */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.pointer, { color: colors.primary }]}>▶</Text>
                  <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>
                    TANGGAL KEGIATAN (YYYY-MM-DD)
                  </Text>
                </View>
                <Pressable
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      borderColor: colors.border,
                      justifyContent: 'center'
                    },
                  ]}
                  onPress={() => setDatePickerVisible(true)}
                >
                  <Text style={{ color: colors.onSurface, fontSize: 13, fontWeight: '600' }}>
                    {date}
                  </Text>
                </Pressable>
                {/* Shortcut buttons */}
                <View style={styles.shortcutRow}>
                  <Pressable
                    onPress={() => setDate(todayStr)}
                    style={[
                      styles.shortcutBtn,
                      {
                        backgroundColor: date === todayStr ? colors.primary : colors.surfaceContainer,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.shortcutText,
                        { color: date === todayStr ? colors.onPrimary : colors.onSurface },
                      ]}
                    >
                      Hari Ini
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDate(tomorrowStr)}
                    style={[
                      styles.shortcutBtn,
                      {
                        backgroundColor: date === tomorrowStr ? colors.primary : colors.surfaceContainer,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.shortcutText,
                        { color: date === tomorrowStr ? colors.onPrimary : colors.onSurface },
                      ]}
                    >
                      Besok
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setDate(lusaStr)}
                    style={[
                      styles.shortcutBtn,
                      {
                        backgroundColor: date === lusaStr ? colors.primary : colors.surfaceContainer,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.shortcutText,
                        { color: date === lusaStr ? colors.onPrimary : colors.onSurface },
                      ]}
                    >
                      Lusa
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* 4. Waktu Mulai & Waktu Selesai */}
              <View style={styles.timeRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <PixelTextInput
                    label="JAM MULAI"
                    placeholder="09:00"
                    value={startTime}
                    onChangeText={setStartTime}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <PixelTextInput
                    label="JAM SELESAI"
                    placeholder="10:00"
                    value={endTime}
                    onChangeText={setEndTime}
                  />
                </View>
              </View>

              {/* 5. Kategori */}
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.pointer, { color: colors.primary }]}>▶</Text>
                  <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>
                    KATEGORI MISI
                  </Text>
                </View>
                <View style={styles.categoriesWrap}>
                  {CATEGORIES.map(cat => {
                    const isSelected = category === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setCategory(cat)}
                        style={[
                          styles.catChip,
                          {
                            backgroundColor: isSelected ? colors.secondaryContainer : colors.surfaceContainerLow,
                            borderColor: colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.catChipText,
                            {
                              color: isSelected ? colors.onSecondaryContainer : colors.onSurface,
                              fontWeight: isSelected ? '800' : '600',
                            },
                          ]}
                        >
                          {cat}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* 6. Pengingat Toggle */}
              <PixelToggle
                label="PENGINGAT"
                subLabel={hasReminder ? '15 Menit Sebelumnya' : 'Tidak Aktif'}
                value={hasReminder}
                onToggle={() => setHasReminder(!hasReminder)}
              />

              {/* Action Save Button */}
              <Pressable
                onPress={handleSave}
                disabled={isSaving || isSaved}
                style={[
                  styles.saveBtn,
                  {
                    backgroundColor: isSaved 
                      ? colors.primary 
                      : isSaving 
                        ? colors.surfaceDim 
                        : colors.primaryContainer,
                    borderColor: colors.border,
                  },
                ]}
              >
                {isSaved ? (
                  <View style={styles.savedRow}>
                    <MaterialIcons name="check-circle" size={20} color="#ffffff" />
                    <Text style={styles.saveBtnText}>MISI TERSIMPAN!</Text>
                  </View>
                ) : isSaving ? (
                  <View style={styles.savedRow}>
                    <MaterialIcons name="hourglass-empty" size={20} color="#ffffff" />
                    <Text style={styles.saveBtnText}>MENYIMPAN...</Text>
                  </View>
                ) : (
                  <Text style={styles.saveBtnText}>
                    {taskId ? 'SIMPAN PERUBAHAN' : 'SIMPAN MISI'}
                  </Text>
                )}
              </Pressable>
            </View>
          </PixelCard>
        </ScrollView>
      </KeyboardAvoidingView>

      <PixelAlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      <PixelDatePickerModal
        visible={datePickerVisible}
        initialDate={date}
        onSelect={setDate}
        onClose={() => setDatePickerVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 2,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cancelBtn: {
    padding: 6,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '800',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 14,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  questIconBox: {
    width: 36,
    height: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  questTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  formCard: {
    overflow: 'hidden',
  },
  formRail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
  },
  railDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  railDot: {
    width: 10,
    height: 10,
  },
  railTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  lvlBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  lvlText: {
    fontSize: 9,
    fontWeight: '800',
  },
  formBody: {
    padding: 16,
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointer: {
    fontSize: 11,
    fontWeight: '800',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  charCounter: {
    fontSize: 10,
    fontWeight: '700',
  },
  input: {
    height: 42,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  textArea: {
    height: 72,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  shortcutBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  shortcutText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categoriesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 11,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1.5,
  },
  reminderSub: {
    fontSize: 11,
    marginTop: 2,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderWidth: 1.5,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 16,
    height: 16,
  },
  saveBtn: {
    height: 46,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
