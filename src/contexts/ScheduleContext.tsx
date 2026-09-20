import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Task, TaskStatus, ActivityLog, TaskCategory } from '../types';
import { 
  getTodayDateString, 
  get30DaysAgoString, 
  get30DaysForwardString, 
  get30DaysAgoTimestamp 
} from '../utils/dateUtils';
import { useDeviceId } from '../utils/deviceId';
import { 
  requestNotificationPermissions, 
  scheduleTaskReminder, 
  cancelTaskReminder 
} from '../utils/notifications';

interface UserStats {
  deviceId: string;
  totalExp: number;
  level: number;
}

interface ScheduleContextType {
  user: UserStats | null;
  tasks: Task[];
  logs: ActivityLog[];
  isLoading: boolean;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  getTasksForDate: (date: string) => Task[];
  getTodayProgress: () => { total: number; done: number; percentage: number };
  refreshData: () => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceId = useDeviceId();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());

  const userQuery = useQuery(api.users.getUser, deviceId ? { deviceId } : 'skip');
  
  const rawTasks = useQuery(api.tasks.getByDevice, deviceId ? { 
    deviceId, 
    startDate: get30DaysAgoString(), 
    endDate: get30DaysForwardString() 
  } : 'skip');
  
  const rawLogs = useQuery(api.logs.getByDevice, deviceId ? { 
    deviceId,
    startTimestamp: get30DaysAgoTimestamp(),
  } : 'skip');

  const addTaskMutation = useMutation(api.tasks.add);
  const updateTaskMutation = useMutation(api.tasks.update);
  const deleteTaskMutation = useMutation(api.tasks.remove);
  const updateStatusMutation = useMutation(api.tasks.updateStatus);
  const addLogMutation = useMutation(api.logs.add);
  const addExpMutation = useMutation(api.users.addExp);

  const isLoading = rawTasks === undefined || rawLogs === undefined || userQuery === undefined || deviceId === null;

  // Handle midnight day-change when app resumes
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const trueToday = getTodayDateString();
        // Force refresh the selected date if the day has changed while in background
        setSelectedDate((prevDate) => {
          if (prevDate < trueToday) return trueToday;
          return prevDate;
        });
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Request Notification Permissions on Mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const tasks: Task[] = useMemo(() => {
    if (!rawTasks) return [];
    return rawTasks.map(t => ({
      id: t._id as string,
      title: t.title,
      description: t.description,
      date: t.date,
      startTime: t.startTime,
      endTime: t.endTime,
      category: t.category as TaskCategory,
      status: t.status as TaskStatus,
      hasReminder: t.hasReminder,
      createdAt: t.createdAt,
    }));
  }, [rawTasks]);

  const logs: ActivityLog[] = useMemo(() => {
    if (!rawLogs) return [];
    return rawLogs.map(l => ({
      id: l._id as string,
      timestamp: l.timestamp,
      actionType: l.actionType as any,
      taskTitle: l.taskTitle,
      description: l.description,
      expGained: l.expGained,
    }));
  }, [rawLogs]);

  // Keep refreshData to satisfy interface, but Convex is real-time so it's a no-op
  const refreshData = useCallback(async () => {}, []);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!deviceId) return;
    
    // Simulate slight backend processing for UI loading feel
    await new Promise(resolve => setTimeout(resolve, 300));

    const newTaskId = await addTaskMutation({
      deviceId,
      title: taskData.title,
      description: taskData.description,
      date: taskData.date,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      category: taskData.category,
      status: taskData.status,
      hasReminder: taskData.hasReminder,
    });

    // Schedule notification locally
    await scheduleTaskReminder({
      ...taskData,
      id: newTaskId,
      createdAt: Date.now(),
    });

    await addLogMutation({
      deviceId,
      actionType: 'create',
      taskTitle: taskData.title,
      description: `Misi baru ditambahkan ke agenda (${taskData.category})`,
      expGained: 25,
    });
    
    await addExpMutation({ deviceId, expAmount: 25 });
  }, [deviceId, addTaskMutation, addLogMutation, addExpMutation]);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    if (!deviceId) return;
    
    // Simulating loading to preserve the user's UI experience
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;

    await updateTaskMutation({
      id: id as Id<"tasks">,
      title: updates.title ?? currentTask.title,
      description: updates.description ?? currentTask.description,
      date: updates.date ?? currentTask.date,
      startTime: updates.startTime ?? currentTask.startTime,
      endTime: updates.endTime ?? currentTask.endTime,
      category: updates.category ?? currentTask.category,
      hasReminder: updates.hasReminder ?? currentTask.hasReminder,
    });

    // Reschedule or cancel notification based on new updates
    const updatedTask = { ...currentTask, ...updates };
    await scheduleTaskReminder(updatedTask as Task);

    await addLogMutation({
      deviceId,
      actionType: 'edit',
      taskTitle: updates.title || currentTask.title,
      description: `Data misi telah diperbarui`,
      expGained: 10,
    });

    await addExpMutation({ deviceId, expAmount: 10 });
  }, [deviceId, tasks, updateTaskMutation, addLogMutation, addExpMutation]);

  const deleteTask = useCallback(async (id: string) => {
    if (!deviceId) return;
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;

    await new Promise(resolve => setTimeout(resolve, 300));

    await deleteTaskMutation({ id: id as Id<"tasks"> });
    await cancelTaskReminder(id);

    await addLogMutation({
      deviceId,
      actionType: 'delete',
      taskTitle: currentTask.title,
      description: `Misi dihapus dari jadwal`,
    });
  }, [deviceId, tasks, deleteTaskMutation, addLogMutation]);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus) => {
    if (!deviceId) return;
    const currentTask = tasks.find(t => t.id === id);
    if (!currentTask) return;

    // For status, no explicit delay to keep the optimistic UI very fast
    await updateStatusMutation({
      id: id as Id<"tasks">,
      status,
    });

    if (status === 'done' || status === 'cancelled') {
      await cancelTaskReminder(id);
    }

    let statusLabel = 'MENUNGGU';
    let exp = 0;
    if (status === 'running') {
      statusLabel = 'BERJALAN';
      exp = 15;
    } else if (status === 'done') {
      statusLabel = 'SELESAI';
      exp = 50;
    } else if (status === 'cancelled') {
      statusLabel = 'BATAL';
      exp = 0;
    }

    await addLogMutation({
      deviceId,
      actionType: 'status',
      taskTitle: currentTask.title,
      description: `Mengubah status kegiatan menjadi ${statusLabel}`,
      expGained: exp,
    });

    if (exp > 0) {
      await addExpMutation({ deviceId, expAmount: exp });
    }
  }, [deviceId, tasks, updateStatusMutation, addLogMutation, addExpMutation]);

  const getTasksForDate = useCallback((date: string): Task[] => {
    return tasks.filter(t => t.date === date);
  }, [tasks]);

  const getTodayProgress = useCallback(() => {
    const today = getTodayDateString();
    const todayTasks = tasks.filter(t => t.date === today);
    const total = todayTasks.length;
    const done = todayTasks.filter(t => t.status === 'done').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, percentage };
  }, [tasks]);

  const contextValue = useMemo(() => ({
    user: userQuery || null,
    tasks,
    logs,
    isLoading,
    selectedDate,
    setSelectedDate,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksForDate,
    getTodayProgress,
    refreshData,
  }), [
    userQuery,
    tasks,
    logs,
    isLoading,
    selectedDate,
    setSelectedDate,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksForDate,
    getTodayProgress,
    refreshData,
  ]);

  return (
    <ScheduleContext.Provider value={contextValue}>
      {children}
    </ScheduleContext.Provider>
  );
};

export function useSchedule(): ScheduleContextType {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}
