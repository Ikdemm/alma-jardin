import { Body, Controller, Get, Patch } from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';
import { Public } from '../common/decorators/access.decorator';
import { RequirePermissions } from '../common/decorators/access.decorator';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get('public')
  getPublic() {
    return this.settingsService.getPublic();
  }

  @RequirePermissions('settings.read' satisfies PermissionCode)
  @Get()
  getAdmin() {
    return this.settingsService.getPublic();
  }

  @RequirePermissions('settings.update' satisfies PermissionCode)
  @Patch()
  update(@Body() body: Record<string, string>) {
    return this.settingsService.update(body);
  }
}
