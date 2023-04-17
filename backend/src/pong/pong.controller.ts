import { Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { PongService } from './pong.service';
import { IRoom } from './Room/Room';
import Client, { IClient } from './Client/Client';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) { }

  @Get('users')
  getAllUsers(): IClient[] {
    return this.pongService.users();
  }

  @Get('users/:username')
  getUser(@Param("username") username: string): IClient {
    const client = this.pongService.profile(username);
    if (client) {
      return client;
    }
    throw new NotFoundException(`unknown user (${username}`);
  }
  
  @Get('users/:username/friends')
  getFriends(@Param("username") username: string): IClient[] | null {
    return this.pongService.userFriendList(username);
  }

  @Post('friend-request')
  sendFriendRequest(@Query("username") username: string, @Query("friendName") friendName: string) {
    const client = Client.at(username);
    if (client) {
      const friend = Client.at(friendName);
      if (friend) {
        client.addFriend(friend);
        return 'ok';
      }
      throw new NotFoundException(`unknown user (${friendName}`);
    }
    throw new NotFoundException(`unknown user (${username}`);
  }

  @Delete('friends/:id')
  removeFriend(@Query("username") username: string, @Query("friendName") friendName: string): void {
    const client = Client.at(username);
    if (client) {
      const friend = Client.at(friendName);
      if (friend) {
        client.removeFriend(friend);
        return ;
      }
      throw new NotFoundException(`unknown user (${friendName}`);
    }
    throw new NotFoundException(`unknown user (${username}`);
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
