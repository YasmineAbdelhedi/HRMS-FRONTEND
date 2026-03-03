import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectAssignment } from '../models/projectassignment.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProjectAssignmentService {
    private baseUrl = `${environment.apiUrl}/api/project-assignments`;

    constructor(private http: HttpClient) { }

    getAllProjectAssignments(): Observable<ProjectAssignment[]> {
        return this.http.get<ProjectAssignment[]>(this.baseUrl);
    }

    getProjectAssignmentById(id: number): Observable<ProjectAssignment> {
        return this.http.get<ProjectAssignment>(`${this.baseUrl}/${id}`);
    }

    createProjectAssignment(assignment: ProjectAssignment): Observable<ProjectAssignment> {
        return this.http.post<ProjectAssignment>(this.baseUrl, assignment);
    }

    updateProjectAssignment(id: number, assignment: ProjectAssignment): Observable<ProjectAssignment> {
        return this.http.put<ProjectAssignment>(`${this.baseUrl}/${id}`, assignment);
    }

    deleteProjectAssignment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
