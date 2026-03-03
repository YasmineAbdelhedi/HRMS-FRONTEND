import { Routes } from '@angular/router';
import { PMDashboardComponent } from './dashboard/dashboard.component';
import { PMProjectsComponent } from './projects/projects.component';

export const ProjectManagerRoutes: Routes = [
  { path: '', component: PMDashboardComponent },
  { path: 'projects', component: PMProjectsComponent },
];
