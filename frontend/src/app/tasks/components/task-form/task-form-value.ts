import { TaskPriority } from "../../models/task";

export interface TaskFormValue {
  title: string;
  description: string;
  priority: TaskPriority;
  assignee: string;
  completed: boolean;
}