import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChannelsService } from './channels.service';
import { UsersService } from './users.service';

@Module({
	imports: [],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService, ChannelsService, UsersService],
  })
export class ChatModule {}
