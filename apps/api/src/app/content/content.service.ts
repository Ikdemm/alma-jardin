import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  BannerPublic,
  FeaturedSectionPublic,
  TestimonialPublic,
} from '@alma-jardin/shared';
import { Banner, BannerDocument } from '../schemas/banner.schema';
import {
  FeaturedSection,
  FeaturedSectionDocument,
} from '../schemas/featured-section.schema';
import { Testimonial, TestimonialDocument } from '../schemas/testimonial.schema';
import {
  UpdateBannerDto,
  UpdateFeaturedSectionDto,
  UpdateTestimonialDto,
  UpsertBannerDto,
  UpsertFeaturedSectionDto,
  UpsertTestimonialDto,
} from './dto/content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Banner.name)
    private readonly bannerModel: Model<BannerDocument>,
    @InjectModel(FeaturedSection.name)
    private readonly featuredModel: Model<FeaturedSectionDocument>,
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
  ) {}

  listPublicBanners(): Promise<BannerPublic[]> {
    return this.bannerModel
      .find({ isActive: true })
      .sort({ orderIndex: 1 })
      .then((items) => items.map((item) => this.toBanner(item)));
  }

  listPublicFeatured(): Promise<FeaturedSectionPublic[]> {
    return this.featuredModel
      .find({ isActive: true })
      .sort({ orderIndex: 1 })
      .then((items) => items.map((item) => this.toFeatured(item)));
  }

  listPublicTestimonials(): Promise<TestimonialPublic[]> {
    return this.testimonialModel
      .find({ isActive: true })
      .sort({ orderIndex: 1 })
      .then((items) => items.map((item) => this.toTestimonial(item)));
  }

  listAdminBanners() {
    return this.bannerModel
      .find()
      .sort({ orderIndex: 1 })
      .then((items) =>
        items.map((item) => ({ ...this.toBanner(item), isActive: item.isActive })),
      );
  }

  listAdminFeatured() {
    return this.featuredModel
      .find()
      .sort({ orderIndex: 1 })
      .then((items) =>
        items.map((item) => ({
          ...this.toFeatured(item),
          isActive: item.isActive,
        })),
      );
  }

  listAdminTestimonials() {
    return this.testimonialModel
      .find()
      .sort({ orderIndex: 1 })
      .then((items) =>
        items.map((item) => ({
          ...this.toTestimonial(item),
          isActive: item.isActive,
        })),
      );
  }

  async createBanner(dto: UpsertBannerDto) {
    const banner = await this.bannerModel.create({
      ...dto,
      isActive: dto.isActive ?? true,
      orderIndex: dto.orderIndex ?? 0,
    });
    return { ...this.toBanner(banner), isActive: banner.isActive };
  }

  async updateBanner(id: string, dto: UpdateBannerDto) {
    const banner = await this.bannerModel.findById(id);
    if (!banner) throw new NotFoundException('Banner no encontrado');
    Object.assign(banner, dto);
    await banner.save();
    return { ...this.toBanner(banner), isActive: banner.isActive };
  }

  async deleteBanner(id: string) {
    const banner = await this.bannerModel.findById(id);
    if (!banner) throw new NotFoundException('Banner no encontrado');
    await banner.deleteOne();
    return { deleted: true };
  }

  async createFeatured(dto: UpsertFeaturedSectionDto) {
    const section = await this.featuredModel.create({
      ...dto,
      isActive: dto.isActive ?? true,
      orderIndex: dto.orderIndex ?? 0,
    });
    return { ...this.toFeatured(section), isActive: section.isActive };
  }

  async updateFeatured(id: string, dto: UpdateFeaturedSectionDto) {
    const section = await this.featuredModel.findById(id);
    if (!section) throw new NotFoundException('Sección no encontrada');
    Object.assign(section, dto);
    await section.save();
    return { ...this.toFeatured(section), isActive: section.isActive };
  }

  async deleteFeatured(id: string) {
    const section = await this.featuredModel.findById(id);
    if (!section) throw new NotFoundException('Sección no encontrada');
    await section.deleteOne();
    return { deleted: true };
  }

  async createTestimonial(dto: UpsertTestimonialDto) {
    const item = await this.testimonialModel.create({
      ...dto,
      isActive: dto.isActive ?? true,
      orderIndex: dto.orderIndex ?? 0,
    });
    return { ...this.toTestimonial(item), isActive: item.isActive };
  }

  async updateTestimonial(id: string, dto: UpdateTestimonialDto) {
    const item = await this.testimonialModel.findById(id);
    if (!item) throw new NotFoundException('Testimonio no encontrado');
    Object.assign(item, dto);
    await item.save();
    return { ...this.toTestimonial(item), isActive: item.isActive };
  }

  async deleteTestimonial(id: string) {
    const item = await this.testimonialModel.findById(id);
    if (!item) throw new NotFoundException('Testimonio no encontrado');
    await item.deleteOne();
    return { deleted: true };
  }

  private toBanner(banner: BannerDocument): BannerPublic {
    return {
      id: banner._id.toString(),
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      ctaLabel: banner.ctaLabel,
      ctaHref: banner.ctaHref,
      placement: banner.placement,
      orderIndex: banner.orderIndex,
    };
  }

  private toFeatured(section: FeaturedSectionDocument): FeaturedSectionPublic {
    return {
      id: section._id.toString(),
      title: section.title,
      subtitle: section.subtitle,
      body: section.body,
      imageUrl: section.imageUrl,
      ctaLabel: section.ctaLabel,
      ctaHref: section.ctaHref,
      orderIndex: section.orderIndex,
    };
  }

  private toTestimonial(item: TestimonialDocument): TestimonialPublic {
    return {
      id: item._id.toString(),
      quote: item.quote,
      authorName: item.authorName,
      authorRole: item.authorRole,
      orderIndex: item.orderIndex,
    };
  }
}
