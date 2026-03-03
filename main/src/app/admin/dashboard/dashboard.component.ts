
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { TaskService } from 'src/app/services/task.service';
import { LeaveRequest, LeaveStatus } from 'src/app/models/leave-request.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userCount = 0;
  projectCount = 0;
  leaveRequestCount = 0;
  taskCount = 0;
  pendingLeaveCount = 0;
  approvedLeaveCount = 0;
  rejectedLeaveCount = 0;
  recentLeaves: LeaveRequest[] = [];

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private leaveService: LeaveRequestService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.userService.getAllUsers().subscribe({ next: u => (this.userCount = u?.length || 0), error: e => console.error(e) });
    this.projectService.getAllProjects().subscribe({ next: p => (this.projectCount = p?.length || 0), error: e => console.error(e) });
    this.leaveService.getAllLeaveRequests().subscribe({
      next: (l) => {
        this.leaveRequestCount = l?.length || 0;
        this.recentLeaves = (l || []).slice(0, 5);
      },
      error: e => console.error(e)
    });
    this.leaveService.getLeaveRequestsByStatus(LeaveStatus.PENDING).subscribe({ next: l => (this.pendingLeaveCount = l?.length || 0), error: e => console.error(e) });
    this.leaveService.getLeaveRequestsByStatus(LeaveStatus.APPROVED).subscribe({ next: l => (this.approvedLeaveCount = l?.length || 0), error: e => console.error(e) });
    this.leaveService.getLeaveRequestsByStatus(LeaveStatus.REJECTED).subscribe({ next: l => (this.rejectedLeaveCount = l?.length || 0), error: e => console.error(e) });
    this.taskService.getAllTasks().subscribe({ next: t => (this.taskCount = t?.length || 0), error: e => console.error(e) });
  }
}
