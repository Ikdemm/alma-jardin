import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';
import { Public, RequirePermissions } from '../common/decorators/access.decorator';
import {
  CreateContactMessageDto,
  UpdateContactMessageStatusDto,
} from './dto/contact.dto';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateContactMessageDto) {
    return this.contactService.createPublic(dto);
  }

  @RequirePermissions('contact_messages.read' satisfies PermissionCode)
  @Get()
  list() {
    return this.contactService.listAdmin();
  }

  @RequirePermissions('contact_messages.update' satisfies PermissionCode)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageStatusDto,
  ) {
    return this.contactService.updateStatus(id, dto);
  }
}
