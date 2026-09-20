import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Task } from '../types';
import { loadSettingsFromStorage } from './storage';

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Meminta izin dari OS untuk menampilkan notifikasi.
 * Wajib dipanggil saat aplikasi baru dibuka.
 */
export async function requestNotificationPermissions() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Izin Notifikasi ditolak.');
      return false;
    }
    return true;
  } else {
    console.log('Must use physical device for Push Notifications');
    return false;
  }
}

/**
 * Menanamkan alarm ke dalam sistem operasi HP.
 * Notifikasi akan berbunyi tepat 15 menit sebelum waktu mulai (startTime).
 */
export async function scheduleTaskReminder(task: Task) {
  // Selalu bersihkan alarm lama jika ada (mencegah alarm ganda saat edit)
  await cancelTaskReminder(task.id);

  if (!task.hasReminder) return;

  const settings = await loadSettingsFromStorage();
  if (settings && settings.notificationsEnabled === false) {
    console.log(`Saklar Master Notifikasi mati. Alarm untuk ${task.title} dibatalkan.`);
    return;
  }

  const [year, month, day] = task.date.split('-').map(Number);
  const [hour, minute] = task.startTime.split(':').map(Number);
  
  const taskDate = new Date(year, month - 1, day, hour, minute);
  
  // Kurangi 15 Menit (15 * 60 * 1000 milidetik)
  const triggerDate = new Date(taskDate.getTime() - 15 * 60000);
  
  // Pastikan alarm di masa depan (tidak masuk akal menyetel alarm untuk masa lalu)
  if (triggerDate.getTime() > Date.now()) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Misi Segera Dimulai! 🔔',
          body: `Persiapkan diri Anda: "${task.title}" akan dimulai jam ${task.startTime}`,
          data: { taskId: task.id },
          sound: true,
        },
        trigger: triggerDate as any,
        identifier: task.id, // Kunci unik agar mudah dihapus nanti
      });
      console.log(`Alarm sukses dipasang untuk tugas: ${task.title}`);
    } catch (error) {
      console.error("Gagal memasang alarm notifikasi:", error);
    }
  }
}

/**
 * Mencabut alarm dari sistem operasi berdasarkan ID Tugas
 */
export async function cancelTaskReminder(taskId: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(taskId);
  } catch (error) {
    console.error("Gagal menghapus alarm:", error);
  }
}

/**
 * Mencabut seluruh alarm yang ada di sistem operasi sekaligus.
 * Dipanggil saat Saklar Master Notifikasi dimatikan.
 */
export async function disableAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Semua alarm dinonaktifkan secara paksa (Master Switch).");
  } catch (error) {
    console.error("Gagal menonaktifkan semua alarm:", error);
  }
}
