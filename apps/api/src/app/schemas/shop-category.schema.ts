import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopCategoryDocument = HydratedDocument<ShopCategory>;

@Schema({ timestamps: true, collection: 'shop_categories' })
export class ShopCategory {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  imageUrl?: string;

  @Prop({ default: 0 })
  orderIndex!: number;

  @Prop({ default: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ShopCategorySchema = SchemaFactory.createForClass(ShopCategory);
