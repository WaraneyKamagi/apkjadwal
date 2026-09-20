export type TaskStatus = 'running' | 'pending' | 'done' | 'cancelled';

export type TaskCategory = 
  | 'Kerja / Proyek'
  | 'Belajar'
  | 'Olahraga'
  | 'Personal'
  | 'Operasional';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  category: TaskCategory;
  status: TaskStatus;
  hasReminder: boolean;
  createdAt: number;
}
