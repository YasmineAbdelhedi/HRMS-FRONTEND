import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { roleGuard } from './guards/role.guard'; // Adjust the path as needed
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'
import { EmployeeLayoutComponent } from './layouts/employee-layout/employee-layout.component'
import { HRLayoutComponent } from './layouts/hr-layout/hr-layout.component';
import { PMLayoutComponent } from './layouts/pm-layout/pm-layout.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'authentication/login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      // // Admin Routes
      // {
      //   path: 'admin',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () =>
      //         import('./admin/admin.routes').then((m) => m.AdminRoutes),
      //     },
      //   ],
      // },
    ],
  },
  {
      path:'admin',
      component : AdminLayoutComponent,
      // canActivate: [authGuard, roleGuard],
      data: { roles: ['ADMIN'] },
      children: [
        {
          path: '',
          loadChildren: () =>
            import('./admin/admin.routes').then((m) => m.AdminRoutes),
        },
      ],
  },
  {
    path: 'pm',
    component: PMLayoutComponent,
    // canActivate: [authGuard, roleGuard],
    data: { roles: ['PROJECT_MANAGER'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./project-manager/project-manager.routes').then((m) => m.ProjectManagerRoutes),
      },
    ],
  },
  {
    path: 'hr',
    component: HRLayoutComponent,
    // canActivate: [authGuard, roleGuard],
    data: { roles: ['HR_MANAGER'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./hr-manager/hr-manager.routes').then((m) => m.HRManagerRoutes),
      },
    ],
  },
  {
    path: 'employee',
    component: EmployeeLayoutComponent,
    // canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYEE'] },
    children: [
      {
        path: '',
        loadChildren: () => import('./employee/employee.routes').then((m) => m.EmployeeRoutes),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentification',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/login',
  },
];
