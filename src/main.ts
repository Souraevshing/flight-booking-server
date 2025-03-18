import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from './config/swagger-config';
import { HttpExceptionFilter } from './exception-filters/http-exception-filter';

async function bootstrap() {
  const allowedOrigins = process.env.ALLOWED_ORIGIN.split(',') || [];

  const app = await NestFactory.create(AppModule);

  // configure express
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.use(cookieParser());

  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // BASE_URL for all apis
  app.setGlobalPrefix('api/v1');

  // setup swagger

  const doc = SwaggerModule.createDocument(app, config, {
    include: [],
    ignoreGlobalPrefix: false,
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/docs', app, doc);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
