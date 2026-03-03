import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { TaskService } from 'src/app/services/task.service';
import { ProjectService } from 'src/app/services/project.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { Task, TaskStatus } from 'src/app/models/task.model';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  myTaskCount = 0;
  pendingTaskCount = 0;
  inProgressTaskCount = 0;
  completedTaskCount = 0;
  myProjectCount = 0;
  myLeaveCount = 0;
  monthlyAttendanceCount = 0;
  upcomingTasks: Task[] = [];

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private leaveService: LeaveRequestService,
    private attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        const list = tasks || [];
        this.myTaskCount = list.length;
        this.pendingTaskCount = list.filter(t => t.status === TaskStatus.PENDING).length;
        this.inProgressTaskCount = list.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
        this.completedTaskCount = list.filter(t => t.status === TaskStatus.COMPLETED).length;
        this.upcomingTasks = [...list]
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 6);
      },
      error: (err) => console.error(err)
    });

    this.userService.getAuthenticatedUser().subscribe({
      next: (user) => {
        this.projectService.getProjectsByEmployee(user.id).subscribe({
          next: (projects) => (this.myProjectCount = projects?.length || 0),
          error: (err) => console.error(err)
        });

        this.leaveService.getLeaveRequestsByEmployee(user.id).subscribe({
          next: (requests) => (this.myLeaveCount = requests?.length || 0),
          error: (err) => console.error(err)
        });

        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString();
        this.attendanceService.getAttendanceByEmployeeAndDateRange(user.id, start, end).subscribe({
          next: (attendance) => (this.monthlyAttendanceCount = attendance?.length || 0),
          error: (err) => console.error(err)
        });
      },
      error: (err) => console.error(err)
    });
  }
}
