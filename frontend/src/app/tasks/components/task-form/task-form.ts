import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskPriority } from '../../models/task';
import { TaskFormValue } from './task-form-value';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-task-form',
  styleUrl: './task-form.scss',
  templateUrl: './task-form.html',
})
export class TaskForm implements OnInit {

  readonly initialValue = input.required<TaskFormValue>();
  readonly formTitle = input<string | null>('New Task');
  readonly showCompletedField = input(false);

  readonly submitting = input(false);
  readonly submitError = input<string | null>(null);
  readonly submitLabel = input('Save');
  readonly submittingLabel = input('Saving...');
  readonly cancelLabel = input<string | null>(null);
  readonly submitted = output<TaskFormValue>();
  readonly cancelled = output<void>();

  private readonly formBuilder = inject(FormBuilder);

  protected readonly taskForm =
    this.formBuilder.nonNullable.group({

      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],

      description: ['', [
        Validators.maxLength(200)
      ]],

      priority: this.formBuilder.nonNullable.control<TaskPriority>('MEDIUM'),

      assignee: ['', [
        Validators.maxLength(100)
      ]],

      completed: [false]

    });


  ngOnInit(): void {
    this.taskForm.reset(this.initialValue());
  }


  protected cancel(): void {
    this.cancelled.emit();
  }

  protected submit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const value: TaskFormValue = this.taskForm.getRawValue();
    this.submitted.emit(value);
  }


  reset(): void {
    this.taskForm.reset(this.initialValue());
  }

}