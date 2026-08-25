import type { PermissionCode } from '@alma-jardin/shared';
import type { AdminDocument } from '../schemas/admin.schema';
import type { RoleDocument } from '../schemas/role.schema';

export function resolveEffectivePermissions(
  admin: Pick<AdminDocument, 'isSuperAdmin' | 'directPermissions'>,
  roles: Pick<RoleDocument, 'isActive' | 'permissions'>[],
): PermissionCode[] {
  if (admin.isSuperAdmin) {
    return [];
  }

  const fromRoles = roles
    .filter((role) => role.isActive)
    .flatMap((role) => role.permissions as PermissionCode[]);

  return [...new Set([...fromRoles, ...(admin.directPermissions as PermissionCode[])])];
}

export function adminHasPermission(
  admin: Pick<AdminDocument, 'isSuperAdmin'>,
  permissions: PermissionCode[],
  required: PermissionCode[],
): boolean {
  if (admin.isSuperAdmin) {
    return true;
  }

  return required.every((permission) => permissions.includes(permission));
}

export function authAdminHasPermission(
  admin: { isSuperAdmin: boolean; permissions: PermissionCode[] },
  required: PermissionCode | PermissionCode[],
): boolean {
  const codes = Array.isArray(required) ? required : [required];

  if (admin.isSuperAdmin) {
    return true;
  }

  return codes.every((permission) => admin.permissions.includes(permission));
}
