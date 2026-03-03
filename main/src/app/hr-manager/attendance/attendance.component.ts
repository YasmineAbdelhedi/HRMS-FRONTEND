import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MaterialModule } from 'src/app/material.module';
import { Attendance } from 'src/app/models/attendance.model';
import { User } from 'src/app/models/user.model';
import { AttendanceService } from 'src/app/services/attendance.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-hr-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class HRAttendanceComponent implements OnInit {
  dataSource = new MatTableDataSource<Attendance>([]);
  displayedColumns: string[] = ['employee', 'checkInTime', 'checkOutTime'];
  employees: User[] = [];

  filterForm = this.fb.group({
    employeeId: [null as number | null],
    startDate: [''],
    endDate: [''],
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadAllAttendance();
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.employees = (users || []).filter((user) =>
          (user.roles || []).some((role) => role.name === 'EMPLOYEE')
        );
      },
      error: (err) => console.error(err)
    });
  }

  loadAllAttendance(): void {
    this.attendanceService.getAllAttendance().subscribe({
      next: (attendance) => {
        this.dataSource.data = attendance || [];
        setTimeout(() => {
          if (this.paginator) this.dataSource.paginator = this.paginator;
          if (this.sort) this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to load attendance', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  applyRangeFilter(): void {
    const values = this.filterForm.getRawValue();
    if (!values.employeeId || !values.startDate || !values.endDate) {
      this.snackBar.open('Select employee and date range', 'Close', { duration: 2500 });
      return;
    }

    const startDate = new Date(values.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(values.endDate);
    endDate.setHours(23, 59, 59, 999);

    this.attendanceService
      .getAttendanceByEmployeeAndDateRange(values.employeeId, startDate.toISOString(), endDate.toISOString())
      .subscribe({
        next: (attendance) => {
          this.dataSource.data = attendance || [];
          setTimeout(() => {
            if (this.paginator) this.dataSource.paginator = this.paginator;
            if (this.sort) this.dataSource.sort = this.sort;
          });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Failed to filter attendance', 'Close', { duration: 3000 });
        }
      });
  }

  resetFilter(): void {
    this.filterForm.reset();
    this.loadAllAttendance();
  }
}
