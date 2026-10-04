import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Task } from '../models/task';
import { TaskStore } from './task-store';

describe('TaskStore', () => {
  let store: TaskStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(TaskStore);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('loads a task by id through the API', () => {
    const expectedTask: Task = {
      id: 42,
      title: 'Review release',
      description: null,
      completed: false,
      priority: 'HIGH',
      assignee: null,
    };
    let actualTask: Task | undefined;

    store.findById(expectedTask.id).subscribe(task => (actualTask = task));

    const request = httpTestingController.expectOne('/api/tasks/42');
    expect(request.request.method).toBe('GET');
    request.flush(expectedTask);

    expect(actualTask).toEqual(expectedTask);
  });
});
