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
import { NotificationsService } from '../notifications/notifications.service';
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
    private readonly notifications: NotificationsService,
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

  async forgotPassword(
    dto: ForgotPasswordDto,
  ): Promise<{ message: string; resetToken?: string; emailSent?: boolean }> {
    const admin = await this.adminModel
      .findOne({ email: dto.email.toLowerCase() })
      .select('+resetPasswordToken +resetPasswordExpiresAt');

    const genericMessage =
      'Si el correo existe, recibirás instrucciones de recuperación';

    if (!admin || admin.status === 'blocked' || admin.status === 'inactive') {
      return { message: genericMessage };
    }

    const token = await this.issueResetToken(admin, 1000 * 60 * 60);
    const emailSent = await this.sendPasswordEmail({
      to: admin.email,
      firstName: admin.firstName,
      token,
      kind: 'reset',
    });

    const response: {
      message: string;
      resetToken?: string;
      emailSent?: boolean;
    } = {
      message: genericMessage,
      emailSent,
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

    if (admin.status === 'blocked' || admin.status === 'inactive') {
      throw new BadRequestException('Esta cuenta no puede activarse');
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

  async issueResetToken(
    admin: AdminDocument,
    ttlMs: number,
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    admin.resetPasswordToken = token;
    admin.resetPasswordExpiresAt = new Date(Date.now() + ttlMs);
    await admin.save();
    return token;
  }

  async sendPasswordEmail(input: {
    to: string;
    firstName: string;
    token: string;
    kind: 'reset' | 'invite';
  }): Promise<boolean> {
    const webOrigin = (
      this.config.get<string>('WEB_ORIGIN') || 'http://localhost:4200'
    ).replace(/\/$/, '');
    const link = `${webOrigin}/admin/reset-password?token=${encodeURIComponent(input.token)}`;

    if (input.kind === 'invite') {
      const subject = 'Activa tu cuenta de administrador — Alma Jardín';
      const text = [
        `Hola ${input.firstName},`,
        '',
        'Te invitaron a administrar la plataforma de Alma Jardín.',
        'Define tu contraseña con este enlace (válido 7 días):',
        link,
        '',
        'Si no esperabas este correo, puedes ignorarlo.',
      ].join('\n');

      return this.notifications.sendMail({
        to: input.to,
        subject,
        text,
        html: this.notifications.buildEmailHtml(subject, [
          `Hola ${input.firstName},`,
          'Te invitaron a administrar la plataforma de Alma Jardín.',
          `Define tu contraseña aquí: ${link}`,
          'El enlace es válido durante 7 días.',
        ]),
      });
    }

    const subject = 'Recuperar contraseña — Alma Jardín';
    const text = [
      `Hola ${input.firstName},`,
      '',
      'Recibimos una solicitud para restablecer tu contraseña de administrador.',
      'Usa este enlace (válido 1 hora):',
      link,
      '',
      'Si no solicitaste este cambio, ignora este correo.',
    ].join('\n');

    return this.notifications.sendMail({
      to: input.to,
      subject,
      text,
      html: this.notifications.buildEmailHtml(subject, [
        `Hola ${input.firstName},`,
        'Recibimos una solicitud para restablecer tu contraseña de administrador.',
        `Restablece tu contraseña aquí: ${link}`,
        'El enlace es válido durante 1 hora.',
      ]),
    });
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
