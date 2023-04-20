import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const clientPort = configService.get('CLIENT_PORT');

  const redisClient = createClient();
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({client: redisClient});

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      `http://192.168.1.178:${clientPort}`,
    ],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.use(session({
    store: redisStore,
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
