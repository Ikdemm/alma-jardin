import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { BlogCategory, BlogPostStatus } from '@alma-jardin/shared';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({ timestamps: true, collection: 'blog_posts' })
export class BlogPost {
  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ required: true, trim: true })
  excerpt!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({
    type: String,
    required: true,
    enum: ['historias', 'recetas', 'ingredientes', 'eventos', 'noticias'],
  })
  category!: BlogCategory;

  @Prop()
  coverImageUrl?: string;

  @Prop({
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  })
  status!: BlogPostStatus;

  @Prop({ default: false })
  featured!: boolean;

  @Prop()
  publishedAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1, status: 1 });
