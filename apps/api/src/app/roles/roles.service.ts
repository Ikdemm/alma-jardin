import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ALL_PERMISSIONS,
  buildPermissionCatalog,
  isPermissionCode,
  type PaginatedResponse,
  type RoleSummary,
} from '@alma-jardin/shared';
import { Admin, AdminDocument } from '../schemas/admin.schema';
import { Role, RoleDocument } from '../schemas/role.schema';
import { CreateRoleDto, ListRolesQueryDto, UpdateRoleDto } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  getPermissionCatalog() {
    return {
      modules: buildPermissionCatalog(),
      all: ALL_PERMISSIONS,
    };
  }

  async list(query: ListRolesQueryDto): Promise<PaginatedResponse<RoleSummary>> {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const filter: Record<string, unknown> = {};

    if (query.isActive !== undefined) {
      filter.isActive = query.isActive;
    }

    if (query.search?.trim()) {
      filter.name = { $regex: query.search.trim(), $options: 'i' };
    }

    const [items, total] = await Promise.all([
      this.roleModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      this.roleModel.countDocuments(filter),
    ]);

    return {
      data: items.map((item) => this.toSummary(item)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(id: string): Promise<RoleSummary> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return this.toSummary(role);
  }

  async create(dto: CreateRoleDto): Promise<RoleSummary> {
    this.validatePermissions(dto.permissions);

    const existing = await this.roleModel.findOne({ name: dto.name.trim() });

    if (existing) {
      throw new ConflictException('Ya existe un rol con ese nombre');
    }

    const role = await this.roleModel.create({
      name: dto.name.trim(),
      description: dto.description?.trim(),
      color: dto.color,
      permissions: dto.permissions,
      isActive: dto.isActive ?? true,
    });

    return this.toSummary(role);
  }

  async update(id: string, dto: UpdateRoleDto): Promise<RoleSummary> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    if (dto.name && dto.name.trim() !== role.name) {
      const existing = await this.roleModel.findOne({
        name: dto.name.trim(),
        _id: { $ne: role._id },
      });

      if (existing) {
        throw new ConflictException('Ya existe un rol con ese nombre');
      }

      role.name = dto.name.trim();
    }

    if (dto.permissions) {
      this.validatePermissions(dto.permissions);
      role.permissions = dto.permissions;
    }

    if (dto.description !== undefined) role.description = dto.description.trim();
    if (dto.color !== undefined) role.color = dto.color;
    if (dto.isActive !== undefined) role.isActive = dto.isActive;

    await role.save();
    return this.toSummary(role);
  }

  async remove(id: string): Promise<{ message: string }> {
    const role = await this.roleModel.findById(id);

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    const assignedCount = await this.adminModel.countDocuments({ roleIds: role._id });

    if (assignedCount > 0) {
      throw new BadRequestException(
        'No se puede eliminar un rol asignado a administradores',
      );
    }

    await role.deleteOne();
    return { message: 'Rol eliminado correctamente' };
  }

  private validatePermissions(permissions: string[]) {
    const invalid = permissions.filter((code) => !isPermissionCode(code));

    if (invalid.length) {
      throw new BadRequestException(`Permisos inválidos: ${invalid.join(', ')}`);
    }
  }

  private toSummary(role: RoleDocument): RoleSummary {
    return {
      id: role._id.toString(),
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: role.permissions,
      isActive: role.isActive,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    };
  }
}
