import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectDto, CreateProjectDto } from '../models/project.model';
import { ProjectAssignment, ProjectAssignmentDto } from '../models/projectassignment.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = `${environment.apiUrl}/api/projects`;

  constructor(private http: HttpClient) { }

  // Create a project
  createProject(project: CreateProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${this.baseUrl}/create`, project);
  }

  // Fetch a project by ID
  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  // Fetch all projects
  getAllProjects(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(this.baseUrl);
  }

  // Delete a project
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Update a project
  updateProject(id: number, project: CreateProjectDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.baseUrl}/${id}`, project);
  }

  // Assign a single employee to a project
  assignEmployeeToProject(projectId: number, assignment: ProjectAssignmentDto): Observable<string> {
    const params = {
      userId: assignment.userId.toString(),
      role: assignment.role,
    };
    return this.http.post<string>(`${this.baseUrl}/${projectId}/assign`, null, { params });
  }

  // Assign multiple employees to a project
  assignEmployeesToProject(projectId: number, assignments: ProjectAssignmentDto[]): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/${projectId}/assign-employees`, assignments);
  }

  // Fetch projects by manager
  getProjectsByManager(managerId: number): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.baseUrl}/GetProjectsByPM/${managerId}`);
  }

  // Fetch projects by employee
  getProjectsByEmployee(employeeId: number): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${this.baseUrl}/GetProjectsByEmployee/${employeeId}`);
  }
}
