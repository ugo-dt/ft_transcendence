import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";
import Queue from "./Matchmaking/Queue";
import Client from "./Client/Client";

@WebSocketGateway({
  namespace: 'pong',
  cors: '*',
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor() {
    setInterval(() => {
      const queue: Client[] = Queue.list();
      if (queue.length >= 2) {
        PongService.startGame(this.server, queue[0], queue[1]);
      }
    }, 1000);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    client.data.name = 'Username'; // get name from db later.
    client.data.backgroundColor = 'black';
    PongService.handleUserConnected(client);
  }
  
  async handleDisconnect(client: Socket) {
    PongService.handleUserDisconnect(client);
  }

  @SubscribeMessage('join-queue')
  handleJoinQueue(@ConnectedSocket() client: Socket) {
    PongService.addClientToQueue(client);
  }

  @SubscribeMessage('leave-queue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    PongService.removeClientFromQueue(client);
  }

  @SubscribeMessage('upKeyPressed')
  handleKeyUpPressed(@ConnectedSocket() client: Socket) {
    PongService.handleKeyUpPressed(client);
  }

  @SubscribeMessage('upKeyUnpressed')
  handleKeyUpUnpressed(@ConnectedSocket() client: Socket) {
    PongService.handleKeyUpUnpressed(client);
  }

  @SubscribeMessage('downKeyPressed')
  handleKeyDownPressed(@ConnectedSocket() client: Socket) {
    PongService.handleKeyDownPressed(client);
  }

  @SubscribeMessage('downKeyUnpressed')
  handleKeyDownUnpressed(@ConnectedSocket() client: Socket) {
    PongService.handleKeyDownUnpressed(client);
  }
}