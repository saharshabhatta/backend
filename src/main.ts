import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const message = errors
          .map((err) => Object.values(err.constraints))
          .flat();
        return new BadRequestException(message);
      },
    }),
  );

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('This contains documentation')
    .setVersion('1.0')
    .addTag('app')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(8000);
}
bootstrap();
