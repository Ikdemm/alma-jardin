import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { ContactMessageStatus } from '@alma-jardin/shared';

export type ContactMessageDocument = HydratedDocument<ContactMessage>;

@Schema({ timestamps: true, collection: 'contact_messages' })
export class ContactMessage {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true, lowercase: true })
  email!: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ required: true, trim: true })
  subject!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({
    enum: ['new', 'read', 'archived'],
    default: 'new',
  })
  status!: ContactMessageStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ContactMessageSchema =
  SchemaFactory.createForClass(ContactMessage);

ContactMessageSchema.index({ status: 1, createdAt: -1 });
