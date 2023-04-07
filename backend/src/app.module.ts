import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MessagesService } from './messages.service';
import { ChatGateway } from './app.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [MessagesService, ChatGateway],
})
export class AppModule {}
