import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { PermissionCode } from '@alma-jardin/shared';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true, collection: 'roles' })
export class Role {
  @Prop({ required: true, trim: true, unique: true })
  name!: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ trim: true })
  color?: string;

  @Prop({ type: [String], default: [] })
  permissions!: PermissionCode[];

  @Prop({ default: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
