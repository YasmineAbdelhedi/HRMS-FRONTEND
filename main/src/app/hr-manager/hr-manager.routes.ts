import { Routes } from '@angular/router';
import { HRDashboardComponent } from './dashboard/dashboard.component';
import { HRUsersComponent } from './users/users.component';
import { HRProjectsComponent } from './projects/projects.component';
import { HRLeaverequestsComponent } from './leaverequests/leaverequests.component';
import { HRAttendanceComponent } from './attendance/attendance.component';

export const HRManagerRoutes: Routes = [
  { path: '', component: HRDashboardComponent },
  { path: 'users', component: HRUsersComponent },
  { path: 'projects', component: HRProjectsComponent },
  { path: 'leaverequests', component: HRLeaverequestsComponent },
  { path: 'attendance', component: HRAttendanceComponent },
];
