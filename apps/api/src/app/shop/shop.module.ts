import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ShopCategory,
  ShopCategorySchema,
} from '../schemas/shop-category.schema';
import { ShopProduct, ShopProductSchema } from '../schemas/shop-product.schema';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopCategory.name, schema: ShopCategorySchema },
      { name: ShopProduct.name, schema: ShopProductSchema },
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
