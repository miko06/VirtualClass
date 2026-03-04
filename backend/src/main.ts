import 'dotenv/config';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Also load root-level .env (where DATABASE_URL lives)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(3001);
  console.log(`🚀 Backend running on http://localhost:3001`);
}
bootstrap();
