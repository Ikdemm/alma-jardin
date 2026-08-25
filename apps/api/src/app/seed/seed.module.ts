import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import {
  MenuCategory,
  MenuCategorySchema,
} from '../schemas/menu-category.schema';
import { MenuItem, MenuItemSchema } from '../schemas/menu-item.schema';
import {
  RestaurantSettings,
  RestaurantSettingsSchema,
} from '../schemas/restaurant-settings.schema';
import { Role, RoleSchema } from '../schemas/role.schema';
import { SeedService } from './seed.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Role.name, schema: RoleSchema },
      { name: RestaurantSettings.name, schema: RestaurantSettingsSchema },
      { name: MenuCategory.name, schema: MenuCategorySchema },
      { name: MenuItem.name, schema: MenuItemSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
