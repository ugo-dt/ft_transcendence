import { Controller, Get } from '@nestjs/common';
import { PongService } from './pong.service';
import { IRoom } from './Room/Room';
import { IClient } from './Client/Client';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) { }

  @Get('users')
  getUsers(): IClient[] {
    return this.pongService.users();
  }

  @Get('rooms')
  getRooms(): IRoom[] {
    return this.pongService.rooms();
  }

  @Get('history')
  getHistory(): IRoom[] {
    return this.pongService.history();
  }
}
