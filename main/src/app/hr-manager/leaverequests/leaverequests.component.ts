import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { LeaveRequestService } from 'src/app/services/leave-request.service';
import { UserService } from 'src/app/services/user.service';
import { LeaveRequest } from 'src/app/models/leave-request.model';

@Component({
  selector: 'app-hr-leaverequests',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './leaverequests.component.html',
  styleUrls: ['./leaverequests.component.scss']
})
export class HRLeaverequestsComponent implements OnInit {
  myRequests = new MatTableDataSource<LeaveRequest>([]);
  allRequests = new MatTableDataSource<LeaveRequest>([]);
  displayedColumns: string[] = ['employee','leaveType','startDate','endDate','status','actions'];

  @ViewChild('myPaginator') myPaginator!: MatPaginator;
  @ViewChild('allPaginator') allPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  userId?: number;

  constructor(private leaveService: LeaveRequestService, private userService: UserService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe({ next: u => { this.userId = u.id; this.loadMy(); this.loadAll(); }, error: e => console.error(e) });
  }

  loadMy() { if (!this.userId) return; this.leaveService.getLeaveRequestsByEmployee(this.userId).subscribe({ next: d => { this.myRequests.data = d || []; setTimeout(()=>{ if(this.myPaginator) this.myRequests.paginator = this.myPaginator; }); }, error: e => { console.error(e); this.snackBar.open('Failed to load your leave requests','Close',{duration:3000}); } }); }

  loadAll() { this.leaveService.getAllLeaveRequests().subscribe({ next: d => { this.allRequests.data = d || []; setTimeout(()=>{ if(this.allPaginator) this.allRequests.paginator = this.allPaginator; }); }, error: e => { console.error(e); this.snackBar.open('Failed to load leave requests','Close',{duration:3000}); } }); }

  approve(r: LeaveRequest) { this.leaveService.approveLeaveRequest(r.id).subscribe({ next: () => { this.snackBar.open('Approved','Close',{duration:2000}); this.loadAll(); this.loadMy(); }, error: e => { console.error(e); this.snackBar.open('Failed to approve','Close',{duration:3000}); } }); }

  reject(r: LeaveRequest) { this.leaveService.rejectLeaveRequest(r.id).subscribe({ next: () => { this.snackBar.open('Rejected','Close',{duration:2000}); this.loadAll(); this.loadMy(); }, error: e => { console.error(e); this.snackBar.open('Failed to reject','Close',{duration:3000}); } }); }
}
