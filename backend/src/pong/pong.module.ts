import { Module } from '@nestjs/common';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';

@Module({
  imports: [],
  controllers: [PongController],
  providers: [PongService],
})
export class PongModule {}
