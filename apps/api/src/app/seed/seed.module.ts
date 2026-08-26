import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Admin, AdminSchema } from '../schemas/admin.schema';
import { BlogPost, BlogPostSchema } from '../schemas/blog-post.schema';
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
import {
  ShopCategory,
  ShopCategorySchema,
} from '../schemas/shop-category.schema';
import { ShopProduct, ShopProductSchema } from '../schemas/shop-product.schema';
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
      { name: ShopCategory.name, schema: ShopCategorySchema },
      { name: ShopProduct.name, schema: ShopProductSchema },
      { name: BlogPost.name, schema: BlogPostSchema },
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
