import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectDto } from 'src/app/models/project.model';
import { ProjectAssignmentDto } from 'src/app/models/projectassignment.model';
import { Task, TaskStatus } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
import { ProjectDialogComponent } from 'src/app/admin/projects/project-dialog.component';

@Component({
  selector: 'app-pm-projects',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class PMProjectsComponent implements OnInit {
  projectDataSource = new MatTableDataSource<ProjectDto>([]);
  taskDataSource = new MatTableDataSource<Task>([]);

  projectColumns: string[] = ['name', 'description', 'budget', 'projectManagerName', 'actions'];
  taskColumns: string[] = ['name', 'description', 'dueDate', 'status', 'actions'];

  selectedProject: ProjectDto | null = null;
  employees: User[] = [];
  readonly statuses = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED];

  projectAssignmentForm = this.fb.group({
    employeeId: [null as number | null, Validators.required],
  });

  taskForm = this.fb.group({
    employeeId: [null as number | null, Validators.required],
    name: ['', Validators.required],
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadEmployees();
  }

  loadProjects(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (user) => {
        this.projectService.getProjectsByManager(user.id).subscribe({
          next: (projects) => {
            this.projectDataSource.data = projects || [];
            if (this.selectedProject) {
              const refreshed = (projects || []).find((p) => p.id === this.selectedProject?.id);
              if (!refreshed) {
                this.selectedProject = null;
                this.taskDataSource.data = [];
                this.projectAssignmentForm.reset();
              } else {
                this.selectedProject = refreshed;
              }
            }
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Failed to load projects', 'Close', { duration: 3000 });
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to identify manager account', 'Close', { duration: 3000 });
      }
    });
  }

  loadEmployees(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.employees = (users || []).filter((user) =>
          (user.roles || []).some((role: any) => {
            const roleName = typeof role === 'string' ? role : role?.name;
            return roleName?.replace('ROLE_', '') === 'EMPLOYEE';
          })
        );
      },
      error: (err) => console.error(err)
    });
  }

  openCreateProject(): void {
    const ref = this.dialog.open(ProjectDialogComponent, {
      data: { mode: 'create' },
      width: '600px'
    });

    ref.afterClosed().subscribe((res) => {
      if (res === 'saved') {
        this.loadProjects();
        this.snackBar.open('Project created', 'Close', { duration: 2000 });
      }
    });
  }

  selectProject(project: ProjectDto): void {
    this.selectedProject = project;
    this.taskForm.reset();
    this.projectAssignmentForm.reset();
    this.loadTasks(project.id);
  }

  assignEmployeeToProject(): void {
    if (!this.selectedProject || this.projectAssignmentForm.invalid) return;

    const employeeId = this.projectAssignmentForm.getRawValue().employeeId;
    if (!employeeId) return;

    const alreadyAssigned = (this.selectedProject.assignments || []).some((assignment) => assignment.userId === employeeId);
    if (alreadyAssigned) {
      this.snackBar.open('Employee is already assigned to this project', 'Close', { duration: 2500 });
      return;
    }

    this.projectService.assignEmployeesToProject(this.selectedProject.id, [{ userId: employeeId, role: 'EMPLOYEE' }]).subscribe({
      next: () => {
        this.snackBar.open('Employee assigned to project', 'Close', { duration: 2000 });
        this.projectAssignmentForm.reset();
        this.loadProjects();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        const message = err.status === 403
          ? 'You are not allowed to assign employees to this project (403)'
          : `Failed to assign employee to project${err.status ? ` (${err.status})` : ''}`;
        this.snackBar.open(message, 'Close', { duration: 3500 });
      }
    });
  }

  get selectedProjectAssignments(): ProjectAssignmentDto[] {
    return this.selectedProject?.assignments || [];
  }

  loadTasks(projectId: number): void {
    this.taskService.getTasksByProject(projectId).subscribe({
      next: (tasks) => {
        this.taskDataSource.data = tasks || [];
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      }
    });
  }

  createTask(): void {
    if (!this.selectedProject || this.taskForm.invalid) return;

    const payload = this.taskForm.getRawValue();
    if (!payload.employeeId || !payload.name || !payload.description || !payload.dueDate) return;

    this.taskService
      .createTask(
        this.selectedProject.id,
        payload.employeeId,
        payload.name,
        payload.description,
        payload.dueDate,
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Task created', 'Close', { duration: 2000 });
          this.taskForm.reset();
          this.loadTasks(this.selectedProject!.id);
          this.loadProjects();
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to create task', 'Close', { duration: 3000 });
        }
      });
  }

  updateTaskStatus(task: Task, status: TaskStatus): void {
    this.taskService.updateTaskStatus(task.id, status).subscribe({
      next: () => {
        task.status = status;
        this.snackBar.open('Task status updated', 'Close', { duration: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to update status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTask(task: Task): void {
    if (!confirm(`Delete task ${task.name}?`)) return;

    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
        if (this.selectedProject) this.loadTasks(this.selectedProject.id);
        this.loadProjects();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
      }
    });
  }
}
