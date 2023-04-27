import { Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { MessageBody } from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';

@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) { }

  @Get('all')
  async getAllChannels(): Promise<Channel[]> {
    return this.channelService.findAll();
  }

  @Get('channel/:id')
  async getChannelName(@Param("id") id: number): Promise<string> {
    const channel = await this.channelService.findOneId(id);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    return channel.name;
  }
}
