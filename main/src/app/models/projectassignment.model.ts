import { Project } from './project.model';
import { User } from './user.model';

export interface ProjectAssignment {
  id: number;
  project: Project;
  user: User;
  role: string;
}

export interface ProjectAssignmentDto {
  userId: number;
  fullName?: string;
  role: string;
}