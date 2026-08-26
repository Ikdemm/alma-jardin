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
import { Public, RequirePermissions } from '../common/decorators/access.decorator';
import {
  CreateShopCategoryDto,
  CreateShopProductDto,
  UpdateShopCategoryDto,
  UpdateShopProductDto,
} from './dto/shop.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Public()
  @Get('categories')
  listPublicCategories() {
    return this.shopService.listPublicCategories();
  }

  @Public()
  @Get('products')
  listPublicProducts(@Query('category') category?: string) {
    return this.shopService.listPublicProducts(category);
  }

  @Public()
  @Get('featured')
  listFeatured() {
    return this.shopService.listFeaturedProducts();
  }

  @Public()
  @Get('products/by-slug/:slug')
  getPublicBySlug(@Param('slug') slug: string) {
    return this.shopService.getPublicBySlug(slug);
  }

  @RequirePermissions('shop_categories.read' satisfies PermissionCode)
  @Get('admin/categories')
  listAdminCategories() {
    return this.shopService.listAdminCategories();
  }

  @RequirePermissions('shop_categories.read' satisfies PermissionCode)
  @Get('admin/categories/:id')
  getAdminCategory(@Param('id') id: string) {
    return this.shopService.getAdminCategory(id);
  }

  @RequirePermissions('shop_categories.create' satisfies PermissionCode)
  @Post('admin/categories')
  createCategory(@Body() dto: CreateShopCategoryDto) {
    return this.shopService.createCategory(dto);
  }

  @RequirePermissions('shop_categories.update' satisfies PermissionCode)
  @Patch('admin/categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateShopCategoryDto) {
    return this.shopService.updateCategory(id, dto);
  }

  @RequirePermissions('shop_categories.delete' satisfies PermissionCode)
  @Delete('admin/categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.shopService.deleteCategory(id);
  }

  @RequirePermissions('shop_products.read' satisfies PermissionCode)
  @Get('admin/products')
  listAdminProducts(@Query('categoryId') categoryId?: string) {
    return this.shopService.listAdminProducts(categoryId);
  }

  @RequirePermissions('shop_products.read' satisfies PermissionCode)
  @Get('admin/products/:id')
  getAdminProduct(@Param('id') id: string) {
    return this.shopService.getAdminProduct(id);
  }

  @RequirePermissions('shop_products.create' satisfies PermissionCode)
  @Post('admin/products')
  createProduct(@Body() dto: CreateShopProductDto) {
    return this.shopService.createProduct(dto);
  }

  @RequirePermissions('shop_products.update' satisfies PermissionCode)
  @Patch('admin/products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateShopProductDto) {
    return this.shopService.updateProduct(id, dto);
  }

  @RequirePermissions('shop_products.delete' satisfies PermissionCode)
  @Delete('admin/products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.shopService.deleteProduct(id);
  }
}
