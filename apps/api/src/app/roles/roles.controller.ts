import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';
import { RequirePermissions } from '../common/decorators/access.decorator';
import { RolesService } from './roles.service';
import { CreateRoleDto, ListRolesQueryDto, UpdateRoleDto } from './dto/role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @RequirePermissions('roles.read' satisfies PermissionCode)
  @Get('permissions/catalog')
  getCatalog() {
    return this.rolesService.getPermissionCatalog();
  }

  @RequirePermissions('roles.read' satisfies PermissionCode)
  @Get()
  list(@Query() query: ListRolesQueryDto) {
    return this.rolesService.list(query);
  }

  @RequirePermissions('roles.read' satisfies PermissionCode)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @RequirePermissions('roles.create' satisfies PermissionCode)
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @RequirePermissions('roles.update' satisfies PermissionCode)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  @RequirePermissions('roles.delete' satisfies PermissionCode)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
