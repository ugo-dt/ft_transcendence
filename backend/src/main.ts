import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.enableCors({
    origin: [
      `http://localhost:${port}`,
    ],
    credentials: true,
  });
  await app.listen(port);
}
bootstrap();
