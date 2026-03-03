import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { ProfileService } from 'src/app/services/profile.service';
import { PayrollService } from 'src/app/services/payroll.service';
import { AttendanceService } from 'src/app/services/attendance.service';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { LeaveRequest, LeaveStatus } from 'src/app/models/leave-request.model';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class HRDashboardComponent implements OnInit {
  userCount = 0;
  profileCount = 0;
  payrollCount = 0;
  attendanceCount = 0;
  pendingLeaveCount = 0;
  recentPendingLeaves: LeaveRequest[] = [];

  constructor(
    private userService: UserService,
    private profileService: ProfileService,
    private payrollService: PayrollService,
    private attendanceService: AttendanceService,
    private leaveService: LeaveRequestService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.userService.getAllUsers().subscribe({ next: users => (this.userCount = users?.length || 0), error: err => console.error(err) });
    this.profileService.getAllProfiles().subscribe({ next: profiles => (this.profileCount = profiles?.length || 0), error: err => console.error(err) });
    this.payrollService.getAllPayrolls().subscribe({ next: payrolls => (this.payrollCount = payrolls?.length || 0), error: err => console.error(err) });
    this.attendanceService.getAllAttendance().subscribe({ next: attendance => (this.attendanceCount = attendance?.length || 0), error: err => console.error(err) });
    this.leaveService.getLeaveRequestsByStatus(LeaveStatus.PENDING).subscribe({
      next: (requests) => {
        const list = requests || [];
        this.pendingLeaveCount = list.length;
        this.recentPendingLeaves = list.slice(0, 6);
      },
      error: err => console.error(err)
    });
  }
}
