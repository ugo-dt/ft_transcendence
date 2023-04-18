import { Injectable } from '@nestjs/common';
import { EntityMessage } from '../entities/message.entity'
import { EntityChannel } from '../entities/channel.entity';
import { CreateChannelDto } from '../createChannel.dto';
import { EntityUser } from '../entities/user.entity';
import { UsersService } from './users.service';

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
		const newChannel: EntityChannel = { channelId: this.channels.length,
			name: createChannelDto.name,
			messageHistory: [],
			password: createChannelDto.password,
			isDm: createChannelDto.isDm,
			users: createChannelDto.users,
			admins: createChannelDto.admins,
			banned: createChannelDto.banned,
			muted: createChannelDto.muted
		};
		if (newChannel.name === "" || newChannel.name.match(/^ *$/))
		newChannel.name = "Default Channel Name";
		this.channels.push(newChannel);

		return newChannel;
	}

	findUserWithUserName(userName: string, usersService: UsersService): EntityUser | undefined {
		const array: EntityUser[] = usersService.getAllUsers() as EntityUser[];
		return (array.find(user => user.name === userName));
	}

	pushMessageToChannel(message: EntityMessage, index: number, clientId: string) {
		if (message.senderName === undefined || message.senderName === "")
			message.senderName = 'Guest_' + clientId;
		this.channels[index].messageHistory.push(message);
	}

	pushUserToChannel(userName: string, index: number, usersService: UsersService): EntityUser | undefined{
		const user: EntityUser | undefined = this.findUserWithUserName(userName, usersService)
		if (user !== undefined)
		{
			this.channels[index].users.push(user as EntityUser);
			return this.findUserWithUserName(userName, usersService);
		}
		return undefined;
	}

	banUserFromChannel(user: EntityUser, index: number) {
		this.channels[index].banned.push(user);
	}

	muteUserFromChannel(user: EntityUser, index: number) {
		this.channels[index].muted.push(user);
	}

	kickUserFromChannel(user: EntityUser, index: number) {
		this.channels[index].users.splice(user.id, 1);
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
