import { Module } from '@nestjs/common';
import { PongController } from './pong.controller';
import { PongService } from './pong.service';
import { UsersModule } from 'src/users/users.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [UsersModule, RoomModule],
  controllers: [PongController],
  providers: [PongService],
  exports: [PongService],
})
export class PongModule {}
