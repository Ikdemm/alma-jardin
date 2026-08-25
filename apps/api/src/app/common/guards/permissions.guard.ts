import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { AuthAdmin, PermissionCode } from '@alma-jardin/shared';
import { PERMISSIONS_KEY } from '../decorators/access.decorator';
import { adminHasPermission } from '../permissions.util';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<PermissionCode[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: AuthAdmin }>();
    const admin = request.user;

    if (!admin) {
      throw new ForbiddenException('Acceso denegado');
    }

    const allowed = adminHasPermission(
      admin,
      admin.permissions,
      required,
    );

    if (!allowed) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
