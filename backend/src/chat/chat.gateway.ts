// TODO:
// - Ability to mute kick and ban admin users leave and join browse channels also

import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import Channel, { IChannel } from "./Channel/Channel";
import User, { IUser } from "./User/User";
import Message, { IMessage } from "./Message/Message";

@WebSocketGateway({
	namespace: 'chat',
	cors: '*',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(private readonly chatService: ChatService) { }

	readonly logger = new Logger();

	public async handleConnection(userSocket: Socket, ...args: any[]) {
		this.logger.log(`New client connected id: ${userSocket.id}`);
		this.chatService.handleUserConnected(userSocket);
	}

	public async handleDisconnect(userSocket: Socket) {
		this.logger.log(`Client disconnected id: ${userSocket.id}`);
		this.chatService.handleUserDisconnect(userSocket);
	}

	@SubscribeMessage('create-user')
	public handleCreateUser(@ConnectedSocket() userSocket: Socket, @MessageBody() name: string): IUser {
		this.logger.log(`create-user`);
		return this.chatService.handleCreateUser(userSocket, name);
	}

	@SubscribeMessage('create-channel')
	public handleCreateChannel(@ConnectedSocket() userSocket: Socket, @MessageBody() data: any): IChannel {
		this.logger.log(`create-channel`);
		return this.chatService.handleCreateChannel(userSocket, data);
	}

	@SubscribeMessage('create-message')
	public handlePushMessageToChannel(@ConnectedSocket() userSocket: Socket, @MessageBody() data: any): IMessage {
		this.logger.log(`create-message`);
		return this.chatService.handleCreateMessage(userSocket, data, this.server);
	}

	@SubscribeMessage('get-user-channels')
	public handleGetUserChannels(@ConnectedSocket() userSocket: Socket): IChannel[] {
		this.logger.log(`get-user-channels`);
		return this.chatService.handleGetUserChannels(userSocket);
	}

	@SubscribeMessage('invite-user')
	public handleInviteUser(@ConnectedSocket() userSocket: Socket, @MessageBody() data: any) {
		this.logger.log(`invite-user`);
		return this.chatService.handleInviteUser(userSocket, data, this.server);
	}

	@SubscribeMessage('kick-user')
	public handleKickUser(@ConnectedSocket() UserSocket: Socket, @MessageBody() data: any) {
		this.logger.log('kick-user');
		return this.chatService.handleKickUser(UserSocket, data, this.server);
	}

	@SubscribeMessage('leave-channel')
	public handleLeaveChannel(@ConnectedSocket() userSocket: Socket, @MessageBody() data: any) {
		this.logger.log(`leave-channel`);
		this.chatService.handleLeaveChannel(userSocket, data, this.server);
	}
}

//@WebSocketGateway({
//	namespace: 'chat',
//	cors: '*',
//})
//export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//	@WebSocketServer() server: Server;

//	constructor(private readonly channelsService: ChannelsService, private readonly usersService: UsersService) { }
//	readonly logger = new Logger();

//	async handleConnection(client: Socket, ...args: any[]) {
//		this.logger.log(`New client connected: ${client.id}`);
//	}

//	async handleDisconnect(client: any) {
//		this.logger.log(`Client disconnected: ${client.id}`);
//	}

//	@SubscribeMessage('create-message')
//	async handlePushMessageToChannel(@ConnectedSocket() client: Socket, @MessageBody() createMessageDto: CreateMessageDto) {
//		this.channelsService.pushMessageToChannel(createMessageDto, createMessageDto.toChannel, client.id);
//	}

//	@SubscribeMessage('create-channel')
//	async handleCreateChannel(@MessageBody() data: any) {
//		this.logger.log('create-channel');
//		const channel = await this.channelsService.createChannel(data.newChannel);
//		this.usersService.users[data.user.current.id].userChannels.push(channel);
//		return channel;
//	}

//	@SubscribeMessage('create-user')
//	async handleCreateUser(@MessageBody() createUserDto: CreateUserDto) {
//		this.logger.log('create-user');
//		const user = await this.usersService.create(createUserDto);
//		console.log("this.usersService.getAllUsers(): ", this.usersService.getAllUsers());
//		return user;
//	}

//	@SubscribeMessage('get-all-channels')
//	handleGetAllChannels() {
//		this.logger.log('get-all-channels');
//		return this.channelsService.getAllChannels();
//	}

//	@SubscribeMessage('get-one-channel')
//	handleGetOneChannel(index: number) {
//		this.logger.log('get-one-channel');
//		return this.channelsService.getChannelById(index);
//	}

//	@SubscribeMessage('invite-user')
//	handleInviteUser(@MessageBody() data: any) {
//		this.logger.log('invite-user');
//		const ret = this.channelsService.pushUserToChannel(data.userName, data.toChannel, this.usersService); 
//		if (!ret) {
//			return {data: null};
//		} 
//		return {data: ret};
//	}

//	@SubscribeMessage('clear')
//	debugClearAllMessages(@MessageBody() index: number) {
//		this.logger.log(`cleared all messages in channel: ${index}`);
//		this.server.emit('cleared');
//		this.channelsService.debugClearChannelMessages(index);
//	}

//	@SubscribeMessage('clear-channels')
//	debugClearAllChannels() {
//		this.logger.log(`cleared all channels`);
//		this.server.emit('cleared');
//		this.channelsService.debugClearAllChannels();
//	}
//}
