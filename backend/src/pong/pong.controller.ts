import { Controller, Get, Param } from '@nestjs/common';
import { PongService } from './pong.service';
import { IRoom } from './Room/Room';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) { }

  @Get('history/:id')
  getUserHistory(@Param("id") id: number): IRoom[] {
    return this.pongService.userHistory(id);
  }

  @Get('history')
  getHistory(): IRoom[] {
    return this.pongService.history();
  }

  @Get('rooms')
  getRooms(): IRoom[] {
    return this.pongService.rooms();
  }
}
