import { Controller, Get, Logger, Param } from '@nestjs/common';
import { PongService } from './pong.service';
import { Room } from 'src/room/entities/room.entity';
import { IGameRoom } from 'src/room/GameRoom';

@Controller('pong')
export class PongController {
  private readonly logger: Logger;
  constructor(private readonly pongService: PongService) {
    this.logger = new Logger("PongController");
  }

  @Get('history/:id')
  getUserHistory(@Param("id") id: number): Promise<IGameRoom[]> {
    return this.pongService.userHistory(id);
  }

  @Get('history')
  getHistory(): Promise<Room[]> {
    return this.pongService.history();
  }

  @Get('rooms')
  getRooms(): Promise<IGameRoom[]> {
    return this.pongService.rooms();
  }
}
