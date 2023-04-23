import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";
import { Logger} from "@nestjs/common";
import Queue from "./Matchmaking/Queue";

@WebSocketGateway({
  namespace: 'pong',
  cors: {
    origin: 'http://192.168.1.178:5173',
  }
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger: Logger;

  constructor(private readonly pongService: PongService) {
    this.logger = new Logger("PongGateway");
    setInterval(() => {
      if (Queue.size() >= 1) {
        Queue.tryMatchPlayers(this.server, this.pongService);
      }
    }, 1000);
    this.logger.log("Initialized queue.");
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
  public handleChallenge(@ConnectedSocket() client: Socket, @MessageBody() opponent: number) {
    if (opponent == null || opponent == undefined) {
      return 'error: undefined opponent'
    }
    return this.pongService.startChallenge(client, opponent);
  }

  @SubscribeMessage('challenge-list')
  public challengeList(@ConnectedSocket() client: Socket) {
    return this.pongService.challengeList(client);
  }

  @SubscribeMessage('accept-challenge')
  public acceptChallenge(@ConnectedSocket() client: Socket, @MessageBody() opponent: number) {
    return this.pongService.acceptChallenge(this.server, client, opponent);
  }
  
  @SubscribeMessage('cancel-challenge')
  public cancelChallenge(@ConnectedSocket() client: Socket) {
    return this.pongService.cancelChallenge(client);
  }
}