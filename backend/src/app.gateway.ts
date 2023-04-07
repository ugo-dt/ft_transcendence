import { Logger } from "@nestjs/common";
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { MessagesService } from "./messages.service";
import { CreateMessageDto } from "./createMessage.dto";

@WebSocketGateway({
	cors: {
		origin: '*',
	}
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server;

	constructor(private readonly messagesService: MessagesService) {}
	readonly logger = new Logger();

	async handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`New client connected: ${client.id}`);
	}

	async handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('createMessage')
	async handleCreateMessage(@MessageBody() createMessageDto: CreateMessageDto) {
		this.logger.log(`createMessage received from client ${createMessageDto.sender}:  ${createMessageDto.content}`);
		const message = await this.messagesService.create(createMessageDto);

		this.server.emit('createdMessage', message);

		return message;
	}

	@SubscribeMessage('getAllMessages')
	handleGetAllMessages() {
		this.logger.log('getAllMessage');
		return this.messagesService.getAllMessages();
	}

	@SubscribeMessage('clear')
	debugClearAllMessages() {
		this.logger.log('cleared all messages');
		this.server.emit('clear');
		this.messagesService.debugClearAllMessages();
	}
}