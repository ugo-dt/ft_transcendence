import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChannelService } from './channel/channel.service';
import { UsersService } from 'src/users/users.service';

@Controller('chat')
export class ChatController { }