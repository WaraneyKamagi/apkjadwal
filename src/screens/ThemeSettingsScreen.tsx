import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useSchedule } from '../contexts/ScheduleContext';
import { ThemeMode } from '../types';
import { THEMES, THEME_LIST } from '../constants/themes';
import { PixelHeader } from '../components/common/PixelHeader';
import { PixelCard } from '../components/common/PixelCard';
import { PixelAlertModal } from '../components/common/PixelAlertModal';
import { ThemeCard } from '../components/common/ThemeCard';
import { SettingToggleItem } from '../components/common/SettingToggleItem';
import { disableAllNotifications } from '../utils/notifications';


export const ThemeSettingsScreen: React.FC = () => {
  const {
    themeMode,
    colors,
    setThemeMode,
    particlesEnabled,
    setParticlesEnabled,
    sfxEnabled,
    setSfxEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
    refreshThemeSettings,
  } = useTheme();

  const { refreshData } = useSchedule();

  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertTitle, setAlertTitle] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertOnConfirm, setAlertOnConfirm] = React.useState<(() => void) | undefined>(undefined);

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOnConfirm(() => onConfirm);
    setAlertVisible(true);
  };

  const handleApply = (mode: ThemeMode) => {
    setThemeMode(mode);
    showAlert(
      'Tema Diterapkan!',
      `Atmosfer ${THEMES[mode].name} berhasil diaktifkan ke seluruh aplikasi HAYA!`
    );
  };

  const handleToggleNotifications = async () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    if (!newState) {
      await disableAllNotifications();
      showAlert('Alarm Dimatikan', 'Saklar Master telah mencabut seluruh alarm OS secara paksa. Anda tidak akan diganggu.');
    } else {
      showAlert('Alarm Diaktifkan', 'Fitur alarm kembali menyala. Notifikasi pada misi-misi berikutnya akan aktif secara otomatis.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <PixelHeader subtitle="Pengaturan & Tema" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <PixelCard style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={[styles.collectionBadge, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Text style={[styles.collectionText, { color: colors.onSurfaceVariant }]}>
                KOLEKSI MOOD 16-BIT
              </Text>
            </View>
            <View style={styles.adaptiveRow}>
              <MaterialIcons name="auto-fix-high" size={14} color={colors.primary} />
              <Text style={[styles.adaptiveText, { color: colors.primary }]}>
                Tema Adaptif
              </Text>
            </View>
          </View>

          <Text style={[styles.heroTitle, { color: colors.onSurface }]}>
            Pilih Suasana & Tema HAYA
          </Text>
          <Text style={[styles.heroDesc, { color: colors.onSurfaceVariant }]}>
            Ubah nuansa visual aplikasi sesuai mood hari ini. Semua tema tetap bergaya pixel art retro dengan palet unik dan tersimpan otomatis.
          </Text>

          {/* Active Status Pill */}
          <View style={[styles.activePill, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="radio-button-checked" size={16} color={colors.onPrimary} />
            <Text style={[styles.activePillText, { color: colors.onPrimary }]}>
              Tema Aktif: {THEMES[themeMode].name}
            </Text>
          </View>
        </PixelCard>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="brush" size={18} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
              Preset Cuaca Pixel
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: colors.onSurfaceVariant }]}>
            {THEME_LIST.length} Suasana Tersedia
          </Text>
        </View>

        {/* Theme Cards List */}
        <View style={styles.themeList}>
          {THEME_LIST.map(themeItem => (
            <ThemeCard
              key={themeItem.id}
              themeItem={themeItem}
              isActive={themeMode === themeItem.id}
              onApply={handleApply}
            />
          ))}
        </View>

        {/* Additional Settings Section */}
        <PixelCard style={styles.settingsCard}>
          <View style={styles.settingsHeader}>
            <MaterialIcons name="tune" size={18} color={colors.primary} />
            <Text style={[styles.settingsTitle, { color: colors.onSurface }]}>
              Opsi Pengaturan Tambahan
            </Text>
          </View>

          <SettingToggleItem
            label="Efek Partikel Cuaca"
            subLabel="Animasi cuaca pixel di latar belakang"
            value={particlesEnabled}
            onToggle={() => setParticlesEnabled(!particlesEnabled)}
          />

          <SettingToggleItem
            label="Feedback Mekanikal Retro"
            subLabel="Respon haptik / visual penekanan tombol"
            value={sfxEnabled}
            onToggle={() => setSfxEnabled(!sfxEnabled)}
          />

          <SettingToggleItem
            label="Saklar Master Alarm"
            subLabel="Matikan seluruh notifikasi sekaligus"
            value={notificationsEnabled}
            onToggle={handleToggleNotifications}
          />
        </PixelCard>

        {/* Retro Dialog Box */}
        <PixelCard style={styles.dialogCard}>
          <View style={styles.dialogHeader}>
            <View style={[styles.dialogTerminalIcon, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="terminal" size={16} color={colors.onPrimary} />
            </View>
            <View style={styles.dialogTexts}>
              <Text style={[styles.dialogSys, { color: colors.secondary }]}>
                SISTEM DIALOG RETRO
              </Text>
              <Text style={[styles.dialogPrompt, { color: colors.onSurface }]}>
                “Tema yang Anda pilih langsung aktif dan tersimpan permanen di perangkat.”
              </Text>
            </View>
          </View>
        </PixelCard>
      </ScrollView>

      <PixelAlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        onConfirm={alertOnConfirm}
        confirmText="LANJUTKAN"
        cancelText="BATAL"
      />
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
    gap: 14,
  },
  heroCard: {
    padding: 14,
    gap: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  collectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  collectionText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  adaptiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adaptiveText: {
    fontSize: 10,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  activePillText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 11,
  },
  themeList: {
    gap: 14,
  },

  dialogCard: {
    padding: 12,
  },
  settingsCard: {
    padding: 14,
    gap: 12,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dialogHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dialogTerminalIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTexts: {
    flex: 1,
  },
  dialogSys: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  dialogPrompt: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 2,
    lineHeight: 16,
  },
});
