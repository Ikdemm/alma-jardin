import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MenuCategoryDocument = HydratedDocument<MenuCategory>;

@Schema({ timestamps: true, collection: 'menu_categories' })
export class MenuCategory {
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

export const MenuCategorySchema = SchemaFactory.createForClass(MenuCategory);
