import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { BannerPlacement } from '@alma-jardin/shared';

export type BannerDocument = HydratedDocument<Banner>;

@Schema({ timestamps: true, collection: 'banners' })
export class Banner {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ trim: true })
  subtitle?: string;

  @Prop({ required: true })
  imageUrl!: string;

  @Prop({ trim: true })
  ctaLabel?: string;

  @Prop({ trim: true })
  ctaHref?: string;

  @Prop({
    enum: ['home_hero', 'home_mid'],
    default: 'home_mid',
  })
  placement!: BannerPlacement;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: 0 })
  orderIndex!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
