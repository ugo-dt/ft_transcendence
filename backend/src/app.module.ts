import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PongModule } from './pong/pong.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PongModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
