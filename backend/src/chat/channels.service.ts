import { Injectable } from '@nestjs/common';
import { EntityMessage } from './entities/message.entity'
import { EntityChannel } from './entities/channel.entity';
import { CreateChannelDto } from './createChannel.dto';

@Injectable()
export class ChannelsService {
	channels: EntityChannel[] = [{ channelId: 0,
									name: "default",
									messageHistory: [],
									password: null,
									isDm: false,
									users: [],
									admins: [],
									banned: [],
									muted: []
								}];

	createChannel(createChannelDto: CreateChannelDto) {
		const channel: EntityChannel = { channelId: this.channels.length,
			name: createChannelDto.name,
			messageHistory: [],
			password: createChannelDto.password,
			isDm: createChannelDto.isDm,
			users: createChannelDto.users,
			admins: createChannelDto.admins,
			banned: createChannelDto.banned,
			muted: createChannelDto.muted
		};
		if (channel.name === "" || channel.name.match(/^ *$/))
			channel.name = "Default Channel Name";
		this.channels.push(channel);

		return this.channels;
	}

	pushMessageToChannel(message: EntityMessage, index: number, clientId: string) {
		if (message.senderName === undefined)
			message.senderName = 'Guest' + clientId;
		this.channels[index].messageHistory.push(message);
	}

	getChannelById(index: number) {
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
