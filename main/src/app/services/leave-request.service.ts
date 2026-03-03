import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { LeaveRequest, LeaveStatus } from '../models/leave-request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LeaveRequestService {
  private baseUrl = `${environment.apiUrl}/leave-requests`;

  constructor(private http: HttpClient) { }

  createLeaveRequest(leaveRequest: LeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}`, leaveRequest);
  }

  approveLeaveRequest(id: number): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.baseUrl}/approve/${id}`, null);
  }

  rejectLeaveRequest(id: number): Observable<LeaveRequest> {
    return this.http.put<LeaveRequest>(`${this.baseUrl}/reject/${id}`, null);
  }

  getAllLeaveRequests(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}`);
  }

  getLeaveRequestsByStatus(status: LeaveStatus): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/status/${status}`);
  }

  getLeaveRequestsByEmployee(employeeId: number): Observable<LeaveRequest[]> {
    return this.getAllLeaveRequests().pipe(
      map((requests) => (requests || []).filter((request) => request.employee?.id === employeeId))
    );
  }

}
