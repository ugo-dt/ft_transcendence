import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChannelService } from './channel/channel.service';
import { UsersService } from 'src/users/users.service';
import Client from 'src/Client/Client';
import { MessageService } from './message/message.service';

@Injectable()
export class ChatService {
	private readonly logger: Logger;
	constructor(
		private readonly channelService: ChannelService,
		private readonly usersService: UsersService,
		private readonly messageService: MessageService,
	) {
	  this.logger = new Logger("ChatService");
	}

	public async handlePushMessageToChannel(clientSocket: Socket, channelId: number, content: string) {
		const client = Client.at(clientSocket);
		if (!client) {
			throw new NotFoundException('client not found');
		}
		const user = await this.usersService.findOneId(client.id);
		if (!user) {
			throw new NotFoundException('user not found');
		}
		const message = await this.messageService.create(content, user.id, channelId);
		return this.channelService.newMessage(channelId, message);
	}


	//public async handleSendMessage(userSocket: Socket, data: any, server: Server): Promise<Message | null> {
	//	const channel = await this.channelService.findOneId(data.destination);
	//	if (!channel) {
	//		throw new NotFoundException('channel not found');
	//	}
	//	const client = Client.at(userSocket);
	//	if (!client) {
	//		throw new NotFoundException('user not found');
	//	}
	//	console.log("client: ", client);
	//	const message = await this.messageService.create(data.content, this._timestamp_mmddyy(), client.id, data.destination);
	//	this.channelService.newMessage(channel.id, message);
	//	server.to(channel.room).emit('update');
	//	return message;
	//}

	//public handleInviteUser(userSocket: Socket, data: any, server: Server) {
	//	const channel: Channel | null = Channel.at(data.currentChannelId);
	//	const user: User | null = User.at(data.ChanneSettingslInputValue);
	//	if (!user)
	//		return { data: null };
	//	if (channel) {
	//		channel.addUser(user);
	//		console.log("Channel.list(): ", Channel.list());
	//		server.emit('update');
	//	}
	//	return (user?.IUser());
	//}

	//public handleKickUser(userSocket: Socket, data: any, server: Server) {
	//	const channel: Channel | null = Channel.at(data.currentChannelId);
	//	const user: User | null = User.at(data.ChanneSettingslInputValue);
	//	if (!user)
	//		return { data: null };
	//	if (channel) {
	//		channel.removeUser(user);
	//		console.log("Channel.list(): ", Channel.list());
	//		server.emit('update');
	//	}
	//	return (user?.IUser());
	//}

	//public async handleLeaveChannel(userSocket: Socket, id: number, server: Server) {
	//	const channel = await this.channelService.findOneId(id);
	//	if (!channel) {
	//		throw new NotFoundException('channel not found');
	//	}
	//	const client = Client.at(userSocket);
	//	if (!client) {
	//		throw new NotFoundException('user not found');
	//	}
	//	this.channelService.removeUser(channel.id, client.id);
	//	server.to(channel.room).emit('update');
	//	return channel;
	//}

	//public async handleJoinChannel(userSocket: Socket, id: number, password: string, server: Server) {
	//	const channel = await this.channelService.findOneId(id);
	//	if (!channel) {
	//		throw new NotFoundException('channel not found');
	//	}
	//	const client = Client.at(userSocket);
	//	if (!client) {
	//		throw new NotFoundException('user not found');
	//	}
	//	this.channelService.addUser(channel.id, client.id, password);
	//	server.to(channel.room).emit('update');
	//	return channel;

		//if (channel.password !== undefined && channel.password !== crypto.createHash('sha256').update(data.channelPasswordInputValue).digest('hex')) {
		//	return { data: null };
		//}
		//channel.addUser(user);
		//console.log("Channel.list(): ", Channel.list());
		//server.emit('update');
		//return channel?.IChannel();
	//}
}
