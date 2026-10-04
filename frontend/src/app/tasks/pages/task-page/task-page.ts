import { Component, DestroyRef, inject, OnInit, viewChild } from '@angular/core';
import { TaskStore } from '../../services/task-store';
import { TaskForm } from '../../components/task-form/task-form';
import { TaskItem } from '../../components/task-item/task-item';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskFormValue } from '../../components/task-form/task-form-value';
import { CreateTaskRequest } from '../../models/create-task-request';

@Component({
  imports: [TaskForm, TaskItem],
  selector: 'app-task-page',
  styleUrl: './task-page.scss',
  templateUrl: './task-page.html',
})

export class TaskPage implements OnInit {

  private readonly taskStore = inject(TaskStore);
  private readonly destroyRef = inject(DestroyRef);

  private readonly taskForm = viewChild.required(TaskForm);
  protected readonly tasks = this.taskStore.tasks;
  protected readonly totalTasks = this.taskStore.totalTasks;
  protected readonly completedTasksCount = this.taskStore.completedTasksCount;
  protected readonly pendingTasksCount = this.taskStore.pendingTasksCount;
  protected readonly isLoading = this.taskStore.isLoading;
  protected readonly loadError = this.taskStore.loadError;
  protected readonly isCreating = this.taskStore.isCreating;
  protected readonly createError = this.taskStore.createError;
  protected readonly taskActionError = this.taskStore.taskActionError;
  protected readonly createFormInitialValue:
    TaskFormValue = {
      title: '',
      description: '',
      priority: 'MEDIUM',
      assignee: '',
      completed: false

    };


  ngOnInit(): void {
    this.taskStore.load();
  }


  protected createTask(formValue: TaskFormValue): void {

    const request: CreateTaskRequest = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      assignee: formValue.assignee
    };


    this.taskStore
      .create(request)
      .pipe(
        takeUntilDestroyed(
          this.destroyRef
        )
      )
      .subscribe(() => {

        this.taskForm()
          .reset();

      });

  }


  protected updateCompletion(taskId: number, completed: boolean): void {
    this.taskStore
      .updateCompletion(taskId, completed)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

  }


  protected deleteTask(taskId: number): void {
    this.taskStore
      .delete(taskId)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();

  }


  protected isTaskPending(taskId: number): boolean {
    return this.taskStore.isTaskPending(taskId);
  }

}