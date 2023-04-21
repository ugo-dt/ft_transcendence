import { Injectable, Logger } from '@nestjs/common';
import User, { IUser } from './User/User';
import { Socket } from 'socket.io';
import Channel, { IChannel } from './Channel/Channel';
import Message, { IMessage } from './Message/Message';
import { Server } from 'socket.io';

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

	public handleCreateChannel(userSocket: Socket, newChannel: any) {
		const channel = Channel.new(newChannel);
		if (channel) {
			channel.addUser(User.at(userSocket) as User);
			channel.addAdmin(User.at(userSocket) as User);
		}
		User.at(userSocket)?.userChannels.add(channel);
		console.log("Channel.list(): ", Channel.list());
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
		const message = Message.new(userSocket, data);
		Channel.at(message.destination)?.pushMessageToChannel(message);
		server.emit('update');
		return message.IMessage();
	}

	public handleInviteUser(userSocket: Socket, data: any, server: Server) {
		const channel: Channel | null = Channel.at(data.toChannel);
		const user: User | null = User.at(data.userName);
		if (!user)
			return {data: null};
		if (channel){
			channel.addUser(user);
			console.log("Channel.list(): ", Channel.list());
			server.emit('update');
		}
		return (user?.IUser());
	}

	public users(): IUser[] {
		return User.list();
	}

	public channels(): IChannel[] {
		return Channel.list();
	}
}
