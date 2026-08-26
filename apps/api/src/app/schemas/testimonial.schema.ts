import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestimonialDocument = HydratedDocument<Testimonial>;

@Schema({ timestamps: true, collection: 'testimonials' })
export class Testimonial {
  @Prop({ required: true, trim: true })
  quote!: string;

  @Prop({ required: true, trim: true })
  authorName!: string;

  @Prop({ trim: true })
  authorRole?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: 0 })
  orderIndex!: number;

  createdAt!: Date;
  updatedAt!: Date;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
