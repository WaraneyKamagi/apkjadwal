import { Task } from '../types/task';
import { ActivityLog } from '../types/log';
import { getTodayDateString } from './dateUtils';

export function getInitialTasks(): Task[] {
  const today = getTodayDateString();
  return [
    {
      id: 'task-1',
      title: 'Selesaikan Mockup UI HAYA',
      description: 'Fokus ke layar kalender pixel & aset warna hijau',
      date: today,
      startTime: '09:30',
      endTime: '11:00',
      category: 'Kerja / Proyek',
      status: 'running',
      hasReminder: true,
      createdAt: Date.now() - 3600000 * 3,
    },
    {
      id: 'task-2',
      title: 'Review Dokumentasi Tailwind',
      description: 'Baca panduan utility first styling & typography retro',
      date: today,
      startTime: '11:15',
      endTime: '12:00',
      category: 'Belajar',
      status: 'pending',
      hasReminder: false,
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'task-3',
      title: 'Stretching Ringan & Minum Air',
      description: 'Istirahat sejenak 30 menit dari layar monitor',
      date: today,
      startTime: '13:30',
      endTime: '14:00',
      category: 'Olahraga',
      status: 'done',
      hasReminder: true,
      createdAt: Date.now() - 3600000 * 5,
    },
    {
      id: 'task-4',
      title: 'Beli Kopi & Camilan Pixel',
      description: 'Kunjungi kedai kopi retro dekat stasiun',
      date: today,
      startTime: '15:00',
      endTime: '15:30',
      category: 'Personal',
      status: 'pending',
      hasReminder: false,
      createdAt: Date.now() - 3600000 * 1,
    },
    {
      id: 'task-5',
      title: 'Briefing Vendor Cetak',
      description: 'Dijadwalkan ulang ke hari Senin depan karena kendala materi cetak.',
      date: today,
      startTime: '08:30',
      endTime: '09:00',
      category: 'Operasional',
      status: 'cancelled',
      hasReminder: false,
      createdAt: Date.now() - 3600000 * 6,
    },
  ];
}

export function getInitialLogs(): ActivityLog[] {
  const now = Date.now();
  return [
    {
      id: 'log-1',
      timestamp: now - 15 * 60 * 1000,
      actionType: 'status',
      taskTitle: 'Selesaikan Mockup UI HAYA',
      description: 'Mengubah status kegiatan menjadi BERJALAN',
      expGained: 15,
    },
    {
      id: 'log-2',
      timestamp: now - 65 * 60 * 1000,
      actionType: 'status',
      taskTitle: 'Stretching Ringan & Minum Air',
      description: 'Menandai kegiatan telah SELESAI',
      expGained: 50,
    },
    {
      id: 'log-3',
      timestamp: now - 120 * 60 * 1000,
      actionType: 'create',
      taskTitle: 'Review Dokumentasi Tailwind',
      description: 'Misi baru ditambahkan ke jadwal harian',
      expGained: 25,
    },
    {
      id: 'log-4',
      timestamp: now - 180 * 60 * 1000,
      actionType: 'status',
      taskTitle: 'Briefing Vendor Cetak',
      description: 'Mengubah status kegiatan menjadi BATAL',
      expGained: 0,
    },
    {
      id: 'log-5',
      timestamp: now - 240 * 60 * 1000,
      actionType: 'create',
      taskTitle: 'Beli Kopi & Camilan Pixel',
      description: 'Misi baru ditambahkan ke jadwal harian',
      expGained: 25,
    },
  ];
}
