// TODO:
// - Ability to mute kick and ban users

import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChannelsService } from "./services/channels.service";
import { CreateMessageDto } from "./createMessage.dto";
import { CreateChannelDto } from "./createChannel.dto";
import { CreateUserDto } from "./createUser.dto";
import { UsersService } from "./services/users.service";
import { EntityUser } from "./entities/user.entity";

@WebSocketGateway({
	namespace: 'chat',
	cors: '*',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() server: Server;

	constructor(private readonly channelsService: ChannelsService, private readonly usersService: UsersService) { }
	readonly logger = new Logger();

	async handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`New client connected: ${client.id}`);
	}

	async handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('create-message')
	async handlePushMessageToChannel(@ConnectedSocket() client: Socket, @MessageBody() createMessageDto: CreateMessageDto) {
		this.channelsService.pushMessageToChannel(createMessageDto, createMessageDto.toChannel, client.id);
		this.server.emit('created-message');
	}

	@SubscribeMessage('create-channel')
	async handleCreateChannel(@MessageBody() createChannelDto: CreateChannelDto) {
		this.logger.log('create-channel');
		console.log("this.channelsService.getAllChannels(): ", this.channelsService.getAllChannels());
		const channel = await this.channelsService.createChannel(createChannelDto);
		return channel;
	}

	@SubscribeMessage('create-user')
	async handleCreateUser(@MessageBody() createUserDto: CreateUserDto) {
		this.logger.log('create-user');
		const user = await this.usersService.create(createUserDto);
		console.log("this.usersService.getAllUsers(): ", this.usersService.getAllUsers());
		return user;
	}

	@SubscribeMessage('get-all-channels')
	handleGetAllChannels() {
		this.logger.log('get-all-channels');
		return this.channelsService.getAllChannels();
	}

	@SubscribeMessage('get-one-channel')
	handleGetOneChannel(index: number) {
		this.logger.log('get-one-channel');
		return this.channelsService.getChannelById(index);
	}

	@SubscribeMessage('invite-user')
	handleInviteUser(@MessageBody() data: any) {
		this.logger.log('invite-user');
		const ret = this.channelsService.pushUserToChannel(data.userName, data.toChannel, this.usersService); 
		if (!ret) {
			return {data: null};
		} 
		return {data: ret};
	}

	@SubscribeMessage('clear')
	debugClearAllMessages(@MessageBody() index: number) {
		this.logger.log(`cleared all messages in channel: ${index}`);
		this.server.emit('cleared');
		this.channelsService.debugClearChannelMessages(index);
	}

	@SubscribeMessage('clear-channels')
	debugClearAllChannels() {
		this.logger.log(`cleared all channels`);
		this.server.emit('cleared');
		this.channelsService.debugClearAllChannels();
	}
}
