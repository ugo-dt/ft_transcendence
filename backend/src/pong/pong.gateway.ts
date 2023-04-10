import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";
import Queue from "./Matchmaking/Queue";
import Client from "./Client/Client";
import { IRoom } from "./Room/Room";

@WebSocketGateway({
  namespace: 'pong',
  cors: '*',
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly pongService: PongService) {
    setInterval(() => {
      const queue: Client[] = Queue.list();
      if (queue.length >= 2) {
        this.pongService.startGame(this.server, queue[0], queue[1]);
      }
    }, 1000);
  }

  public async handleConnection(client: Socket, ...args: any[]) {
    // get correct values from db later
    client.data.name = 'Username';
    client.data.backgroundColor = 'black';
    this.pongService.handleUserConnected(client);
  }
  
  public  async handleDisconnect(client: Socket) {
    this.pongService.handleUserDisconnect(client);
  }

  @SubscribeMessage('join-queue')
  public handleJoinQueue(@ConnectedSocket() client: Socket) {
    this.pongService.addClientToQueue(client);
  }

  @SubscribeMessage('leave-queue')
  public handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.pongService.removeClientFromQueue(client);
  }

  @SubscribeMessage('get-room-list')
  public handleGetRoomList(@ConnectedSocket() client: Socket): IRoom[] {    
    return this.pongService.roomList();
  }

  @SubscribeMessage('spectate')
  public handleSpectate(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    this.pongService.spectateRoom(client, roomId);
  }

  @SubscribeMessage('stop-spectate')
  public handleStopSpectate(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    this.pongService.stopSpectateRoom(client, roomId);
  }

  @SubscribeMessage('upKeyPressed')
  public handleKeyUpPressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "up", true);
  }

  @SubscribeMessage('upKeyUnpressed')
  public handleKeyUpUnpressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "up", false);
  }

  @SubscribeMessage('downKeyPressed')
  public handleKeyDownPressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "down", true);
  }

  @SubscribeMessage('downKeyUnpressed')
  public handleKeyDownUnpressed(@ConnectedSocket() client: Socket) {
    this.pongService.handleKey(client, "down", false);
  }
}