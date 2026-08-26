import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeaturedSectionDocument = HydratedDocument<FeaturedSection>;

@Schema({ timestamps: true, collection: 'featured_sections' })
export class FeaturedSection {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  subtitle?: string;

  @Prop({ trim: true })
  body?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ trim: true })
  ctaLabel?: string;

  @Prop({ trim: true })
  ctaHref?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: 0 })
  orderIndex!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const FeaturedSectionSchema =
  SchemaFactory.createForClass(FeaturedSection);
