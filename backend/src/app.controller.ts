import { Controller, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller()
export class AppController {
  constructor(private readonly appService: MessagesService) {}

}
