import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';
import { ChatController } from './chat.controller';
import { ChannelsService } from './services/channels.service';
import { UsersService } from './services/users.service';

@Module({
	imports: [],
	controllers: [ChatController],
	providers: [ChatGateway, ChatService, ChannelsService, UsersService],
  })
export class ChatModule {}
