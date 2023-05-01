import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from './entities/channel.entity';

@Controller('channels')
export class ChannelController {
  constructor(private channelService: ChannelService) { }

  @Get('all')
  async getAllChannels(): Promise<Channel[]> {
    const channels = await this.channelService.findAll();
    return channels.filter(c => !c.isPrivate);
  }

  @Get(':id')
  async getChannelName(@Param("id") id: number): Promise<string> {
    const channel = await this.channelService.findOneId(id);
    if (!channel) {
      throw new NotFoundException('channel not found');
    }
    return channel.name;
  }
}
