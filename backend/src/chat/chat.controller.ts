import { Controller, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { IUser } from './User/User';
import { IChannel } from './Channel/Channel';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService:ChatService) { }
	@Get('users')
	getUsers(): IUser[] {
	  return this.chatService.users();
	}
  
	@Get('rooms')
	getRooms(): IChannel[] {
	  return this.chatService.channels();
	}
}