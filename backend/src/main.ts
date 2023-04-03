import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const clientPort = configService.get('CLIENT_PORT');

  app.enableCors({
    origin: [
      `http://localhost:${clientPort}`,
      `http://192.168.1.178:${clientPort}`,
    ],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
