import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { RequirePermissions } from '../common/decorators/access.decorator';
import type { AuthAdmin } from '@alma-jardin/shared';
import { AdminsService } from './admins.service';
import {
  CreateAdminDto,
  ListAdminsQueryDto,
  UpdateAdminDto,
} from './dto/admin.dto';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @RequirePermissions('admins.read' satisfies PermissionCode)
  @Get()
  list(@Query() query: ListAdminsQueryDto) {
    return this.adminsService.list(query);
  }

  @RequirePermissions('admins.read' satisfies PermissionCode)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @RequirePermissions('admins.create' satisfies PermissionCode)
  @Post()
  create(@Body() dto: CreateAdminDto, @CurrentAdmin() actor: AuthAdmin) {
    return this.adminsService.create(dto, actor);
  }

  @RequirePermissions('admins.update' satisfies PermissionCode)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminDto,
    @CurrentAdmin() actor: AuthAdmin,
  ) {
    return this.adminsService.update(id, dto, actor);
  }

  @RequirePermissions('admins.update' satisfies PermissionCode)
  @Post(':id/block')
  block(@Param('id') id: string, @CurrentAdmin() actor: AuthAdmin) {
    return this.adminsService.block(id, actor);
  }

  @RequirePermissions('admins.update' satisfies PermissionCode)
  @Post(':id/unblock')
  unblock(@Param('id') id: string, @CurrentAdmin() actor: AuthAdmin) {
    return this.adminsService.unblock(id, actor);
  }

  @RequirePermissions('admins.update' satisfies PermissionCode)
  @Post(':id/resend-invite')
  resendInvite(@Param('id') id: string, @CurrentAdmin() actor: AuthAdmin) {
    return this.adminsService.resendInvite(id, actor);
  }
}
