import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectDto } from 'src/app/models/project.model';

@Component({
  selector: 'app-pm-dashboard',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class PMDashboardComponent implements OnInit {
  managedProjectCount = 0;
  totalAssignments = 0;
  totalTasks = 0;
  totalBudget = 0;
  projects: ProjectDto[] = [];

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (user) => {
        this.projectService.getProjectsByManager(user.id).subscribe({
          next: (projects) => {
            const list = projects || [];
            this.projects = list.slice(0, 8);
            this.managedProjectCount = list.length;
            this.totalAssignments = list.reduce((sum, p) => sum + (p.assignments?.length || 0), 0);
            this.totalTasks = list.reduce((sum, p) => sum + (p.taskNames?.length || 0), 0);
            this.totalBudget = list.reduce((sum, p) => sum + Number(p.budget || 0), 0);
          },
          error: (err) => console.error(err)
        });
      },
      error: (err) => console.error(err)
    });
  }
}
