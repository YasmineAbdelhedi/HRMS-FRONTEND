import { NavItem } from './nav-item/nav-item';

export const adminNavItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: '/admin',
  },
  {
    displayName: 'Users',
    iconName: 'people',
    route: '/admin/users',
  },
  {
    displayName: 'Projects',
    iconName: 'work',
    route: '/admin/projects',
  },
  {
    displayName: 'Leave Requests',
    iconName: 'mail',
    route: '/admin/leaverequests',
  },
];

// Keep default export name for backwards compatibility if any file imports `navItems`
export const navItems = adminNavItems;
