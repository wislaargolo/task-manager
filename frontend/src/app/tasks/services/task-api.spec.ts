import { TestBed } from '@angular/core/testing';
import { TaskApi } from './task-api';

describe('Task', () => {
  let service: TaskApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
