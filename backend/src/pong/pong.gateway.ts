import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";
import Queue from "./Matchmaking/Queue";
import { Logger } from "@nestjs/common";

@WebSocketGateway({
  namespace: 'pong',
  cors: '*',
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger: Logger;

  constructor(private readonly pongService: PongService) {
    this.logger = new Logger("PongGateway");
    setInterval(() => {
      if (Queue.size() >= 1) {
        Queue.tryMatchPlayers(this.server, pongService);
      }
    }, 1000);
  }

  public async handleConnection(client: Socket) {
    this.pongService.handleUserConnected(client);
  }
  
  public async handleDisconnect(client: Socket) {
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

  @SubscribeMessage('spectate')
  public handleSpectate(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    this.pongService.spectateRoom(client, roomId);
  }

  @SubscribeMessage('stop-spectate')
  public handleStopSpectate(@ConnectedSocket() client: Socket, @MessageBody() roomId: number) {
    this.pongService.stopSpectateRoom(client, roomId);
  }

  @SubscribeMessage('game-results')
  public handleGameResults(@MessageBody() roomId: number) {
    return this.pongService.gameResults(roomId);
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

  @SubscribeMessage('challenge')
  public handleChallenge(@ConnectedSocket() client: Socket, opponent: string) {
    this.pongService.startChallenge();
  }
}