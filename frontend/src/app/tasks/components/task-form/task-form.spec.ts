import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskForm } from './task-form';
import { TaskFormValue } from './task-form-value';

describe('TaskForm', () => {
  let fixture: ComponentFixture<TaskForm>;

  const initialValue: TaskFormValue = {
    title: '',
    description: '',
    priority: 'MEDIUM',
    assignee: '',
    completed: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    fixture.componentRef.setInput('initialValue', initialValue);
  });

  it('shows the submit error and disables the button while submitting', async () => {
    fixture.componentRef.setInput('submitError', 'Unable to create task.');
    fixture.componentRef.setInput('submitting', true);
    fixture.componentRef.setInput('submittingLabel', 'Adding...');
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to create task.',
    );
    expect(compiled.querySelector('button')?.disabled).toBe(true);
    expect(compiled.querySelector('button')?.textContent).toContain('Adding...');
  });
});
