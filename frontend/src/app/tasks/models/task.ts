export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  readonly id: number;
  readonly title: string;
  readonly description: string | null;
  readonly completed: boolean;
  readonly priority: TaskPriority;
  readonly assignee: string | null;
}