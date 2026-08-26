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

  @RequirePermissions('menu_categories.read' satisfies PermissionCode)
  @Get('admin/categories/:id')
  getAdminCategory(@Param('id') id: string) {
    return this.menuService.getAdminCategory(id);
  }

  @RequirePermissions('menu_categories.delete' satisfies PermissionCode)
  @Delete('admin/categories/:id')
  deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id);
  }

  @RequirePermissions('menu_items.read' satisfies PermissionCode)
  @Get('admin/items/:id')
  getAdminItem(@Param('id') id: string) {
    return this.menuService.getAdminItem(id);
  }

  @RequirePermissions('menu_items.create' satisfies PermissionCode)
  @Post('admin/items')
  createItem(@Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(dto);
  }

  @RequirePermissions('menu_items.read' satisfies PermissionCode)
  @Get('admin/items')
  listAdminItems(@Query('categoryId') categoryId?: string) {
    return this.menuService.listAdminItems(categoryId);
  }

  @RequirePermissions('menu_items.delete' satisfies PermissionCode)
  @Delete('admin/items/:id')
  deleteItem(@Param('id') id: string) {
    return this.menuService.deleteItem(id);
  }

  @RequirePermissions('menu_items.update' satisfies PermissionCode)
  @Patch('admin/items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.updateItem(id, dto);
  }
}
