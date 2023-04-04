import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { log } from "console";
import { Socket } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: '*',
	}
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server;
	readonly logger = new Logger();

	async handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`New client connected: ${client.id}`);
	}

	async handleDisconnect(client: any) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('message')
	handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
		this.logger.log(`Message received from client ${client.id}:  ${data.message}`);
		this.server.emit('message', { message: data.message, senderId: `${client.id}` });
	}
}