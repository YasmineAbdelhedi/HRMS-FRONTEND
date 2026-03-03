import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MaterialModule } from 'src/app/material.module';
import { LeaveRequest, LeaveStatus } from 'src/app/models/leave-request.model';
import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-employee-leaverequests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './leaverequests.component.html',
  styleUrls: ['./leaverequests.component.scss']
})
export class EmployeeLeaverequestsComponent implements OnInit {
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  displayedColumns: string[] = ['leaveType', 'startDate', 'endDate', 'status'];
  userId?: number;

  leaveForm = this.fb.group({
    leaveType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveRequestService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadMyRequests();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load user context', 'Close', { duration: 3000 });
      }
    });
  }

  loadMyRequests(): void {
    if (!this.userId) return;

    this.leaveService.getLeaveRequestsByEmployee(this.userId).subscribe({
      next: (requests) => {
        this.dataSource.data = requests || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load leave requests', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createLeaveRequest(): void {
    if (!this.userId || this.leaveForm.invalid) return;

    const values = this.leaveForm.getRawValue();
    if (!values.leaveType || !values.startDate || !values.endDate) return;

    const payload: any = {
      startDate: values.startDate,
      endDate: values.endDate,
      leaveType: values.leaveType,
      status: LeaveStatus.PENDING,
      employee: { id: this.userId },
    };

    this.leaveService.createLeaveRequest(payload).subscribe({
      next: () => {
        this.snackBar.open('Leave request submitted', 'Close', { duration: 2000 });
        this.leaveForm.reset();
        this.loadMyRequests();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to submit leave request', 'Close', { duration: 3000 });
      }
    });
  }
}
