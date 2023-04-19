import { Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { PongService } from './pong.service';
import { IRoom } from './Room/Room';
import Client, { IClient } from './Client/Client';

@Controller('pong')
export class PongController {
  constructor(private readonly pongService: PongService) { }
  
  @Get('friends/:username')
  getFriends(@Param("username") username: string): IClient[] | null {
    return this.pongService.userFriendList(username);
  }

  @Post('add-friend')
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

  @Delete('remove-friend')
  removeFriend(@Query("username") username: string, @Query("friendName") friendName: string) {
    const client = Client.at(username);
    if (client) {
      const friend = Client.at(friendName);
      if (friend) {
        client.removeFriend(friend);
        return 'ok';
      }
      throw new NotFoundException(`unknown user (${friendName}`);
    }
    throw new NotFoundException(`unknown user (${username}`);
  }

  @Get('history/:username')
  getUserHistory(@Param("username") username: string): IRoom[] {
    return this.pongService.userHistory(username);
  }

  @Get('history')
  getHistory(): IRoom[] {
    return this.pongService.history();
  }

  @Get('rankings')
  getRankings(): IClient[] {
    return this.pongService.rankings();
  }

  @Get('rooms')
  getRooms(): IRoom[] {
    return this.pongService.rooms();
  }
}
