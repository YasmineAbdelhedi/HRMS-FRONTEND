import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { LeaverequestsComponent } from './leaverequests/leaverequests.component';

export const AdminRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'leaverequests',
    component: LeaverequestsComponent,
  },
];
