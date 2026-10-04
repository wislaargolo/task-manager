import { TaskPriority } from './task';

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
}