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
import { Public, RequirePermissions } from '../common/decorators/access.decorator';
import {
  CreateMenuCategoryDto,
  CreateMenuItemDto,
  UpdateMenuCategoryDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get('categories')
  listPublicCategories() {
    return this.menuService.listPublicCategories();
  }

  @Public()
  @Get('items')
  listPublicItems(@Query('category') category?: string) {
    return this.menuService.listPublicItems(category);
  }

  @Public()
  @Get('featured')
  listFeatured() {
    return this.menuService.listFeaturedItems();
  }

  @RequirePermissions('menu_categories.read' satisfies PermissionCode)
  @Get('admin/categories')
  listAdminCategories() {
    return this.menuService.listAdminCategories();
  }

  @RequirePermissions('menu_categories.create' satisfies PermissionCode)
  @Post('admin/categories')
  createCategory(@Body() dto: CreateMenuCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @RequirePermissions('menu_categories.update' satisfies PermissionCode)
  @Patch('admin/categories/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateMenuCategoryDto) {
    return this.menuService.updateCategory(id, dto);
  }

  @RequirePermissions('menu_items.read' satisfies PermissionCode)
  @Get('admin/items')
  listAdminItems(@Query('categoryId') categoryId?: string) {
    return this.menuService.listAdminItems(categoryId);
  }

  @RequirePermissions('menu_items.create' satisfies PermissionCode)
  @Post('admin/items')
  createItem(@Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(dto);
  }

  @RequirePermissions('menu_items.update' satisfies PermissionCode)
  @Patch('admin/items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.updateItem(id, dto);
  }
}
