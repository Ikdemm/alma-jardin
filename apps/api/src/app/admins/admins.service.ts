import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type {
  AdminSummary,
  AuthAdmin,
  PaginatedResponse,
} from '@alma-jardin/shared';
import { PasswordService } from '../common/password.service';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { Role, RoleDocument } from '../schemas/role.schema';
import {
  CreateAdminDto,
  ListAdminsQueryDto,
  UpdateAdminDto,
} from './dto/admin.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    private readonly passwordService: PasswordService,
  ) {}

  async list(query: ListAdminsQueryDto): Promise<PaginatedResponse<AdminSummary>> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const filter: Record<string, unknown> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.search?.trim()) {
      const term = query.search.trim();
      filter.$or = [
        { firstName: { $regex: term, $options: 'i' } },
        { lastName: { $regex: term, $options: 'i' } },
        { email: { $regex: term, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.adminModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.adminModel.countDocuments(filter),
    ]);

    return {
      data: items.map((item) => this.toSummary(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: string): Promise<AdminSummary> {
    const admin = await this.adminModel.findById(id);

    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }

    return this.toSummary(admin);
  }

  async create(dto: CreateAdminDto, actor: AuthAdmin): Promise<AdminSummary> {
    const existing = await this.adminModel.findOne({
      email: dto.email.toLowerCase(),
    });

    if (existing) {
      throw new ConflictException('Ya existe un administrador con ese correo');
    }

    await this.ensureRolesExist(dto.roleIds);

    const password = dto.password ?? this.generateTemporaryPassword();
    const strengthError = this.passwordService.validateStrength(password);

    if (strengthError) {
      throw new BadRequestException(strengthError);
    }

    const admin = await this.adminModel.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone?.trim(),
      passwordHash: await this.passwordService.hash(password),
      roleIds: dto.roleIds.map((id) => new Types.ObjectId(id)),
      directPermissions: dto.directPermissions ?? [],
      status: dto.password ? 'active' : 'pending',
      isSuperAdmin: false,
    });

    return this.toSummary(admin);
  }

  async update(
    id: string,
    dto: UpdateAdminDto,
    actor: AuthAdmin,
  ): Promise<AdminSummary> {
    const admin = await this.adminModel.findById(id);

    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }

    if (admin.isSuperAdmin && !actor.isSuperAdmin) {
      throw new BadRequestException('No puedes modificar un super administrador');
    }

    if (dto.email && dto.email.toLowerCase() !== admin.email) {
      const existing = await this.adminModel.findOne({
        email: dto.email.toLowerCase(),
        _id: { $ne: admin._id },
      });

      if (existing) {
        throw new ConflictException('Ya existe un administrador con ese correo');
      }

      admin.email = dto.email.toLowerCase().trim();
    }

    if (dto.roleIds) {
      await this.ensureRolesExist(dto.roleIds);
      admin.roleIds = dto.roleIds.map((roleId) => new Types.ObjectId(roleId));
    }

    if (dto.firstName !== undefined) admin.firstName = dto.firstName.trim();
    if (dto.lastName !== undefined) admin.lastName = dto.lastName.trim();
    if (dto.phone !== undefined) admin.phone = dto.phone.trim();
    if (dto.directPermissions !== undefined) {
      admin.directPermissions = dto.directPermissions;
    }
    if (dto.status !== undefined) admin.status = dto.status;

    await admin.save();
    return this.toSummary(admin);
  }

  async block(id: string, actor: AuthAdmin): Promise<AdminSummary> {
    return this.update(id, { status: 'blocked' }, actor);
  }

  async unblock(id: string, actor: AuthAdmin): Promise<AdminSummary> {
    return this.update(id, { status: 'active' }, actor);
  }

  private async ensureRolesExist(roleIds: string[]) {
    if (!roleIds.length) {
      return;
    }

    const count = await this.roleModel.countDocuments({
      _id: { $in: roleIds },
      isActive: true,
    });

    if (count !== roleIds.length) {
      throw new BadRequestException('Uno o más roles no existen o están inactivos');
    }
  }

  private generateTemporaryPassword(): string {
    return `Temp${Math.random().toString(36).slice(2, 10)}1A`;
  }

  private toSummary(admin: AdminDocument): AdminSummary {
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
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }
}
