import { Module } from '@nestjs/common';
import { PongModule } from './pong-module/pong.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PongModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
