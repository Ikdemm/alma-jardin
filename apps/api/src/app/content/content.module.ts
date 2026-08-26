import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from '../schemas/banner.schema';
import {
  FeaturedSection,
  FeaturedSectionSchema,
} from '../schemas/featured-section.schema';
import { Testimonial, TestimonialSchema } from '../schemas/testimonial.schema';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      { name: FeaturedSection.name, schema: FeaturedSectionSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
