import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  private baseUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) { }

  createTask(projectId: number, employeeId: number, name: string, description: string, dueDate: string): Observable<Task> {
    const params = new HttpParams()
      .set('projectId', projectId.toString())
      .set('employeeId', employeeId.toString())
      .set('name', name)
      .set('description', description)
      .set('dueDate', dueDate);

    return this.http.post<Task>(`${this.baseUrl}/create`, null, { params });
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/all`);
  }

  getMyTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/my-tasks`);
  }

  getTasksByProject(projectId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/project/${projectId}`);
  }

  updateTaskStatus(taskId: number, status: TaskStatus): Observable<Task> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Task>(`${this.baseUrl}/${taskId}/status`, JSON.stringify(status), { headers });
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taskId}`);
  }
}
