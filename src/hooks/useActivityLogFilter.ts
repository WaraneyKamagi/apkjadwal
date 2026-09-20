import { useMemo } from 'react';
import { ActivityLog, LogActionType } from '../types';

export type LogFilter = 'all' | LogActionType;

export interface UseActivityLogFilterResult {
  filteredLogs: ActivityLog[];
  totalCount: number;
}

export function useActivityLogFilter(
  logs: ActivityLog[],
  activeFilter: LogFilter
): UseActivityLogFilterResult {
  return useMemo(() => {
    const filteredLogs = logs.filter(log => {
      if (activeFilter === 'all') return true;
      return log.actionType === activeFilter;
    });

    return {
      filteredLogs,
      totalCount: logs.length,
    };
  }, [logs, activeFilter]);
}
