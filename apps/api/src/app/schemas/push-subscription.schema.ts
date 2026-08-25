import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PushSubscriptionDocument = HydratedDocument<PushSubscription>;

@Schema({ timestamps: true, collection: 'push_subscriptions' })
export class PushSubscription {
  @Prop({ type: Types.ObjectId, ref: 'Admin', required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true, unique: true })
  endpoint!: string;

  @Prop({ required: true })
  p256dh!: string;

  @Prop({ required: true })
  auth!: string;

  @Prop()
  userAgent?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const PushSubscriptionSchema =
  SchemaFactory.createForClass(PushSubscription);
