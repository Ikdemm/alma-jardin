import type { AuthAdmin } from './auth';
import type { PermissionCode } from './permissions';

export function hasPermission(
  admin: Pick<AuthAdmin, 'isSuperAdmin' | 'permissions'>,
  required: PermissionCode | PermissionCode[],
): boolean {
  const codes = Array.isArray(required) ? required : [required];

  if (admin.isSuperAdmin) {
    return true;
  }

  return codes.every((code) => admin.permissions.includes(code));
}

export function hasAnyPermission(
  admin: Pick<AuthAdmin, 'isSuperAdmin' | 'permissions'>,
  required: PermissionCode[],
): boolean {
  if (admin.isSuperAdmin) {
    return true;
  }

  return required.some((code) => admin.permissions.includes(code));
}
