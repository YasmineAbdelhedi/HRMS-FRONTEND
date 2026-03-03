import { NavItem } from '../../admin-layout/sidebar/nav-item/nav-item';

export const pmNavItems: NavItem[] = [
  { navCap: 'Project Manager' },
  { displayName: 'Dashboard', iconName: 'dashboard', route: '/pm' },
  { displayName: 'Projects', iconName: 'briefcase', route: '/pm/projects' },
];

export const navItems = pmNavItems;
