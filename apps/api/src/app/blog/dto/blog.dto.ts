import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import type { BlogCategory, BlogPostStatus } from '@alma-jardin/shared';

export class CreateBlogPostDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  excerpt!: string;

  @IsString()
  content!: string;

  @IsEnum(['historias', 'recetas', 'ingredientes', 'eventos', 'noticias'])
  category!: BlogCategory;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: BlogPostStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(['historias', 'recetas', 'ingredientes', 'eventos', 'noticias'])
  category?: BlogCategory;

  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: BlogPostStatus;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}
