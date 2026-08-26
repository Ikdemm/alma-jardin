import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { Public } from '../common/decorators/access.decorator';
import type { UploadedImageFile } from './upload-file.type';
import { UploadsService, type UploadFolder } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  upload(
    @UploadedFile() file: UploadedImageFile,
    @Query('folder') folder?: UploadFolder,
  ) {
    return this.uploadsService.uploadImage(file, folder ?? 'general');
  }

  @Public()
  @Get('files/:folder/:date/:filename')
  serveLocal(
    @Param('folder') folder: string,
    @Param('date') date: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const key = `${folder}/${date}/${filename}`;
    const stream = this.uploadsService.openLocalFile(key);

    if (!stream) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const lower = filename.toLowerCase();
    if (lower.endsWith('.png')) res.type('image/png');
    else if (lower.endsWith('.webp')) res.type('image/webp');
    else if (lower.endsWith('.gif')) res.type('image/gif');
    else res.type('image/jpeg');

    stream.pipe(res);
  }

  @Public()
  @Get('status')
  status() {
    return { driver: this.uploadsService.getDriver() };
  }
}
