import { NavItem } from '../../admin-layout/sidebar/nav-item/nav-item';

export const employeeNavItems: NavItem[] = [
  { navCap: 'Employee' },
  { displayName: 'Dashboard', iconName: 'dashboard', route: '/employee' },
  { displayName: 'Tasks', iconName: 'list', route: '/employee/tasks' },
  { displayName: 'Leave Requests', iconName: 'mail', route: '/employee/leaverequests' },
];

export const navItems = employeeNavItems;
