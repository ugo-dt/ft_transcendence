import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { PongService } from './pong.service';
import { IRoom } from './Room/Room';
import Client, { IClient } from './Client/Client';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) { }

  @Get('users')
  getAllUsers(): IClient[] {
    return this.pongService.users();
  }

  @Get('users/:id')
  getUser(@Param("id") id: string): IClient {
    const client = this.pongService.profile(id);
    if (client) {
      return client;
    }
    throw new NotFoundException(`unknown user (${id}`);
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

  @Post('username')
  changeUsername(@Query("username") username: string, @Query("value") value: string): IClient | null {
    const client = Client.at(username);
    if (client) {
      client.name = value;
      return client.IClient();
    }
    return null;
  }
}
