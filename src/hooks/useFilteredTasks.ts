import { useMemo } from 'react';
import { Task } from '../types';
import { FilterType } from '../components/home/FilterTabs';

export interface UseFilteredTasksResult {
  dateTasks: Task[];
  filteredTasks: Task[];
  counts: Record<FilterType, number>;
}

export function useFilteredTasks(
  tasks: Task[],
  selectedDate: string,
  activeFilter: FilterType
): UseFilteredTasksResult {
  return useMemo(() => {
    const dateTasks = tasks.filter(t => t.date === selectedDate);
    
    const counts: Record<FilterType, number> = {
      all: dateTasks.length,
      running: 0,
      pending: 0,
      done: 0,
      cancelled: 0,
    };

    dateTasks.forEach(task => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });

    const filteredTasks = dateTasks.filter(t => {
      if (activeFilter === 'all') return true;
      return t.status === activeFilter;
    });

    return {
      dateTasks,
      filteredTasks,
      counts,
    };
  }, [tasks, selectedDate, activeFilter]);
}
