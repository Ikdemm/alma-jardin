import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import type { ContactMessageStatus } from '@alma-jardin/shared';

export class CreateContactMessageDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  subject!: string;

  @IsString()
  message!: string;
}

export class UpdateContactMessageStatusDto {
  @IsEnum(['new', 'read', 'archived'])
  status!: ContactMessageStatus;
}
