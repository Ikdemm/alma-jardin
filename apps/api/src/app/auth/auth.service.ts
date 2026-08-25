import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import type { AuthAdmin, LoginResponse } from '@alma-jardin/shared';
import { PasswordService } from '../common/password.service';
import { resolveEffectivePermissions } from '../common/permissions.util';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { Role, RoleDocument } from '../schemas/role.schema';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponse> {
    const admin = await this.adminModel
      .findOne({ email: dto.email.toLowerCase() })
      .select('+passwordHash');

    if (!admin) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (admin.status === 'blocked' || admin.status === 'inactive') {
      throw new UnauthorizedException('Cuenta bloqueada o inactiva');
    }

    const valid = await this.passwordService.compare(
      dto.password,
      admin.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (admin.status === 'pending') {
      admin.status = 'active';
      await admin.save();
    }

    const authAdmin = await this.buildAuthAdmin(admin);
    const accessToken = await this.signToken(admin);

    return { accessToken, admin: authAdmin };
  }

  async getProfile(adminId: string): Promise<AuthAdmin> {
    const admin = await this.adminModel.findById(adminId);

    if (!admin) {
      throw new UnauthorizedException('Administrador no encontrado');
    }

    return this.buildAuthAdmin(admin);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    const admin = await this.adminModel
      .findOne({ email: dto.email.toLowerCase() })
      .select('+resetPasswordToken +resetPasswordExpiresAt');

    if (!admin) {
      return { message: 'Si el correo existe, recibirás instrucciones de recuperación' };
    }

    const token = randomBytes(32).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 60);
    await admin.save();

    const response: { message: string; resetToken?: string } = {
      message: 'Si el correo existe, recibirás instrucciones de recuperación',
    };

    if (this.config.get('NODE_ENV') !== 'production') {
      response.resetToken = token;
    }

    return response;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const strengthError = this.passwordService.validateStrength(dto.password);

    if (strengthError) {
      throw new BadRequestException(strengthError);
    }

    const admin = await this.adminModel
      .findOne({
        resetPasswordToken: dto.token,
        resetPasswordExpiresAt: { $gt: new Date() },
      })
      .select('+resetPasswordToken +resetPasswordExpiresAt +passwordHash');

    if (!admin) {
      throw new BadRequestException('Token inválido o expirado');
    }

    admin.passwordHash = await this.passwordService.hash(dto.password);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpiresAt = undefined;

    if (admin.status === 'pending') {
      admin.status = 'active';
    }

    await admin.save();

    return { message: 'Contraseña actualizada correctamente' };
  }

  private async signToken(admin: AdminDocument): Promise<string> {
    return this.jwtService.signAsync({
      sub: admin._id.toString(),
      email: admin.email,
    });
  }

  private async buildAuthAdmin(admin: AdminDocument): Promise<AuthAdmin> {
    const roles = await this.roleModel.find({ _id: { $in: admin.roleIds } });
    const permissions = admin.isSuperAdmin
      ? []
      : resolveEffectivePermissions(admin, roles);

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
