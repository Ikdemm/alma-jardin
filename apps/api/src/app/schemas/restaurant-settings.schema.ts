import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantSettingsDocument = HydratedDocument<RestaurantSettings>;

@Schema({ timestamps: true, collection: 'restaurant_settings' })
export class RestaurantSettings {
  @Prop({ required: true, default: 'Alma Jardín' })
  name!: string;

  @Prop({ default: 'Donde el jardín se encuentra con la alta cocina' })
  tagline!: string;

  @Prop({ default: 'Un refugio verde para el paladar' })
  heroTitle!: string;

  @Prop({ default: 'Cocina gourmet inspirada en la naturaleza, el huerto y el vuelo del colibrí.' })
  heroSubtitle!: string;

  @Prop({ default: '' })
  aboutText!: string;

  @Prop({ default: '' })
  address!: string;

  @Prop({ default: '' })
  phone!: string;

  @Prop({ default: '' })
  whatsappPhone!: string;

  @Prop({ default: 'Hola, me gustaría hacer una reserva en Alma Jardín.' })
  whatsappMessage!: string;

  @Prop({ default: 'hola@almajardin.com' })
  email!: string;

  @Prop()
  instagramUrl?: string;

  @Prop({ default: 'Mar–Dom · 12:00 – 23:00' })
  openingHours!: string;

  @Prop()
  mapUrl?: string;

  @Prop()
  staffNotificationEmail?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const RestaurantSettingsSchema =
  SchemaFactory.createForClass(RestaurantSettings);
