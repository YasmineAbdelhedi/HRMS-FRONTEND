import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TaskService } from 'src/app/services/task.service';
import { Task, TaskStatus } from 'src/app/models/task.model';

@Component({
  selector: 'app-employee-tasks',
  standalone: true,
  imports: [CommonModule, MaterialModule, DragDropModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class EmployeeTasksComponent implements OnInit {
  columns: { title: string, status: TaskStatus, tasks: Task[] }[] = [
    { title: 'Pending', status: TaskStatus.PENDING as unknown as TaskStatus, tasks: [] },
    { title: 'In Progress', status: TaskStatus.IN_PROGRESS as unknown as TaskStatus, tasks: [] },
    { title: 'Completed', status: TaskStatus.COMPLETED as unknown as TaskStatus, tasks: [] },
  ];

  constructor(private taskService: TaskService, private snackBar: MatSnackBar) {}

  ngOnInit(): void { this.loadTasks(); }

  loadTasks() {
    this.taskService.getMyTasks().subscribe({ next: t => { this.groupTasks(t || []); }, error: e => console.error(e) });
  }

  groupTasks(tasks: Task[]) {
    this.columns.forEach(c => c.tasks = tasks.filter(tsk => tsk.status === c.status));
  }

  drop(event: any, column: { title: string, status: TaskStatus, tasks: Task[] }) {
    const prev = event.previousContainer.data as Task[];
    const curr = event.container.data as Task[];
    if (event.previousContainer === event.container) {
      // reorder
      const [moved] = curr.splice(event.previousIndex, 1);
      curr.splice(event.currentIndex, 0, moved);
    } else {
      const [moved] = prev.splice(event.previousIndex, 1);
      const previousStatus = moved.status;
      moved.status = column.status;
      curr.splice(event.currentIndex, 0, moved);
      // persist status
      this.taskService.updateTaskStatus(moved.id, column.status).subscribe({
        next: () => {
          this.snackBar.open('Task status updated', 'Close', { duration: 2000 });
        },
        error: e => {
          console.error(e);
          this.snackBar.open('Failed to update task status', 'Close', { duration: 3000 });
          curr.splice(event.currentIndex, 1);
          moved.status = previousStatus;
          prev.splice(event.previousIndex, 0, moved);
        }
      });
    }
  }
}
