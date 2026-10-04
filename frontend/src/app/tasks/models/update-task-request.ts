import { TaskPriority } from './task';

export interface UpdateTaskRequest {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  completed: boolean;
}

export interface UpdateTaskCompletionRequest {
  completed: boolean;
}