import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { AdminsModule } from './admins/admins.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ContactModule } from './contact/contact.module';
import { ContentModule } from './content/content.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { MenuModule } from './menu/menu.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RolesModule } from './roles/roles.module';
import { SeedModule } from './seed/seed.module';
import { SettingsModule } from './settings/settings.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    NotificationsModule,
    AuthModule,
    AdminsModule,
    RolesModule,
    SettingsModule,
    MenuModule,
    ShopModule,
    BlogModule,
    ContentModule,
    ReservationsModule,
    ContactModule,
    HealthModule,
    SeedModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
