import { NavItem } from '../../admin-layout/sidebar/nav-item/nav-item';

export const hrNavItems: NavItem[] = [
  { navCap: 'HR Manager' },
  { displayName: 'Dashboard', iconName: 'dashboard', route: '/hr' },
  { displayName: 'Users', iconName: 'users', route: '/hr/users' },
  { displayName: 'Projects', iconName: 'briefcase', route: '/hr/projects' },
  { displayName: 'Leave Requests', iconName: 'mail', route: '/hr/leaverequests' },
  { displayName: 'Attendance', iconName: 'clock', route: '/hr/attendance' },
];

export const navItems = hrNavItems;
