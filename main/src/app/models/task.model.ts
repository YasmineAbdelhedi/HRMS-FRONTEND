export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string; // API returns date string
  status: TaskStatus;
  projectId: number;
  employeeId: number;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}