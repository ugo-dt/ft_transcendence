import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const clientPort = configService.get('CLIENT_PORT');

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.use(session({
    secret: "a-secret-string",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false // remove for production
    }
  }));
  await app.listen(port);
}

bootstrap();
