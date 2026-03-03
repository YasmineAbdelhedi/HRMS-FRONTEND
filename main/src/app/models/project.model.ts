import { User } from './user.model';
import { Task } from './task.model';
import { ProjectAssignment, ProjectAssignmentDto } from './projectassignment.model';

export interface Project {
  id: number;
  name: string;
  description: string;
  budget: number;
  projectManager: User;
  tasks: Task[];
  projectAssignments: ProjectAssignment[];
}

export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  budget: number;
  projectManagerName: string;
  taskNames: string[];
  assignments: ProjectAssignmentDto[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  budget: number;
}
