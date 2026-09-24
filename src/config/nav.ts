import { FileText, LayoutDashboard, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '@/types';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  // Omit to show the item to every signed-in user.
  roles?: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/items', label: 'Items', icon: FileText },
  { href: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  { href: '/settings', label: 'Settings', icon: Settings },
];

// Labels for static URL segments, used by the topbar breadcrumbs.
export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  items: 'Items',
  new: 'New',
  users: 'Users',
  settings: 'Settings',
};
