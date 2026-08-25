import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import type { AdminStatus, PermissionCode } from '@alma-jardin/shared';

export class CreateAdminDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @IsArray()
  @IsMongoId({ each: true })
  roleIds!: string[];

  @IsOptional()
  @IsArray()
  directPermissions?: PermissionCode[];
}

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  roleIds?: string[];

  @IsOptional()
  @IsArray()
  directPermissions?: PermissionCode[];

  @IsOptional()
  @IsEnum(['pending', 'active', 'blocked', 'inactive'])
  status?: AdminStatus;
}

export class ListAdminsQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['pending', 'active', 'blocked', 'inactive'])
  status?: AdminStatus;
}
