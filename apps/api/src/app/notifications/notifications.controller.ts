import { Body, Controller, Get, Post } from '@nestjs/common';
import type { AuthAdmin } from '@alma-jardin/shared';
import { CurrentAdmin } from '../common/decorators/current-admin.decorator';
import { Public } from '../common/decorators/access.decorator';
import { SubscribePushDto, UnsubscribePushDto } from './dto/push.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Public()
  @Get('vapid-public-key')
  getVapidPublicKey() {
    return {
      publicKey: this.notificationsService.getVapidPublicKey(),
      configured: this.notificationsService.isPushConfigured(),
    };
  }

  @Get('push/status')
  getStatus(@CurrentAdmin() admin: AuthAdmin) {
    return this.notificationsService.listAdminSubscriptions(admin.id);
  }

  @Post('push/subscribe')
  subscribe(
    @CurrentAdmin() admin: AuthAdmin,
    @Body() dto: SubscribePushDto,
  ) {
    return this.notificationsService.subscribeAdmin(admin.id, dto);
  }

  @Post('push/unsubscribe')
  unsubscribe(@Body() dto: UnsubscribePushDto) {
    return this.notificationsService.unsubscribe(dto.endpoint);
  }
}
