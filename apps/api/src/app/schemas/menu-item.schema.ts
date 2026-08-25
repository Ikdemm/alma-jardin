import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { MenuItemStatus } from '@alma-jardin/shared';

export type MenuItemDocument = HydratedDocument<MenuItem>;

@Schema({ timestamps: true, collection: 'menu_items' })
export class MenuItem {
  @Prop({ type: Types.ObjectId, ref: 'MenuCategory', required: true, index: true })
  categoryId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  ingredients?: string;

  @Prop({ required: true, min: 0 })
  priceCents!: number;

  @Prop()
  imageUrl?: string;

  @Prop({
    enum: ['active', 'sold_out', 'hidden'],
    default: 'active',
  })
  status!: MenuItemStatus;

  @Prop({ default: false })
  featured!: boolean;

  @Prop({ default: 0 })
  orderIndex!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
