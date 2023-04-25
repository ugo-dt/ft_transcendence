// TODO:
// - Ability to mute kick and ban admin users leave and join browse channels also

import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { IChannel } from "./Channel/Channel";
import { IUser } from "./User/User";
import { IMessage } from "./Message/Message";

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
	public handleCreateChannel(@ConnectedSocket() userSocket: Socket, @MessageBody() data: any, ): IChannel {
		this.logger.log(`create-channel`);
		return this.chatService.handleCreateChannel(userSocket, data, this.server);
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

	@SubscribeMessage('get-all-channels')
	public handleGetAllChannels(@ConnectedSocket() userSocket: Socket, @MessageBody() data: any): IChannel[] {
		this.logger.log('get-all-channels');
		return this.chatService.handleGetAllChannels();
	}

	@SubscribeMessage('join-channel')
	public handleJoinChannel(@ConnectedSocket() userSocket:Socket, @MessageBody() data: any) {
		this.logger.log('join-channel');
		console.log("data: ", data);
		return this.chatService.handleJoinChannel(userSocket, data, this.server);
	}
}
