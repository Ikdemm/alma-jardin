import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import type { ReservationStatus } from '@alma-jardin/shared';

export class CreateReservationDto {
  @IsString()
  contactName!: string;

  @IsString()
  contactPhone!: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsDateString()
  date!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  time!: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(30)
  pax!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateReservationStatusDto {
  @IsEnum(['pending', 'confirmed', 'rejected', 'cancelled'])
  status!: ReservationStatus;
}

export class ListReservationsQueryDto {
  @IsOptional()
  status?: ReservationStatus;

  @IsOptional()
  @IsDateString()
  date?: string;
}
