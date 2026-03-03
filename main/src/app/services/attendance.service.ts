import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AttendanceService {
    private baseUrl = `${environment.apiUrl}/attendance`;

    constructor(private http: HttpClient) { }

    getAllAttendance(): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(this.baseUrl);
    }

    getAttendanceById(id: number): Observable<Attendance> {
        return this.http.get<Attendance>(`${this.baseUrl}/${id}`);
    }

    markCheckIn(employeeId: number, checkInTime: string): Observable<Attendance> {
        return this.http.post<Attendance>(`${this.baseUrl}/checkin/${employeeId}`, null, {
            params: { checkInTime },
        });
    }

    getAttendanceByEmployeeAndDateRange(
        employeeId: number,
        startDate: string,
        endDate: string
    ): Observable<Attendance[]> {
        return this.http.get<Attendance[]>(`${this.baseUrl}/employee/${employeeId}/range`, {
            params: { startDate, endDate },
        });
    }
}
