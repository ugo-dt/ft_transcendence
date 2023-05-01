import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message/message.service';

@Controller('chat')
export class ChatController {
  constructor(private messageService: MessageService) { }

  @Get("message/:id")
  getMessage(@Param("id") id: number) {
    return this.messageService.findOneId(id);
  }
}