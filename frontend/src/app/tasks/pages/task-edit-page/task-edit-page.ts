import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskFormValue } from '../../components/task-form/task-form-value';
import { UpdateTaskRequest } from '../../models/update-task-request';
import { TaskStore } from '../../services/task-store';

@Component({
  imports: [RouterLink, TaskForm],
  selector: 'app-task-edit-page',
  styleUrl: './task-edit-page.scss',
  templateUrl: './task-edit-page.html',
})
export class TaskEditPage implements OnInit {
  readonly taskId = input.required<number, string>({
    transform: value => Number(value),
  });

  private readonly taskStore = inject(TaskStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoadingState = signal(true);
  protected readonly loadErrorState = signal<string | null>(null);
  protected readonly formInitialValue = signal<TaskFormValue | null>(null);
  protected readonly submitError = this.taskStore.taskActionError;

  protected isSaving(): boolean {
    return this.taskStore.isTaskPending(this.taskId());
  }

  protected cancel(): void {
    void this.router.navigate(['/tasks']);
  }

  protected submit(formValue: TaskFormValue): void {
    const request: UpdateTaskRequest = formValue;

    this.taskStore
      .update(this.taskId(), request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/tasks']);
      });
  }

  ngOnInit(): void {
    this.taskStore
      .findById(this.taskId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: task => {
          this.formInitialValue.set({
            title: task.title,
            description: task.description ?? '',
            priority: task.priority,
            assignee: task.assignee ?? '',
            completed: task.completed,
          });
          this.isLoadingState.set(false);
        },
        error: () => {
          this.loadErrorState.set('Unable to load task.');
          this.isLoadingState.set(false);
        },
      });
  }
}
