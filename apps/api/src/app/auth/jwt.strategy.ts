import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthAdmin } from '@alma-jardin/shared';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { Role, RoleDocument } from '../schemas/role.schema';
import { resolveEffectivePermissions } from '../common/permissions.util';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'dev-secret-change-me'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthAdmin> {
    const admin = await this.adminModel
      .findById(payload.sub)
      .select('+passwordHash')
      .lean(false);

    if (!admin || admin.status === 'blocked' || admin.status === 'inactive') {
      throw new UnauthorizedException('Cuenta no disponible');
    }

    const roles = await this.roleModel.find({ _id: { $in: admin.roleIds } });
    const permissions = admin.isSuperAdmin
      ? []
      : resolveEffectivePermissions(admin, roles);

    return this.toAuthAdmin(admin, roles, permissions);
  }

  private toAuthAdmin(
    admin: AdminDocument,
    roles: RoleDocument[],
    permissions: AuthAdmin['permissions'],
  ): AuthAdmin {
    return {
      id: admin._id.toString(),
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phone: admin.phone,
      status: admin.status,
      isSuperAdmin: admin.isSuperAdmin,
      roleIds: admin.roleIds.map((id) => id.toString()),
      directPermissions: admin.directPermissions,
      permissions,
      roles: roles.map((role) => ({
        id: role._id.toString(),
        name: role.name,
        description: role.description,
        color: role.color,
        permissions: role.permissions,
        isActive: role.isActive,
        createdAt: role.createdAt.toISOString(),
        updatedAt: role.updatedAt.toISOString(),
      })),
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }
}
