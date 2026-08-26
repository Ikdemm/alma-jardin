import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { ShopProductStatus } from '@alma-jardin/shared';

export type ShopProductDocument = HydratedDocument<ShopProduct>;

@Schema({ timestamps: true, collection: 'shop_products' })
export class ShopProduct {
  @Prop({ type: Types.ObjectId, ref: 'ShopCategory', required: true, index: true })
  categoryId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  story?: string;

  @Prop({ trim: true })
  artistName?: string;

  @Prop({ trim: true })
  technique?: string;

  @Prop({ trim: true })
  medium?: string;

  @Prop({ trim: true })
  dimensions?: string;

  @Prop({ required: true, min: 0 })
  priceCents!: number;

  @Prop({ type: [String], default: [] })
  imageUrls!: string[];

  @Prop({
    type: String,
    enum: ['active', 'sold_out', 'hidden'],
    default: 'active',
  })
  status!: ShopProductStatus;

  @Prop({ default: false })
  featured!: boolean;

  @Prop({ default: 0 })
  orderIndex!: number;

  @Prop({ trim: true })
  whatsappInquiryMessage?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ShopProductSchema = SchemaFactory.createForClass(ShopProduct);
