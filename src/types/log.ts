export type LogActionType = 'status' | 'create' | 'edit' | 'delete';

export interface ActivityLog {
  id: string;
  timestamp: number;
  actionType: LogActionType;
  taskTitle: string;
  description: string;
  expGained?: number;
}
