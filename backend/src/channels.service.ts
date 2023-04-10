import { Injectable } from '@nestjs/common';
import { EntityMessage } from './entities/message.entity';
import { EntityChannel } from './entities/channel.entity';
import { CreateChannelDto } from './createChannel.dto';
import { CreateMessageDto } from './createMessage.dto';
import { MessagesService } from './messages.service';
import { log } from 'console';

@Injectable()
export class ChannelsService {
	channels: EntityChannel[] = [{ channelId: 0,
									name: "default",
									messageHistory: [{ sender: 'God',
									content: 'Hello. This is God from the backend.',
									timestamp: Date().toString(),
									toChannel: 0}],
									isPrivate: false,
									admins: [],
									isDm: false
								}];

	create(createChannelDto: CreateChannelDto) {
		
		this.channels.push(createChannelDto);

		return this.channels;
	}

	pushMessage(message: EntityMessage, index: number) {
		this.channels[index].messageHistory.push(message);
	}

	getChannelById(index: number) {
		console.log("index: ", index);
		if (this.channels[index])
			return this.channels[index];
	}

	getAllChannels() {
		if (this.channels)
			return this.channels;
	}

	debugClearAllChannels() {
		this.channels.splice(0);
	}

	debugClearChannelMessages(index: number) {
		if (this.channels[index].messageHistory)
			this.channels[index].messageHistory.splice(0);
	}
}
