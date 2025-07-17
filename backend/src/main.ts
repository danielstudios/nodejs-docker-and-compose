import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'https://danielkupi.students.nomorepartiessbs.ru',
      'https://api.danielkupi.students.nomorepartiessbs.ru'
    ],
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
    credentials: true,
    maxAge: 86400,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
