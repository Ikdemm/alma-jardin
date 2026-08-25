import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { ReservationStatus } from '@alma-jardin/shared';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true, collection: 'reservations' })
export class Reservation {
  @Prop({ required: true, trim: true })
  contactName!: string;

  @Prop({ required: true, trim: true })
  contactPhone!: string;

  @Prop({ trim: true, lowercase: true })
  contactEmail?: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true, trim: true })
  time!: string;

  @Prop({ required: true, min: 1, max: 30 })
  pax!: number;

  @Prop({ trim: true })
  notes?: string;

  @Prop({
    enum: ['pending', 'confirmed', 'rejected', 'cancelled'],
    default: 'pending',
  })
  status!: ReservationStatus;

  @Prop({ default: 'web' })
  source!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

ReservationSchema.index({ date: 1, time: 1 });
ReservationSchema.index({ status: 1, createdAt: -1 });
