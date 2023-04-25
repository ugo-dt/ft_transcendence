import { Injectable, Logger } from '@nestjs/common';
import User, { IUser } from './User/User';
import { Socket } from 'socket.io';
import Channel, { IChannel } from './Channel/Channel';
import Message, { IMessage } from './Message/Message';
import { Server } from 'socket.io';
import * as crypto from 'crypto';

@Injectable()
export class ChatService {

	public async handleUserConnected(userSocket: Socket): Promise<void> { }

	public async handleUserDisconnect(userSocket: Socket): Promise<void> {
		const user = User.at(userSocket);
		if (!user) {
			return;
		}
		User.delete(userSocket);
	}

	public handleCreateUser(userSocket: Socket, name: string): IUser {
		const user = User.new(userSocket, name);
		console.log("User.list(): ", User.list());
		return user.IUser();
	}

	public handleCreateChannel(userSocket: Socket, newChannel: any, server: Server) {
		const channel = Channel.new(newChannel);
		if (channel) {
			channel.addUser(User.at(userSocket) as User);
			channel.addAdmin(User.at(userSocket) as User);
		}
		User.at(userSocket)?.userChannels.add(channel);
		console.log("Channel.list(): ", Channel.list());
		server.emit('update');
		return channel.IChannel();
	}

	public handleGetUserChannels(userSocket: Socket): IChannel[] {
		const userChannels = User.at(userSocket)?.userChannels;
		if (!userChannels) {
			return [];
		}
		const channels: IChannel[] = [];
		userChannels.forEach((channel: Channel) => {
			channels.push(channel.IChannel());
		});
		return channels;
	}

	public handleCreateMessage(userSocket: Socket, data: any, server: Server): IMessage {
		const message = Message.new(userSocket, data)
		Channel.at(message.destination)?.pushMessageToChannel(message);
		server.emit('update');
		return message.IMessage();
	}

	public handleInviteUser(userSocket: Socket, data: any, server: Server) {
		const channel: Channel | null = Channel.at(data.currentChannelId);
		const user: User | null = User.at(data.ChanneSettingslInputValue);
		if (!user)
			return {data: null};
		if (channel){
			channel.addUser(user);
			console.log("Channel.list(): ", Channel.list());
			server.emit('update');
		}
		return (user?.IUser());
	}
	
	public handleKickUser(userSocket: Socket, data: any, server: Server) {
		const channel: Channel | null = Channel.at(data.currentChannelId);
		const user: User | null = User.at(data.ChanneSettingslInputValue);
		if (!user)
			return {data: null};
		if (channel){
			channel.removeUser(user);
			console.log("Channel.list(): ", Channel.list());
			server.emit('update');
		}
		return (user?.IUser());
	}

	public handleLeaveChannel(userSocket: Socket, data: any, server: Server) {
		const channel: Channel | null = Channel.at(data.currentChannelId);
		const user: User | null = User.at(userSocket);
		if (channel && user)
		{
			channel.removeUser(user);
			server.emit('update');
		}
	}

	public handleJoinChannel(userSocket:Socket, data: any, server: Server) {
		const channel: Channel | null = Channel.at(data.currentChannelId);
		const user: User | null = User.at(userSocket);
		if (!user)
			return ;
		if (channel){
			if (channel.password !== undefined && channel.password !== crypto.createHash('sha256').update(data.channelPasswordInputValue).digest('hex'))
			{
				return {data: null};
			}
			channel.addUser(user);
			console.log("Channel.list(): ", Channel.list());
			server.emit('update');
		}
		return channel?.IChannel();
	}

	public handleGetAllChannels(): IChannel[] {
		return this.channels();
	}

	public users(): IUser[] {
		return User.list();
	}

	public channels(): IChannel[] {
		return Channel.list();
	}
}
