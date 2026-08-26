import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { PermissionCode } from '@alma-jardin/shared';
import { Public, RequirePermissions } from '../common/decorators/access.decorator';
import {
  UpdateBannerDto,
  UpdateFeaturedSectionDto,
  UpdateTestimonialDto,
  UpsertBannerDto,
  UpsertFeaturedSectionDto,
  UpsertTestimonialDto,
} from './dto/content.dto';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Public()
  @Get('banners')
  listPublicBanners() {
    return this.contentService.listPublicBanners();
  }

  @Public()
  @Get('featured-sections')
  listPublicFeatured() {
    return this.contentService.listPublicFeatured();
  }

  @Public()
  @Get('testimonials')
  listPublicTestimonials() {
    return this.contentService.listPublicTestimonials();
  }

  @RequirePermissions('banners.read' satisfies PermissionCode)
  @Get('admin/banners')
  listAdminBanners() {
    return this.contentService.listAdminBanners();
  }

  @RequirePermissions('banners.create' satisfies PermissionCode)
  @Post('admin/banners')
  createBanner(@Body() dto: UpsertBannerDto) {
    return this.contentService.createBanner(dto);
  }

  @RequirePermissions('banners.update' satisfies PermissionCode)
  @Patch('admin/banners/:id')
  updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.contentService.updateBanner(id, dto);
  }

  @RequirePermissions('banners.delete' satisfies PermissionCode)
  @Delete('admin/banners/:id')
  deleteBanner(@Param('id') id: string) {
    return this.contentService.deleteBanner(id);
  }

  @RequirePermissions('featured_sections.read' satisfies PermissionCode)
  @Get('admin/featured-sections')
  listAdminFeatured() {
    return this.contentService.listAdminFeatured();
  }

  @RequirePermissions('featured_sections.create' satisfies PermissionCode)
  @Post('admin/featured-sections')
  createFeatured(@Body() dto: UpsertFeaturedSectionDto) {
    return this.contentService.createFeatured(dto);
  }

  @RequirePermissions('featured_sections.update' satisfies PermissionCode)
  @Patch('admin/featured-sections/:id')
  updateFeatured(
    @Param('id') id: string,
    @Body() dto: UpdateFeaturedSectionDto,
  ) {
    return this.contentService.updateFeatured(id, dto);
  }

  @RequirePermissions('featured_sections.delete' satisfies PermissionCode)
  @Delete('admin/featured-sections/:id')
  deleteFeatured(@Param('id') id: string) {
    return this.contentService.deleteFeatured(id);
  }

  @RequirePermissions('featured_sections.read' satisfies PermissionCode)
  @Get('admin/testimonials')
  listAdminTestimonials() {
    return this.contentService.listAdminTestimonials();
  }

  @RequirePermissions('featured_sections.create' satisfies PermissionCode)
  @Post('admin/testimonials')
  createTestimonial(@Body() dto: UpsertTestimonialDto) {
    return this.contentService.createTestimonial(dto);
  }

  @RequirePermissions('featured_sections.update' satisfies PermissionCode)
  @Patch('admin/testimonials/:id')
  updateTestimonial(
    @Param('id') id: string,
    @Body() dto: UpdateTestimonialDto,
  ) {
    return this.contentService.updateTestimonial(id, dto);
  }

  @RequirePermissions('featured_sections.delete' satisfies PermissionCode)
  @Delete('admin/testimonials/:id')
  deleteTestimonial(@Param('id') id: string) {
    return this.contentService.deleteTestimonial(id);
  }
}
