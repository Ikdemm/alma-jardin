import { SetMetadata } from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';

export const PERMISSIONS_KEY = 'permissions';

export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

export const IS_PUBLIC_KEY = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
