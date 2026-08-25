import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { AdminStatus, PermissionCode } from '@alma-jardin/shared';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true, collection: 'admins' })
export class Admin {
  @Prop({ required: true, trim: true })
  firstName!: string;

  @Prop({ required: true, trim: true })
  lastName!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({
    required: true,
    enum: ['pending', 'active', 'blocked', 'inactive'],
    default: 'pending',
  })
  status!: AdminStatus;

  @Prop({ default: false })
  isSuperAdmin!: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], default: [] })
  roleIds!: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  directPermissions!: PermissionCode[];

  @Prop({ select: false })
  resetPasswordToken?: string;

  @Prop({ select: false })
  resetPasswordExpiresAt?: Date;

  createdAt!: Date;
  updatedAt!: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
