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
import type { BlogCategory, PermissionCode } from '@alma-jardin/shared';
import { Public, RequirePermissions } from '../common/decorators/access.decorator';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Public()
  @Get()
  listPublic(@Query('category') category?: BlogCategory) {
    return this.blogService.listPublic(category);
  }

  @Public()
  @Get('featured')
  listFeatured() {
    return this.blogService.listFeatured();
  }

  @Public()
  @Get('by-slug/:slug')
  getPublicBySlug(@Param('slug') slug: string) {
    return this.blogService.getPublicBySlug(slug);
  }

  @RequirePermissions('blog_posts.read' satisfies PermissionCode)
  @Get('admin')
  listAdmin() {
    return this.blogService.listAdmin();
  }

  @RequirePermissions('blog_posts.read' satisfies PermissionCode)
  @Get('admin/:id')
  getAdmin(@Param('id') id: string) {
    return this.blogService.getAdmin(id);
  }

  @RequirePermissions('blog_posts.create' satisfies PermissionCode)
  @Post('admin')
  create(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create(dto);
  }

  @RequirePermissions('blog_posts.update' satisfies PermissionCode)
  @Patch('admin/:id')
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @RequirePermissions('blog_posts.delete' satisfies PermissionCode)
  @Delete('admin/:id')
  delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
