
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from 'src/app/material.module';

import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { LeaveRequest } from 'src/app/models/leave-request.model';

@Component({
  selector: 'app-leaverequests',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './leaverequests.component.html',
  styleUrls: ['./leaverequests.component.scss']
})
export class LeaverequestsComponent implements OnInit {
  dataSource = new MatTableDataSource<LeaveRequest>([]);
  displayedColumns: string[] = ['employee', 'leaveType', 'startDate', 'endDate', 'status', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private leaveService: LeaveRequestService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadLeaveRequests();
  }

  loadLeaveRequests(): void {
    this.leaveService.getAllLeaveRequests().subscribe({
      next: (data) => { this.dataSource.data = data || []; setTimeout(()=>{ if(this.paginator) this.dataSource.paginator = this.paginator; if(this.sort) this.dataSource.sort = this.sort; }); },
      error: (err) => { console.error('Failed to load leave requests', err); this.snackBar.open('Failed to load leave requests','Close',{duration:3000}); }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  approve(r: LeaveRequest) {
    this.leaveService.approveLeaveRequest(r.id).subscribe({ next: () => { this.snackBar.open('Approved', 'Close', { duration: 2000 }); this.loadLeaveRequests(); }, error: e => { console.error(e); this.snackBar.open('Failed to approve', 'Close', { duration: 3000 }); } });
  }

  reject(r: LeaveRequest) {
    this.leaveService.rejectLeaveRequest(r.id).subscribe({ next: () => { this.snackBar.open('Rejected', 'Close', { duration: 2000 }); this.loadLeaveRequests(); }, error: e => { console.error(e); this.snackBar.open('Failed to reject', 'Close', { duration: 3000 }); } });
  }
}
