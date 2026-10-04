import { computed, inject, Service, signal } from '@angular/core';
import { TaskApi } from './task-api';
import { Task } from '../models/task';
import { catchError, EMPTY, finalize, Observable, tap } from 'rxjs';
import { ApiProblem } from '../../core/http/api-problem';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateTaskRequest } from '../models/create-task-request';
import { UpdateTaskRequest } from '../models/update-task-request';

@Service()
export class TaskStore {
    private readonly taskApi = inject(TaskApi);

    private readonly tasksState = signal<readonly Task[]>([]);
    readonly tasks = this.tasksState.asReadonly();

    private readonly pendingTaskIdsState = signal<ReadonlySet<number>>(new Set());
    readonly pendingTaskIds = this.pendingTaskIdsState.asReadonly();

    private readonly isLoadingState = signal(false);
    readonly isLoading = this.isLoadingState.asReadonly();

    private readonly isCreatingState = signal(false);
    readonly isCreating = this.isCreatingState.asReadonly();

    private readonly loadErrorState = signal<string | null>(null);
    readonly loadError = this.loadErrorState.asReadonly();

    private readonly createErrorState = signal<string | null>(null);
    readonly createError = this.createErrorState.asReadonly();

    private readonly taskActionErrorState = signal<string | null>(null);
    readonly taskActionError = this.taskActionErrorState.asReadonly();


    readonly totalTasks =
        computed(() =>
            this.tasksState().length
        );


    readonly completedTasksCount =
        computed(() =>
            this.tasksState()
                .filter(task => task.completed)
                .length
        );


    readonly pendingTasksCount =
        computed(() =>
            this.totalTasks() -
            this.completedTasksCount()
        );

    findById(taskId: number): Observable<Task> {
        return this.taskApi.findById(taskId);
    }

    load(): void {

        if (this.isLoadingState()) {
            return;
        }


        this.isLoadingState.set(true);
        this.loadErrorState.set(null);

        this.taskApi
            .findAll()
            .pipe(

                tap(tasks => {
                    this.tasksState.set(tasks);
                }),

                catchError(error => {
                    this.loadErrorState.set(
                        this.getErrorMessage(
                            error,
                            'Unable to load tasks.'
                        )
                    );
                    return EMPTY;
                }),

                finalize(() => {
                    this.isLoadingState.set(false);
                })

            )
            .subscribe();

    }


    create(request: CreateTaskRequest): Observable<Task> {

        this.isCreatingState.set(true);
        this.createErrorState.set(null);

        return this.taskApi
            .create(request)
            .pipe(

                tap(createdTask => {
                    this.tasksState.update(tasks => [
                        ...tasks,
                        createdTask
                    ]);
                }),

                catchError(error => {
                    this.createErrorState.set(
                        this.getErrorMessage(
                            error,
                            'Unable to create task.'
                        )
                    );
                    return EMPTY;
                }),

                finalize(() => {
                    this.isCreatingState.set(false);
                })

            );
    }

    private replaceTask(updatedTask: Task): void {

        this.tasksState.update(tasks =>
            tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            )
        );

    }

    private removeTaskFromState(taskId: number): void {

        this.tasksState.update(tasks =>
            tasks.filter(
                task => task.id !== taskId
            )
        );

    }

    updateCompletion(taskId: number, completed: boolean): Observable<Task> {

        this.setTaskPending(taskId, true);

        return this.taskApi
            .updateCompletion(taskId, { completed })
            .pipe(

                tap(updatedTask => {
                    this.replaceTask(updatedTask);

                }),

                catchError(error => {
                    this.taskActionErrorState.set(
                        this.getErrorMessage(
                            error,
                            'Unable to update task.'
                        )
                    );

                    return EMPTY;
                }),

                finalize(() => {
                    this.setTaskPending(taskId, false);
                })

            );

    }

    update(taskId: number, request: UpdateTaskRequest): Observable<Task> {

        this.taskActionErrorState.set(null);
        this.setTaskPending(taskId, true);

        return this.taskApi
            .update(taskId, request)
            .pipe(

                tap(updatedTask => {
                    this.replaceTask(updatedTask);
                }),

                catchError(error => {
                    this.taskActionErrorState.set(
                        this.getErrorMessage(
                            error,
                            'Unable to update task.'
                        )
                    );

                    return EMPTY
                }),

                finalize(() => {
                    this.setTaskPending(taskId, false);
                })

            );

    }

    delete(taskId: number): Observable<void> {

        this.setTaskPending(taskId, true);

        return this.taskApi
            .delete(taskId)
            .pipe(

                tap(() => {
                    this.removeTaskFromState(taskId);
                }),

                catchError(error => {
                    this.taskActionErrorState.set(
                        this.getErrorMessage(
                            error,
                            'Unable to delete task.'
                        )
                    );

                    return EMPTY;
                }),

                finalize(() => {
                    this.setTaskPending(taskId, false);
                })

            );

    }

    isTaskPending(taskId: number): boolean {
        return this.pendingTaskIdsState().has(taskId);
    }

    private setTaskPending(taskId: number, pending: boolean): void {

        this.pendingTaskIdsState.update(
            current => {
                const next = new Set(current);

                if (pending) {
                    next.add(taskId);
                } else {
                    next.delete(taskId);
                }

                return next;
            }
        );

    }


    private getErrorMessage(error: unknown, fallbackMessage: string): string {

        if (!(error instanceof HttpErrorResponse)) {
            return fallbackMessage;
        }

        if (error.status === 0) {
            return 'Unable to connect to the server.';
        }

        const problem = error.error as ApiProblem | null;

        return (problem?.detail ?? fallbackMessage);

    }

}
