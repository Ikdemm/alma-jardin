import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'fs';
import { extname, join } from 'path';
import type { UploadedImageFile } from './upload-file.type';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_BYTES = 8 * 1024 * 1024;

export type UploadFolder =
  | 'menu'
  | 'shop'
  | 'blog'
  | 'banners'
  | 'featured'
  | 'general';

export interface UploadedImage {
  url: string;
  key: string;
  driver: 's3' | 'local';
  contentType: string;
  size: number;
}

@Injectable()
export class UploadsService implements OnModuleInit {
  private readonly logger = new Logger(UploadsService.name);
  private s3: S3Client | null = null;
  private driver: 's3' | 'local' = 'local';
  private readonly localRoot = join(process.cwd(), 'uploads');

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const bucket = this.config.get<string>('S3_BUCKET');
    if (bucket) {
      this.driver = 's3';
      this.s3 = new S3Client({
        region: this.config.get('S3_REGION', 'us-east-1'),
        endpoint: this.config.get('S3_ENDPOINT') || undefined,
        forcePathStyle: this.config.get('S3_FORCE_PATH_STYLE') === 'true',
        credentials:
          this.config.get('S3_ACCESS_KEY_ID') &&
          this.config.get('S3_SECRET_ACCESS_KEY')
            ? {
                accessKeyId: this.config.get<string>('S3_ACCESS_KEY_ID')!,
                secretAccessKey: this.config.get<string>(
                  'S3_SECRET_ACCESS_KEY',
                )!,
              }
            : undefined,
      });
      this.logger.log(`Uploads driver: S3 (${bucket})`);
    } else {
      mkdirSync(this.localRoot, { recursive: true });
      this.logger.warn(
        'S3_BUCKET not set — using local uploads/ fallback (dev only)',
      );
    }
  }

  getDriver() {
    return this.driver;
  }

  async uploadImage(
    file: UploadedImageFile,
    folder: UploadFolder = 'general',
  ): Promise<UploadedImage> {
    if (!file) {
      throw new BadRequestException('No se envió ningún archivo');
    }

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(
        'Formato no permitido. Usa JPG, PNG, WebP o GIF',
      );
    }

    if (file.size > MAX_BYTES) {
      throw new BadRequestException('La imagen no puede superar 8 MB');
    }

    const extension = this.extensionFor(file);
    const key = `${folder}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}${extension}`;

    if (this.driver === 's3' && this.s3) {
      const bucket = this.config.get<string>('S3_BUCKET')!;
      await this.s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL:
            this.config.get('S3_OBJECT_ACL') === 'private'
              ? 'private'
              : 'public-read',
        }),
      );

      return {
        url: this.publicUrlFor(key),
        key,
        driver: 's3',
        contentType: file.mimetype,
        size: file.size,
      };
    }

    const absolute = join(this.localRoot, key);
    mkdirSync(join(absolute, '..'), { recursive: true });
    writeFileSync(absolute, file.buffer);

    const apiOrigin =
      this.config.get('API_PUBLIC_URL') ??
      `http://localhost:${this.config.get('API_PORT', 3333)}`;

    return {
      url: `${apiOrigin}/api/uploads/files/${key}`,
      key,
      driver: 'local',
      contentType: file.mimetype,
      size: file.size,
    };
  }

  openLocalFile(key: string) {
    const safeKey = key.replace(/\.\./g, '');
    const absolute = join(this.localRoot, safeKey);

    if (!existsSync(absolute) || !absolute.startsWith(this.localRoot)) {
      return null;
    }

    return createReadStream(absolute);
  }

  private publicUrlFor(key: string): string {
    const customBase = this.config.get<string>('S3_PUBLIC_BASE_URL');
    if (customBase) {
      return `${customBase.replace(/\/$/, '')}/${key}`;
    }

    const bucket = this.config.get<string>('S3_BUCKET')!;
    const region = this.config.get('S3_REGION', 'us-east-1');
    const endpoint = this.config.get<string>('S3_ENDPOINT');

    if (endpoint) {
      return `${endpoint.replace(/\/$/, '')}/${bucket}/${key}`;
    }

    return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  }

  private extensionFor(file: UploadedImageFile): string {
    const fromName = extname(file.originalname || '').toLowerCase();
    if (fromName && fromName.length <= 5) {
      return fromName;
    }

    switch (file.mimetype) {
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      case 'image/gif':
        return '.gif';
      default:
        return '.jpg';
    }
  }
}
