import type { PermissionCode } from './permissions';

export type AdminStatus = 'pending' | 'active' | 'blocked' | 'inactive';

export interface AdminSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: AdminStatus;
  isSuperAdmin: boolean;
  roleIds: string[];
  directPermissions: PermissionCode[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleSummary {
  id: string;
  name: string;
  description?: string;
  color?: string;
  permissions: PermissionCode[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthAdmin extends AdminSummary {
  permissions: PermissionCode[];
  roles: RoleSummary[];
}

export interface LoginResponse {
  accessToken: string;
  admin: AuthAdmin;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
