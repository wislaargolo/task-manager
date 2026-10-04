import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-task-item',
  styleUrl: './task-item.scss',
  templateUrl: './task-item.html',
})
export class TaskItem {

  readonly task = input.required<Task>();

  readonly pending = input(false);
  readonly completionChange = output<boolean>();

  readonly deleteRequested = output<number>();

  protected toggleCompletion(): void {
    this.completionChange.emit(!this.task().completed);
  }


  protected requestDelete(): void {
    this.deleteRequested.emit(this.task().id);
  }
}
