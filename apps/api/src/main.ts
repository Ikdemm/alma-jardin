import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:4200',
    credentials: true,
  });

  const port = Number(process.env.API_PORT ?? 3333);
  await app.listen(port);

  Logger.log(`API running at http://localhost:${port}/api`);
}

bootstrap();
