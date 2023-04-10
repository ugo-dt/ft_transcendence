import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { MessagesService } from "./messages.service";
import { ChannelsService } from "./channels.service";
import { CreateMessageDto } from "./createMessage.dto";
import { CreateChannelDto } from "./createChannel.dto";

@WebSocketGateway({
	cors: {
		origin: '*',
	}
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server;
	
	constructor(private readonly messagesService: MessagesService, private readonly channelsService: ChannelsService) {}
	readonly logger = new Logger();
	
	async handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`New client connected: ${client.id}`);
	}
	
	async handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('createMessage')
	async handlePushMessageToChannel(@MessageBody() createMessageDto: CreateMessageDto) {

		const message = await this.messagesService.create(createMessageDto);
		const channel = await this.channelsService.getChannelById(createMessageDto.toChannel);

		this.channelsService.pushMessage(message, createMessageDto.toChannel);
		this.server.emit('createdMessage', channel);
	}

	@SubscribeMessage('createChannel')
	async handleCreateChannel(@MessageBody() createChannelDto: CreateChannelDto) {
		this.logger.log('createChannel');
		console.log('black magic: ', createChannelDto.name);
		const channel = await this.channelsService.create(createChannelDto);
		this.server.emit('createdChannel', channel);
	}

	@SubscribeMessage('getAllChannels')
	handleGetAllChannels() {
		this.logger.log('getAllChannels');
		return this.channelsService.getAllChannels();
	}

	@SubscribeMessage('clear')
	debugClearAllMessages(@MessageBody() index: number) {
		this.logger.log(`cleared all messages in channel: ${index}`);
		this.server.emit('clear');
		this.channelsService.debugClearChannelMessages(index);
	}

	@SubscribeMessage('clearChannels')
	debugClearAllChannels() {
		this.logger.log(`cleared all channels`);
		this.server.emit('clear');
		this.channelsService.debugClearAllChannels();
	}
}
