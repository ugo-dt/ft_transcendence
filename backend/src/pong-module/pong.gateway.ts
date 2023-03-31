import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PongService } from "./pong.service";
import { GameState } from "./game/GameState";

@WebSocketGateway({
  namespace: 'pong',
  cors: ['*'],
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  private players: Socket[];
  logger = new Logger();

  constructor(private pongService: PongService) {
    this.players = [];
  }

  async handleConnection(client: Socket) {
    await this.pongService.handleUserConnected(this.wss, client, this.players);
    this.logger.verbose(`New socket connected (id: ${client.id})`)
  }

  async handleDisconnect(client: Socket) {
    await this.pongService.handleUserDisconnect(this.wss, client);
    this.logger.verbose(`Socket disconnected (id: ${client.id})`)
  }

  joinQueue(client: Socket, name: string) {
    client.data.name = name;
    this.players.push(client);
    this.logger.verbose(`Added ${client.id} to queue.`);
  }

  leaveQueue(client: Socket) {
    this.players = this.players.filter((clt) => {
      return clt.id !== client.id;
    })
    this.logger.verbose(`Removed ${client.id} from queue.`);
  }

  startGame(left: Socket, right: Socket) {
    const gameId = left.id + right.id;

    left.join(gameId);
    right.join(gameId);
    left.data.room = gameId;
    right.data.room = gameId;
    left.data.opponentId = right.id;
    right.data.opponentId = left.id;

    const gameState = new GameState(650, 480);

    this.wss.emit('start');
    const interval = setInterval(() => {
      this.wss.emit('update', gameState.IGameState());
      gameState.update();
    }, 1000 / 60);
  }

  endGame(left: Socket, right: Socket) {
    this.wss.emit('end');
  }

  @SubscribeMessage('queue')
  handleQueueActions(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    this.logger.log(client.handshake.query);
    if (data.action) {
      if (data.action === "join") {
        this.joinQueue(client, data.name);
        this.logger.verbose(this.players.length);
        if (this.players.length === 2) {
          this.startGame(this.players[0], this.players[1]);
        }
      }
      else if (data.action === "leave") {
        this.leaveQueue(client);
      }
    }
  }

  @SubscribeMessage('game')
  handleGameActions(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    if (data.action) {
      if (data.action === "leave") {
        this.endGame(this.players[0], this.players[1]);
      }
    }
  }
}
