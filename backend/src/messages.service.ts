import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './createMessage.dto';
import { EntityMessage } from './entities/message.entity';

@Injectable()
export class MessagesService {
	messages: EntityMessage[] = [];

	create(createMessageDto: CreateMessageDto) {
		const message = {...createMessageDto};
		this.messages.push(message);

		return message;
	}

	getAllMessages() { // Add a query to select all from database later
		return this.messages;
	}

	debugClearAllMessages() {
		this.messages.splice(0);
	}
}
