import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessagesService } from './messages.service';
import { ChatGateway } from './app.gateway';
import { ChannelsService } from './channels.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MessagesService, ChannelsService, ChatGateway],
})
export class AppModule {}
