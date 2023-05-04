import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { EnvService } from './config/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvService);
  const port = envService.get('BACKEND_PORT');

  const redisClient = createClient({
    socket: {
      host: envService.get('REDIS_HOST'),
      port: envService.get('REDIS_PORT'),
    }
  });
  redisClient.connect().catch(console.error);
  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      `${envService.get('FRONTEND_HOST')}`,
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
