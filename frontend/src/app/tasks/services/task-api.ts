import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { CreateTaskRequest } from '../models/create-task-request';
import { UpdateTaskCompletionRequest, UpdateTaskRequest } from '../models/update-task-request';

@Service()
export class TaskApi {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/tasks';


  findAll(): Observable<Task[]> {

    return this.http.get<Task[]>(
      this.baseUrl
    );

  }


  findById(taskId: number): Observable<Task> {

    return this.http.get<Task>(
      `${this.baseUrl}/${taskId}`
    );

  }


  create(request: CreateTaskRequest): Observable<Task> {

    return this.http.post<Task>(
      this.baseUrl,
      request
    );

  }

  update(taskId: number, request: UpdateTaskRequest): Observable<Task> {

    return this.http.put<Task>(
      `${this.baseUrl}/${taskId}`,
      request
    );

  }

  updateCompletion(
    taskId: number,
    request: UpdateTaskCompletionRequest
  ): Observable<Task> {

    return this.http.patch<Task>(
      `${this.baseUrl}/${taskId}`,
      request
    );

  }

  delete(taskId: number): Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/${taskId}`
    );

  }

}