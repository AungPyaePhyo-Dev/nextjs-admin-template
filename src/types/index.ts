export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export type ItemStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface Item {
  id: string;
  name: string;
  code: string;
  owner: string;
  status: ItemStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
}
