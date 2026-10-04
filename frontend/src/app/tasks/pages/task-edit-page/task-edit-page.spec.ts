import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import { Task } from '../../models/task';
import { TaskStore } from '../../services/task-store';
import { TaskEditPage } from './task-edit-page';

const taskToEdit: Task = {
  id: 42,
  title: 'Review release',
  description: 'Check the deployment',
  completed: true,
  priority: 'HIGH',
  assignee: 'Ana',
};

describe('TaskEditPage', () => {
  let fixture: ComponentFixture<TaskEditPage>;
  let router: Router;

  beforeEach(async () => {
    const taskStore = {
      findById: () => of(taskToEdit),
      isTaskPending: () => false,
      taskActionError: signal<string | null>(null),
      update: () => of(taskToEdit),
    };

    await TestBed.configureTestingModule({
      imports: [TaskEditPage],
      providers: [
        provideRouter([]),
        { provide: TaskStore, useValue: taskStore },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    fixture = TestBed.createComponent(TaskEditPage);
    fixture.componentRef.setInput('taskId', '42');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('uses the shared task form and prepopulates the task being edited', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-task-form')).not.toBeNull();
    expect((compiled.querySelector('#title') as HTMLInputElement).value).toBe(
      'Review release',
    );
    expect(
      (compiled.querySelector('input[type="checkbox"]') as HTMLInputElement)
        .checked,
    ).toBe(true);
  });

  it('places cancel with the form actions and returns to the task list', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cancelButton = compiled.querySelector(
      '.task-form__cancel',
    ) as HTMLButtonElement | null;

    expect(cancelButton).not.toBeNull();
    cancelButton?.click();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('navigates to the task list after a successful save', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const saveButton = compiled.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;

    saveButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
