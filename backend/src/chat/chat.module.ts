import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
	imports: [UsersModule, ChannelModule, MessageModule],
	controllers: [ChatController],
	providers: [ChatService],
	exports: [ChatService],
  })
export class ChatModule {}
