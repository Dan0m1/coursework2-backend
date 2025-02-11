import {ValidationPipe} from "@nestjs/common";

require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3030, '0.0.0.0');
}
bootstrap();
