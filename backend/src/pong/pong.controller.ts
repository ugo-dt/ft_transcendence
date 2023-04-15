import { Controller, Get, Param } from '@nestjs/common';
import { PongService } from './pong.service';
import { IRoom } from './Room/Room';
import { IClient } from './Client/Client';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) { }

  @Get('users')
  getAllUsers(): IClient[] {
    return this.pongService.users();
  }

  @Get('users/:id')
  getUser(@Param("id") id: string): IClient | null {
    return this.pongService.profile(id);
  }

  @Get('rooms')
  getRooms(): IRoom[] {
    return this.pongService.rooms();
  }

  @Get('history/:id')
  getUserHistory(@Param("id") id: string): IRoom[] | null {
    return this.pongService.userHistory(id);
  }

  @Get('history')
  getHistory(): IRoom[] {
    return this.pongService.history();
  }
}
