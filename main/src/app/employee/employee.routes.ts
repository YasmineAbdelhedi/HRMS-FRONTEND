import { Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './dashboard/dashboard.component';
import { EmployeeTasksComponent } from './tasks/tasks.component';
import { EmployeeLeaverequestsComponent } from './leaverequests/leaverequests.component';

export const EmployeeRoutes: Routes = [
  { path: '', component: EmployeeDashboardComponent },
  { path: 'tasks', component: EmployeeTasksComponent },
  { path: 'leaverequests', component: EmployeeLeaverequestsComponent },
];
